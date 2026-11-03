<?php

/**
 * Dominio del Nomenclador de linea de productos
 *
 * @author     Alien Fernandez Fuentes
 * @package    Nomencladores
 * @subpackage Nomencladores de Quimefa
 * @copyright  UCID-ERP Cuba
 * @version    1.0
 */
class NomLineaProducto extends BaseNomLineaProducto
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatLineaProductoEntidad',
            array('local' => 'idlineaproducto', 'foreign' => 'idlineaproducto')
        );
    }

    public function ObtenerLineaProducto($objLineaProducto, $arrIdsInsertados)
    {
        $filtro = '';
        if ($objLineaProducto->descripcion) {
            $arrFiltro []
                = "lower(descripcion) LIKE '%$objLineaProducto->descripcion%'";
        }
        if ($objLineaProducto->codigo) {
            $arrFiltro [] = "codigo LIKE '%$objLineaProducto->codigo%'";
        }
        $query = new Doctrine_Query();
        if ($objLineaProducto->descripcion || $objLineaProducto->codigo) {
            $filtro = implode(' AND ', $arrFiltro);
            //print_r($filtro);die;
            $query->addWhere($filtro);
        }
        if (count($arrIdsInsertados) > 0) {
            $query->whereNotIn("$objLineaProducto->id", $arrIdsInsertados);
        }
        $result = $query->from('NomLineaProducto nlp')
            ->orderBy('idlineaproducto DESC');
        if ($objLineaProducto->limit) {
            $result->limit($objLineaProducto->limit);
        }
        if ($objLineaProducto->start) {
            $result->offset($objLineaProducto->start);
        }
        return $result->execute()->toArray();
    }

    public function CantidadLineaProducto($objLineaProducto, $arrIdsInsertados)
    {
        $filtro = '';
        if ($objLineaProducto->descripcion) {
            $arrFiltro []
                = "lower(descripcion) LIKE '%$objLineaProducto->descripcion%'";
        }
        if ($objLineaProducto->codigo) {
            $arrFiltro [] = "codigo LIKE '%$objLineaProducto->codigo%'";
        }
        $query = new Doctrine_Query();
        if ($objLineaProducto->descripcion || $objLineaProducto->codigo) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro);
        }

        if (count($arrIdsInsertados) > 0) {
            $query->whereNotIn("$objLineaProducto->id", $arrIdsInsertados);
        }

        $result = $query->from('NomLineaProducto nlp')->count();
        return $result;
    }

    public function ObtenerLPDadoDescripcion($descripcion)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomLineaProducto')
            ->where('descripcion =?', $descripcion)
            ->execute();
        return $result->toArray();
    }

    public function ObtenerLPDadoCodigo($codigo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomLineaProducto')
            ->where('codigo =?', array($codigo))
            ->execute();
        return $result->toArray();
    }

    public function obtenerLineasProductoDadoArea($objLinea)
    {
        $conn = Zend_Registry::get('conexion');
        $arrLineas = $conn->execute(
            "select distinct nlp.descripcion,dp.idlineaproducto
        from dat_producto dp
        inner join nom_lineaproducto nlp on dp.idlineaproducto = nlp.idlineaproducto
        inner join dat_areaproducto dap on dap.idproducto = dp.idproducto
        inner join dat_area da on dap.idarea = da.idarea
        inner join dat_estructuraubicacion deu on deu.idarea = da.idarea
        inner join nom_producto np on dp.idprod = np.idprod
        where deu.idarea = {$objLinea->idarea}
        and deu.idestructuraubicacion = deu.idpadre
        order by nlp.descripcion"
        );
        return $arrLineas->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getLineasProductosEntidad($identidad)
    {
        $query = new Doctrine_Query();
        $query->select('dm.idlineaproducto, dm.denominacion, dm.codigo')
            ->from('NomLineaProducto dm')
            ->innerJoin('dm.DatLineaProductoEntidad dp')
            ->where("dp.idestructuracomun =?", $identidad);

        return array('datos'    => $query->fetchArray(),
                     'cantidad' => $query->count());
    }

} //fin clase
