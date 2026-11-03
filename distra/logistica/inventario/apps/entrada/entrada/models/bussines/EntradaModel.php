<?php

class EntradaModel extends DocumentoLogisticaModel
{

    /**
     * @var LoteService Servicios de lote.
     */
    protected $loteService,
        /**
         * @var NoSerieService
         */
        $nroSerieService,
        /**
         * @var UtilesubicacionService
         */
        $ubicacionService,
        /**
         * @var ConfiguracioninventarioService
         */
        $configuracionService,
        /**
         * Datos de las monedas configurafas.
         */
        $tipoMoneda;


    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->loteService = new LoteService();
        $this->nroSerieService = new NoSerieService();
        $this->ubicacionService = new UtilesubicacionService();
        $this->configuracionService = new ConfiguracioninventarioService();
        $this->cargarConfMonedas();
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatMovubicacion',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatMovnroserie',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        if ($this->existComponent('log.inv.municiones')) {
            $relations[] = array(
                'cardinalidad' => 'one',
                'relation' => 'DatMovproductomunic',
                'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
            );
        }
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
    }

    /**
     * Verifica que el documento tenga productos.
     * @param int $iddocumento (identificador de documento).
     * @return boolean
     */
    public function contieneProductos($iddocumento)
    {
        $datosBusqueda = $this->getProductoModel()->devolverMovimientos(
            array('iddocumento' => implode(',', Zend_Json::decode($iddocumento)))
        );
        if ($datosBusqueda['cantidad'] > 0) {
            return true;
        }
        return false;
    }

    /**
     * Verifica que las ubicaciones realizadas se corresponden con la cantidad de los productos.
     * @param numeroc $iddocumento
     * @return boolean
     */
    public function ubicacionConDatosCorrectos($iddocumento)
    {
        return true;
//        $datosBusqueda = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $iddocumento));
//        return $this->ubicacionService->comprobarUbicacionMov($datosBusqueda);
    }

    /**
     * Actulaliza las cantidad de movimientos por ubicación de los productos del documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    protected function actualizarMovUbicacion($iddocumento)
    {
        $query = Doctrine_Query::create()
            ->select(
                'm.idmovimiento, -1 AS idestructuraubicacion, (m.cantidad - coalesce(sum(mu.cantidad), 0)) AS cantidad'
            )
            ->from('DatMovimientos m')
            ->leftJoin('m.DatMovlote ml')->leftJoin('m.DatMovnroserie mns')
            ->leftJoin('m.DatMovubicacion mu')
            ->where('m.iddocumento = ? AND ml.idmovimiento IS NULL AND mns.idmovimiento IS NULL', $iddocumento)
            ->groupBy('m.idmovimiento, m.cantidad')
            ->having('(m.cantidad - coalesce(sum(mu.cantidad), 0)) > 0');
        if ($this->existComponent('log.inv.municiones')) {
            $query->leftJoin('m.DatMovproductomunic mpm')->addWhere('mpm.idmovproductomunic IS NULL');
        }
        $movimientos = $query->fetchArray();
        $collection = new Doctrine_Collection('DatMovubicacion');
        foreach ($movimientos as $value) {
            $record = new DatMovubicacion();
            $record->synchronizeWithArray($value);
            $collection->add($record);
        }
        if ($collection->count() > 0) {
            $collection->save();
        }
        return true;
    }

    /**
     * Actualiza las ubicaciones de los productos del documento.
     * @param numeric $iddocumento
     * @param boolean $ubicar [Opcional]
     * @return boolean
     */
    protected function actualizarUbicacion($iddocumento, $ubicar = false)
    {
        Doctrine_Query::create()
            ->delete('DatMovubicacion')
            ->where(
                'cantidad = 0 AND idmovimiento IN (SELECT m.idmovimiento FROM DatMovimientos m '
                . 'WHERE m.iddocumento = ?)', $iddocumento
            )
            ->execute();
        $query = Doctrine_Query::create()
            ->select('m.idproducto AS idproducto, mu.idestructuraubicacion AS idubicacion, mu.cantidad')
            ->from('DatMovubicacion mu')->innerJoin('mu.DatMovimientos m')
            ->where('m.iddocumento = ?', $iddocumento);
        if ($ubicar) {
            $ubicaciones = $query->fetchArray();
            foreach ($ubicaciones as $value) {
                $this->ubicacionService->ubicarProducto($value);
            }
        } else {
            $query->addSelect('ap.idareaproducto AS idareaproducto, up.idubicacionproducto AS idubicacionproducto')
                ->innerJoin('mu.DatEstructuraubicacion eu')->innerJoin('eu.DatUbicacionproducto up')
                ->innerJoin('eu.DatArea a')->innerJoin('a.DatAreaproducto ap')
                ->addWhere('m.idproducto = up.idproducto AND up.idproducto = ap.idproducto');
            $ubicaciones = $query->fetchArray();
            $this->ubicacionService->desubicarProducto($ubicaciones);
        }
        return true;
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @param int $iddocumento (identificador de documento).
     * @return boolean
     */
    public function productosConCantidad($iddocumento)
    {
        return true;
        $query = $this->getProductoModel()->devolverMovimientos(
            array('iddocumento' => $iddocumento), true
        );
        $query->addWhere('mov.cantidad = 0');
        if ($query->count()) {
            return false;
        }
        return true;
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @param int $iddocumento (identificador de documento).
     * @return boolean
     */
    public function productosConPrecio($iddocumento)
    {
        $query = Doctrine_Query::create()
            ->from('DatMovimientos m')
            ->where('m.iddocumento = ? AND m.preciocontable = 0 AND m.precioalternativo = 0', $iddocumento);
        if ($query->count()) {
            return false;
        }
        return true;
    }

    /**
     * Verifica que todos los conteos fisico (ajuste de inventario) esten contabilizados.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function conteoFisico($iddocumento)
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatMovimientos',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'inventariogLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $inventario = new InventarioModel();
        $query = $inventario->devolverDocumentos(null, true);
        $query->innerJoin('d.DatMovimientos _m')
            ->innerJoin('_m.DatMovimientos _m2 ON _m2.idproducto = _m.idproducto')
            ->innerJoin('_m2.DatDocumento _d2')
            ->addWhere(
                '_m2.iddocumento = ? AND d.idestructuracomun = _d2.idestructuracomun AND d.estado IN (1, 2) '
                . 'AND d.iddoc = ?', array($iddocumento, $objDocPrim->iddoc)
            )
            ->orderBy('d.iddocumento');
        if ($query->count() > 0) {
            return false;
        }
        return true;
    }

    /**
     * Elimina el documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function eliminarDocumento($iddocumento)
    {
        $this->nroSerieService->eliminarNrosCancelados($iddocumento);
        if ($this->existComponent('log.inv.municiones')) {
            $municiones = new MunicionesService();
            $municiones->eliminarPartidasCanceladas($iddocumento);
        }
        return parent::eliminarDocumento($iddocumento);
    }

    /**
     * Anula el estado del documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function anularEstadoDocumento($iddocumento)
    {
        Doctrine_Query::create()->delete('DatMovubicacion')
            ->where(
                'idmovimiento IN (SELECT m.idmovimiento FROM DatMovimientos m WHERE m.iddocumento = ?) '
                . 'AND idestructuraubicacion = -1', $iddocumento
            )
            ->execute();
        return parent::anularEstadoDocumento($iddocumento);
    }

    /**
     * Contabiliza un documento.
     * @param numeric $iddocumento Identificador de documento.
     * @return boolean
     */
    public function contabilizarDocumento($iddocumento)
    {
        $cronologia = parent::contabilizarDocumento($iddocumento);
        $this->getProductoModel()->aprobarMovimientos($iddocumento, $cronologia, true);
        return $cronologia;
    }

    /**
     * Carga la configuracion de las monedas configuradas.
     */
    protected function cargarConfMonedas()
    {
        $conf = $this->configuracionService->devolverConfiguracion($this->idestructuracomun);
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $this->tipoMoneda['idtasa'] = $conf['idtipotasa'];
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $this->tipoMoneda['idalternativa'] = $value['idmoneda'];
                $this->tipoMoneda['codigoAlt'] = $value['codigoiso'];
            } else if ($value['tipomoneda'] == 0) {
                $this->tipoMoneda['idcontable'] = $value['idmoneda'];
                $this->tipoMoneda['codCont'] = $value['codigoiso'];
            }
        }
    }

    /**
     * Devuelve los tipos de monedas de la entidad.
     * @return array
     */
    public function cargarTipoMonedas()
    {
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->idestructuracomun);
        return array('cantidad' => count($monedas['datos']), 'datos' => $monedas['datos']);
    }

    /**
     * Devuelve las monedas de un movimiento.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarMonedas($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select('m.idmovmoneda, m.idmovimiento, m.idmoneda, m.precio, m.importe, m.preciotasa, m.importetasa')
            ->from('DatMovmoneda m')
            ->innerJoin('m.NomMoneda nm')
            ->innerJoin('nm.DatMonedaEntidad dme')
            ->innerJoin('m.DatMovimientos dm')
            ->where('m.idmovimiento = ?', $filtro['idmovimiento']);
        if ($dql) {
            return $query;
        }
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    /**
     * Adiciona monedas a un movimiento.
     * @param array $datos
     * @param array $precio [Opcional]
     * @return boolean
     */
    protected function adicionarMoneda($datos, $tasa, $precio = '')
    {
        $collection = new Doctrine_Collection('DatMovmoneda');
        $precioCont = $precioAlt = $importeAlt = $precioTasa = $importeTasa = $recargodescuento = $importMon = 0;
        $idmovimiento = false;
        foreach ($datos as &$item) {
            if (!$idmovimiento) {
                $idmovimiento = $item['idmovimiento'];
                $cantidad = Doctrine::getTable('DatMovimientos')->find($idmovimiento)->toArray()['cantidad'];
            }

            if ($item['idmoneda'] == $this->tipoMoneda['idcontable']) {
                $item['precio'] = (float)($precio ? $precio : $item['precio']);
                $precioCont = (float)$item['precio'];
            } else {
                //$importeAlt = (float)(($item['precio'])) * $cantidad;
                $item['precio'] = (float)($precio ? $precio : $item['precio']);
                $item['preciotasa'] = (float)($item['precio']) * $tasa;
                $item['importetasa'] = (float)(($item['precio'] * $tasa)) * $cantidad;
                $precioCont = (float)$item['preciotasa'];

            }
            $importMon = (float)($item['precio']);
            $item['importe'] = $cantidad * $importMon;

            /*if ($item['idmoneda'] == $this->tipoMoneda['idalternativa']) {
                $importeAlt += (float)(($item['precio'])) * $cantidad;
                $item['preciotasa'] = (float)($item['precio']) * $tasa;
                $item['importetasa'] = (float)(($item['precio'] * $tasa)) * $cantidad;
                $precioAlt += (float)$item['preciotasa'];

            }*/
            $moneda = new DatMovmoneda();
            if ($item['idmovmoneda']) {
                $moneda->assignIdentifier($item['idmovmoneda']);
            }
            LogisticaObjectHelper::__init()->unsetNullValues($item);
            $moneda->synchronizeWithArray($item);
            $collection->add($moneda);
        }
        $result = false;
        if ($collection->count()) {
            $collection->save();
            $datosAct = array(
                'idmovimiento' => $idmovimiento,
                'preciocontable' => $precioCont,
                'precioalternativo' => $precioAlt,
                'importealternativo' => LogisticaObjectHelper::__init()->_round($precioAlt * $cantidad, 2),
                'preciotasa' => $precioTasa,
                'importetasa' => $importeTasa,
                'cantidad' => $cantidad,
                'importecontable' => LogisticaObjectHelper::__init()->_round($precioCont * $cantidad, 2),
                'entrada' => true
            );
            $result = $this->getProductoModel()->modificarMovimientos(array($datosAct));
        }
        return $result;

    }

    /**
     * Actualiza las monedas.
     * @param array $monedas
     * @param numeric $iddocumento
     * @return boolean
     */
    public function procesarMonedas($monedas, $iddocumento, $tasa)
    {
        if (is_array($monedas) && count($monedas) > 0) {
            $this->adicionarMoneda($monedas, $tasa);
        } else {
            $movimientos = Doctrine_Query::create()
                ->select('m.idmovimiento')
                ->from('DatMovimientos m')
                ->where('m.iddocumento = ?', $iddocumento)
                ->fetchArray();
            foreach ($movimientos as $value) {
                $monedas = $this->cargarMonedas(array('idmovimiento' => $value['idmovimiento']), true)->fetchArray();
                $this->adicionarMoneda($monedas, $tasa);
            }
        }
        return true;
    }

    /**
     * Elimina las monedas del movimiento.
     * @param numeric $idmovmoneda
     * @return boolean
     */
    public function eliminarMoneda($idmovmoneda)
    {
        $importConv = $precioConv = 0;
        $param = array();
        $moneda = Doctrine::getTable('DatMovmoneda')->find($idmovmoneda)->toArray();
        $datosMov = Doctrine::getTable('DatMovimientos')->find($moneda['idmovimiento'])->toArray();

        if ($this->tipoMoneda['idcontable'] == $moneda['idmoneda']) {
            $param = array(
                'preciocontable' => $datosMov['preciocontable'] - $moneda['precio'],
                'importecontable' => $datosMov['importecontable'] - $moneda['importe'],
                'precioalternativo' => $datosMov['precioalternativo'],
                'importealternativo' => $datosMov['importealternativo']
            );
        } else {
            if ($this->tipoMoneda['idalternativa'] == $moneda['idmoneda']) {
                $param = array(
                    'preciocontable' => $datosMov['preciocontable'], 'importecontable' => $datosMov['importecontable'],
                    'precioalternativo' => $datosMov['precioalternativo'] - $moneda['precio'],
                    'importealternativo' => $datosMov['importealternativo'] - $moneda['importe']
                );
            } else {
                $conf = $this->configuracionService->devolverConfiguracion($this->idestructuracomun);
                $rdAlt = $moneda['recargo'] + ($moneda['descuento'] * -1);
                if (!$conf['descuentorecargo']) {
                    $rdAlt = ($moneda['precio'] * $rdAlt) / 100;
                }
                $importConv = $this->configuracionHelper->convertirImporte(
                    $moneda['idmoneda'], $this->tipoMoneda['idalternativa'], $this->idtasa,
                    (($moneda['precio'] + $rdAlt) * $datosMov['cantidad']), 2
                );
                $precioConv = $this->configuracionHelper->convertirImporte(
                    $moneda['idmoneda'], $this->tipoMoneda['idalternativa'], $this->idtasa, (($moneda['precio'])), 2
                );
                $param = array(
                    'preciocontable' => $datosMov['preciocontable'], 'importecontable' => $datosMov['importecontable'],
                    'precioalternativo' => $datosMov['precioalternativo'] - $precioConv,
                    'importealternativo' => $datosMov['importealternativo'] - $importConv
                );
            }
        }
        Doctrine_Query::create()->update('DatMovimientos')
            ->set('preciocontable', '?', $param['preciocontable'])
            ->set('importecontable', '?', $param['importecontable'])
            ->set('precioalternativo', '?', $param['precioalternativo'])
            ->set('importealternativo', '?', $param['importealternativo'])
            ->where('idmovimiento = ?', $moneda['idmovimiento'])->execute();
        Doctrine_Query::create()->delete('DatMovmoneda')->where('idmovmoneda = ?', $idmovmoneda)->execute();
        return array('success' => true);
    }

    public function abrirDeposito($idDocumento)
    {
        $datDoc = Doctrine_Query::create()->select('d.idestructuracomun')->from('DatDocumento d')
            ->where('iddocumento = ?', array($idDocumento))->fetchArray();
        if (count($datDoc)) {
            $idDeposito = $datDoc[0]['idestructuracomun'];
            $fecha = $fecha = $this->configuracionHelper->getFechaContableSubsistema(
                $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
            );
            $alm = new DatEstadoalmacen();
            $alm->abrirAlmacen($idDeposito, $fecha);
        }
    }

    /**
     * Convierte la unidad de medida de la factura a la unidad de medida de recepcion y
     * registra el precio del movimiento.
     * @param array $datos
     * @return boolean
     */
    public function registrarPrecio($datos)
    {
        $query = $this->cargarMonedas($datos, true)->addWhere('m.idmoneda = ?', $this->tipoMoneda['idcontable']);
        if ($query->count() > 0) {
            $monedas = $query->fetchArray();
            $this->adicionarMoneda($monedas, $datos['preciocontable']);
        } else {
            $mov = Doctrine::getTable('DatMovimientos')->find($datos['idmovimiento'])->toArray();
            $datos['cantidad'] = $mov['cantidad'];
            $this->getProductoModel()->modificarMovimientos(array($datos));
        }
        return true;
    }

    /**
     * Revierte la operacion de entrada
     * @param $idDocumento
     * @return array|void
     */
    public function cancelarDocumento($idDocumento)
    {
        $datos = parent::cancelarDocumento($idDocumento);
        $this->producto->cancelarMovimientos($datos['iddocumento'], $datos['cronologia'], true);
        return true;
    }
    /**
     * @param Integer $idDocumento
     * @return boolean
     */
    public function checkPuedeCancelar($idDocumento)
    {
        $this->checkCancelarExistenciaMovimientos($idDocumento);
        return true;
    }

    /**
     * @param Integer $idDocumento
     * @return Boolean
     * @throws ZendExt_Exception
     */
    private function checkCancelarExistenciaMovimientos($idDocumento)
    {
        $dql = "SELECT COUNT(DISTINCT p.idproducto) as cant_negativos"
            . " FROM DatProductoLogistica p INNER JOIN p.DatMovimientos m"
            . " WHERE m.iddocumento = {$idDocumento} AND (p.cantidad - m.cantidad) < 0";
        $dqlResult = $this->doctrineHelper->query($dql)->toArray();
        if ($dqlResult[0]['cant_negativos'] > 0) {
            throw new ZendExt_Exception('LOG_LB_DOC_007');
        }
        return true;
    }
    
    /**
     * Devuelve un arreglo con los tipos de documento del sistema.
     * @return Array
     */
    public function cargarComboTipoDocumento() {
        return $this->configuracionHelper->obtenerOperaciones(
           $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV, $this->iddoc
        );
    }

}
