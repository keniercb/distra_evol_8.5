<?php

class UbicacionModel extends BaseModel
{
    private $datAreaProd,
        /**
         * @var DatMovubicacion
         */
        $movUbicacion,
        /**
         * @var UbicacionComprometidaModel
         */
        $comprometida;

    /**
     * Constructor de la clase.
     */
    public function __construct()
    {
        parent::__construct();
        $this->tryInyector();
        $this->datAreaProd = new DatAreaproducto();
        $this->movUbicacion = new DatMovubicacion();
        $this->comprometida = new UbicacionComprometidaModel();
    }
    
    /**
     * Inyecta las relaciones entre clases.
     */
    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatUbicacionproducto',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatAreaproducto(), $relations);
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'NomNaturaleza',
            'properties' => array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza')
        );
        $this->doctrineHelper->tryInyectRelactions(new NomIndicador(), $relations);
    }

    /**
     * Devuelve los datos generales de la ubicacion de los productos.
     * @param array $params
     * @return array
     */
    public function cargarProductosUbicar($params)
    {
        $params['asentado'] = true;
        if ($params['idubicacion'] && !$params['idarea']) {
            $eu = Doctrine::getTable('DatEstructuraubicacion')->find($params['idubicacion']);
            $params['idarea'] = $eu->idarea;
            $params['idubicacion'] = array($params['idubicacion']);
        }
        $productos = new LogisticaProductoModel();
        $confubicacion = new Datconfigubicacion();
        $query = $productos->cargarProductos($params, true);
        $query->addSelect("(coalesce(p.cantidad, 0) - coalesce({$this->getSqlCant('p', 'dup1')}, 0)) AS cantidad");
        $query->addSelect("coalesce({$this->getSqlCant('p')}, 0) AS ubicada");
        $confubic = $confubicacion->cargarDatos($this->global->Estructura->idestructura);
        if ($params['conCantidad']) {
            $query->addWhere("(coalesce(p.cantidad, 0) - coalesce({$this->getSqlCant('p', 'dup1')}, 0)) <> 0");
            return array('cantidad' => $query->count(), 'datos' => $query->fetchArray(), 'confubicacion' => $confubic);
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $params)->fetchArray(),
            'confubicacion' => $confubic
        );
    }

    /**
     * Para cuando no tiene Lote
     * @param string $asProducto
     * @param string $asUbicProd
     * @return string
     */
    private function getSqlCant($asProducto, $asUbicProd = 'dup')
    {
        return "(SELECT sum(coalesce({$asUbicProd}.cantidad, 0)) FROM DatUbicacionproducto {$asUbicProd} " .
            "WHERE {$asProducto}.idproducto = {$asUbicProd}.idproducto)";
    }

    public function addSqlCantUbicaciones(Doctrine_Query $dql, $aliasProd = 'p')
    {
        $dql->addSelect(
            "(SELECT count(dup.idubicacionproducto) FROM DatUbicacionproducto dup " . "WHERE $aliasProd.idproducto = dup.idproducto) as numubicaciones"
        );
    }

    public function cargarlotes($params)
    {
        $lotes = new LoteService();
        $query = $lotes->cargarLotes($params, true);
        if ($params['idmovimiento']) {
            $query->addSelect("(coalesce(ml.cantidad,0) - coalesce({$this->getSqlCantLote('ml')},0)) as cantporubicar");
        }
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray(),);
    }

    public function cargarLotesUbic($params)
    {
        $query = Doctrine_Query::create()
            ->from("DatUbicacionlote ul")
            ->select(
                "ul.idubicacionlote, l.idlote AS idlote, l.numero AS numero, l.idproducto AS idproducto, "
                . "l.fechafabricacion AS fechafabricacion, l.fechavencimiento AS fechavencimiento, "
                . "l.idpais AS idpais, l.idfabricante AS idfabricante, coalesce(ul.cantidad, 0) AS existencia, "
                . "(coalesce(ul.cantidad, 0) - coalesce((SELECT sum(lc.cantidad) FROM DatLoteComprometido lc "
                . "WHERE lc.idlote = l.idlote AND lc.idubicacion = ul.idubicacion "
                . "AND lc.estado = 1), 0)) AS disponible, (eu.codigo || '-' || eu.descripcion) AS descripcion, "
                . "ap.idareaproducto AS idareaproducto, (eu.nivel = 1) AS esarea, ap.idarea AS idarea, "
                . "ul.idubicacion AS idubicacion, (ul.cantidad - coalesce((SELECT sum(_lc.cantidad) "
                . "FROM DatLoteComprometido _lc WHERE _lc.idlote = ul.idlote AND _lc.idubicacion = ul.idubicacion "
                . "AND _lc.estado = 1), 0)) AS cantidad, up.idubicacionproducto AS idubicacionproducto, "
                . "ul.idubicacionlote AS idubicacionlote, al.idarealote AS idarealote"
            )
            ->where('l.cronologia > 0 AND l.idproducto = ?', array($params['idproducto']))
            ->innerJoin('ul.DatLote l')
            ->innerJoin('l.DatArealote al')
            ->innerJoin('al.DatArea a')
            ->innerJoin('ul.DatEstructuraubicacion eu')
            ->innerJoin('a.DatAreaproducto ap')
            ->innerJoin('eu.DatUbicacionproducto up')
            ->orderBy('l.numero');
        if ($params['criterio']) {
            $query->andWhere("l.numero ILIKE '%{$params['criterio']}%'");
        }
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    /* Para cuando Tiene Lote */
    public function getSqlCantLote($asLote, $asUbicLote = 'dup2')
    {
        return "(SELECT SUM(coalesce({$asUbicLote}.cantidad, 0)) " . "from DatUbicacionlote {$asUbicLote} " .
        "where {$asLote}.idlote = {$asUbicLote}.idlote)";
    }

    public function cargarComboUbicacion($iddeposito)
    {
        $obj = new DatEstructuraubicacion();
        $datos = $obj->dameUbicacionesPorDeposito($iddeposito);
        $result = array();
        foreach ($datos as $value) {
            foreach ($value['DatEstructuraubicacion'] as $ubicacion) {
                $ubicacion['idarea'] = $value['idarea'];
                $result[] = $ubicacion;
            }
        }
        return $result;
    }

    public function cargarProductosUbicacion($filtro)
    {
        $eu = Doctrine::getTable('DatEstructuraubicacion')->find($filtro['idubicacion']);
        $filtro['idarea'] = $eu->idarea;
        if ($eu->nivel > 1) {
            $filtro['idubicacion'] = $this->buscarUbicacionesHijas($eu->idestructuraubicacion, true);
        } else {
            unset($filtro['idubicacion']);
        }
        $productos = new LogisticaProductoModel();
        $query = $productos->cargarProductos($filtro, true);
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    public function ubicarProducto($datos)
    {
        if ($datos['tienelote'] == 1) {
            return $this->ubicarProductoLotes($datos);
        }
        if ($datos['idmovimiento']) {
            $ubicMovim = Doctrine::getTable('DatMovubicacion')
                ->findByDql(
                    'idestructuraubicacion = ? and idmovimiento = ?',
                    array($datos['idubicacion'], $datos['idmovimiento'])
                );
            if (count($ubicMovim->toArray()) == 0) {
                $ubicMovim = new DatMovubicacion();
                $ubicMovim->synchronizeWithArray(
                    array('cantidad' => $datos['cantidad'], 'idmovimiento' => $datos['idmovimiento'],
                        'idestructuraubicacion' => $datos['idubicacion'])
                );
            } else {
                $ubicMovim[0]['cantidad'] = $ubicMovim[0]['cantidad'] + $datos['cantidad'];
            }
            $ubicMovim->save();
            return true;
        }
        $object = new DatEstructuraubicacion();
        $area = Array();
        if (!$datos['esarea']) {
            $area[0]['idarea'] = $object->getIdAreaXIdEstructura($datos['idubicacion']);
        } else {
            $area[0]['idarea'] = $datos['idarea'];
        }
        $obj = Doctrine::getTable('DatAreaproducto')
            ->findByDql('idarea = ? and idproducto = ?', array($area[0]['idarea'], $datos['idproducto']));
        if (count($obj->toArray()) == 0) {
            $obj = new DatAreaproducto();
            $obj->synchronizeWithArray(
                array('disponible' => $datos['cantidad'], 'idproducto' => $datos['idproducto'],
                    'idarea' => $area[0]['idarea'])
            );
        } else {
            $obj[0]['disponible'] = $obj[0]['disponible'] + $datos['cantidad'];
        }
        $ubicProducto = Doctrine::getTable('DatUbicacionproducto')
            ->findByDql('idubicacion = ? and idproducto = ?', array($datos['idubicacion'], $datos['idproducto']));

        if (count($ubicProducto->toArray()) == 0 ) {
            $ubicProducto = new DatUbicacionproducto();
            $ubicProducto->synchronizeWithArray(
                array('cantidad' => $datos['cantidad'], 'idproducto' => $datos['idproducto'],
                    'idubicacion' => $datos['idubicacion'])
            );
        } else{
            $ubicProducto[0]['cantidad'] = $ubicProducto[0]['cantidad'] + $datos['cantidad'];
        }
        $obj->save();
        $ubicProducto->save();
        return true;
    }

    /**
     *  Se utiliza para crear o cambiar la cantidad y la ubicación del lote.
     *
     * @param array $datos
     *
     * @return boolean
     */
    private function gestionarUbicacionLote($datos)
    {
        if ($datos['idubicacionlote']) {
            $ubicLote = Doctrine::getTable('DatUbicacionlote')
                ->find($datos['idubicacionlote']);
            $cambio = !$datos['unificar'] && $ubicLote->idubicacion != $datos['idubicacion'];
        } else {
            $ubicLote = Doctrine::getTable('DatUbicacionlote')
                ->findByDql('idubicacion = ? and idlote = ?', array($datos['idubicacion'], $datos['idlote']))
                ->getFirst();
        }
        if (!$ubicLote) {
            $ubicLote = new DatUbicacionlote();
        }
        $cantidad = $ubicLote ? $ubicLote->cantidad : 0;
        $datos['cantidad'] = $cambio ? $cantidad : $datos['cantidad'] + $cantidad;
        $ubicLote->synchronizeWithArray($datos);
        $ubicLote->save();
        return true;
    }

    /**
     *  Se utiliza para crear o cambiar la cantidad y el área del lote.
     *
     * @param array $datos
     *
     * @return boolean
     */
    private function gestionarAreaLote($datos)
    {
        if ($datos['idarealote']) {
            $areaLote = Doctrine::getTable('DatArealote')
                ->find($datos['idarealote']);
            $cambio = !$datos['unificar'] && $areaLote->idarea != $datos['idarea'];
        } else {
            $areaLote = Doctrine::getTable('DatArealote')
                ->findByDql('idarea = ? and idlote = ?', array($datos['idarea'], $datos['idlote']))
                ->getFirst();
        }
        if (!$areaLote) {
            $areaLote = new DatArealote();
        }
        $cantidad = $areaLote ? $areaLote->disponible : 0;
        $datos['disponible'] = $cambio ? $cantidad : $datos['cantidad'] + $cantidad;
        $areaLote->synchronizeWithArray($datos);
        $areaLote->save();
        return true;
    }

    /**
     * Se utiliza para crear o cambiar las cantidades del producto de la ubicación.
     *
     * @param array $datos
     *
     * @return boolean
     */
    private function gestionarUbicacionProducto($datos)
    {
        if ($datos['idubicacionproducto']) {
            $ubicProducto = Doctrine::getTable('DatUbicacionproducto')
                ->find($datos['idubicacionproducto']);
        } else {
            $ubicProducto = Doctrine::getTable('DatUbicacionproducto')
                ->findByDql('idubicacion = ? AND idproducto = ?', array($datos['idubicacion'], $datos['idproducto']))
                ->getFirst();
        }
        if (!$ubicProducto) {
            $ubicProducto = new DatUbicacionproducto();
        }
        $datos['cantidad'] += $ubicProducto ? $ubicProducto->cantidad : 0;
        $ubicProducto->synchronizeWithArray($datos);
        $ubicProducto->save();
        return true;
    }

    /**
     * Se utiliza para crear o cambiar las cantidades del producto del área.
     *
     * @param array $datos
     *
     * @return boolean
     */
    private function gestionarAreaProducto($datos)
    {
        if ($datos['idareaproducto']) {
            $areaProd = Doctrine::getTable('DatAreaproducto')
                ->find($datos['idareaproducto']);
        } else {
            $areaProd = Doctrine::getTable('DatAreaproducto')
                ->findByDql('idarea = ? AND idproducto = ?', array($datos['idarea'], $datos['idproducto']))
                ->getFirst();
        }
        if (!$areaProd) {
            $areaProd = new DatAreaproducto();
        }
        $cantidad = $areaProd ? $areaProd->disponible : 0;
        $datos['disponible'] = $datos['cantidad'] + $cantidad;
        $areaProd->synchronizeWithArray($datos);
        $areaProd->save();
        return true;
    }

    /**
     *  Se utiliza para ubicar los productos con Lotes
     *
     * @param array $datos
     *
     * @return boolean
     */
    public function ubicarProductoLotes($datos)
    {
        $estructuraUbic = new DatEstructuraubicacion();
        if (!$datos['esarea']) {
            $datos['idarea'] = $estructuraUbic->getIdAreaXIdEstructura($datos['idubicacion']);
        } else {
            $datos['idubicacion'] = $datos['idarea'];
        }
        $this->gestionarUbicacionLote($datos);
        $this->gestionarAreaLote($datos);
        $this->gestionarUbicacionProducto($datos);
        $this->gestionarAreaProducto($datos);
        if ($datos['proceso']) {
            $ubicMovim = Doctrine::getTable('DatMovubicacion')
                ->findByDql(
                    'idestructuraubicacion = ? and idmovimiento = ?',
                    array($datos['idubicacion'], $datos['idmovimiento'])
                );
            if (count($ubicMovim->toArray()) == 0) {
                $ubicMovim = new DatMovubicacion();
                $ubicMovim->synchronizeWithArray(
                    array('cantidad' => $datos['cantidad'], 'idmovimiento' => $datos['idmovimiento'],
                        'idestructuraubicacion' => $datos['idubicacion'])
                );
            } else {
                $ubicMovim[0]['cantidad'] = $ubicMovim[0]['cantidad'] + $datos['cantidad'];
            }
            $ubicMovim->save();
        }
        return true;
    }

    /**
     * Devuelve las ubicaciones y areas de los productos especificados.
     * @param array   $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarUbicacionesProducto($filtro, $dql)
    {
        $query = Doctrine_Query::create();
        if ($filtro['movUbicacion']) {
            $this->cargarPUbicacionesSinGuardar($query, $filtro);
        } else {
            $query->select(
                    'ap.idareaproducto AS idareaproducto, ap.disponible AS cant_area, up.cantidad, '
                    . 'up.idubicacionproducto, _nat.denominacion AS denominacionnat, '
                    . '(up.cantidad - coalesce((SELECT sum(uc.cantidad) FROM DatUbicacionComprometida uc '
                    . 'WHERE uc.idubicacion = up.idubicacion AND uc.idproducto = up.idproducto '
                    . 'AND uc.estado = 1), 0)) AS disponible'
                )
                ->from('DatUbicacionproducto up')
                ->innerJoin('up.DatProductoLogistica _p')
                ->innerJoin('_p.NomIndicador _i')
                ->leftJoin('_i.NomNaturaleza _nat')
                ->innerJoin('up.DatEstructuraubicacion eu2 ON (eu2.idestructuraubicacion = up.idubicacion)')
                ->innerJoin('eu2.DatArea a')
                ->innerJoin('a.DatAreaproducto ap')
                ->innerJoin(
                    'a.DatEstructuraubicacion eu ON (eu.idarea = a.idarea AND eu.idestructuraubicacion = eu.idpadre)'
                )
                ->where('up.idproducto = ap.idproducto AND up.cantidad > 0')
                ->orderBy('up.idubicacion');
        }
        /*$query->addSelect(
                'a.idarea AS idarea, eu.descripcion AS area, eu2.idestructuraubicacion AS idubicacion, '
                . 'eu.idpadre as idpadre, eu2.descripcion AS ubicacion, a.idformato as idformato, '
                . 'eu2.idestructuraubicacion AS idubic'
            )
            ->addWhere('eu.idarbol = eu2.idarbol');*/
        if ($filtro['idproducto'] && !$filtro['movUbicacion']) {
            $idproductos = is_array($filtro['idproducto']) ? $filtro['idproducto'] : array($filtro['idproducto']);
            $query->whereIn('ap.idproducto', $idproductos);
        }
        if ($filtro['idarea']) {
            $idareas = is_array($filtro['idarea']) ? $filtro['idarea'] : array($filtro['idarea']);
            $query->andWhereIn('a.idarea', $idareas);
        }
        if ($filtro['idubicacion']) {
            $idubicaciones = is_array($filtro['idubicacion']) ? $filtro['idubicacion'] : array($filtro['idubicacion']);
            $query->andWhereIn('eu2.idestructuraubicacion', $idubicaciones);
        }
        if ($filtro['idmovimiento'] && !$filtro['movUbicacion']) {
            $query->addSelect('mu.idmovubicacion AS idmovubicacion, coalesce(mu.cantidad, 0) AS cantidada');
            if ($filtro['desubicar']) {
                $query->leftJoin(
                    'eu2.DatMovubicacion mu ON (mu.idestructuraubicacion = eu2.idestructuraubicacion '
                    . "AND mu.idmovimiento = {$filtro['idmovimiento']})"
                );
            } else {
                $query->innerJoin('eu2.DatMovubicacion mu')->addWhere('mu.idmovimiento = ?', $filtro['idmovimiento']);
            }
        }
        if ($filtro['criterio']) {
            $query->addWhere("eu2.descripcion LIKE '%{$filtro['criterio']}%'");
        }
        if ($dql) {
            return $query;
        }
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }
    
    /**
     * Devuelve las ubicaciones que aun no se han guardado en DatAreaproducto y DatUbicacionproduucto.
     * @param Doctrine_Query $query
     * @param array $filtro
     */
    private function cargarPUbicacionesSinGuardar($query, $filtro)
    {
        $query->select('mu.idmovubicacion, coalesce(mu.cantidad, 0) AS cantidad')
            ->from('DatMovubicacion mu')
            ->innerJoin('mu.DatEstructuraubicacion eu2')
            ->innerJoin('eu2.DatArea a')
            ->innerJoin(
                'a.DatEstructuraubicacion eu ON (eu.idarea = a.idarea AND eu.idestructuraubicacion = eu.idpadre)'
            )
            ->where('mu.idmovimiento = ?', $filtro['idmovimiento']);
    }

    /**
     * Elimina las ubicaciones de los lotes.
     *
     * @param array $datos
     *
     * @return boolean
     */
    public function desubicarProductoLote($datos)
    {   
        Doctrine_Query::create()
            ->update('DatUbicacionproducto')->set('cantidad', "cantidad - ({$datos['cantidad']})")
            ->where('idubicacionproducto = ?', $datos['idubicacionproducto'])
            ->execute();
        Doctrine_Query::create()->update('DatUbicacionlote')->set('cantidad', "cantidad - ({$datos['cantidad']})")
            ->where('idubicacionlote = ?', $datos['idubicacionlote'])
            ->execute();
        Doctrine_Query::create()->update('DatArealote')->set('disponible', "disponible - ({$datos['cantidad']})")
            ->where('idarealote = ?', $datos['idarealote'])
            ->execute();
        Doctrine_Query::create()->update('DatAreaproducto')->set('disponible', "disponible - ({$datos['cantidad']})")
            ->where('idareaproducto = ?', $datos['idareaproducto'])
            ->execute();
        return true;
    }

    public function eliminarUbicacion($parametros)
    {
        if ($parametros['proceso']) {
            $this->actualizarMovUbicacion($parametros);
            return true;
        }
        Doctrine_Query::create()->delete()->from('DatUbicacionproducto')
            ->where('idubicacionproducto = ?', $parametros['idubicacionproducto'])
            ->execute();
        $objDatArea = Doctrine::getTable('DatAreaproducto')->find($parametros['idareaproducto']);
        $obj = $objDatArea->toArray();
        if ($parametros['idmovubicacion']) {
            Doctrine_Query::create()->delete()->from('DatMovubicacion')
                ->where('idmovubicacion = ?', $parametros['idmovubicacion'])
                ->execute();
        }
        $this->restaurarUbicacion($objDatArea->idproducto, $parametros['cantidad']);
        if ($parametros['cantidad'] == $obj['disponible']) {
            Doctrine_Query::create()->delete()->from('DatAreaproducto')
                ->where('idareaproducto = ?', $parametros['idareaproducto'])
                ->execute();
            return true;
        } else {
            $objDatArea->disponible = $objDatArea->disponible - $parametros['cantidad'];
            $objDatArea->save();
            return true;
        }
        return false;
    }
    
    /**
     * Ubica la cantidad eliminada en la ubicacion ficticia.
     * @param numeric $idproducto
     * @param integer $cantidad
     * @return boolean
     */
    private function restaurarUbicacion($idproducto, $cantidad)
    {
        $areaTemp = Doctrine::getTable('DatAreaproducto')->findByDql(
            'idarea = ? AND idproducto = ?', array(-1, $idproducto)
        );
        $area = new DatAreaproducto();
        if ($areaTemp->count() > 0) {
            $areaTemp = $areaTemp->getFirst();
            $disponible = $areaTemp->disponible;
            $area->assignIdentifier($areaTemp->idareaproducto);
        }
        $array = array(
            'idarea' => -1, 'idubicacion' => -1, 'idproducto' => $idproducto,
            'disponible' => (int) $disponible + $cantidad
        );
        $area->synchronizeWithArray($array);
        $area->save();
        $ubicacionTemp = Doctrine::getTable('DatUbicacionproducto')->findByDql(
            'idubicacion = ? AND idproducto = ?', array(-1, $idproducto)
        );
        $ubicacion = new DatUbicacionproducto();
        if ($ubicacionTemp->count() > 0) {
            $ubicacionTemp = $ubicacionTemp->getFirst();
            $cant = $ubicacionTemp->cantidad;
            $ubicacion->assignIdentifier($ubicacionTemp->idubicacionproducto);
        }
        $array['cantidad'] = (int) $cant + $cantidad;
        $ubicacion->synchronizeWithArray($array);
        $ubicacion->save();
        return true;
    }

    public function calcularEstado($pidestruct)
    {
        $estructura = new DatEstructuraubicacionModel();
        $arrhijos = $estructura->getDatosArbol($pidestruct);
        $rasultados = array();
        if (count($arrhijos) > 1) {
            foreach ($arrhijos as $val) {
                $cap = $estructura->getEstadoUbicacion($val['idestructuraubicacion']);
                if ($cap['capacidad']) {
                    $rasultados['capacidad'] = 0;
                    $rasultados['capacidad'] += $cap['capacidad'];
                }
                if ($cap['volumen']) {
                    $rasultados['volumen'] =
                        ($rasultados['volumen']) ? $rasultados['volumen'] + $cap['volumen'] : $cap['volumen'];
                }
                if ($cap['peso']) {
                    $rasultados['peso'] = ($rasultados['peso']) ? $rasultados['p eso'] + $cap['peso'] : $cap['peso'];
                }
            }
        } else {
            $rasultados = $estructura->getEstadoUbicacion($pidestruct);
        }
        return $rasultados;
    }

    public function addDqlCantidadPorArea(Doctrine_Query $dql, $params = array(), $aliasProd = 'p')
    {
        if ($params['idarea']) {
            $paramArea = json_decode($params['idarea']);
            if ($params['idubicacion']) {
                $where = " AND _up.idubicacion IN (" . implode(',', $params['idubicacion']) . ")";
                $whereD = str_replace('_up', '_up_2', $where);
            }
            $idareas = is_array($paramArea) ? implode(',', $paramArea) : $paramArea;
            $dql->addSelect(
                "(SELECT sum(_up.cantidad) FROM DatUbicacionproducto _up INNER JOIN _up.DatEstructuraubicacion _deu "
                . "WHERE _up.idproducto = {$aliasProd}.idproducto AND _deu.idarea IN ({$idareas}) {$where}) AS existencia_area, "
                
                . "(SELECT sum(_up_2.cantidad - coalesce((SELECT sum(uc.cantidad) FROM DatUbicacionComprometida uc "
                . "WHERE uc.idubicacion = _up_2.idubicacion AND uc.idproducto = _up_2.idproducto AND uc.estado = 1), 0)) "
                . "FROM DatUbicacionproducto _up_2 INNER JOIN _up_2.DatEstructuraubicacion _deu_2 "
                . "WHERE _up_2.idproducto = {$aliasProd}.idproducto AND _deu_2.idarea IN ({$idareas}) {$whereD} "
                . "GROUP BY _up_2.idproducto) AS disponible_area"

//                . "((SELECT sum(_up_2.cantidad) FROM DatUbicacionproducto _up_2 INNER JOIN _up_2.DatEstructuraubicacion _deu_2 "
//                . "WHERE _up_2.idproducto = {$aliasProd}.idproducto AND _deu_2.idarea IN ({$idareas}) {$where}) - "
//                . "(SELECT sum(_uc.cantidad) FROM DatUbicacionComprometida _uc INNER JOIN _uc.DatEstructuraubicacion _deu_3 "
//                . "WHERE _uc.idproducto = {$aliasProd}.idproducto AND _deu_3.idarea IN ({$idareas}) {$whereC})) AS disponible_area"
            );
//            if (is_array($paramArea)) {
//                $dql->addSelect(
//                    "(SELECT SUM(_up.cantidad) FROM DatUbicacionproducto _up " .
//                    "INNER JOIN _up.DatEstructuraubicacion _deu " .
//                    "WHERE _up.idproducto = {$aliasProd}.idproducto AND _deu.idarea in (" . implode(',', $paramArea) .
//                    ")" . ") as existencia_area, " . "(SELECT SUM(_ap.disponible) FROM DatAreaproducto _ap " .
//                    "WHERE _ap.idproducto = {$aliasProd}.idproducto AND _ap.idarea in (" . implode(',', $paramArea) .
//                    ")" . ") as disponible_area"
//                );
//            } else {
//                $dql->addSelect(
//                    "(SELECT SUM(_up.cantidad) FROM DatUbicacionproducto _up " .
//                    "INNER JOIN _up.DatEstructuraubicacion _deu " .
//                    "WHERE _up.idproducto = {$aliasProd}.idproducto AND _deu.idarea = {$params['idarea']}" .
//                    ") as existencia_area, " . "(SELECT _ap.disponible FROM DatAreaproducto _ap " .
//                    "WHERE _ap.idproducto = {$aliasProd}.idproducto AND _ap.idarea = {$params['idarea']}" .
//                    ") as disponible_area"
//                );
//            }
        }
    }

    public function cargarPubicacioneProducto($params)
    {
        $objeto = new DatEstructuraubicacionModel();
        return $objeto->cargarPUbicaciones($params);
    }

    public function devolverAreasByIdProducto($idproducto, $parametros = array())
    {
        try {
            return DatAreaproducto::devolverAreasByIdProducto($idproducto, $parametros);
        } catch (Exception $exc) {
            return array();
        }
    }

    /**
     * @param Doctrine_Query $query
     * @param string         $alias Alias de la tabla root "DatLote"
     *
     * @return Doctrine_Query
     */
    public function getQueryUbicacionLote(Doctrine_Query $query, $alias = 'l', $aliasMov = 'ml')
    {
        return $query->addSelect(
                    "(eu.codigo || '-' || eu.descripcion) AS descripcion, ap.idareaproducto AS idareaproducto, "
                    . "(eu.nivel = 1) AS esarea, ap.idarea AS idarea, ul.idubicacion AS idubicacion, "
                    . "ul.cantidad AS ubicada, up.idubicacionproducto AS idubicacionproducto, "
                    . "ul.idubicacionlote AS idubicacionlote, al.idarealote AS idarealote"
                )
                ->leftJoin("{$alias}.DatArealote al")
                ->leftJoin("{$alias}.DatUbicacionlote ul")
                ->innerJoin('al.DatArea a')
                ->innerJoin('ul.DatEstructuraubicacion eu')
                ->innerJoin(
                    "eu.DatUbicacionproducto up on up.idubicacion = {$aliasMov}.idubicacion "
                    . "AND up.idproducto = {$alias}.idproducto"
                )
                ->innerJoin("a.DatAreaproducto ap on a.idarea = ap.idarea and ap.idproducto = {$alias}.idproducto");
    }

    /**
     * Rebaja las cantidades ubicadas del producto.
     *
     * @param array $parametros
     *
     * @return boolean
     */
    public function desubicarProducto($parametros)
    {
        $result = false;
        foreach ($parametros as $value) {
            if (!$value['proceso']) {
                $ubicacionP = new DatUbicacionproducto();
                $ubicacionP->assignIdentifier($value['idubicacionproducto']);
                if ($ubicacionP->cantidad != $value['cantidad']) {
                    $ubicacionP->cantidad = $ubicacionP->cantidad - $value['cantidad'];
                    $ubicacionP->save();
                } else {
                    $ubicacionP->delete();
                }
                $areaP = new DatAreaproducto();
                $areaP->assignIdentifier($value['idareaproducto']);
                $value['cantidad'] = intVal($value['cantidad']);
                $areaP->disponible = intVal($areaP->disponible);
                if ($value['cantidad'] == $areaP->disponible) {
                    $areaP->delete();
                } else {
                    $areaP->disponible = $areaP->disponible - $value['cantidad'];
                    $areaP->save();
                }
                $result = true;
            }

            if ($value['idmovimiento'] && $value['proceso']) {
                $this->comprometida->adicionarUbicacionComprometida($value);
                $this->actualizarMovUbicacion($value);
                $result = true;
            }
            if ($value['bandUbicar']) {
                if ($this->ubicarProducto($value)) {
                    $result = true;
                }
            }
        }
        return $result;
    }

    public function rebajarCantProductosByUbicacion($pDatos = array())
    {
        $count = 0;
        $res = array();
        foreach ($pDatos as $prod) {
            $cant = $this->datAreaProd->devolverPorductosUbicacionesVarias($prod['idproducto']);
            if ($cant > 1) {
                $count++;
                $res[] = $prod['idproducto'];
            } else {
                if ($cant == 1) {
                    $producto = $this->cargarUbicacionesProducto(array('idproducto' => $prod['idproducto']));
                    $param[] = array('idubicacionproducto' => $producto['datos'][0]['idubicacionproducto'],
                        'cantidad' => $prod['cantidad'], 'idareaproducto' => $producto['datos'][0]['idareaproducto']);
                    $this->desubicarProducto($param);
                    $datMovUbic = new DatMovubicacion();
                    $datMovUbic->synchronizeWithArray(
                        array('idestructuraubicacion' => $prod['idestructuraubicacion'],
                            'cantidad' => $prod['cantidad'], 'idmovimiento' => $producto['idmovimiento'],)
                    );
                    $datMovUbic->save();
                }
            }
        }
        return $count ? $res : 1;
    }

    public function restablecerCantProductosByUbicacion($pDatos = array())
    {
        foreach ($pDatos as $idMov) {
            $obMU = Doctrine::getTable('DatMovubicacion')
                ->findByDql('idmovimiento = ?', array($idMov['idmovimiento']))
                ->getFirst();
            $arrDatMovub = $obMU->toArray();
            $arrDatMov = Doctrine::getTable('DatMovimientos')
                ->find($idMov['idmovimiento'])
                ->toArray();
            $datos = array('tienelote' => 0, 'esarea' => false, 'idubicacion' => $arrDatMovub['idestructuraubicacion'],
                'idproducto' => $arrDatMov['idproducto'], 'cantidad' => $arrDatMovub['cantidad']);
            $this->ubicarProducto($datos);
        }
        return true;
    }

    private function actualizarMovUbicacion($value)
    {
        if ($value['idmovubicacion']) {
            $ubicMovim = Doctrine::getTable('DatMovubicacion')->find($value['idmovubicacion']);
            if ($ubicMovim->cantidad > $value['cantidad']) {
                $ubicMovim->cantidad -= $value['cantidad'];
                $ubicMovim->save();
            } else {
                $ubicMovim->delete();
            }
        } else {
            $ubicMovim = Doctrine::getTable('DatMovubicacion')->findByDql(
                'idestructuraubicacion = ? and idmovimiento = ?', array($value['idubicacion'], $value['idmovimiento'])
            );
            if (!$ubicMovim->toArray()) {
                $ubicMovim = new DatMovubicacion();
            } else {
                $ubicMovim = $ubicMovim->getFirst();
            }
            //$ubicMovim = new DatMovubicacion();
            $ubicMovim->idestructuraubicacion = $value['idubicacion'];
            $ubicMovim->cantidad = $value['cantidad'];
            $ubicMovim->idmovimiento = $value['idmovimiento'];
            $ubicMovim->save();
        }
    }

    public function obtenerArea($idubicacion)
    {
        $tabla = Doctrine::getTable('DatEstructuraubicacion')
            ->find($idubicacion)
            ->toArray();
        return $tabla['idarea'];
    }

    /**
     * Redistribuye las cantidades de los productos por las ubicaciones seleccionadas.
     *
     * @param array $pDatos
     */
    public function redistribuirUbicacion($pDatos = array())
    {
        foreach ($pDatos as $ubic) {
            $datosUbicar = array('idlote' => $ubic['idlote'], 'idproducto' => $ubic['idproducto'],
                'idubicacion' => $ubic['idubicacion'], 'idubicacionlote' => $ubic['idubicacionlote'],
                'idubicacionproducto' => $ubic['idubicacionproducto'], 'idarea' => $ubic['idarea'],
                'idarealote' => $ubic['idarealote'], 'idareaproducto' => $ubic['idareaproducto'],
                'cantidad' => $ubic['cantidad'], 'unificar' => $ubic['unificar']);
            $this->ubicarProductoLotes($datosUbicar);
            $datosDesubicar = array('idubicacionlote' => $ubic['idubicacionloteViejo'],
                'idubicacionproducto' => $ubic['idubicacionproductoViejo'], 'idarealote' => $ubic['idarealoteViejo'],
                'idareaproducto' => $ubic['idareaproductoViejo'], 'cantidad' => $ubic['cantidad']);
            $this->desubicarProductoLote($datosDesubicar);
        }
    }

    /**
     * Devuelve un arreglo de ubicaciones del lote en forma de arbol.
     * @param array $filtro
     * @return array
     */
    public function cargarUbicacionesLoteArbol($filtro)
    {
        if (!$filtro['node'] && isset($filtro['_node'])) {
            $filtro['node'] = $filtro['_node'];
        }
        $filtro['nivel'] = $filtro['nivel'] ? $filtro['nivel'] : -1;
        $filtro['ultimo_nivel'] = ($filtro['ultimo_nivel']) ? $filtro['ultimo_nivel'] : -1;
        $query = Doctrine_Query::create()
            ->select(
                "eu.idestructuraubicacion, eu.idestructuraubicacion AS id, eu.idtipoubicacion AS idtipoubicacion, "
                . "(eu.codigo || '-' || eu.descripcion) AS text, ai.ubicacionarea AS ubicacion, "
                . "a.idformato AS idformato, ai.idnomtipoarea AS idnomtipoarea, a.idarea AS idarea, "
//                "(CASE WHEN ({$filtro['nivel']} = eu.nivel) THEN (TRUE) ELSE FALSE END) AS leaf"
                . "(CASE WHEN (eu.ordender - eu.ordenizq = 1 ) THEN 1 ELSE 0 END) AS leaf"
            )
            ->from('DatEstructuraubicacion eu')
            ->leftJoin('eu.DatArea a')
            ->leftJoin('a.DatAreainventario ai')
            ->leftJoin('eu.DatValorescampostipoubicacion dv')
            ->where('eu.idestructuraubicacion <> -1');
        if ($filtro['idlote']) {
            $areas = Doctrine_Query::create()
                ->select('a.idarea')
                ->from('DatArea a')
                ->innerJoin('a.DatArealote al')
                ->where('al.idlote = ? AND a.idestructuracomun = ?', array($filtro['idlote'], $filtro['node']))
                ->fetchArray();
            $idsestructuras = $this->crearDqlDinamico($filtro);
            $idareas[] = -1;
            foreach ($areas as $value) {
                $idareas[] = $value['idarea'];
            }
            $query->addSelect('ul.cantidad AS cantidad')
                ->innerJoin(
                    'eu.DatUbicacionlote ul ON (ul.idubicacion = eu.idestructuraubicacion AND ul.idlote = ?)',
                    array($filtro['idlote'])
                )
                ->addWhere("a.idestructuracomun = ? AND eu.idpadre = eu.idestructuraubicacion", array($filtro['node']))
                ->whereIn('a.idarea', $idareas)
                ->orWhere("eu.idpadre = ? AND eu.idpadre <> eu.idestructuraubicacion", array($filtro['node']))
                ->whereIn('eu.idestructuraubicacion', $idsestructuras);
        } else {
            $query->addWhere("a.idestructuracomun = ? AND eu.idpadre = eu.idestructuraubicacion", array($filtro['node']))
                ->orWhere("eu.idpadre = ? AND eu.idpadre <> eu.idestructuraubicacion", array($filtro['node']));
        }
        if ($filtro['ultimo_nivel'] != -1) {
            $query->addWhere('eu.nivel <= ?', array($filtro['ultimo_nivel']));
        }
        return $query->fetchArray();
    }
    
    /**
     * Devuelve las ubicaciones de los lotes.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarUbicacionesLote($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select(
                'ul.idubicacionlote, ul.idubicacion, al.idarealote AS idarealote, ul.idlote, '
                . 'eu.descripcion AS descripcion, eu.descripcion AS ubicacion, eu2.descripcion AS area, '
                . 'eu.idarea AS idarea, al.disponible AS cant_area, ul.cantidad, '
                . '(ul.cantidad - coalesce((SELECT sum(uc.cantidad) FROM DatUbicacionComprometida uc '
                . 'WHERE uc.estado = 1 AND uc.idubicacion = ul.idubicacion '
                . 'AND uc.idlote = ul.idlote), 0)) AS disponible'
            )
            ->from('DatUbicacionlote ul')
            ->innerJoin('ul.DatEstructuraubicacion eu')
            ->innerJoin('eu.DatEstructuraubicacion eu2 ON (eu2.idestructuraubicacion = eu.idarbol)')
            ->innerJoin('ul.DatArealote al ON (al.idlote = ul.idlote AND al.idarea = eu.idarea)')
            ->orderBy('eu.idestructuraubicacion');
        if ($filtro['idlote']) {
            $query->where('ul.idlote = ?', $filtro['idlote']);
        }
        if ($filtro['idarea']) {
            $query->addWhere('eu.idarea = ?', $filtro['idarea']);
        }
        if ($filtro['ubicaciones']) {
            $ubicaciones = is_array($filtro['ubicaciones']) ? $filtro['ubicaciones'] : array($filtro['ubicaciones']);
            $query->whereIn('ul.idubicacion', $ubicaciones);
        }
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Construye la consulta dinámicamente.
     *
     * @param array $filtro
     *
     * @return array
     */
    private function crearDqlDinamico($filtro)
    {
        $nivel = Doctrine::getTable('DatEstructuraubicacion')
            ->find($filtro['node']);
        $i = $nivel ? $nivel->toArray()['nivel'] : 1;
        $nivelUbic = Doctrine_Query::create()
            ->select('eu.nivel')
            ->from('DatEstructuraubicacion eu')
            ->innerJoin('eu.DatUbicacionlote ul')
            ->where('ul.idlote = ?', array($filtro['idlote']))
            ->orderBy('eu.nivel DESC')
            ->fetchArray();
        $query = Doctrine_Query::create()
            ->select("eu{$i}.idestructuraubicacion")
            ->from("DatEstructuraubicacion eu{$i}")
            ->innerJoin("eu{$i}.DatUbicacionlote ul")
            ->where("ul.idlote = ?", array($filtro['idlote']));
        while ($i < $nivelUbic[0]['nivel']) {
            $j = $i++;
            $query->innerJoin(
                "eu{$j}.DatEstructuraubicacion eu{$i} ON (eu{$i}.idestructuraubicacion = eu{$j}.idpadre)"
            );
            if ($i == $nivelUbic[0]['nivel']) {
                $query->addSelect("eu{$j}.idestructuraubicacion AS idubicacion");
            }
        }
        $ubicaciones = $query->fetchArray();
        $ids[] = 0;
        foreach ($ubicaciones as $value) {
            $ids[] = $value['idubicacion'];
            $ids[] = $value['idestructuraubicacion'];
        }
        return $ids;
    }

    /*
     * Metodo para validar que los datos de ubicacion esten correctos
     * en los movimientos
     *
     */
    public function comprobarUbicacionMov($datosMovimiento)
    {
        foreach ($datosMovimiento['datos'] as $dmov) {
            if ($dmov['tienelote'] == 0 && $dmov['municion'] == 0 && $dmov['equipo'] == 0) {
                $movUbic = $this->movUbicacion->getMovDatosUbicacion($dmov['idmovimiento']);
//                $prodDisponible = $objMovUbic->productoDisponible($dmov['idproducto'], $dmov['idmovimiento']);
                $unico = $this->getUbicacionUnica($dmov['idproducto']);
                if (!$unico && $dmov['signo'] == '-' && ($movUbic['cantidad'] == 0 ||
                    $dmov['cantidad'] > $movUbic['cantidad'])) {
                    throw new ZendExt_Exception('LOG_LB_DOC_015');
                }
//                if ($dmov['signo'] == '-' && !$prodDisponible) {
//                    throw new ZendExt_Exception('LOG_LB_DOC_025');
//                }
                if ($dmov['signo'] == '-' && $unico && $unico['disponible'] < $dmov['cantidad']) {
                    throw new ZendExt_Exception('LOG_LB_DOC_025');
                }
                if ($dmov['signo'] == '-' && $dmov['cantidad'] < $movUbic['cantidad']) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Deevuelve los datos de la ubicación si es unica o false en caso contrario.
     * @param numeric $idproducto
     * @return array|boolean
     */
    public function getUbicacionUnica($idproducto)
    {
        return $this->movUbicacion->getUbicacionUnica($idproducto);;
    }
    

    /**
     * 
     * @param Doctrine_Query $query
     * @param array $filtro
     * @return Doctrine_Query
     */
    public function innerJoinDatAreaProducto($query, $filtro)
    {
        $query->innerJoin("{$filtro['aliasp']}.DatAreaproducto ap")
            ->innerJoin("ap.DatArea a")
            ->innerJoin("a.DatEstructuraubicacion e")
            ->innerJoin("e.DatUbicacionproducto u");
        if ($filtro['desdeubicacion']) {
            $query->addSelect('ap.disponible as cantidadubicada');
        }
        $idareas = json_decode($filtro['idarea']);
        if (is_array($idareas)) {
            $query->whereIn("ap.idarea", $idareas);
        } else {
            $query->where('ap.idarea = ?', $idareas);
        }
        if ($filtro['idubicacion']) {
            $query->addWhere('ap.idproducto = u.idproducto')
                ->andWhereIn('e.idestructuraubicacion', $filtro['idubicacion']);
        }
        return $query;
    }
    
    /**
     * Adiciona o modifica el registro de la cantidad comprometida por ubicacion asociada a un producto de un documento.
     * @param array $datos
     * @return boolean
     */
    public function adicionarUbicacionComprometida($datos)
    {
        $this->comprometida->adicionarUbicacionComprometida($datos);
    }

    /**
     * Elimina los registros de cantidades comprometidas por ubicacion asociadas a los productos
     * seleccionados de un documento.
     * @param numeric $iddocumento [Opcional]
     * @param array|numeric $idproducto [Opcional]
     * @param array|numeric $idubicacioncomprometida [Opcional]
     * @return boolean
     */
    public function eliminarUbicacionComprometida($iddocumento, $idproducto, $idubicacioncomprometida)
    {
        $this->comprometida->eliminarUbicacionComprometida($iddocumento, $idproducto, $idubicacioncomprometida);
    }

    /**
     * Cambia el estado de los registros de cantidades comprometidas por ubicacion asociados a los productos
     * de un documento.
     * @param numeric $iddocumento
     * @param numeric $estado
     * @return boolean
     */
    public function cambiarEstado($iddocumento, $estado)
    {
        $this->comprometida->cambiarEstado($iddocumento, $estado);
    }
    
    private function buscarUbicacionesHijas($idubicacion, $soloId = false)
    {
        $result = array();
        if ($soloId) {
            $result[] = $idubicacion;
        } else {
            $eu = Doctrine::getTable('DatEstructuraubicacion')->find($idubicacion)->toArray();
            $result[] = $eu;
        }
        $ubicaciones = Doctrine::getTable('DatEstructuraubicacion')
            ->findByDql('idpadre = ? AND nivel > 1', array($idubicacion));
        foreach ($ubicaciones as $value) {
            if (!in_array($value->idestructuraubicacion, $result)) {
                $result[] = $soloId ? $value->idestructuraubicacion : (array) $value;
                $result = array_merge($result, $this->buscarUbicacionesHijas($value->idestructuraubicacion, $soloId));
            }
        }
        return array_unique($result);
    }

}
