<?php

/**
 * Description of RecetaModel
 *
 * @package       Inventario
 * @subpackage    Alimento
 * @author        osmel
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
class RecetaModel extends BaseModel
{
    private $serviciosConfiguracion;

    public function __construct()
    {
        parent::__construct();
        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        $this->doctrineHelper->tryInyectRelactions(
            (new NomIndicador),
            array(
            array(
                'cardinalidad' => 'many', 'relation' => 'DatProductoReceta',
                'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
            )
            )
        );
    }

    public function adicionarReceta($datosRec)
    {
        $nomreceta = new NomReceta();
        if ($datosRec['idreceta']) {
            $nomreceta->assignIdentifier($datosRec['idreceta']);
        }
        $datosRec['cantidad'] = $datosRec['cantracion'];
        $nomreceta->synchronizeWithArray($datosRec);
        foreach ($datosRec['idproductos'] as $valor) {
            $datProdRec = new DatProductoReceta();
            if ($valor['idproductoreceta']) {
                $datProdRec->assignIdentifier($valor['idproductoreceta']);
            }
            $datProdRec->synchronizeWithArray(
                array(
                    'idindicador' => $valor['idindicador'],
                    'idunidadmedida' => $valor['idunidadmedida'],
                    'cantidad' => ($valor['cantidad']) ? $valor['cantidad'] : 0,
                    'imprescindible' => $valor['imprescindible'] ? 1 : 0,
                    'aceptalternativo' => $valor['aceptalternativo'] ? 1 : 0
                )
            );
            $nomreceta->DatProductoReceta->add($datProdRec);
        }
        $nomreceta->save();

        return $nomreceta->idreceta;
    }

    public function devolverRecetas($filtro)
    {
        $query = Doctrine_Query::create()->from("NomReceta nr")
            ->select(
            "nr.idreceta,round(nr.proteinas,1) as proteinas,nr.cantidad as cantracion ,nr.estado,nr.fechainicio,nr.fechafin,"
            . "round(nr.calorias,1) as calorias,nr.idunidadmedida,"
            . "nr.denominacion,nr.observacion"
        );
        if ($filtro['idreceta']) {
            $query->addWhere("nr.idreceta = ?", array($filtro['idreceta']));
        }
        if ($filtro['criterio']) {
            $query->addWhere("nr.denominacion ILIKE '%{$filtro['criterio']}%'");
        }
        if ($filtro['entidad']) {
            //$query->addWhere("nr.estado = ?", array(2));
            $query->innerJoin('nr.DatRecetaEntidad dre');
        }
        
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'nr', 'umedida', 'umedida.abreviaturaunidadmedida as abreviaturaunidadmedida, umedida.decimales as decimales', 'leftJoin'
        );       

        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );       
    }

    /**
     *
     * @param Array $datosDoc
     * @param bool  $dql
     *
     * @return Array/Doctrine_Query
     */
    public function cargarProductos($datosDoc, $dql = false)
    {
        $maestroModel = new MaestroProductoModel;
        $query = $maestroModel->cargarGridNomenclador(array(), true);
        $productos = new DatProductoReceta();
        $query = $productos->getProducto($query, 'ind', $datosDoc, 'dpr');

        if ($dql) {
            return $query;
        }
        $datosProducto = $this->doctrineHelper->addQueryLimits($query, $datosDoc)->fetchArray();
        return array(
            'cantidad' => (count($datosProducto) > 0) ? $query->count() : 0,
            'datos' =>$datosProducto
        );
    }

    public function habilitarEntidad($filtro)
    {
        $objnom = new NomReceta();
        $nomRec = $objnom->Buscar($filtro['idreceta']);
        $nomRec->estado = $filtro['estado'];
        if ($filtro['estado'] == 2) {
            $datRecEnt = new DatRecetaEntidad();
            $datRecEnt->synchronizeWithArray(
                array(
                    'idestructuracomun' => $this->global->Estructura->idestructura,
                    'idreceta' => $filtro['idreceta']
                )
            );
            $datRecEnt->save();
        } else {
            if ($filtro['estado'] == 1) {

                if ($this->validarUsoRecetaenMenu($filtro['idreceta'])) {

                    return false;
                } else {
                    Doctrine_Query::create()->delete('DatRecetaEntidad')
                        ->where('idreceta = ?', $filtro['idreceta'])
                        ->execute();
                }
            }
        }
        $nomRec->save();
        return true;
    }

    public function eliminarReceta($idreceta)
    {
        Doctrine_Query::create()->delete('DatRecetaEntidad')->whereIn('idreceta ', $idreceta)->execute();
        Doctrine_Query::create()->delete('NomReceta')->whereIn('idreceta ', $idreceta)->execute();
        return true;
    }

    public function eliminarProductosReceta($datos)
    {
        Doctrine_Query::create()->delete('DatProductoReceta')->whereIn('idproductoreceta', $datos['idproductos'])
            ->execute();
    }

    /**
     * @param int $idreceta
     *
     * @return int
     */
    public function copiarDocumento($idreceta)
    {
        $receta = Doctrine::getTable('NomReceta')->find($idreceta);
        $nuevaRec = $receta->copy();
        $datos = $receta->toArray();
        $datos['idreceta'] = null;
        $datos['estado'] = 1;
        $nuevaRec->synchronizeWithArray($datos);
        $productos = Doctrine::getTable('DatProductoReceta')->findByDql('idreceta = ?', array($idreceta))->toArray();
        foreach ($productos as $prod) {
            $prod['idproductoreceta'] = null;
            $prod['idreceta'] = null;
            $prodRec = new DatProductoReceta();
            $prodRec->synchronizeWithArray($prod);
            $nuevaRec->DatProductoReceta[] = $prodRec;
        }
        $nuevaRec->save();
        return $nuevaRec->idreceta;
    }

    /**
     * Verifica si la receta tiene productos.
     *
     * @param int $idreceta
     *
     * @return bool
     */
    public function contieneProductos($idreceta)
    {
        $query = $this->cargarProductos(array('idreceta' => $idreceta), true);
        return $query->count() > 0;
    }

    /**
     * Verifica si los productos de la receta tienen cantidades registradas.
     *
     * @param int $idreceta
     *
     * @return bool
     */
    public function productosConCantidad($idreceta)
    {
        $query = $this->cargarProductos(array('idreceta' => $idreceta), true);
        $query->addWhere('dpr.cantidad = 0');
        return $query->count() == 0;
    }

    /**
     * Verifica si una receta esta haciendo usada.
     *
     * @param int $idreceta
     *
     * @return bool
     */
    public function verificarUso($idreceta)
    {

        $recetaact = Doctrine::getTable('DatRecetaEntidad')
                ->findByDql('idreceta=?', array($idreceta[0]))->toArray();

        return count($recetaact) == 0;
    }

    /**
     * Metodo para validar si una receta esta en uso en un menu
     *
     * @param type $idreceta
     */
    function validarUsoRecetaenMenu($idreceta)
    {

        $actreceta = Doctrine::getTable('DatRecetaActividad')->findByDql('idreceta = ?', array($idreceta))->toArray();
        return count($actreceta) != 0;
    }

    /**
     * Metodo para validar que no exsuta en uso una receta con las mismas caracteristicas
     *
     * @param type $parametros
     */
    function verificarExisteMismaReceta($parametros)
    {
        if ($parametros['estado'] == 2) {
            $recetaHabilitar = $this->auxiliarObtenerDatosReceta(false, $parametros);
            $recetasEnUso = $this->auxiliarObtenerDatosReceta(true);

            foreach ($recetasEnUso as $rect) {
                $cont = 0;

                if (count($rect['DatProductoReceta']) == count($recetaHabilitar[0]['DatProductoReceta']) 
                    && $rect['denominacion'] == $recetaHabilitar[0]['denominacion']) {
                    foreach ($rect['DatProductoReceta'] as $index => $product) {
                        if ($product['idindicador'] == $recetaHabilitar[0]['DatProductoReceta'][$index]['idindicador']) {
                            $cont++;
                        }
                    }

                    if ($cont == count($recetaHabilitar[0]['DatProductoReceta'])) {
                        return false;
                    }
                }
            }
            return true;
        } else {
            return true;
        }
    }

    private function auxiliarObtenerDatosReceta($estado, $parametros)
    {
        $query = Doctrine_Query::create()
            ->select("nr.denominacion,dpr.idindicador,dpr.cantidad")
            ->from('NomReceta nr');
        if ($estado) {
            $query->innerJoin('nr.DatRecetaEntidad dre');
        } else {
            $query->where("nr.idreceta =?", array($parametros['idreceta']));
        }
        $query->innerJoin('nr.DatProductoReceta dpr')
            ->orderBy('dpr.idindicador');
        
        return $query->fetchArray();
    }

}
