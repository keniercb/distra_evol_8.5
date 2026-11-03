<?php

/**
 * @class AjusteModel
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Movimiento
 * @author Manuel Yhon Figueroa
 * @copyright XETID
 * @version 1.0
 */
class AjusteModel extends MovimientosModel
{
    const MOTIVO_FALTANTE = 'OPER_INV_FALTANTE',
        MOTIVO_SOBRANTE = 'OPER_INV_SOBRANTE',
        MOTIVO_IMPORTE_SUMA = 'OPER_INV_IMPORTE_MAS',
        MOTIVO_IMPORTE_RESTA = 'OPER_INV_IMPORTE_MEN',
        MOTIVO_MERMA = 'OPER_INV_MERMA',
        MOTIVO_ROTURA = 'OPER_INV_ROTURA',
        MOTIVO_BAJA = 'OPER_INV_BAJA',
        MOTIVO_OTROS_SUMA = 107;

    private $utilesubicacionService, $noSerieService, $configuracionService, $serviciosIddoc;

    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->noSerieService = new NoSerieService();
        $this->utilesubicacionService = new UtilesubicacionService();
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatAjuste',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idajuste')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $relations = array();
        if ($this->existComponent('log.inv.municiones')) {
            $relations[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatMovproductomunic',
                'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
            );
        }
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatMovnroserie',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovlote',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatMovubicacion',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatMovimientos(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatMovimientos',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatUbicacionComprometida(), $relations);
        $this->configuracionService = new ConfiguracioninventarioService();
        $this->serviciosIddoc = LogisticaDocumentosHelper::__init();
    }

    /**
     * Devuelve los documentos de ajuste de inventario.
     * @param array $filtro Arreglo con los parametros para filtrar los documentos
     * @param boolean $dql [Opcional] Determina si devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function devolverDocumentos($filtro, $dql = false)
    {
        $query = parent::devolverDocumentos($filtro);
		$query->addSelect('d.idcomprobante');
        $query->addSelect('(SELECT round(SUM(round(dm.importecontable,2)),2) FROM DatMovimientos dm WHERE dm.iddocumento = d.iddocumento) as importecontable');
        $query->addSelect('(SELECT round(SUM(round(dm1.importealternativo,2)),2) FROM DatMovimientos dm1 WHERE dm1.iddocumento = d.iddocumento) as importealternativo');
        
        $ajuste = new DatAjuste();
        $ajuste->getJoinDatAjuste($query, $filtro, 'd', 'a');
        if ($dql) {
            return $query;
        }
        $datos = $this->logisticaDoctrine->addQueryLimits($query, $filtro)->fetchArray();
        foreach ($datos as $key => $value) {
            $operacion = $this->cargaMotivoAjuste(true, $value['idoperacion']);
            $datos[$key]['signo'] = $this->getSignoAjuste($operacion['codigo']);
	    if ($value['idcomprobante']) {
                $sql = "select c.numerocomprobante as nrocomprobante from mod_contabilidad.dat_comprobante c where c.idcomprobante = {$value['idcomprobante']}";
                $resultComp = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
                $datos[$key]['nrocomprobante'] = $resultComp[0]['nrocomprobante'];
            }
        }
        return array('cantidad' => $query->count(), 'datos' => $datos);
    }

    /**
     * Adiciona un documento de ajuste de inventario y los movimientos del producto.
     * @params array $datosDoc Arreglo con los parametros para adicionar un documento
     * @return array
     */
    public function adicionarDocumento($datosDoc)
    {
        $documento = parent::adicionarDocumento($datosDoc);
        $ajuste = new DatAjuste();
        if ($datosDoc['iddocumento']) {
            $ajuste->assignIdentifier($datosDoc['iddocumento']);
        }
        $ajuste->synchronizeWithArray($datosDoc);
        $documento->DatAjuste = $ajuste;
        $documento->save();
        $this->operacionesMovimientos($documento->iddocumento, $datosDoc);
        $operacion = $this->cargaMotivoAjuste(true, $datosDoc['idoperacion']);
        return array(
            'iddocumento' => $documento->iddocumento, 'signo' => $this->getSignoAjuste($operacion['codigo']),
            'fechacontable' => $documento->fechacontable, 'numeroref' => $documento->numeroref,
            'nrodoc' => $documento->nrodoc, 'cantproductos' => $this->cantidadMovimientos($documento->iddocumento)
        );
    }

    /**
     * Eliminar el documento de ajuste de inventario.
     * @param numeric $iddocumento Identificador de documento
     * @return boolean
     */
    public function eliminarDocumento($iddocumento)
    {
        $ajuste = new DatAjuste();
        $datos = $ajuste->getDatosOperacion($iddocumento);
        $operacion = $this->cargaMotivoAjuste(true, $datos['idoperacion']);
        if ($operacion['codigo'] == self::MOTIVO_IMPORTE_SUMA || $operacion['codigo'] == self::MOTIVO_IMPORTE_RESTA) {
            $afecta = false;
        } else {
            $datosoperacion = $this->getSignoAjuste($operacion['codigo']);
            $afecta = ($datosoperacion == LogisticaMovimientoModel::SIGNO_MOV_RESTA) ? true : false;
        }
        $this->loteService->eliminarLotesDocumento($iddocumento);
        $this->getProductoModel()->eliminarMovimientos($iddocumento, false, $afecta);
        $this->utilesubicacionService->eliminarUbicacionComprometida($iddocumento);
        return parent::eliminarDocumento($iddocumento);
    }

    /**
     * Confirma el documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function confirmarDocumento($iddocumento)
    {
        $this->actualizarMovUbicacion($iddocumento);
        return parent::confirmarDocumento($iddocumento);
    }

    /**
     * Anula el documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function anularEstadoDocumento($iddocumento)
    {
        $uc = Doctrine_Query::create()
            ->select('uc.idubicacioncomprometida')
            ->from('DatUbicacionComprometida uc')
            ->innerJoin('uc.DatMovimientos m')
            ->where(
                'm.iddocumento = ? AND uc.iddocumento = m.iddocumento AND uc.idproducto = m.idproducto '
                . 'AND (SELECT count(up.idubicacionproducto) FROM DatUbicacionproducto up '
                . 'WHERE up.idproducto = m.idproducto AND up.cantidad > 0) = 1', $iddocumento
            )
            ->fetchArray();
        $mu = Doctrine_Query::create()
            ->select('mu.idmovubicacion')
            ->from('DatMovubicacion mu')
            ->innerJoin('mu.DatMovimientos m')
            ->where(
                'm.iddocumento = ? AND (SELECT count(up.idubicacionproducto) FROM DatUbicacionproducto up '
                . 'WHERE up.idproducto = m.idproducto AND up.cantidad > 0) = 1', $iddocumento
            )
            ->fetchArray();
        $idubicacioncomprometida = $this->objectHelper->extractValueFromArrayColumn($mu, 'idubicacioncomprometida');
        $idubicacioncomprometida[] = -1;
        $idmovubicacion = $this->objectHelper->extractValueFromArrayColumn($uc, 'idmovubicacion');
        $idmovubicacion[] = -1;
        $this->utilesubicacionService->eliminarUbicacionComprometida(null, null, $idubicacioncomprometida);
        Doctrine_Query::create()->delete('DatMovubicacion')->whereIn('idmovubicacion', $idmovubicacion)->execute();
        return parent::anularEstadoDocumento($iddocumento);
    }
	
	
	public function cancelarDocumento($iddocumento)
    {
        $this->trazaDocumento->guardarTraza('Cancelando documento', $iddocumento);
		$datos = (new DatAjuste())->getDatosOperacion($iddocumento);
		$operacion = $this->cargaMotivoAjuste(true, $datos['idoperacion']);
		if($operacion['codigo'] == AjusteModel::MOTIVO_IMPORTE_RESTA || $operacion['codigo'] == AjusteModel::MOTIVO_IMPORTE_RESTA){
		    throw new ZendExt_Exception('LOG_LB_DOC_029');
        }
		$entrada = $this->getSignoAjuste($operacion['codigo']) == LogisticaMovimientoModel::SIGNO_MOV_SUMA ? true :false;
		$doc = parent::cancelarDocumento($iddocumento);
        $this->producto->cancelarMovimientos($doc['iddocumento'],$doc['cronologia'],$entrada);
        return true;
    }

    /**
     * Aprueba el documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function aprobarDocumento($iddocumento)
    {
        $this->trazaDocumento->guardarTraza('Documento aprobado', $iddocumento, EstadoDocumentoModel::ESTADO_APROBADO);
        $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_APROBADO);
        Doctrine_Query::create()->update('DatDocumento')->set('aprobadopor', $this->idusuario)
            ->where('iddocumento = ?', $iddocumento)->execute();
        return array('success' => true);
    }

    /**
     * Contabiliza el documento de ajuste de inventario.
     * @param numeric $iddocumento Identificador de documento
     * @return boolean
     */
    public function contabilizarDocumento($iddocumento)
    {
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);

        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $cronologia = parent::contabilizarDocumento($iddocumento);
        
		Doctrine_Query::create()->update('DatAjuste')
			->set('contabilizadopor', $this->idusuario)
			->where('idajuste =?', $iddocumento)->execute();
        Doctrine_Query::create()->update('DatDocumento')->set('aprobadopor', $doc->aprobadopor)
			->where('iddocumento =?', $iddocumento)
			->execute();
        $ajuste = new DatAjuste();
        $datos = $ajuste->getDatosOperacion($iddocumento);
        $operacion = $this->cargaMotivoAjuste(true, $datos['idoperacion']);
        if ($operacion['codigo'] == self::MOTIVO_IMPORTE_SUMA || $operacion['codigo'] == self::MOTIVO_IMPORTE_RESTA) {            
			$invertirPrec = $operacion['codigo'] == self::MOTIVO_IMPORTE_SUMA ? true : false;
            $entrada = $operacion['codigo'] == self::MOTIVO_IMPORTE_SUMA ? false : true;
            $updateExistencia = $operacion['codigo'] == self::MOTIVO_IMPORTE_SUMA ? false : true;                        
            $this->getProductoModel()->aprobarMovimientos($iddocumento, $cronologia, $entrada, $updateExistencia, $invertirPrec, true);
            $this->logisticaDoctrine->executeQuery("SELECT * FROM mod_loginventario.fn_actualizarsubmayoresdoc({$iddocumento});");
            if ($config['comprobante']) {
                $comp = $this->generarComprobante($iddocumento, LogisticaGlobal::SUBSISTEMA_INV);
                $resultado['comprobante'] = $comp[0];
            }
            return array(
                'success' => true,
                'comprobante' => (isset($resultado) ? $resultado['comprobante'] : false)
            );
        } else {
            $signo = $this->getSignoAjuste($operacion['codigo']);
            $afecta = ($signo == LogisticaMovimientoModel::SIGNO_MOV_SUMA) ? false : true;
            $this->actualizarUbicacion($iddocumento, !$afecta);

            if ($this->existComponent('log.inv.municiones')) {
                $municionesService = new MunicionesService();
                $municionesService->aprobarPartida($iddocumento);
            }
            $noSerieServ = new NoSerieService();
            $noSerieServ->actualizarEstadoNumeroSerie($iddocumento, false, $operacion['codigo'] == self::MOTIVO_BAJA);
            $this->loteService->actualizarExistenciaLote($iddocumento, !$afecta);
        }
        $this->getProductoModel()->aprobarMovimientos($iddocumento, $cronologia, !$afecta);
        if ($afecta) {
            $comprometida = new CantidadesComprometidasModel();
            $comprometida->cambiarEstado(2, $iddocumento);
            $this->utilesubicacionService->cambiarEstado($iddocumento, 2);
        }
        if ($config['comprobante']) {
            $comp = $this->generarComprobante($iddocumento, LogisticaGlobal::SUBSISTEMA_INV);
            $resultado['comprobante'] = $comp[0];
        }
        return array(
            'success' => true,
            'comprobante' => (isset($resultado) ? $resultado['comprobante'] : false)
        );
    }

    /**
     * Devuelve una coleccion de movimientos.
     * @param array $datosDoc
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function devolverMovimientos($datosDoc, $dql = false)
    {
        $maestroP = new MaestroProductoModel();
        $query = $this->getProductoModel()->devolverMovimientos($datosDoc, true)->addSelect(
            "(SELECT (count(up.idubicacion) = 1) FROM DatUbicacionproducto up "
            . "WHERE up.idproducto = mov.idproducto AND up.cantidad > 0) AS ubicacionunica, "
            . "(CASE WHEN mov.cronologia > 0 THEN mov.importetotal ELSE (CASE WHEN mov.signo = '-' THEN p.importe - mov.importecontable "
            . "ELSE p.importe + mov.importecontable END) END) AS importetotal, (CASE WHEN mov.signo = '-' "
            . "THEN p.importealternativo - mov.importealternativo "
            . "ELSE p.importealternativo + mov.importealternativo END) AS importetotalalt"
        );
        if ($dql) {
            return $query;
        }
        return array('datos' => $maestroP->addSelectionData($this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray()), 'cantidad' => $query->count());
    }

    /**
     * Adiciona los movimientos al documento.
     * @param numeric $iddocumento
     * @param array $arrIdProd
     * @param numeric $idoperacion
     * @param boolean $concantidad [Opcional]
     * @return array
     */
    public function adicionarMovimientos($iddocumento, $arrIdProd, $idoperacion, $concantidad)
    {
        $this->adicionarDocumento(array('iddocumento' => $iddocumento, 'idoperacion' => $idoperacion));
        $operacion = $this->cargaMotivoAjuste(true, $idoperacion);
        $signo = $this->getSignoAjuste($operacion['codigo']);
        if ($operacion['codigo'] == self::MOTIVO_IMPORTE_SUMA || $operacion['codigo'] == self::MOTIVO_IMPORTE_RESTA) {
            $afecta = false;
        } else {
            $afecta = ($signo == LogisticaMovimientoModel::SIGNO_MOV_RESTA) ? true : false;
        }
        $this->getProductoModel()->adicionarMovimientos($iddocumento, $arrIdProd, $signo, $afecta, $afecta);
        $dql = Doctrine_Query::create()->from('DatMovimientos m')->where('m.iddocumento = ?', $iddocumento);
        return array('success' => true, 'cantproductos' => $dql->count(), 'signo' => $signo);
    }

    /**
     * Adiciona o modifica los movimientos de ajuste de inventario.
     * @param Integer $iddocumento Identificador de documento
     * @params array $datosDoc Arreglo con los parametros para adicionar un documento
     * @return void
     */
    public function operacionesMovimientos($iddocumento, $datosDoc)
    {
        $operacion = $this->cargaMotivoAjuste(true, $datosDoc['idoperacion']);
        $signo = $this->getSignoAjuste($operacion['codigo']);
        if ($datosDoc['tarjeta'] && $datosDoc['tarjeta']['idindicador']) {
            $datosDoc['tarjeta']['iddocumento'] = $iddocumento;
            $datosDoc['tarjeta']['idestructura'] = $datosDoc['idestructuracomun'];
            $this->producto->adicionarProductoEstructuras(array($datosDoc['tarjeta']));
        } elseif ($datosDoc['tarjeta']) {
            foreach ($datosDoc['tarjeta'] as $index => $prod) {
                $datosDoc['tarjeta'][$index]['iddocumento'] = $iddocumento;
                $datosDoc['tarjeta'][$index]['idestructura'] = $datosDoc['idestructuracomun'];
            }
            $this->producto->adicionarProductoEstructuras($datosDoc['tarjeta']);
        }
        if (is_array($datosDoc['idproductos']) && count($datosDoc['idproductos']) > 0) {
            $this->producto->adicionarMovimientos($iddocumento, $datosDoc['idproductos'], $signo);
        }
        if (is_array($datosDoc['productos']) && count($datosDoc['productos']) > 0) {
            if ($operacion['codigo'] == self::MOTIVO_IMPORTE_SUMA ||
                $operacion['codigo'] == self::MOTIVO_IMPORTE_RESTA) {
                $afecta = false;
            } else {
                $afecta = ($signo == LogisticaMovimientoModel::SIGNO_MOV_RESTA) ? true : false;
            }
            $this->modificarMovimientos($datosDoc['productos'], $afecta, $operacion['codigo']);
        }
        if (is_array($datosDoc['lotes']) && count($datosDoc['lotes']) > 0) {
            $this->guardarConteoLote($datosDoc, $operacion['codigo']);
        }
    }

    /**
     * Actualiza los movimientos.
     * @param array $movimientos
     * @param boolean $afecta
     * @param string $motivo
     * @throws ZendExt_Exception
     */
    public function modificarMovimientos($movimientos, $afecta, $motivo)
    {
        if ($motivo == self::MOTIVO_IMPORTE_RESTA || $motivo == self::MOTIVO_IMPORTE_SUMA) {
            $collection = new Doctrine_Collection('DatMovimientos');
            foreach ($movimientos as $value) {
                if ($this->getSignoAjuste($motivo) == LogisticaMovimientoModel::SIGNO_MOV_RESTA) {
                    $prod = $this->producto->getDatosProducto($value['idproducto']);
                    $prod['importe'] = LogisticaObjectHelper::__init()->_round($prod['importe'],2);
                    $prod['importealternativo'] = LogisticaObjectHelper::__init()->_round($prod['importealternativo'],2);
                    if (($value['importe']) && $prod['importe'] < $value['importe']) {
                        throw new ZendExt_Exception('LOG_LB_AJUSTE_001');
                    }
                    if (($value['importealternativo']) && $prod['importealternativo'] < $value['importealternativo']) {
                        throw new ZendExt_Exception('LOG_LB_AJUSTE_001');
                    }
                }
                $value['importecontable'] = !empty($value['importe']) ? $value['importe'] : 0;
                //$value['importealternativo'] = !empty($value['importealternativo']) ? $value['importealternativo'] : 0;
                $movimiento = new DatMovimientos();
                $movimiento->assignIdentifier($value['idmovimiento']);
                LogisticaObjectHelper::__init()->unsetNullValues($value);
                $movimiento->synchronizeWithArray($value);
                $collection->add($movimiento);
            }
            if ($collection->count() > 0) {
                //var_dump($collection->toArray());die;
                $collection->save();
            }
        } else {
            $movimientos[0]['entrada'] = true;
            $this->producto->modificarMovimientos($movimientos, $afecta, $afecta);
        }
    }

    /**
     * Elimina los movimientos seleccionados del documento.
     * @param array $idmovimientos
     * @param numeric $iddocumento
     * @return array
     */
    public function eliminarMovimientos($idmovimientos, $iddocumento)
    {
        $prod = Doctrine_Query::create()
            ->select("array_to_string(array_agg(m.idproducto), ',') AS idproductos")
            ->from('DatMovimientos m')
            ->whereIn('m.idmovimiento', $idmovimientos)
            ->fetchArray();
        $arrIdProd = explode(',', $prod[0]['idproductos']);
        $ajuste = new DatAjuste();
        $datos = $ajuste->getDatosOperacion($iddocumento);
        $operacion = $this->cargaMotivoAjuste(true, $datos['idoperacion']);
        if ($operacion['codigo'] == self::MOTIVO_IMPORTE_SUMA || $operacion['codigo'] == self::MOTIVO_IMPORTE_RESTA) {
            $afecta = false;
        } else {
            $datosoperacion = $this->getSignoAjuste($operacion['codigo']);
            $afecta = ($datosoperacion == LogisticaMovimientoModel::SIGNO_MOV_RESTA) ? true : false;
        }
        $this->loteService->eliminarLotesDocumento($iddocumento, $idmovimientos);
        Doctrine_Query::create()->delete('DatMovubicacion')->whereIn('idmovimiento', $idmovimientos)->execute();
        $this->getProductoModel()->eliminarMovimientos(false, $idmovimientos, $afecta, false);
        $comprometida = new CantidadesComprometidasModel();
        $comprometida->eliminarCantidadComprometida($iddocumento, $arrIdProd);
        $this->utilesubicacionService->eliminarUbicacionComprometida($iddocumento, $arrIdProd);
        return array('cantproductos' => $this->cantidadMovimientos($iddocumento));
    }

    /**
     * Devuelve una coleccion de lotes.
     * @param array $filtro
     * @return array
     */
    public function cargarLotes($filtro)
    {
        $query = $this->loteService->cargarMovLote($filtro, true)
            ->addSelect(
                'ml.cantidad AS cantidadVieja, ul.cantidad AS cantubicada, (SELECT sum(ml3.cantidad) '
                . 'FROM DatMovlote ml3 WHERE ml3.idmovimiento = ml.idmovimiento) AS total'
            )
            ->orderBy('ml.idubicacion');
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->logisticaDoctrine->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Elimina los lotes seleccionados.
     * @param array $datos
     * @return boolean
     */
    public function eliminarLote($datos)
    {
        return $this->loteService->eliminarLote($datos['data'], $datos['datos']);
    }

    /**
     * Adiciona un documento de ajuste de inventario a partir de una hoja de inventario.
     * @params array $datosDoc Arreglo con los parametros para adicionar un documento
     * @return boolean
     */
    public function generarAjuste($datos)
    {
        $documento = $this->adicionarDocumento($datos);
        if ($documento) {
            $sql = "SELECT mod_loginventario.f_generarajuste({$documento['iddocumento']}, {$datos['idinventario']}, "
                . "'{$datos['signo']}');";
            $this->doctrineHelper->getConnection()->fetchAll($sql);
            return true;
        }
        return false;
    }

    /**
     * Actulaliza las cantidad de movimientos por ubicación de los productos del documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    private function actualizarMovUbicacion($iddocumento)
    {
        $ajuste = new DatAjuste();
        $datos = $ajuste->getDatosOperacion($iddocumento);
        $operacion = $this->cargaMotivoAjuste(true, $datos['idoperacion']);
        if ($operacion['codigo'] == self::MOTIVO_FALTANTE || $operacion['codigo'] == self::MOTIVO_BAJA ||
            $operacion['codigo'] == self::MOTIVO_ROTURA || $operacion['codigo'] == self::MOTIVO_MERMA) {
            $afecta = true;
        }

        $query = Doctrine_Query::create()
            ->select(
                'm.idmovimiento, m.idproducto, m.iddocumento, -1 AS idestructuraubicacion, '
                . '(m.cantidad - coalesce(sum(mu.cantidad), 0)) AS cantidad'
            )
            ->from('DatMovimientos m')
            ->leftJoin('m.DatMovlote ml')->leftJoin('m.DatMovnroserie mns')
            ->leftJoin('m.DatMovubicacion mu')
            ->where('m.iddocumento = ? AND ml.idmovimiento IS NULL AND mns.idmovimiento IS NULL', $iddocumento)
            ->groupBy('m.idmovimiento, m.idproducto')
            ->having('(m.cantidad - coalesce(sum(mu.cantidad), 0)) > 0');
        if ($this->existComponent('log.inv.municiones')) {
            $query->leftJoin('m.DatMovproductomunic mpm')->addWhere('mpm.idmovproductomunic IS NULL');
        }
        $movimientos = $query->fetchArray();
        $collection = new Doctrine_Collection('DatMovubicacion');
        foreach ($movimientos as $value) {
            $ubicacion = $this->utilesubicacionService->getUbicacionUnica($value['idproducto']);
            if ($ubicacion) {
                $value['idestructuraubicacion'] = $ubicacion['idubicacion'];
                if ($afecta) {
                    $ubicacion['iddocumento'] = $iddocumento;
                    $ubicacion['cantidad'] = $value['cantidad'];
                    $this->utilesubicacionService->adicionarUbicacionComprometida($ubicacion);
                }
            }
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
     * Actualiza la cantidad ubicada de los productos del documento.
     * @param numeric $iddocumento
     * @param boolean $ubicar [Opcional]
     * @return boolean
     */
    private function actualizarUbicacion($iddocumento, $ubicar = false)
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
                $this->utilesubicacionService->ubicarProducto($value);
            }
        } else {
            $query->addSelect('up.idubicacionproducto AS idubicacionproducto, ap.idareaproducto AS idareaproducto')
                ->innerJoin('mu.DatEstructuraubicacion eu')->innerJoin('mu.DatUbicacionproducto up')
                ->innerJoin('eu.DatArea a')->innerJoin('a.DatAreaproducto ap')
                ->addWhere('up.idproducto = m.idproducto AND ap.idproducto = m.idproducto');
            $ubicaciones = $query->fetchArray();
            $this->utilesubicacionService->desubicarProducto($ubicaciones);
        }
        return true;
    }

    /**
     * Verifica si el documento tiene productos.
     * @param numeric $iddocumento Identificador de documento
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
     * Verifica si un producto tiene cantidad registrada.
     * @param numeric $iddocumento Identificador de documento
     * @return boolean
     */
    public function contieneCantidad($iddocumento)
    {
        $ajuste = new DatAjuste();
        $iddocumento = implode(',', Zend_Json::decode($iddocumento));
        $datos = $ajuste->getDatosOperacion($iddocumento);
        $operacion = $this->cargaMotivoAjuste(true, $datos['idoperacion']);
        $queryMov = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $iddocumento), true);
        if ($operacion['codigo'] == self::MOTIVO_IMPORTE_RESTA || $operacion['codigo'] == self::MOTIVO_IMPORTE_SUMA) {
            $queryMov->addWhere('mov.importecontable = 0 AND mov.importealternativo = 0');
            if ($queryMov->count() > 0) {
                throw new LogisticaException('LOG_LB_DOC_019');
            }
            return true;
        } else {
            $queryMov->addWhere('mov.cantidad = 0');
            if ($queryMov->count() > 0) {
                return false;
            }
            $query = $this->loteService->cargarMovLote(null, true);
            $query->select('ml.idmovlote')->where('m.iddocumento = ? AND ml.cantidad = 0', $iddocumento);
            if ($query->count() > 0) {
                throw new LogisticaException('LOG_LB_DOC_018');
            }
            return true;
        }
    }

    /**
     * Verifica si los equipos tienen el número de serie registrado.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function contieneNroSerie($iddocumento)
    {
        $operaciones = $this->cargaMotivoAjuste(true);
        $idoperaciones = $this->objectHelper->extractValueFromArrayColumn($operaciones, 'idoperacion');
        $query = Doctrine_Query::create()
            ->from('DatMovnroserie mns')
            ->innerJoin('mns.DatNroserie ns')
            ->innerJoin('mns.DatMovimientos m')
            ->innerJoin('m.DatDocumento d')
            ->innerJoin('d.DatAjuste a')
            ->where('d.iddocumento = ? AND ns.nroserie IS NULL', $iddocumento)
            ->whereIn('a.idoperacion', $idoperaciones)
            ->orderBy('ns.idnroserie');
        return $query->count() == 0;
    }

    /**
     * Verifica si la diferencia detectada es igual la cantidad de cada movimiento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function tieneDiferencias($iddocumento)
    {
        $query = Doctrine_Query::create()
            ->from('DatMovimientos m')
            ->where('m.iddocumento = ? AND m.diferencia > 0 AND m.diferencia <> m.cantidad', $iddocumento);
        return $query->count() > 0;
    }

    public function contieneUbicacionProducto($datosDoc)
    {
        $tieneUbicaciones = $this->utilesubicacionService->rebajarCantProductosByUbicacion($datosDoc['datos']);
        if ($tieneUbicaciones == 1) {
            return array('ubicaciones' => 0);
        } else {
            return array('ubicaciones' => 1);
        }
    }

    /**
     * Carga las operaciones de ajuste.
     * @param boolean $asArray [Opcional]
     * @param numeric $idoperacion [Opcional]
     * @param numeric $idestructura [Opcional]
     * @param numeric $iddoc [Opcional]
     * @return array
     */
    public function cargaMotivoAjuste($asArray = false, $idoperacion = null, $idestructura = null, $iddoc = null)
    {
        $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
        $iddoc = $iddoc ? $iddoc : $this->iddoc;
        $datos = $this->configuracionHelper->obtenerOperaciones(
            $idestructura, LogisticaGlobal::SUBSISTEMA_INV, $iddoc, $idoperacion
        );
        $data = array();
        foreach ($datos as $dat) {
            $objajuste = new stdClass();
            $objajuste->idoperacion = $dat['idnomoperaciones'];
            $objajuste->descripcion = $dat['denominacion'];
            $objajuste->signo = $dat['signo'];
            $objajuste->codigo = $dat['codigooperacion'];
            $data[] = $asArray ? (array) $objajuste : $objajuste;
        }
        if ($idoperacion) {
            return $data[0];
        }
        return $data;
    }

    /**
     * Devuelve el signo de la operacion del ajuste de inventario.
     * @param string $operacion
     * @return string
     */
    public function getSignoAjuste($operacion = self::MOTIVO_FALTANTE)
    {
        switch ($operacion) {
            case self::MOTIVO_IMPORTE_RESTA:
            case self::MOTIVO_SOBRANTE:
            case self::MOTIVO_OTROS_SUMA:
                return LogisticaMovimientoModel::SIGNO_MOV_SUMA;
            default:
                return LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        }
    }

    /**
     * Adiciona o modifica los datos de los lotes.
     * @param array $datos
     * @param string $motivo
     */
    public function guardarConteoLote($datos, $motivo)
    {
        $afecta = ($motivo == self::MOTIVO_IMPORTE_RESTA || $motivo == self::MOTIVO_IMPORTE_SUMA ||
            $motivo == self::MOTIVO_SOBRANTE || $motivo == self::MOTIVO_OTROS_SUMA) ? false : true;
        $signo = $this->getSignoAjuste($motivo);
        $params = array(
            'collection' => true, 'afectaLote' => $afecta, 'afectaProducto' => $afecta,
            'actualizarMov' => true, 'signo' => $signo, 'comprometida' => $afecta
        );
        $this->loteService->adicionarLote($datos['lotes'], $params);
    }

    /**
     * Verifica que en la tabla datmovubicacion las cantidades se correspondan con la cantidad de los movimientos.
     * @param numeric $iddocumento identificador de documento.
     * @return boolean
     */
    public function ubicacionConDatosCorrectos($iddocumento)
    {
        $ajuste = new DatAjuste();
        $datos = $ajuste->getDatosOperacion($iddocumento);
        $operacion = $this->cargaMotivoAjuste(true, $datos['idoperacion']);
        if ($operacion['codigo'] == self::MOTIVO_IMPORTE_RESTA ||
            $operacion['codigo'] == self::MOTIVO_IMPORTE_SUMA
        ) {
            return true;
        }
        $datosBusqueda = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $iddocumento));
        $objUbic = new UtilesubicacionService();
        $bandera = $objUbic->comprobarUbicacionMov($datosBusqueda);
        if ($datosBusqueda['datos'][0]['signo'] == '+' && !$bandera) {
            throw new ZendExt_Exception('LOG_LB_DOC_011');
        } else {
            return $bandera;
        }
    }

    /**
     * Devuelve el/los idoperacion dado un/varios código(s).
     * @param string|array $codigo
     * @param numeric $idestructura [Opcional]
     * @param numeric $iddoc [Opcional]
     * @return numeric
     */
    public function getIdOperacion($codigo, $idestructura = null, $iddoc = null)
    {
        $motivos = $this->cargaMotivoAjuste(true, null, $idestructura, $iddoc);
        foreach ($motivos as $value) {
            if (is_array($codigo) && array_search($value['codigo'], $codigo) !== false) {
                $idoperacion[] = $value['idoperacion'];
            } elseif ($value['codigo'] == $codigo) {
                $idoperacion = $value['idoperacion'];
            }
        }
        return $idoperacion;
    }

    /**
     * Devuelve los nombres de los usuarios que contabilizaros documentos.
     * @return array
     */
    public function devolverUsuarios()
    {
        $dql = Doctrine_Query::create()->select("d.iddocumento, a.contabilizadopor as id")->from('DatDocumento d')
            ->innerJoin('d.DatAjuste a');
        if ($this->iddoc) {
            $iddoc = is_array($this->iddoc) ? $this->iddoc : array($this->iddoc);
            $dql->andWhereIn('d.iddoc', $iddoc);
        }

        $queryResults = $dql->fetchArray();

        $usuariosDevueltos = array();
        foreach ($queryResults as $idusuario) {
            if (!array_search($idusuario['id'], $usuariosDevueltos)) {
                array_push($usuariosDevueltos, $idusuario['id']);
            }
        }
        return ServiciosSeguridadHelper::__init()->getUsersNameById($usuariosDevueltos);
    }

    public function ajustarCero($iddeposito)
    {
        $arrAlias = array('aperturaLog', 'recepcionLog', 'valedev', 'valeLog', 'transferenciaLog', 'ajusteLog');
        $arrAliasFact = array('facturaLog','compventaLog','compdevLog');
        $aliasInv = $this->findIddocsByAlias($arrAlias, LogisticaGlobal::SUBSISTEMA_INV);
        $aliasFact = $this->findIddocsByAlias($arrAliasFact, LogisticaGlobal::SUBSISTEMA_FAC);
        $striddoc = implode(', ', array_merge($aliasInv, $aliasFact));

        $iddocs = "'{".$striddoc."}'";

        $respuesta = Doctrine_Manager::connection()->fetchAll(
            "SELECT * FROM mod_loginventario.f_generarajustescero(
              {$this->global->Estructura->idestructura}, {$iddeposito},{$this->global->Perfil->idusuario},{$iddocs}
            )"
        );
        return true;
    }

    private function findIddocsByAlias($arrAlias, $subsistema) {
        $result = array();
        if (!is_array($arrAlias)) {
            $arrAlias = array($arrAlias);
        }
        foreach ($arrAlias as $alias) {
            //if (!array_key_exists($alias, $this->arrayIddocs)) {
            $iddoc = $this->serviciosIddoc->devuelveIddocByIdEstructura(
                $alias, $this->global->Estructura->idestructura, $subsistema
            );
            if (!empty($iddoc->iddoc)) {
                array_push($result, $iddoc->iddoc);
            }
        }
        return $result;
    }

}
