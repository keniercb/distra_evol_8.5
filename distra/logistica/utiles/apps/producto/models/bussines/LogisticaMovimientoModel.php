<?php

/**
 * Clase para la gestion de operaciones sobre los movimientos
 *
 * @author        Kenier Cumba Bueno
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
class LogisticaMovimientoModel extends BaseModel
{

    const SIGNO_MOV_SUMA = '+',
        SIGNO_MOV_RESTA = '-',
        SIGNO_NINGUNO = 'N';

    /**
     *
     * @var LogisticaProductoModel
     */
    private $productoModel, $fRedondeo;

    /**
     *
     * @param type $productoModel
     */
    public function setProductoModel(LogisticaProductoModel $productoModel)
    {
        $this->productoModel = $productoModel;
    }

    public function __construct()
    {
        parent::__construct();
        $this->fRedondeo = LogisticaGlobal::FACTOR_REDONDEO;
    }

    /**
     * Adiciona los movimientos de los documentos, devuelve los productos que no fueron adicionados.
     * @param numeric $iddocumento Id del documento al que se le adicionan los movimientos.
     * @param array $arrIdprod Arreglo con los datos de los productos a adicionar.
     * @param string $signo [Opcional] Signo del movimiento (por defecto es 'N').
     * @return array Devuelve los datos de los movimientos adicionados y los que no.
     */
    public function adicionarMovimientos($iddocumento, $arrIdprod, $signo = LogisticaMovimientoModel::SIGNO_NINGUNO)
    {
        $collectionMovimiento = new Doctrine_Collection('DatMovimientos');
        $datosMovimiento = array('iddocumento' => $iddocumento, 'noadicionados' => array(),
            'movimientos' => array(), 'signo' => $signo);
        foreach ($arrIdprod as $idprod) {
            if (!DatMovimientos::existeMovimiento($iddocumento, is_array($idprod) ? $idprod['idproducto'] : $idprod)) {
                if (is_array($idprod)) {
                    $datosMovimiento = array_merge($datosMovimiento, $idprod);
                } else {
                    $datosMovimiento['idproducto'] = $idprod;
                    $datosMovimiento['cantidad'] = 0;
                    $datosMovimiento['preciocontable'] = 0;
                    $datosMovimiento['precioalternativo'] = 0;
                }
                $datosMovimiento['signo'] = is_array($idprod) && array_key_exists('signomov', $idprod) ? $idprod['signomov'] : $datosMovimiento['signo'];
                $movimiento = $this->adicionarMovimiento($datosMovimiento);
                $collectionMovimiento[] = $movimiento;
            } else {
                $datosMovimiento['noadicionados'][] = $idprod;
            }
        }
        if ($collectionMovimiento->count()) {
            $collectionMovimiento->save();
            $datosMovimiento['movimientos'] = $collectionMovimiento->toArray();
        }
        return $datosMovimiento;
    }

    /**
     *
     * @param Doctrine_Query $query
     * @param type $aliasExterno
     * @param type $aliasLocal
     *
     * @return \Doctrine_Query
     */
    public function getJoinContarMovimientos(Doctrine_Query $query, $aliasExterno, $aliasLocal = 'mov')
    {
        $query->addSelect(
            "(SELECT COUNT({$aliasLocal}.idmovimiento) FROM DatMovimientos {$aliasLocal} "
            . "WHERE {$aliasLocal}.iddocumento = {$aliasExterno}.iddocumento ) as cantproductos"
        );
        return $query;
    }

    /**
     *
     * @param Doctrine_Query $query
     * @param type $asExterno
     * @param type $as
     *
     * @return \Doctrine_Query
     */
    public function getJoinDatMovimiento(Doctrine_Query $query, $asExterno, $as = 'mov')
    {
        $query->leftJoin("{$asExterno}.DatMovimientos {$as}")
            ->addSelect(
                "{$as}.idmovimiento as idmovimiento, {$as}.idproducto as idproducto, {$as}.iddocumento as iddocumento,"
                . "{$as}.iddocumento as iddocumento, round({$as}.recargodescuento, {$this->fRedondeo}) as recargodescuento, "
                . "round({$as}.preciocontable, {$this->fRedondeo}) as preciocontable, round({$as}.importecontable, {$this->fRedondeo}) as importe, "
                . "round({$as}.cantidad, {$this->fRedondeo}) as cantidad, {$as}.iddocumento as iddocumento"
            );
        return $query;
    }

    /**
     *
     * @param Doctrine_Query $query
     * @param type $asExterno
     * @param type $as
     *
     * @return \Doctrine_Query
     */
    public function getInnerJoinDatMovimiento(Doctrine_Query $query, $asExterno, $as = 'mov')
    {
        return $query->innerJoin("{$asExterno}.DatMovimientos {$as}");
    }

    /**
     *
     * @param type $as
     *
     * @return \Doctrine_Query
     */
    public function getQueryMovimiento($as = 'mov', $select = true)
    {
        $dqlResult = new Doctrine_Query();
        $dqlResult->from("DatMovimientos {$as}");
        if ($select) {
            $dqlResult->select(
                " {$as}.idmovimiento, {$as}.idproducto as idproducto, {$as}.iddocumento as iddocumento,"
                . "round({$as}.recargodescuento, 6) as recargodescuento,"
                . " round({$as}.preciocontable, 6) as preciocontable, "
                . " round({$as}.precioalternativo, 6) as precioalternativo, "
                . " round({$as}.recargodescuentoalt, 6) as recargodescuentoalt, "
                . " round({$as}.recargodescuento, 6) as recargodescuento, "
                . "round({$as}.importecontable, {$this->fRedondeo}) as importe,round({$as}.importealternativo, {$this->fRedondeo}) as importealternativo, "
                . "round({$as}.cantidad, 6) as cantidad, round({$as}.importetotalalt, {$this->fRedondeo}) as importetotalalt,"
                . "{$as}.signo as signo, {$as}.idunidadmedida as idunidadmedida,"
                . " {$as}.factorconversion as factorconversion, {$as}.idelementogasto as idelementogasto, {$as}.idelementogastoalt as idelementogastoalt,"
                . "{$as}.existenciaalmacen as existenciaalmacen, {$as}.diferencia as diferencia, "
                . "{$as}.numerochip as numerochip, {$as}.fecha as fecha, "
                ."{$as}.existenciaactual as existenciamovimiento"
            );
        }
        return $dqlResult;
    }

    /**
     *
     * @param Doctrine_Query $dql
     * @param type $as
     * @param type $filtro
     *
     * @return \Doctrine_Query
     */
    public function addFiltersQueryMovimiento(Doctrine_Query $dql, $as = 'mov', $filtro = array())
    {
        if ($filtro['idproducto']) {
            $dql->addWhere("{$as}.idproducto = ?", array($filtro['idproducto']));
        }
        if ($filtro['iddocumento']) {
            $filtro['iddocumento'] = is_array($filtro['iddocumento']) ?
                $filtro['iddocumento'] : array($filtro['iddocumento']);
            $dql->andWhereIn("{$as}.iddocumento", $filtro['iddocumento']);
        }
        if ($filtro['signo']) {
            $dql->addWhere("{$as}.signo = ?", $filtro['signo']);
        }
        return $dql;
    }

    /**
     *
     * @param type $parametros
     *
     * @return type
     */
    public function devolverMovimientos($parametros = array())
    {
        $dql = $this->getQueryMovimiento('mov');
        $dql->orderBy('mov.idmovimiento');
        $this->addFiltersQueryMovimiento($dql, 'mov', $parametros);
        return $dql;
    }

    /**
     *
     * @param array $datos
     *
     * @return \DatMovimientos
     */
    public function adicionarMovimiento($datos)
    {
        $objMovimiento = new DatMovimientos();
        if (!$datos['idmovimiento'] && $datos['idproducto']) {
            $query = Doctrine_Query::create()->select('m.idmovimiento as idmovimiento, m.idunidadmedida as idumedida')
                ->from('DatMovimientos m')->where('m.idproducto = ? and m.iddocumento = ?')
                ->fetchOne(array($datos['idproducto'], $datos['iddocumento']));
            $datos['idmovimiento'] = $query->idmovimiento;
            $datos['idunidadmedida'] = $query->idumedida;
        }
        $cancelar = array_key_exists('cancelar', $datos) ? $datos['cancelar'] : false;
        $isEntrada = array_key_exists('entrada', $datos);
        unset($datos['entrada']);
        if ($datos['idmovimiento']) {
            $objMovimiento->assignIdentifier($datos['idmovimiento']);
        }
        $datosProducto = $this->productoModel->getDatosProducto($datos['idproducto']);
        if (!$isEntrada && !$cancelar) {
            $datos['preciocontable'] = $datosProducto['precio'];
            $datos['precioalternativo'] = $datosProducto['precioalternativo'];
        }
        if (!$datos['idunidadmedida']) {
            $datos['idunidadmedida'] = $datosProducto['idumedida'];
            $datos['factorconversion'] = $datos['factorbase'];
        }
        if ($datos['cancelar'] == 1 && $datos['cantidad'] == 0 && $datos['importecontable'] > 0) {
            $datos['importecontable'] = LogisticaObjectHelper::__init()->_round($datos['importecontable'], LogisticaGlobal::FACTOR_REDONDEO);
        } else {
            $datos['importecontable'] = LogisticaObjectHelper::__init()->_round($datos['preciocontable'] * $datos['cantidad'], LogisticaGlobal::FACTOR_REDONDEO);
        }
        $datos['importealternativo'] = LogisticaObjectHelper::__init()->_round($datos['precioalternativo'] * $datos['cantidad'], LogisticaGlobal::FACTOR_REDONDEO);
        $objMovimiento->synchronizeWithArray($datos);
        return $objMovimiento;
    }

    /**
     *
     * @param numeric $iddocumento
     * @param array $arrIdMovimientos
     * @param boolean $afectaDisponible
     * @param boolean $cancelar
     *
     * @return boolean
     */
    public function eliminarMovimientos($iddocumento = false, $arrIdMovimientos = array(), $afectaDisponible = false, $cancelar = true
    )
    {
        //if((new EstadoDocumentoModel())->getEstadoActual($iddocumento) == EstadoDocumentoModel::ESTADO_ELABORACION){
            $doctrineUtil = LogisticaDoctrineHelper::__init();
            $dqlProducto = "SELECT d.idproducto, d.cantidad, d.iddocumento FROM DatMovimientos d WHERE";
            if (!$iddocumento && count($arrIdMovimientos) == 0) {
                return false;
            }
            if ($iddocumento) {
                $dqlWHERE = " d.iddocumento = {$iddocumento}";
            } else {
                $strIds = implode(',', $arrIdMovimientos);
                $dqlWHERE = " d.idmovimiento IN ({$strIds})";
            }
            $datosProducto = $doctrineUtil->query($dqlProducto . '' . $dqlWHERE)->toArray();
            if ($this->tryDeleteMovimiento($iddocumento, $arrIdMovimientos, $cancelar)) {
                $this->tryDeleteProductos($datosProducto);
                return $afectaDisponible ? $datosProducto : true;
            }
        //}
        return false;
    }

    /**
     *
     * @param type $iddocumento
     * @param type $arrIdMovimientos
     * @param type $cancelar
     *
     * @return boolean
     */
    private function tryDeleteMovimiento($iddocumento = false, $arrIdMovimientos = array(), $cancelar = true)
    {
        $dqlWHERE = '';
        if (!$iddocumento && count($arrIdMovimientos) == 0) {
            return false;
        }
        if ($iddocumento) {
            $dqlWHERE = "iddocumento = {$iddocumento}";
        } else {
            $strIds = implode(',', $arrIdMovimientos);
            $dqlWHERE = "idmovimiento IN ({$strIds})";
        }
        if ($cancelar) {
            Doctrine_Query::create()->update('DatMovimientos')->set('cantidad', 0)->where($dqlWHERE)->execute();
        } else {
            Doctrine_Query::create()->delete('DatMovimientos')->where($dqlWHERE)->execute();
        }
        return true;
    }

    private function tryDeleteProductos($datosProductos = array())
    {
        if (count($datosProductos) == 0) {
            return false;
        }
        $datosProductos = LogisticaObjectHelper::__init()->extractValueFromArrayColumn($datosProductos, 'idproducto');
        Doctrine_Query::create()->delete('DatProductoLogistica')
            ->whereIn('idproducto', $datosProductos)
            ->andWhere("cronologia = 0")
            ->execute();
        return true;
    }

    /**
     *
     * @param array $datosMov
     * @param boolean $afectaDisp [Opcional]
     * @return boolean
     */
    public function modificarMovimiento($datosMov, $afectaDisp = false)
    {
        $objMov = Doctrine::getTable('DatMovimientos')->find($datosMov['idmovimiento']);
        $tempArrData = $objMov->toArray();
        $cantidad = 0;
        if ($objMov) {
            $isEntrada = array_key_exists('entrada', $datosMov);
            unset($datosMov['idmovimiento']);
            unset($datosMov['entrada']);
            $datosProducto = $this->productoModel->getDatosProducto($objMov->idproducto);
            if (/*$objMov->preciocontable == 0 && $datosMov['preciocontable'] == 0 &&*/ !$isEntrada) {
                $datosMov['preciocontable'] = $datosProducto['precio'];
            }
            if (/*$objMov->precioalternativo == 0 && $datosMov['precioalternativo'] == 0 &&*/ !$isEntrada) {
                $datosMov['precioalternativo'] = $datosProducto['precioalternativo'];
            }
            $datosMov['preciocontable'] = ($datosMov['preciocontable'] || $datosMov['preciocontable'] == 0) ? $datosMov['preciocontable'] : $objMov->preciocontable;
            $datosMov['precioalternativo'] = ($datosMov['precioalternativo'] || $datosMov['precioalternativo'] == 0) ? $datosMov['precioalternativo'] : $objMov->precioalternativo;
            $datosMov['importecontable'] = LogisticaObjectHelper::__init()->_round($datosMov['preciocontable'] * (is_numeric($datosMov['cantidad']) ? $datosMov['cantidad'] : $objMov->cantidad), LogisticaGlobal::FACTOR_REDONDEO);
            $datosMov['importealternativo'] = LogisticaObjectHelper::__init()->_round($datosMov['precioalternativo'] * (is_numeric($datosMov['cantidad']) ? $datosMov['cantidad'] : $objMov->cantidad), LogisticaGlobal::FACTOR_REDONDEO);
            if ($afectaDisp) {
                $cantidad = floatval($tempArrData['cantidad']) - floatval($datosMov['cantidad']);
                $this->productoModel->checkDisponibleProducto($objMov->idproducto, $cantidad);
                $datosMov['iddocumento'] = $objMov->iddocumento;
                $datosMov['idproducto'] = $objMov->idproducto;
                $comprometida = new CantidadesComprometidasModel();
                $comprometida->insertarCantidadComprometida($datosMov);
            }
            $this->objectHelper->unsetNullValues($datosMov);
            if ($datosMov['idclasificacioncontable']) {
                $datosMov['idclasificacion'] = $datosMov['idclasificacioncontable'];
            }

            $objMov->synchronizeWithArray($datosMov);
            return array('record' => $objMov, 'cantidad' => $cantidad);
        }
        return false;
    }

    public function updatePrecioMovimientoSalida($idmovimiento)
    {
        $objMov = Doctrine::getTable('DatMovimientos')->find($idmovimiento);
        if ($objMov) {
            $datosProducto = $this->productoModel->getDatosProducto($objMov->idproducto);
            if ($datosProducto['precio'] > 0) {
                $precio = $datosProducto['precio'];
                $importe = LogisticaObjectHelper::__init()->_round($precio * ($objMov->cantidad), LogisticaGlobal::FACTOR_REDONDEO);
                $objMov->preciocontable = $precio;
                $objMov->importecontable = $importe;
                return array('record' => $objMov);
            }
        }
        return false;
    }

    /**
     *
     * @param numeric $iddocumento
     * @param numeric $cronologia
     * @param boolean $isEntrada
     * @param boolean $updateExistencia
     * @param boolean $invertirPrecio
     * @param boolean $importe
     *
     * @return boolean
     */
    public function aprobarMovimientos($iddocumento, $cronologia, $isEntrada = false, $updateExistencia = true, $invertirPrecio = false, $importe = false
    )
    {
        $this->asentarMovimientos($iddocumento, $cronologia, $isEntrada, $updateExistencia);
        return true;
    }

    public function aprobarCronologiaProductos($iddocumento, $cronologia)
    {
        $productos = $this->doctrineHelper->query($this->getDqlWhere($iddocumento))->toArray();
        $idproducto = $this->objectHelper->extractValueFromArrayColumn($productos, 'idproducto');
        Doctrine_Query::create()->update('DatProductoLogistica')->set('cronologia', $cronologia)->whereIn(
            'idproducto', $idproducto
        )->execute();
        return true;
    }

    /**
     * metodo que permite aprobar los movimientos usando DQL
     *
     * @param type $iddocumento
     * @param type $cronologia
     * @param type $isEntrada
     */
//    public function aprobarMovimientosDql($iddocumento, $cronologia, $isEntrada = false)
//    {
//        $dqlUpdate = "UPDATE DatProductoLogistica as dp SET cronologia = {$cronologia}"
//            . ", SET cantidad = ({$this->getDqlCantidad($iddocumento, 'dp', 'm', $isEntrada, 'cantidad')}), "
//            . "SET precio = ({$this->getDqlPrecio($iddocumento, 'dp', 'm', $isEntrada)}),"
//            . "SET precioalternativo = ({$this->getDqlPrecioAlternativo($iddocumento, 'dp', 'm', $isEntrada)})";
//        if ($isEntrada) {
//            $dqlUpdate .= ", SET disponible ="
//                . "({$this->getDqlCantidad($iddocumento, 'dp', 'm', $isEntrada, 'disponible')})";
//        }
//        $dqlUpdate .= " WHERE idproducto IN ({$this->getDqlWhere($iddocumento, 'dp', 'dm')})";
//        $this->doctrineHelper->query($dqlUpdate);
//    }

    /**
     *
     * @param type $iddocumento
     * @param type $aliasProducto
     * @param type $aliasMovimiento
     * @param type $isEntrada
     * @param type $campo
     *
     * @return type
     */
//    public function getDqlCantidad($iddocumento, $aliasProducto = 'p', $aliasMovimiento = 'm', $isEntrada = false,
//        $campo = 'cantidad'
//    )
//    {
//        $signo = ($isEntrada == false) ? LogisticaMovimientoModel::SIGNO_MOV_RESTA :
//            LogisticaMovimientoModel::SIGNO_MOV_RESTA;
//        return "SELECT {$campo} {$signo} {$aliasMovimiento}.cantidad "
//            . "FROM dat_movimiento {$aliasMovimiento} "
//            . "WHERE {$aliasMovimiento}.idproducto = {$aliasProducto}.idproducto "
//            . "AND {$aliasMovimiento}.iddocumento = {$iddocumento}";
//    }

    /**
     *
     * @param type $iddocumento
     * @param type $aliasProducto
     * @param type $aliasMovimiento
     * @param type $isEntrada
     *
     * @return string
     */
//    public function getDqlPrecio($iddocumento, $aliasProducto = 'p', $aliasMovimiento = 'm', $isEntrada = false)
//    {
//        if ($isEntrada) {
//            return "SELECT ({$aliasMovimiento}.cantidad * {$aliasMovimiento}.preciocontable + "
//                . "{$aliasProducto}.cantidad * {$aliasProducto}.precio)/({$aliasMovimiento}.cantidad + cantidad) "
//                . "FROM dat_movimiento {$aliasMovimiento} "
//                . "WHERE {$aliasMovimiento}.idproducto = {$aliasProducto}.idproducto "
//                . "AND {$aliasMovimiento}.iddocumento = {$iddocumento}";
//        }
//        return "precio";
//    }

    /**
     *
     * @param type $iddocumento
     * @param type $asProducto
     * @param type $aliasMovimiento
     * @param type $isEntrada
     * @return string
     */
//    public function getDqlPrecioAlternativo($iddocumento, $asProducto = 'p', $aliasMovimiento = 'm', $isEntrada = false)
//    {
//        if ($isEntrada) {
//            return "SELECT ({$aliasMovimiento}.cantidad * {$aliasMovimiento}.precioalternativo + "
//                . "{$asProducto}.cantidad * {$asProducto}.precioalternativo)/({$aliasMovimiento}.cantidad + cantidad)"
//                . " FROM dat_movimiento {$aliasMovimiento} "
//                . " WHERE {$aliasMovimiento}.idproducto = {$asProducto}.idproducto "
//                . " AND {$aliasMovimiento}.iddocumento = {$iddocumento}";
//        }
//        return "precioalternativo";
//    }

    /**
     *
     * @param type $iddocumento
     *
     * @return type
     */
    public function getDqlWhere($iddocumento)
    {
        return "SELECT dm.idproducto FROM DatMovimientos dm WHERE dm.iddocumento = {$iddocumento}";
    }

    /**
     * Metodo que permite contabilizar el producto a traves de un coleccion
     *
     * @param numeric $iddocumento
     * @param numeric $cronologia
     * @param boolean $isEntrada
     * @param boolean $updateExistencia
     * @param boolean $invertirPrec
     * @param boolean $importe
     */
    private function updateProductosCollection(
        $iddocumento, $cronologia, $isEntrada = false, $updateExistencia = true, $invertirPrec = false, $importe = false
    )
    {
        $selectProductos = $this->getProductosContabilizar(
            $iddocumento, $isEntrada, $updateExistencia, $invertirPrec, $importe
        );
        if ($this->contabilizaProductos($selectProductos, $cronologia, $isEntrada)) {
            $this->updateMovimientos($selectProductos, $cronologia);
        }
    }

    private function getProductosContabilizar($iddocumento, $isEntrada = false, $updateExistencia = true, $invertirPrecio = false, $importe = false
    )
    {
        $signo = ($isEntrada == false) ? LogisticaMovimientoModel::SIGNO_MOV_RESTA :
            LogisticaMovimientoModel::SIGNO_MOV_SUMA;
        $sCantidad = $updateExistencia ? 'dm.cantidad' : '0';
        return Doctrine_Query::create()
            ->from('DatProductoLogistica dp')
            ->innerJoin('dp.DatMovimientos dm')
            ->select("dp.idproducto, dm.idmovimiento as idm, dm.idunidadmedida as idumedida, dp.cronologia")
            ->addSelect("(dp.cantidad {$signo} {$sCantidad}) as _existencia")
            ->addSelect("(dp.disponible {$signo} {$sCantidad}) as _disponible")
            ->addSelect($this->getStrPrecio($isEntrada, $invertirPrecio, $importe))
            ->addSelect($this->getStrPrecioAlternativo($isEntrada, $invertirPrecio, $importe))
            ->addWhere("dm.iddocumento = ?", array($iddocumento))
            ->addWhere("(dm.cantidad > 0)")
            ->fetchArray();
    }

    /**
     *
     * @param type $productos
     * @param type $cronologia
     * @param type $isEntrada
     *
     * @return boolean
     */
    private function contabilizaProductos($productos, $cronologia, $isEntrada)
    {
        $cProductos = new Doctrine_Collection('DatProductoLogistica');
        foreach ($productos as $producto) {
            $record = new DatProductoLogistica;
            $record->assignIdentifier($producto['idproducto']);
            $record->synchronizeWithArray(
                array(
                    'cantidad' => $producto['_existencia'],
                    'importe' => LogisticaObjectHelper::__init()->_round($producto['_existencia'] * $producto['_ppromedio'], LogisticaGlobal::FACTOR_REDONDEO),
                    'importealternativo' => LogisticaObjectHelper::__init()->_round($producto['_existencia'] * $producto['_ppromedioalt'], LogisticaGlobal::FACTOR_REDONDEO),
                    'cronologia' => $cronologia
                )
            );
            if (!($producto['cronologia'] > 0)) {
                $record->idumedida = $producto['idumedida'];
            }
            $record->disponible = $producto['_disponible'];
            $record->precio = $producto['_existencia'] > 0 ? $producto['_ppromedio'] : 0.0;
            $record->precioalternativo = $producto['_existencia'] > 0 ? $producto['_ppromedioalt'] : 0.0;
            if ($isEntrada) {
                //$record->disponible = $producto['_disponible'];
                $record->precio = $producto['_existencia'] > 0 ? $producto['_ppromedio'] : 0.0;
                $record->precioalternativo = $producto['_existencia'] > 0 ? $producto['_ppromedioalt'] : 0.0;
            } else {
                $this->productoModel->checkDisponibleProducto($record->idproducto, $record->cantidad, true);
            }
            $cProductos->add($record);
        }
        if ($cProductos->count()) {
            $cProductos->save();
            return true;
        }
        return false;
    }

    /**
     *
     * @param type $productos
     *
     * @return boolean
     */
    private function updateMovimientos($productos, $cronologia)
    {
        $cMovimientos = new Doctrine_Collection('DatMovimientos');
        foreach ($productos as $movimiento) {
            $record = new DatMovimientos;
            $record->assignIdentifier($movimiento['idm']);
            $record->synchronizeWithArray(
                array(
                    'existenciaactual' => $movimiento['_existencia'],
                    'preciopromedio' => $movimiento['_ppromedio'],
                    'preciopromalt' => $movimiento['_ppromedioalt'],
                    'importetotal' => LogisticaObjectHelper::__init()->_round($movimiento['_ppromedio'] * $movimiento['_existencia'], LogisticaGlobal::FACTOR_REDONDEO),
                    'importetotalalt' => LogisticaObjectHelper::__init()->_round($movimiento['_ppromedioalt'] * $movimiento['_existencia'], LogisticaGlobal::FACTOR_REDONDEO),
                    'cronologia' => $cronologia
                )
            );
            $cMovimientos->add($record);
        }
        if ($cMovimientos->count()) {
            $cMovimientos->save();
            return true;
        }
        return false;
    }

    private function getStrPrecio($isEntrada = false, $invertirPrecio = false, $importe = false)
    {
        $importecontable = $importe ? "dm.importecontable" :
            "(coalesce(dm.cantidad, 0) * coalesce(dm.preciocontable, 0))";
        $importecontable = "({$importecontable} + coalesce(dm.recargodescuento,0))";
        if ($invertirPrecio) {
            /*
             * TODO Revisar el caso de la cancelacion de la recepcion
             */
            return (!$isEntrada) ? "((coalesce(dp.cantidad,0) * coalesce(dp.precio,0) - {$importecontable})"
                . "/( case when dp.cantidad <> dm.cantidad then coalesce(dp.cantidad,0) - coalesce(dm.cantidad,0) "
                . "else dp.cantidad end )) as _ppromedio" : "dp.precio as _ppromedio";
        }
        return $isEntrada ? "(({$importecontable} + coalesce(dp.cantidad,0) * coalesce(dp.precio,0))"
            . "/(coalesce(dp.cantidad,0) + coalesce(dm.cantidad,0))) as _ppromedio" : "dp.precio as _ppromedio";
    }

    private function getStrPrecioAlternativo($isEntrada = false, $invertirPrecio = false, $importe = false)
    {
        $importealt = $importe ? "dm.importealternativo" :
            "(coalesce(dm.cantidad, 0) * coalesce(dm.precioalternativo, 0))";
        $importealt = "({$importealt} + coalesce(dm.recargodescuentoalt,0))";
        if ($invertirPrecio) {
            /*
             * TODO Revisar el caso de la cancelacion de la recepcion
             */
            return (!$isEntrada) ? "((coalesce(dp.cantidad,0) * coalesce(dp.precioalternativo,0) - "
                . "{$importealt})"
                . "/( case when dp.cantidad <> dm.cantidad then coalesce(dp.cantidad,0) - coalesce(dm.cantidad,0) "
                . "else dp.cantidad end )) as _ppromedioalt" : "dp.precioalternativo as _ppromedioalt";
        }
        return $isEntrada ? "(({$importealt} + coalesce(dp.cantidad,0) * coalesce(dp.precioalternativo,0))"
            . "/(coalesce(dp.cantidad,0) + coalesce(dm.cantidad,0))) as _ppromedioalt" : "dp.precioalternativo as _ppromedioalt";
    }

    public function cancelarMovimientos($iddocumento, $cronologia, $isEntrada = false)
    {
        /*$signo = $isEntrada ? '-' : '+';
        $queryDatos = "select d.idmovimiento as idm, p.idproducto as idp, (p.cantidad {$signo} d.cantidad) as existencia,
            case when (p.cantidad {$signo} d.cantidad) > 0 
                then (round(p.cantidad*p.precio, {$this->fRedondeo}) {$signo} round(d.cantidad*d.preciocontable, {$this->fRedondeo}))/(p.cantidad {$signo} d.cantidad)  
            else 0 end as preciop,
            case when (p.cantidad {$signo} d.cantidad) > 0 
                then (round(p.cantidad*p.precioalternativo,{$this->fRedondeo}) {$signo} round(d.cantidad*d.precioalternativo,{$this->fRedondeo}))/(p.cantidad {$signo} d.cantidad) 
            else 0 end as preciopalt
        from mod_logistica.dat_movimiento d
        inner join mod_logistica.dat_producto p on p.idproducto = d.idproducto
        where d.iddocumento = {$iddocumento}";

        $queryMovimiento = "update mod_logistica.dat_movimiento 
        set existenciaactual = q.existencia,
            preciopromedio = q.preciop,
            preciopromalt = q.preciopalt,
            importetotal = round(q.existencia*q.preciop, {$this->fRedondeo}),
            importetotalalt = round(q.existencia*q.preciopalt, {$this->fRedondeo})
        from({$queryDatos})q where q.idm = idmovimiento";

        $queryProducto = "update mod_logistica.dat_producto
        set cantidad = q.existencia,
            importe = round(q.existencia*q.preciop, {$this->fRedondeo}),
            importealternativo = round(q.existencia*q.preciopalt, {$this->fRedondeo}),
            cronologia = {$cronologia},
            precio = q.preciop,
            precioalternativo = q.preciopalt
        from({$queryDatos})q where q.idp = idproducto";
        $this->doctrineHelper->getConnection()->execute($queryMovimiento);
        $this->doctrineHelper->getConnection()->execute($queryProducto);*/
        $this->asentarMovimientos($iddocumento, $cronologia, $isEntrada ? false : true);
        return true;
    }

    public function getSignoContrario($signo = LogisticaMovimientoModel::SIGNO_NINGUNO)
    {
        if ($signo == LogisticaMovimientoModel::SIGNO_MOV_RESTA) {
            $signo = LogisticaMovimientoModel::SIGNO_MOV_SUMA;
        } elseif ($signo == LogisticaMovimientoModel::SIGNO_MOV_SUMA) {
            $signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        }
        return $signo;
    }
    /*INICIO DE LOS METODOS DE REFACTORIZAR PRECIO PROMEDIO*/
    /**
     * @param $idDocumento
     * @param $cronologia
     * @param bool $isEntrada
     */
    private function asentarMovimientos($idDocumento, $cronologia, $isEntrada = false, $updateExistencia = true)
    {
        $sqlBase = $this->auxQueryImporteFinal($idDocumento, ($isEntrada ? "+" : "-"), $updateExistencia);
        $this->verificarCantidadImporteNegativo($sqlBase);
        $this->verificarClasificacionContable($idDocumento);
        $this->doctrineHelper->executeQuery($this->auxQueryMovimiento($sqlBase, $cronologia));
        $this->doctrineHelper->executeQuery($this->auxQueryProducto($sqlBase, $cronologia));
        return true;
    }

    /**
     * Metodo que calcula el precio del producto a partir del importe final de la operacion.
     * @param $idDocumento
     * @param $signoOper
     * @return string
     */
    private function auxQueryImporteFinal($idDocumento, $signoOper, $updateExistencia)
    {
        $factor = LogisticaGlobal::FACTOR_REDONDEO;
        if(!$updateExistencia) {
            $cantidad = $importe = $importealt = '0';
        } else {
            $cantidad = 'd.cantidad';
            $importe = 'd.importecontable';
            $importealt = 'd.importealternativo';
        }
        return "select d.idmovimiento as idm, p.idproducto as idp, (p.cantidad {$signoOper} {$cantidad}) as existencia,
            case when (p.cantidad {$signoOper} d.cantidad) > 0 
                then (round(p.importe {$signoOper} {$importe},{$factor}))/(p.cantidad {$signoOper} {$cantidad})  
            else 0 end as preciop,
            case when (p.cantidad {$signoOper} {$cantidad}) > 0 
                 then (round(p.importealternativo {$signoOper} {$importealt}, {$factor}))/(p.cantidad {$signoOper} {$cantidad}) 
            else 0 end as preciopalt,
            case when (p.cantidad {$signoOper} {$cantidad}) > 0 
                  then (round(p.importe {$signoOper} {$importe}, {$factor}) )
            else 0 end as importec,
            case when (p.cantidad {$signoOper} {$cantidad}) > 0 
                  then (round(p.importealternativo {$signoOper} {$importealt}, {$factor})) 
            else 0 end as importealt,
            p.idclasificacioncontable as idclasificacion
          from mod_logistica.dat_movimiento d
          inner join mod_logistica.dat_producto p on p.idproducto = d.idproducto
          where d.iddocumento = {$idDocumento} and d.signo <> 'N'";
    }

    /***
     * Metodo que devuelve la cadena para actualizar los datos del movimiento a partir de una query base.
     * @param $qBase
     * @param $cronologia
     * @return string
     */
    private function auxQueryMovimiento($qBase, $cronologia)
    {
        $updateFileds = implode(',',array(
            "cronologia = {$cronologia}",
            'existenciaactual =qbase.existencia',
            'preciopromedio = qbase.preciop',
            'importetotal=qbase.importec',
            'preciopromalt=qbase.preciopalt',
            'importetotalalt=qbase.importealt',
            'idclasificacion=qbase.idclasificacion',
        ));
        return "UPDATE mod_logistica.dat_movimiento dm
                    SET {$updateFileds}
                FROM ({$qBase}) qbase WHERE dm.idmovimiento = qbase.idm;";
    }
    /**
     * Metodo que devuelve la cadena para actualizar los datos del producto a partir de una query base.
     * @param $qBase
     * @param $cronologia
     * @return string
     */
    private function auxQueryProducto($qBase, $cronologia)
    {
        return "UPDATE mod_logistica.dat_producto dp
                    SET precio = qbase.preciop,
                        cantidad = qbase.existencia,
                        cronologia = {$cronologia},
                        importe = qbase.importec,
                        precioalternativo = qbase.preciopalt,
                        importealternativo = qbase.importealt
                FROM ({$qBase}) qbase WHERE dp.idproducto = qbase.idp;";
    }

    private function verificarCantidadImporteNegativo($sqlBase){
        $sqlVerify = "select count(q.idm) as total from ( $sqlBase ) q where q.existencia < 0 or q.importec < 0";// or q.importealt < 0
        $result = $this->doctrineHelper->getConnection()->fetchAll($sqlVerify);
        if($result[0]['total'] > 0 ){
            throw new ZendExt_Exception('LOG_LB_Prod_004');
        }
    }

    private function verificarClasificacionContable($idDocumento){
        $sqlVerify = "select count(dp.idproducto)  as total from mod_logistica.dat_movimiento dm 
                        join mod_logistica.dat_producto dp on dm.idproducto = dp.idproducto
                        where dm.iddocumento = {$idDocumento} and dp.idclasificacioncontable is null";
        $result = $this->doctrineHelper->getConnection()->fetchAll($sqlVerify);
        if($result[0]['total'] > 0 ){
            throw new ZendExt_Exception('LOG_LB_Prod_005');
        }
    }

    /*FIN DE LOS METODOS DE REFACTORIZAR PRECIO PROMEDIO*/

    public function getQueryValorMovimientos($params = array())
    {
        $params['estado'] = array(EstadoDocumentoModel::ESTADO_APROBADO, EstadoDocumentoModel::ESTADO_CONTABILIZADO);
        $dql = Doctrine_Query::create()
            ->select("round(coalesce(SUM(coalesce(m.importecontable,0)),0), {$this->fRedondeo}) as importe")
            ->from("DatMovimientos m")
            ->innerJoin("m.DatDocumento d");

        $this->addFiltersQueryMovimiento($dql, 'm', $params);
        return $dql;
    }

    public function cambiarSignoMovimientos($iddocumento, $signo = LogisticaMovimientoModel::SIGNO_NINGUNO)
    {
        $this->doctrineHelper
            ->query("UPDATE DatMovimientos SET signo = '{$signo}' WHERE iddocumento = {$iddocumento}");
    }

}
