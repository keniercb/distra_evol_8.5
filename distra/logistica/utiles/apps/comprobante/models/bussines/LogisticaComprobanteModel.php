<?php

/**
 * Description of LogisticaComprobanteModel
 * @package Utiles
 * @subpackage Comprobante
 * @author Kenier Cumba Bueno.
 * @copyright (c) 2015, XETID
 * @version 1.0
 */
class LogisticaComprobanteModel extends BaseModel
{
    const ESTADO_CD = '8032::numeric';
    protected $asientos, $monedaContable, $tasaBase, $cache, $subsistema, $tipoDocVale, $tipoDocFac, $tipoDocTrans, $dataEstructuraE, $fRedondeo6, $tipoCompDev, $tipoDocRecep;

    /**
     * LogisticaComprobanteModel constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->asientos = array();
        $moneda = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $this->monedaContable = $moneda['datos'][0];
        $tasa = $this->configuracionHelper->buscarTasaActual($this->monedaContable['idmonedaentidad']);
        $this->tasaBase = $this->objectHelper->stdClassToArray($tasa);
        $this->cache = $this->initCache();

        //para los vales de devolucion
        $this->tipoDocVale = $this->documentosHelper->devuelveIddocByIdEstructura(
            'valeLog',
            $this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_INV
        );
        $this->tipoDocFac = $this->documentosHelper->devuelveIddocByIdEstructura(
            'facturaLog',
            $this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->tipoDocTrans = $this->documentosHelper->devuelveIddocByIdEstructura(
            'transferenciaLog',
            $this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_INV
        );
        //devolucion de venta en el punto de venta
        $this->tipoCompDev = $this->documentosHelper->devuelveIddocByIdEstructura(
            'compdevLog',
            $this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->tipoDocRecep = $this->documentosHelper->devuelveIddocByIdEstructura(
            'recepcionLog',
            $this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_INV
        );
        $this->dataEstructuraE = $this->obtenerEstructurasEconomicas();
        $this->fRedondeo6 = LogisticaGlobal::FACTOR_REDONDEO;
    }

    /**
     * @return LogisticaComprobanteModel
     */
    public static function getInstance()
    {
        return new LogisticaComprobanteModel;
    }

    /**
     * @param $idDocumento
     * @param $subsistema
     * @param string $detalles
     * @param string $observaciones
     * @return mixed
     * @throws ZendExt_Exception
     */
    public function contabilizarDocumento($idDocumento, $subsistema, $detalles = '', $observaciones = '', $anticipos = array())
    {
        $this->subsistema = $subsistema;
        $comprobante = $this->inicializarComprobante($subsistema);
        if (!is_array($idDocumento)) {
            $idDocumento = array($idDocumento);
        }
        $pases = $documentos = array();
        foreach ($idDocumento as $idDocContablizar) {
            $result = $this->contabilidadHelper->existeComprobanteDocumento($idDocContablizar, $subsistema);
            $documento = Doctrine::getTable('DatDocumento')->find($idDocContablizar);
            if (count($idDocumento) == 1 && $documento->estado != EstadoDocumentoModel::ESTADO_CANCELADO) {
                if ($subsistema == LogisticaGlobal::SUBSISTEMA_TALLERES) {
                    $orden = Doctrine::getTable('DatOrdenTrabajo')->find($idDocContablizar);
                    $comprobante->fechaContable = $orden->fechacierre;
                } else {
                    $comprobante->fechaContable = $documento->fechacontable;
                }
            }
            if ($result != 0) {
                $documento->idcomprobante = $result;
                $documento->save();
                continue;
            }
            if (is_null($documento->idoperacion)) {
                throw new ZendExt_Exception('LOG_LB_DOC_030');
            }
            if ($this->tipoCompDev->iddoc && $documento->iddoc == $this->tipoCompDev->iddoc) {
                $devolucion = Doctrine::getTable('DatDevolucion')->find($documento->iddocumento);
                $compra = Doctrine::getTable('DatDocumento')->find($devolucion->idventas);
                if (!$compra->idcomprobante) {
                    throw new ZendExt_Exception('LOG_LB_FAC_007');
                }
            }
            if (!array_key_exists($documento->idoperacion, $this->cache['operaciones'])) {
                $operacion = $this->configuracionHelper->obtenerOperaciones(
                    null,
                    $subsistema,
                    $documento->iddoc,
                    $documento->idoperacion
                );
                $this->cache['operaciones'][$documento->idoperacion] = $this->configuracionHelper
                    ->getModeloContabilizacion($operacion[0]['idmodelo']);

                if (is_null($operacion[0]['idmodelo'])) {
                    throw new ZendExt_Exception('LOG_LB_DOC_027');
                }
            }
            $observaciones = rtrim($documento->observaciones);
            $detalles = 'Comprobante de operaciones';
            $nro = $documento->nrodoc;
            if ($subsistema == LogisticaGlobal::SUBSISTEMA_FAC) {
                $facturaService = new FacturacionService();
                $tipoDocNC = $this->documentosHelper->devuelveIddocByIdEstructura(
                    'creditoLog',
                    $this->global->Estructura->idestructura,
                    LogisticaGlobal::SUBSISTEMA_FAC
                );
                if (
                    ($tipoDocNC->iddoc && $tipoDocNC->iddoc == $documento->iddoc) ||
                    ($this->tipoCompDev->iddoc && $this->tipoCompDev->iddoc == $documento->iddoc)
                ) {
                    $importe = $facturaService->getImportesFactura($idDocContablizar, 1);
                    if ($tipoDocNC->iddoc == $documento->iddoc) {
                        $docOrigen = $facturaService->getDocOrigen($idDocContablizar);
                    } else {
                        $sqlOrigen = "select dev.idventas as idpadre from mod_logpuntoventa.dat_devolucion dev " .
                            "where dev.iddevolucion = {$idDocContablizar}";
                        $docOrigen = $this->doctrineHelper->getConnection()->execute($sqlOrigen)->fetchAll(PDO::FETCH_ASSOC);
                        $sqlCom = "select pt.comision from mod_logpuntoventa.dat_pedidotienda pt
                        inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda
                        inner join mod_logpuntoventa.dat_ventas dv on dv.idventas = pd.iddocumento and pd.tipo = 4
                        where dv.idventas = {$docOrigen[0]['idpadre']}";
                        $comAux = $this->doctrineHelper->getConnection()->execute($sqlCom)->fetchAll(PDO::FETCH_ASSOC);
                        $importeTotalAux = $importe['importecontable'];
                        if (count($comAux) && is_numeric($comAux[0]['comision'])) {
                            $importe['importecontable'] = $importe['importecontable'] - ($importe['importecontable'] * $comAux[0]['comision'] / 100);
                        }
                        $auxVentaTC = Doctrine::getTable('DatVenta')->find($docOrigen[0]['idpadre']);

                        if ($auxVentaTC->valorconcepto > 0) {
                            $recdesc = $importeTotalAux * $auxVentaTC->valorconcepto / 100;
                            if ($auxVentaTC->conceptoventa == '-') {
                                $importe['importecontable'] = $importe['importecontable'] - $recdesc;
                            }
                        }
                    }
                    if ($this->contabilidadHelper->verificarDuoContabilizadoExterno(
                            $docOrigen[0]['idpadre'],
                            $importe['importecontable']
                        ) == true && $documento->estado != EstadoDocumentoModel::ESTADO_CANCELADO) {
                        throw new ZendExt_Exception('LOG_LB_DOC_030');
                    }
                }
                $nro = $facturaService->getNumeroFactura($idDocContablizar);
                if (!$nro) {
                    $nro = $documento->nrodoc;
                }
            }/*
              elseif ($subsistema == LogisticaGlobal::SUBSISTEMA_INV) {
              $docRecep = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
              'recepcionLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
              );
              if ($documento->iddoc == $docRecep->iddoc) {
              $condPago = Doctrine_Query::create()->from("DatRecepcion t")->select("t.nrodocorigen")
              ->where("t.iddocumento = ?", array($idDocContablizar))->fetchOne()->toArray();
              $nro = $condPago['nrodocorigen'];
              }
              } */
            $importeAnticipos = 0;
            if (count($anticipos)) {
                $pase = array();
                $pase['idoperacion'] = $documento->idoperacion;
                $pase['valor']['porciento'] = 100;
                $pase['creditodebito'] = ($subsistema == LogisticaGlobal::SUBSISTEMA_FAC) ? 1 : 0;
                foreach ($anticipos as $ant) {
                    $objPase = $this->inicializarPase($pase, $idDocContablizar);
                    $objPase->idcuenta = $ant['idcuenta'];
                    $objPase->numero = $nro;
                    $objPase->importe = $ant['importe'];
                    $objPase->importemb = $ant['importe'];
                    $objPase->importemo = $ant['importe'];
                    $importeAnticipos += $ant['importe'];
                    array_push($pases, $objPase);
                }
            }
            $this->generarPases($idDocContablizar, $this->cache['operaciones'][$documento->idoperacion], $pases, $documento->idoperacion, $nro, $documento->estado, $importeAnticipos);
            array_push($documentos, $nro);
        }
        $comprobante->dataComprobante = $this->unificarPases($pases);
        $comprobante->descripcion = rtrim($this->getDetallesOperacion($idDocContablizar));
        $comprobante->detalle = empty($observaciones) ? (($subsistema == LogisticaGlobal::SUBSISTEMA_FAC)
            ? 'Comprobante de operaciones de facturacion - ' . implode(',', $documentos)
            : (($subsistema == LogisticaGlobal::SUBSISTEMA_TALLERES) ? 'Comprobante de operaciones de talleres' : 'Comprobante de operaciones de inventario')) : $observaciones;
        return $this->buildComprobante($comprobante);
    }

    /**
     * @param $idDocumento
     * @param $modelo
     * @param $pases
     * @param $idOperacion
     * @param $nroDoc
     * @param $estado
     */
    public function generarPases($idDocumento, $modelo, &$pases, $idOperacion, $nroDoc, $estado, $importeAnticipos = 0)
    {
        $queryIddocPadre = Doctrine_Query::create()->select('d.iddoc, d.iddocumento, d.idoperacion')->from('DatDocumento d')
            ->innerJoin('d.DatDocumentoPadre ddp ON ddp.idpadre = d.iddocumento')
            ->where('ddp.iddocumento = ?', array($idDocumento))->fetchArray();
        $iddocumentoPadre = false;
        $flag = false;
        $devCancelada = false;
        $flagDevFac = false;
        $operDiff = false;
        $invertirComprobanteEntrega = (new VariablesGlobalesModel)->obtenerValor('INVERTIR_VENTAS') ?: true;
        if (count($queryIddocPadre) > 0) {
            if ($queryIddocPadre[0]['iddoc'] == $this->tipoDocVale->iddoc || $queryIddocPadre[0]['iddoc'] == $this->tipoDocFac->iddoc /*|| $queryIddocPadre[0]['iddoc'] == $this->tipoDocTrans->iddoc*/) {
                $iddocumentoPadre = $queryIddocPadre[0]['iddocumento'];
                $flag = true;

                if ($estado == EstadoDocumentoModel::ESTADO_CANCELADO) {
                    $devCancelada = true;
                }
                if ($queryIddocPadre[0]['iddoc'] == $this->tipoDocFac->iddoc) {
                    $tipoDocND = $this->documentosHelper->devuelveIddocByIdEstructura(
                        'debitoLog',
                        $this->global->Estructura->idestructura,
                        LogisticaGlobal::SUBSISTEMA_FAC
                    );
                    $tipoDocNC = $this->documentosHelper->devuelveIddocByIdEstructura(
                        'creditoLog',
                        $this->global->Estructura->idestructura,
                        LogisticaGlobal::SUBSISTEMA_FAC
                    );
                    $queryIddocDocumento = Doctrine::getTable('DatDocumento')->find($idDocumento);
                    if ($tipoDocNC->iddoc && $queryIddocDocumento->iddoc == $tipoDocNC->iddoc) {
                        $operDiff = ($queryIddocDocumento->idoperacion != $queryIddocPadre[0]['idoperacion']);
                        $flag = ($queryIddocDocumento->idoperacion == $queryIddocPadre[0]['idoperacion']) ? true : false;
                    } else if ($tipoDocND->iddoc && $queryIddocDocumento->iddoc == $tipoDocND->iddoc) {
                        $flag = false;
                    } else {
                        $flagDevFac = true;
                    }
                }
            }
        }
        if ($this->tipoCompDev->iddoc) {
            $queryIddocDocumento = Doctrine::getTable('DatDocumento')->find($idDocumento);
            if ($queryIddocDocumento->iddoc == $this->tipoCompDev->iddoc) {
                $flag = true;
                //$flag = false;
            }
        }
        foreach ($modelo as $pase) {
            $pase['idoperacion'] = $idOperacion;
            $valPase = $this->generarPase($idDocumento, $pase, $iddocumentoPadre, $flagDevFac, $importeAnticipos);
            if (!is_array($valPase)) {
                $valPase->numero = $nroDoc;
                if (($estado == EstadoDocumentoModel::ESTADO_CANCELADO || $flag) && !$devCancelada) {
                    $valPase->debitoCredito = $valPase->debitoCredito == 1 ? 0 : 1;
                } else if (($estado == EstadoDocumentoModel::ESTADO_CANCELADO || $flag) && $operDiff) {
                    $valPase->debitoCredito = $valPase->debitoCredito == 1 ? 0 : 1;
                }
                array_push($pases, $valPase);
            } else {
                foreach ($valPase as $pos => &$tempPase) {
                    $tempPase->numero = $nroDoc;
                    if (($estado == EstadoDocumentoModel::ESTADO_CANCELADO || $flag) && !$devCancelada) {
                        $tempPase->debitoCredito = $tempPase->debitoCredito == 1 ? 0 : 1;
                    } else if (($estado == EstadoDocumentoModel::ESTADO_CANCELADO || $flag) && $operDiff) {
                        $valPase->debitoCredito = $valPase->debitoCredito == 1 ? 0 : 1;
                    }
                }
                $pases = array_merge($pases, $valPase);
            }
        }
    }

    /**
     * @param $idDocumento
     * @param $pase
     * @param bool $idpadre
     * @param bool $devFac
     * @return array|stdClass
     */
    public function generarPase($idDocumento, $pase, $idpadre = false, $devFac = false, $importeAnticipos = 0)
    {
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        $objPase = $this->inicializarPase($pase, $idDocumento);
        if ($pase['tipocuenta'] == 'fija') {
            //$objPase->idcuenta = $pase['cuenta'];
            $cuenta = $this->buscarCuentaPorId($pase['cuenta']);
            $objPase->idcuenta = $cuenta->idcuenta;
        } else {
            switch ($pase['cuenta']['valor']) {
                /**
                 * Cuenta por pagar en moneda contable
                 */
                case 100:
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, false, $moneda->idmoneda, $devFac);
                    $importeResta = $importeAnticipos;
                    break;
                case 114:
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, true, $moneda->idmonedaalternativa, $devFac);
                    $objPase->idmoneda = $moneda->idmonedaalternativa;
                    $objPase->moneda = $moneda->codigoisoalt;
                    break;
                /**
                 * Cuenta por cobrar en moneda contable
                 */
                case 102:
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, true, $moneda->idmoneda, $devFac);
                    $importeResta = $importeAnticipos;
                    break;
                case 113:
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, false, $moneda->idmonedaalternativa, $devFac);
                    $objPase->idmoneda = $moneda->idmonedaalternativa;
                    $objPase->moneda = $moneda->codigoisoalt;
                    break;
                /**
                 * Para los vales de devolucion
                 */
                case 105:
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, false, null, $devFac);
                    break;
                case 101:
                    $signo = $pase['valor']['valor'] == 123 ? LogisticaMovimientoModel::SIGNO_MOV_SUMA : null;
                    $signo = $pase['valor']['valor'] == 124 ? LogisticaMovimientoModel::SIGNO_MOV_RESTA : $signo;
                    return $this->pasesMovimientos($idDocumento, $pase, $signo);
                case 127:
                    $signo = $pase['valor']['valor'] == 123 ? LogisticaMovimientoModel::SIGNO_MOV_SUMA : null;
                    $signo = $pase['valor']['valor'] == 124 ? LogisticaMovimientoModel::SIGNO_MOV_RESTA : $signo;
                    return $this->pasesMovimientosSinRecargo($idDocumento, $pase, $signo);
                /**
                 * Para los vales de entrega
                 */
                case 119:
                    $idDocumentoD = ($idpadre != false) ? $idpadre : $idDocumento;
                    $objPase->idcuenta = $this->buscarCuentaCentroVale($idDocumentoD, true);
                    break;
                case 120:
                    $idDocumentoD = ($idpadre != false) ? $idpadre : $idDocumento;
                    $objPase->idcuenta = $this->buscarCuentaCentroVale($idDocumentoD, false);
                    $objPase->idmoneda = $moneda->idmonedaalternativa;
                    $objPase->moneda = $moneda->codigoisoalt;
                    break;
                case 112:
                    $signo = $pase['valor']['valor'] == 123 ? LogisticaMovimientoModel::SIGNO_MOV_SUMA : null;
                    $signo = $pase['valor']['valor'] == 124 ? LogisticaMovimientoModel::SIGNO_MOV_RESTA : $signo;
                    return $this->pasesMovimientosAlternativo($idDocumento, $pase, $signo);
                /**
                 * Para la revaluacion de los inventarios
                 */
                case 123:
                    return $this->getImporteAnteriorRevaluacion($idDocumento, $pase);
                case 124:
                    return $this->getImporteAnteriorRevaluacion($idDocumento, $pase, 'idcuentaalt');
                case 107:
                    return $this->pasesAFT($idDocumento, $pase, 1);
                case 109:
                    return $this->pasesAFT($idDocumento, $pase, -1);
                case 310:
                    return $this->pasesConceptoPrecio($idDocumento, $pase, '+');
                case 312:
                    return $this->pasesConceptoPrecio($idDocumento, $pase, '-'); //-
                case 311:
                    return $this->pasesConceptoPrecio($idDocumento, $pase, '+', true);
                case 313:
                    return $this->pasesConceptoPrecio($idDocumento, $pase, '-', true); //-
                case 400:
                    return $this->pasesCambioClasificacion($idDocumento, $pase, 1);
                case 401:
                    return $this->pasesCambioClasificacion($idDocumento, $pase, -1);
            }
        }
        $pases = $this->completarPase($objPase, $pase, $idDocumento, $devFac, $importeResta);
        return count($pases) > 0 ? $pases : $objPase;
    }

    /**
     * @param $subsistema
     * @return stdClass
     */
    public function inicializarComprobante($subsistema)
    {

        $comprobante = new stdClass();
        LogisticaObjectHelper::__init()->synchronize(
            $comprobante,
            array(
                'idtipocomprobante' => 3,
                'fechaContable' => $this->configuracionHelper->getFechaContableSubsistema(
                    $this->global->Estructura->idestructura,
                    $subsistema
                ),
                'idsubsistema' => $subsistema,
                'dataComprobante' => array()
            )
        );
        return $comprobante;
    }

    /**
     * @param $pase
     * @param $idDocumento
     * @return stdClass
     */
    public function inicializarPase($pase, $idDocumento)
    {
        $objPase = new stdClass();
        $objPase->porciento = floatval($pase['valor']['porciento']);
        $objPase->idmoneda = $this->monedaContable['idmoneda'];
        $objPase->moneda = $this->monedaContable['codigoiso'];
        $objPase->idtasa = $this->tasaBase['idtasa'];
        $objPase->idoperacioncontable = $pase['idoperacion'];
        $objPase->debitoCredito = (intval($pase['creditodebito']) == 1) ? 0 : 1;
        $objPase->iddoc = $idDocumento;
        return $objPase;
    }

    /**
     * @param $objPase
     * @param $pase
     * @param $idDocumento
     * @param bool $devFac
     * @return array
     */
    public function completarPase(&$objPase, $pase, $idDocumento, $devFac = false, $importeAnticipos = 0)
    {
        $refArray = array();
        $flagCentroCosto = false;
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        if (count($pase['sustituciones'])) {
            foreach ($pase['sustituciones'] as $pos => $sustitucion) {
                /**
                 * 119 Centro de costo
                 * 120 Elemento del gasto
                 */
                if ($sustitucion['valor'] == 119) {
                    if (!is_null($objPase->idcuenta)) {
                        $flagCentroCosto = true;
                        $queryData = Doctrine_Query::create()->from('DatDocumentoCliente')
                            ->where('iddocumento = ?', array($idDocumento))->fetchOne();
                        $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, $sustitucion['parteformato'], $queryData->idcliente);
                        if ($pase['sustituciones'][$pos + 1]['valor'] != 120) {
                            $tmpElementos = $pase['sustituciones'][$pos + 1]['valores'][0];
                            $objElement = new stdClass();
                            $objElement->idelemento = $tmpElementos['id'];
                            $elementos = array($objElement);
                        }
                    }
                } elseif ($sustitucion['valor'] == 600) {

                    if (!is_null($objPase->idcuenta)) {
                        $sqlCentro = "SELECT 
							nc.codigocentrogrupo
						FROM 
						  mod_contabilidadcosto.conf_areasreponsabilidad ca
						  inner join mod_contabilidadcosto.nom_centrocosto nc on ca.idcentro = nc.idcentrogrupo
						  inner join mod_logistica.dat_documento d on d.idestructuracomun = ca.idarea 
						  where d.iddocumento = {$idDocumento}";
                        $idcuenta = $objPase->idcuenta;
                        $destino = $this->doctrineHelper->getConnection()->execute($sqlCentro)->fetchAll(PDO::FETCH_ASSOC);
                        $cuenta = $this->buscarCuentaPorId($idcuenta);
                        $concate = $cuenta->concatcta . '.' . $destino[0]['codigocentrogrupo'];
                        $cuentaE = $this->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
                        $objPase->idcuenta = $cuentaE->idcuenta;
                    }
                } elseif ($sustitucion['valor'] == 120) {
                    $campo = $pase['valor']['valor'] == 103 ? 'importecontable' : 'importealternativo';
                    $elementos = $this->getValorElementosGasto($idDocumento, $pase['valor']['valor'] == 300 ? 'ambos' : $campo);
                    if (count($elementos)) {
                        foreach ($elementos as $gasto) {
                            if ($gasto->idelemento) {
                                $idcuenta = $objPase->idcuenta;

                                $idElementos = $this->getElementosByIdElemento($gasto->idelemento);
                                $cuenta = $this->buscarCuentaPorId($idcuenta);
                                $concate = $cuenta->concatcta . '.' . $idElementos[0]['concat'];
                                $cuentaE = $this->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
                                $idcuenta = $cuentaE->idcuenta;
                            }

                            if ($idcuenta == $objPase->idcuenta) {
                                //TODO Muestro el error de que no existe el elmento del gasto aperturado
                            } else {
                                $newPase = $this->inicializarPase($pase, $idDocumento);
                                $newPase->idcuenta = $idcuenta;
                                $newPase->importe = $gasto->importe;
                                $newPase->importemb = $gasto->importe;
                                $newPase->importemo = $gasto->importe;
                                $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
                                if ($campo != 'importecontable') {
                                    $newPase->idmoneda = $moneda->idmonedaalternativa;
                                    $newPase->moneda = $moneda->codigoisoalt;
                                }
                                if ($flagCentroCosto == false) {
                                    $sustitucionCentro = $pase['sustituciones'][$pos + 1];
                                    $queryData = Doctrine_Query::create()->from('DatDocumentoCliente')
                                        ->where('iddocumento = ?', array($idDocumento))->fetchOne();
                                    $newPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, $sustitucionCentro['parteformato'], $queryData->idcliente);
                                }
                                array_push($refArray, $newPase);
                            }
                        }
                    }

                    if ($flagCentroCosto == false) {
                        break;
                    }
                } elseif ($sustitucion['valor'] == 309) {
                    /**
                     * Aperetura para la entidad destino
                     */
                    $sqlEstrucutura = "select ncp.idestructura as idestructuracomun 
										from mod_logistica.dat_documentocliente dc
										inner join mod_datosmaestros.nom_clientesproveedor ncp on dc.idcliente = ncp.idclientesproveedores
										where dc.iddocumento = {$idDocumento} limit 1";
                    $destino = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
                    if (!count($destino)) {
                        $sqlEstrucutura = "select dp.idestructuracomun as idestructuracomun 
										from mod_logistica.dat_documentocliente dc
										inner join mod_logistica.dat_producto dp on dp.idestructura = dc.idcliente
										where dc.iddocumento = {$idDocumento} 
										and dp.precio is not null and dp.cantidad is not null and dp.cronologia > 0 limit 1";
                        $destino = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
                    }
                    if (!count($destino)) {
                        $sqlEstrucutura = "select dp.idestructura as idestructuracomun
                            from mod_logistica.dat_documentocliente dp
							inner join mod_logistica.dat_documentopadre dc on dc.idpadre = dp.iddocumento
                            where dc.iddocumento = {$idDocumento} and dp.idestructura  is not null limit 1";
                        $destino = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
                    }
                    if (!count($destino) || is_null($destino[0]['idestructuracomun'])) {
                        $sqlEstrucutura = "select dc.idcliente as idestructuracomun 
                            from mod_logistica.dat_documentocliente dc
                            --inner join mod_logistica.dat_producto dp on dp.idestructura = dc.idcliente
                            where dc.iddocumento = {$idDocumento} limit 1";
                        $destino = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
                    }
                    $cuenta = $this->buscarCuentaEstructuraE($objPase->idcuenta, $destino[0]['idestructuracomun']);
                    $objPase->idcuenta = $cuenta->idcuenta;
                } elseif ($sustitucion['valor'] == 308) {
                    /**
                     * Apertura de la cuenta para el origen del traspaso
                     */
                    $cuenta = $this->buscarCuentaEstructuraE($objPase->idcuenta, $this->global->Estructura->idestructura);

                    $objPase->idcuenta = $cuenta->idcuenta;
                } elseif ($sustitucion['valor'] == 310) {
                    $sqlEstrucutura = "select dc.iduebdestino 
                            from mod_logistica.dat_documento dc
                            where dc.iddocumento = {$idDocumento} limit 1";
                    $destino = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
                    /**
                     * Apertura de la cuenta para el destino del traspaso
                     */
                    $cuenta = $this->buscarCuentaEstructuraE($objPase->idcuenta, $destino[0]['iduebdestino'], true);
                    $objPase->idcuenta = $cuenta->idcuenta;
                } elseif ($sustitucion['valor'] == 500) {
                    /**
                     * Aperetura para el almacen
                     */
                    $sqlEstrucutura = "SELECT distinct  v.codigo
                                    FROM mod_logistica.dat_producto dp
                                    inner join mod_estructuracomp.v_dametodasestructuras v on v.idestructura = dp.idestructura
                                    inner join mod_logistica.dat_movimiento dm on dm.idproducto = dp.idproducto
                                    where dm.iddocumento = {$idDocumento} limit 1";
                    $almacen = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
                    $idcuenta = $objPase->idcuenta;
                    $cuenta = $this->buscarCuentaPorId($idcuenta);
                    $concate = $cuenta->concatcta . '.' . $almacen[0]['codigo'];
                    $cuentaE = $this->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
                    $idcuenta = $cuentaE->idcuenta;
                    $objPase->idcuenta = $idcuenta;
                } elseif ($sustitucion['valor'] == 501) {
                    /**
                     * Aperetura para el almacen
                     */
                    $sqlOrganismo = "SELECT nor.codigo
						FROM  mod_logistica.dat_documentocliente ddc
						inner join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = ddc.idcliente
						inner join mod_crmclienteproveedor.nom_organismo nor on nor.idorganismo = ncp.idorganismo
						where ddc.iddocumento = {$idDocumento} limit 1";
                    $almacen = $this->doctrineHelper->getConnection()->execute($sqlOrganismo)->fetchAll(PDO::FETCH_ASSOC);
                    $idcuenta = $objPase->idcuenta;
                    $cuenta = $this->buscarCuentaPorId($idcuenta);
                    $concate = $cuenta->concatcta . '.' . $almacen[0]['codigo'];
                    $cuentaE = $this->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
                    $idcuenta = $cuentaE->idcuenta;
                    $objPase->idcuenta = $idcuenta;
                } elseif ($sustitucion['valor'] == 502) {
                    /**
                     * Aperetura para el servicio
                     */
                    return $this->getServiciosProductoCodigoIng($idDocumento, $pase, $objPase, false);
                } elseif ($sustitucion['tipo'] == 'refestatica') {
                    $idcuenta = $objPase->idcuenta;
                    $cuenta = $this->buscarCuentaPorId($idcuenta);
                    $concate = $cuenta->concatcta . '.' . $sustitucion['valor'];
                    $cuentaE = $this->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
                    $objPase->idcuenta = $cuentaE->idcuenta;
                }
            }
            if (count($refArray)) {
                return $refArray;
            }
        }
        switch ($pase['valor']['valor']) {
            case 103:
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = ($devFac) ? 0 : $this->importeTotalDocumento($idDocumento) - $importeAnticipos;
                break;
            case 115:
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = ($devFac) ? 0 : $this->importeTotalDocumentoAlternativo($idDocumento);
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 106:
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeParcialDocumento($idDocumento) - $importeAnticipos;
                break;
            case 301:
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeParcialDocumentoAlternativo($idDocumento);
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 123:
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeTotalDocumento($idDocumento, LogisticaMovimientoModel::SIGNO_MOV_SUMA);
                break;
            case 124:
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeTotalDocumento($idDocumento, LogisticaMovimientoModel::SIGNO_MOV_RESTA);
                break;
            case 300:
                /**
                 * @todo Calcular el importe total del documento en el cmp documento (ambas monedas).
                 */
                $objPase->importe = $this->importeTotalDocumentoAmbasMonedas($idDocumento, LogisticaMovimientoModel::SIGNO_MOV_RESTA);
                break;
            case 332:
                $faltante = $this->importesDiferencias($idDocumento, 1);
                $objPase->importe = (count($faltante) > 0 ? $faltante[0]['faltante'] : 0);
                break;
            case 333:
                $faltante = $this->importesDiferencias($idDocumento, 1);
                $objPase->importe = (count($faltante) > 0 ? $faltante[0]['faltantealt'] : 0);
                $objPase->idmoneda = $moneda->idmonedaalternativa;;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 505:
                $faltante = $this->importesDiferencias($idDocumento, 0);
                $objPase->importe = (count($faltante) > 0 ? $faltante[0]['sobrante'] : 0);
                break;
            case 506:
                $faltante = $this->importesDiferencias($idDocumento, 0);
                $objPase->importe = (count($faltante) > 0 ? $faltante[0]['sobrantealt'] : 0);
                $objPase->idmoneda = $moneda->idmonedaalternativa;;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 108:
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importePrecioPromedio($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 119:
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importePrecioPromedio($idDocumento, 'precioalternativo');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 310:
                $objPase->importe = $this->pasesConceptoPrecio($idDocumento, $pase, '+', false, true);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 312:
                $objPase->importe = $this->pasesConceptoPrecio($idDocumento, $pase, '-', false, true); //-
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 311:
                $objPase->importe = $this->pasesConceptoPrecio($idDocumento, $pase, '+', true, true);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 313:
                $objPase->importe = $this->pasesConceptoPrecio($idDocumento, $pase, '-', true, true); //-
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 600:
                $objPase->importe = $this->importeTotalDocumentoDiscount($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
        }
        $objPase->importemb = $objPase->importe;
        $objPase->importemo = $objPase->importe;
    }

    /**
     *
     * @param type $iddocumento
     * @param type $porPagar
     * @param type $idmoneda
     * @return null
     */
    public function buscarCuentaClienteProveedor($iddocumento, $porPagar = true, $idmoneda = null, $devFac = false)
    {
        $idmoneda = is_null($idmoneda) ? LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda : $idmoneda;
        $query = Doctrine_Query::create();
        $datos = $query->select("ddc.idcliente as idcliente,dd.iddocumento,ddc.tipocliente as tipo, ddc.idcondicionpago as idcondicionpago")
            ->from('DatDocumento dd')
            ->innerjoin('dd.DatDocumentoCliente ddc')
            ->where(' ddc.iddocumento = ? ', $iddocumento)
            ->fetchArray();
        if ($datos[0]['tipo'] == 2) {
            $result = $this->contabilidadHelper->obtenerCuentasAsociadasACentros($datos[0]['idcliente']);
            return $result[0]['idcuenta'];
        } else {
            /**
             * Busco la condicion de pago
             */
            $tabla = LogisticaGlobal::SUBSISTEMA_INV == $this->subsistema ? 'DatRecepcion' : 'DatDocumentoCliente';
            $tabla = LogisticaGlobal::SUBSISTEMA_AFT == $this->subsistema ? 'DatDocumentoCliente' : $tabla;
            $idDocumentoField = LogisticaGlobal::SUBSISTEMA_INV || LogisticaGlobal::SUBSISTEMA_FAC == $this->subsistema ? 'iddocumento' : 'idfactura';
            $idDocumentoField = LogisticaGlobal::SUBSISTEMA_AFT == $this->subsistema ? 'iddocumento' : $idDocumentoField;
            if (!$devFac) {
                $condPago = Doctrine_Query::create()->from("{$tabla} t")->select("t.idcondicionpago")
                    ->where("t.{$idDocumentoField} = ?", array($iddocumento))->fetchOne()->toArray();
            } else {
                $queryIddocPadre = Doctrine_Query::create()->select('d.iddocumento')->from('DatDocumento d')
                    ->innerJoin('d.DatDocumentoPadre ddp ON ddp.idpadre = d.iddocumento')
                    ->where('ddp.iddocumento = ?', array($iddocumento))->fetchArray();
                $condPago = Doctrine_Query::create()->from("DatDocumentoCliente t")->select("t.idcondicionpago")
                    ->where("t.iddocumento = ?", array($queryIddocPadre[0]['iddocumento']))->fetchOne()->toArray();
            }
            if (!array_key_exists($datos[0]['idcliente'], $this->cache['clientes'])) {
                $this->cache['clientes'][$datos[0]['idcliente']] = $this->configuracionHelper
                    ->getCuentasClienteProveedor($datos[0]['idcliente']);
            }
            $cliente = $this->cache['clientes'][$datos[0]['idcliente']];
            $concepto = $porPagar == true ? 2 : 1;
            foreach ($cliente['cuentas'] as $pos => $cuenta) {
                if (
                    $cuenta['idmoneda'] == $idmoneda && $cuenta['idclasificacion'] == $concepto && $condPago['idcondicionpago'] == $cuenta['idterminodepago']
                ) {
                    return $cuenta['idcuenta'];
                }
            }
            return null;
        }
    }

    /**
     * @param $idproveedor
     * @param $condPago
     * @param $idmoneda
     * @return |null
     */
    public function buscarCuentaProveedorConcepto($idproveedor, $condPago, $idmoneda)
    {
        if (!array_key_exists($idproveedor, $this->cache['clientes'])) {
            $this->cache['clientes'][$idproveedor] = $this->configuracionHelper
                ->getCuentasClienteProveedor($idproveedor);
        }
        $cliente = $this->cache['clientes'][$idproveedor];
        foreach ($cliente['cuentas'] as $pos => $cuenta) {
            if (
                $cuenta['idmoneda'] == $idmoneda && $cuenta['idclasificacion'] == 2 && $condPago == $cuenta['idterminodepago']
            ) {
                return $cuenta['idcuenta'];
            }
        }
        return null;
    }

    /**
     * @param $iddocumento
     * @param $pase
     * @param $signo
     * @return array
     */
    public function pasesMovimientos($iddocumento, $pase, $signo)
    {
        $strWhere = '';
        if (!is_null($signo)) {
            $strWhere .= " AND dm.signo = '{$signo}'";
        }
        $pases = array();
        $sql = "select nc.idcuenta as idcuenta,SUM(round(coalesce(dm.importecontable,0),{$this->fRedondeo6})) as importe
            from mod_logistica.dat_movimiento dm
            inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
            inner join mod_logistica.nom_clasificacioncontable nc on nc.idclasificacioncontable = coalesce(dm.idclasificacion, dp.idclasificacioncontable)
            where dm.iddocumento = {$iddocumento} {$strWhere}
            group by nc.idcuenta
            having SUM(coalesce(dm.importecontable,0)) > 0";
        $dataQuery = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $pase['valor']['valor'] = $pase['cuenta']['valor'];
        foreach ($dataQuery as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $iddocumento);
            $this->objectHelper->synchronize($objPase, $value);
            $this->completarPase($objPase, $pase, $iddocumento, false);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function pasesMovimientosSinRecargo($iddocumento, $pase, $signo)
    {
        $strWhere = '';
        if (!is_null($signo)) {
            $strWhere .= " AND dm.signo = '{$signo}'";
        }
        $recep = Doctrine::getTable('DatRecepcion')->find($iddocumento);
        $resta = "";
        if ($recep && !$recep->salidafactura) {
            $restar = " - coalesce(dm.recargodescuento,0) ";
        }
        $pases = array();
        $sql = "select nc.idcuenta as idcuenta,SUM(round(coalesce(dm.importecontable,0){$restar},{$this->fRedondeo6})) as importe
            from mod_logistica.dat_movimiento dm
            inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
            inner join mod_logistica.nom_clasificacioncontable nc on nc.idclasificacioncontable = coalesce(dm.idclasificacion, dp.idclasificacioncontable)
            where dm.iddocumento = {$iddocumento} {$strWhere}
            group by nc.idcuenta
            having SUM(coalesce(dm.importecontable,0)) > 0";
        $dataQuery = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $pase['valor']['valor'] = $pase['cuenta']['valor'];
        foreach ($dataQuery as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $iddocumento);
            $this->objectHelper->synchronize($objPase, $value);
            $this->completarPase($objPase, $pase, $iddocumento, false);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    /**
     * @param $iddocumento
     * @param $pase
     * @param null $signo
     * @return array
     */
    public function pasesMovimientosAlternativo($iddocumento, $pase, $signo = null)
    {
        $strWhere = '';
        if (!is_null($signo)) {
            $strWhere .= " AND dm.signo = '{$signo}'";
        }
        $pases = array();
        $sql = "select nc.idcuentaalt as idcuenta,SUM(round(coalesce(dm.importealternativo,0),{$this->fRedondeo6})) as importe
            from mod_logistica.dat_movimiento dm
            inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
            inner join mod_logistica.nom_clasificacioncontable nc on nc.idclasificacioncontable = coalesce(dm.idclasificacion, dp.idclasificacioncontable)
            where dm.iddocumento = {$iddocumento} {$strWhere}
            group by nc.idcuentaalt
            having SUM(coalesce(dm.importealternativo,0)) > 0";
        $dataQuery = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        $pase['valor']['valor'] = $pase['cuenta']['valor'];
        foreach ($dataQuery as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $iddocumento);
            $objPase->idmoneda = $moneda->idmonedaalternativa;
            $objPase->moneda = $moneda->codigoisoalt;
            $this->objectHelper->synchronize($objPase, $value);
            $this->completarPase($objPase, $pase, $iddocumento, false);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    /**
     * @param $iddocumento
     * @param $pase
     * @param int $contable
     * @return array
     */
    public function pasesAFT($iddocumento, $pase, $contable = 1)
    {
        $campo = 'idcuentaactivo';
        $campoImporte = 'importecontable';
        if ($contable != 1) {
            $campo = 'idcuentaactivoalternativa';
            $campoImporte = 'importealternativo';
        }
        $pases = array();
        $sql = "select gc.{$campo} as idcuenta, sum(round(COALESCE(m.{$campoImporte},0),{$this->fRedondeo6})) as importe
                from mod_datosmaestros.nom_indicador i
                inner join mod_logistica.dat_producto p on p.idindicador = i.idindicador
                inner join mod_logistica.dat_movimiento m on m.idproducto = p.idproducto
                inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
                left join mod_logactivofijotangible.dat_movregnumerico mr on mr.idmovimiento = m.idmovimiento
                left join mod_logactivofijotangible.dat_movregnumericoactivo ma on ma.idmovregnumerico = mr.idmovregnumerico 
                inner join mod_logactivofijotangible.conf_gruposcuentas gc 
                        on (gc.idgruposubgrupo = coalesce(ma.idgruposubgrupo,ih.idgruposubgrupo) and gc.idestructura = {$this->global->Estructura->idestructura})
                where m.iddocumento = {$iddocumento}
                group by gc.{$campo} having sum(COALESCE(m.{$campoImporte},0)) > 0";
        $dataQuery = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        foreach ($dataQuery as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $iddocumento);
            $objPase->idmoneda = $moneda->idmoneda;
            $objPase->moneda = $moneda->codigoiso;
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function getServiciosProductoCodigoIng($idDocumento, $pase, $pObjectPase = null, $sustitucion = false, $idmoneda = null)
    {
        /*$idmoneda = ($pase['valor']['valor'] == 103 || $pase['valor']['valor'] == 106 || $pase['valor']['valor'] == 108) ? $this->dualidad->idmoneda : $this->dualidad->idmonedaalternativa;
        $iso = ($pase['valor']['valor'] == 103 || $pase['valor']['valor'] == 106 || $pase['valor']['valor'] == 108) ? $this->dualidad->codigoiso : $this->dualidad->codigoisoalt;*/
        $idmoneda = is_null($idmoneda) ? LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda : $idmoneda;
        $iso = 'CUP';
        $columna = 'dm';
        $campo = 'importecontable';
        $and = ($sustitucion) ? " and (nnat.codigoaux = '{$sustitucion}' or nnat.codigoaux is null) " : "";
        $idmoneda = ($idmoneda) ? $idmoneda : $this->dualidad->idmoneda;
        $signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        $sql = "select distinct nnat.codigocontable as codigoauxiliar, sum(coalesce(round(({$columna}.{$campo}),$this->fRedondeo6),0)) as importe 
                    from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
                inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                where dm.iddocumento = {$idDocumento}{$and} group by nnat.codigocontable";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pObjectPase->idcuenta;
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            $concate = $cuenta->concatcta . '.' . $value['codigoauxiliar'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $idcuenta = $cuentaE->idcuenta;
            $objPase->idcuenta = $idcuenta;
            /*if ($this->idCentroCostoFac)         die($concate);

               $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $this->idCentroCostoFac);*/
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }


    /**
     * @param $idDocumento
     * @param null $signo
     * @return int|mixed
     */
    public function importeTotalDocumento($idDocumento, $signo = null)
    {
        $strWhere = '';
        if (!is_null($signo)) {
            $strWhere .= " AND m.signo = '{$signo}'";
        }
        $importe = $this->doctrineHelper->query(
            "SELECT SUM(round(m.importecontable,{$this->fRedondeo6})) as importe FROM DatMovimientos m WHERE m.iddocumento = {$idDocumento} {$strWhere}"
        )->getFirst()->toArray();
        $sobrante = $this->importesDiferencias($idDocumento, 0);
        $faltante = $this->importesDiferencias($idDocumento, 1);
        return $importe['importe'] - (count($sobrante) > 0 ? $sobrante[0]['sobrante'] : 0) + (count($faltante) > 0 ? $faltante[0]['faltante'] : 0);
    }

    public function importeTotalDocumentoDiscount($idDocumento, $signo = null)
    {
        $strWhere = '';
        if (!is_null($signo)) {
            $strWhere .= " AND m.signo = '{$signo}'";
        }
        $amount = $this->doctrineHelper->query(
            "SELECT SUM(round(m.importecontable,{$this->fRedondeo6})) as amount FROM DatMovimientos m WHERE m.iddocumento = {$idDocumento} {$strWhere}"
        )->getFirst()->toArray();
        $discount = $this->getDiscountServiceImport($idDocumento);
        $amount = $discount == 0 ? $amount['amount'] : $amount['amount'] * $discount;
        $sobrante = $this->importesDiferencias($idDocumento, 0);
        $faltante = $this->importesDiferencias($idDocumento, 1);
        return $amount - (count($sobrante) > 0 ? $sobrante[0]['sobrante'] : 0) + (count($faltante) > 0 ? $faltante[0]['faltante'] : 0);
    }

    private function getDiscountServiceImport($iddocumento)
    {
        $discount = 0;
        if ((new VariablesGlobalesModel())->obtenerValor('isNovaBank') == 1) {

            $discount = (new VariablesGlobalesModel())->obtenerValor('novaBankDiscountPercent');
            $documentOperation = (new VariablesGlobalesModel())->obtenerValor('novaBankFinancialOperationId');
            $operationId = LogisticaDoctrineHelper::__init()
                ->executeQuery("select idoperacion from mod_logistica.dat_documento where iddocumento = {$iddocumento}")
                ->fetchAll(PDO::FETCH_ASSOC);
            if ($documentOperation == $operationId[0]['idoperacion']) {
                return $discount;
            }
        }
        return $discount;
    }

    /**
     * @param $idDocumento
     * @param null $signo
     * @return int|mixed
     */
    public function importeTotalDocumentoAlternativo($idDocumento, $signo = null)
    {
        $strWhere = '';
        if (!is_null($signo)) {
            $strWhere .= " AND m.signo = '{$signo}'";
        }
        $importe = $this->doctrineHelper->query(
            "SELECT SUM(round(m.importealternativo,{$this->fRedondeo6})) as importe FROM DatMovimientos m WHERE m.iddocumento = {$idDocumento} {$strWhere}"
        )->getFirst()->toArray();
        $sobrante = $this->importesDiferencias($idDocumento, 0);
        $faltante = $this->importesDiferencias($idDocumento, 1);
        return $importe['importe'] - (count($sobrante) > 0 ? $sobrante[0]['sobrantealt'] : 0) + (count($faltante) > 0 ? $faltante[0]['faltantealt'] : 0);
    }

    /**
     * @param $idDocumento
     * @param string $campo
     * @return mixed
     */
    public function importePrecioPromedio($idDocumento, $campo = 'preciocontable')
    {
        $dataQuery = Doctrine_Query::create()
            ->select("SUM(round(dm.{$campo} * dm.cantidad,{$this->fRedondeo6})) as importe")
            ->from('DatMovimientos dm')
            ->innerjoin('dm.DatProductoLogistica dp')
            ->where('dm.iddocumento = ? ', $idDocumento)
            ->fetchArray();

        return $dataQuery[0]['importe'];
    }

    /**
     * @param $idDocumento
     * @param null $signo
     * @return int|mixed
     */
    public function importeParcialDocumento($idDocumento, $signo = null)
    {
        $recep = Doctrine::getTable('DatRecepcion')->find($idDocumento);
        $salidaFactura = false;
        $restar = 0;
        if ($recep && $recep->salidafactura == 1) {
            $salidaFactura = true;
            $conceptos = array('valor' => 0);
        } else {
            $conceptos = $this->doctrineHelper->query(
                "SELECT COALESCE(SUM(round(coalesce (dcir.valorcalculomn,dcir.valormn),{$this->fRedondeo6})),0) as valor FROM DatConceptoimporterecep dcir WHERE dcir.iddocumento = {$idDocumento}"
            )->getFirst()->toArray();
        }
        /*$strWhere = '';
        if (!is_null($signo)) {
            $strWhere .= " AND m.signo = '{$signo}'";
        }
        $importe = $this->importeTotalDocumento($idDocumento);$this->doctrineHelper->query(
            "SELECT SUM(round(m.importecontable,{$this->fRedondeo6})) as importe FROM DatMovimientos m WHERE m.iddocumento = {$idDocumento} {$strWhere}"
        )->getFirst()->toArray();
        $importe = ($importe['importe'] > 0) ? $importe['importe'] - $conceptos['valor'] : 0;
        $sobrante = $this->importesDiferencias($idDocumento, 0);
        $faltante = $this->importesDiferencias($idDocumento, 1);*/
        return ($this->importeTotalDocumento($idDocumento) > 0) ? $this->importeTotalDocumento($idDocumento) - $conceptos['valor'] : 0;
        //return $importe - (count($sobrante) > 0 ? $sobrante[0]['sobrante'] : 0) + (count($faltante) > 0 ? $faltante[0]['faltante'] : 0);
    }

    /**
     * @param $idDocumento
     * @param null $signo
     * @return int|mixed
     */
    public function importeParcialDocumentoAlternativo($idDocumento, $signo = null)
    {
        $conceptos = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(round(dcir.valoralt,{$this->fRedondeo6})),0) as valor FROM DatConceptoimporterecep dcir WHERE dcir.iddocumento = {$idDocumento}"
        )->getFirst()->toArray();
        /*$importe = $this->importeTotalDocumentoAlternativo($idDocumento);
        $strWhere = '';
        if (!is_null($signo)) {
            $strWhere .= " AND m.signo = '{$signo}'";
        }
        $importe = $this->doctrineHelper->query(
            "SELECT SUM(round(m.importealternativo,{$this->fRedondeo6})) as importe FROM DatMovimientos m WHERE m.iddocumento = {$idDocumento} {$strWhere}"
        )->getFirst()->toArray();
        $sobrante = $this->importesDiferencias($idDocumento, 0);
        $faltante = $this->importesDiferencias($idDocumento, 1);*/
        return ($this->importeTotalDocumentoAlternativo($idDocumento) > 0) ? $this->importeTotalDocumentoAlternativo($idDocumento) - $conceptos['valor'] : 0;
        //return $importe - (count($sobrante) > 0 ? $sobrante[0]['sobrantealt'] : 0) + (count($faltante) > 0 ? $faltante[0]['faltantealt'] : 0);
    }

    /**
     * @param $idDocumento
     * @param null $signo
     * @return double
     */
    public function importeTotalDocumentoAmbasMonedas($idDocumento, $signo = null)
    {
        $strWhere = '';
        /* if (!is_null($signo)) {
          $strWhere .= " AND m.signo = '{$signo}'";
          } */
        $importe = $this->doctrineHelper->query(
            "SELECT SUM(round(coalesce(m.importealternativo,0),{$this->fRedondeo6}) + round(coalesce(m.importecontable,0),{$this->fRedondeo6})) as importe FROM DatMovimientos m WHERE m.iddocumento = {$idDocumento} {$strWhere}"
        )->getFirst()->toArray();
        $sobrante = $this->importesDiferencias($idDocumento, 0);
        $faltante = $this->importesDiferencias($idDocumento, 1);
        return $importe['importe'] - (count($sobrante) > 0 ? $sobrante[0]['sobrantealt'] : 0) + (count($faltante) > 0 ? $faltante[0]['faltantealt'] : 0) - (count($sobrante) > 0 ? $sobrante[0]['sobrante'] : 0) + (count($faltante) > 0 ? $faltante[0]['faltante'] : 0);
    }

    /**
     * @param $comprobante
     * @return mixed
     */
    public function buildComprobante($comprobante)
    {
        $cacheCuenta = array();
        foreach ($comprobante->dataComprobante as &$pase) {
            if (!$cacheCuenta[$pase->idcuenta]) {
                $cacheCuenta[$pase->idcuenta] = $this->buscarCuentaPorId($pase->idcuenta);
            }
            if ($cacheCuenta[$pase->idcuenta]) {
                $pase->concatcta = $cacheCuenta[$pase->idcuenta]->concatcta;
                $pase->importe = abs($pase->importe);
                $pase->importemb = abs($pase->importemb);
                $pase->importemo = abs($pase->importemo);
            }
        }
        return $comprobante;
    }

    /**
     * @param $filtro
     * @return array
     * @throws LogisticaException
     */
    public function cargarDocContabilizados($filtro)
    {
        $documento = new DocumentoLogisticaModel(array('noexception' => true));
        $result = $this->documentosHelper->devuelveArrIddocByIdEstructura(
            array('recepcionLog', 'valedev', 'valeLog', 'transferenciaLog', 'ajusteLog', 'revaluacionLog', 'cambioccontableLog'),
            $this->global->Estructura->idestructura
        );
        foreach ($result[1] as $valor) {
            $arriddoc[] = $valor['iddoc'];
        }
        $estado = array(EstadoDocumentoModel::ESTADO_CONTABILIZADO, EstadoDocumentoModel::ESTADO_CANCELADO);
        if ($filtro['estado']) {
            $estado = array($filtro['estado']);
        }
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj(
            $this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_INV
        );
        $filtro['hasta'] = $fecha->fecha;
        return $documento->devolverDocumentoContabilizados($arriddoc, $filtro, $estado);
    }

    /**
     * @return array
     */
    public function devolverTipoDoc()
    {
        $datos = $this->documentosHelper->devuelveArrIddocByIdEstructura(
            array('recepcionLog', 'valedev', 'valeLog', 'transferenciaLog', 'ajusteLog', 'facturaLog', 'cambioccontableLog', 'debitoLog', 'creditoLog'),
            $this->global->Estructura->idestructura
        );
        $datosRes = array();
        foreach ($datos[1] as $doc) {
            array_push($datosRes, $doc);
        }
        return array(
            'datos' => $datosRes
        );
    }

    /**
     * @param $pases
     * @return array
     */
    public function unificarPases($pases)
    {
        $this->objectHelper->unsetNullValues($pases);
        foreach ($pases as $pos => $objPase) {
            if (
                is_null($objPase->idcuenta) || is_null($objPase->importe) || is_null($objPase->idmoneda) ||
                $objPase->importe == 0
            ) {
                unset($pases[$pos]);
            } else {
                $valor = (($objPase->importe * $objPase->porciento) / 100);
                if ($objPase->porciento == 250) {
                    $valor = (($objPase->importe * 50) / 100);
                    $valueR = explode('.', $valor);
                    $valor = (strlen($valueR[1]) == 3) ? LogisticaObjectHelper::__init()->truncateFloat($valor, LogisticaGlobal::FACTOR_REDONDEO) : $valor;
                }
                $objPase->importemb = $objPase->importemo = $objPase->importe = LogisticaObjectHelper::__init()->_round($valor, LogisticaGlobal::FACTOR_REDONDEO);
//                $valida = $this->validarCuenta($objPase->idcuenta);
//                if (!$valida) {
//                    unset($pases[$pos]);
//                }else{
//                    $objPase->concatcta = $valida['concatcta'];
//                }

                if ($objPase->idcuenta) {
                    $cuenta = $this->buscarCuentaPorId($objPase->idcuenta);
                    $objPase->concatcta = $cuenta->concatcta;
                    if ($cuenta->activo == 0) {
                        unset($pases[$pos]);
                    }
                } else {
                    unset($pases[$pos]);
                }
            }
        }
        return array_values($pases);
    }

    private function validarCuenta($idCuenta)
    {
        $sqlCuenta = "select idcuenta , concatcta, activo from mod_contabilidad.nom_cuenta nc where idcuenta = {$idCuenta}";
        $datosCuenta = $this->doctrineHelper->getConnection()->execute($sqlCuenta)->fetchAll(PDO::FETCH_ASSOC);
        return $datosCuenta[0]['activo'] == 1 ? $datosCuenta[0] : false;
    }

    /**
     * @param $datosDocumentos
     * @return bool
     * @throws Doctrine_Query_Exception
     */
    public function actualizarDocumentosContabilizados($datosDocumentos)
    {
        if (count($datosDocumentos['iddocumento']) > 0) {
            Doctrine_Query::create()
                ->update('DatDocumento')
                ->set('idcomprobante', $datosDocumentos['idComprobante'])
                ->where('idcomprobante is null')
                ->andWhereIn('iddocumento', $datosDocumentos['iddocumento'])
                ->execute();
            /*$estado = LogisticaComprobanteModel::ESTADO_CD;
            LogisticaDoctrineHelper::__init()
                ->executeQuery("update mod_contabilidad.dat_comprobante 
                                        set idestadocomprobante = {$estado} where idcomprobante = {$datosDocumentos['idComprobante']}");*/
            if (count($datosDocumentos['anticipos'])) {
                foreach ($datosDocumentos['anticipos'] as $anticipo) {
                    $salvar = $this->doctrineHelper->getConnection()->fetchAll(
                        "INSERT INTO mod_logistica.dat_documentoanticipo(iddocumento, idanticipo, importe)
                        VALUES ({$datosDocumentos['iddocumento'][0]}, {$anticipo['idanticipo']}, {$anticipo['importe']})"
                    );
                }
            }
        }
        return true;
    }

    /**
     * @param $paseInicial
     * @param $paseFinal
     * @return bool
     */
    public function tryUnificarPases($paseInicial, $paseFinal)
    {
        if (
            $paseInicial->idoperacioncontable == $paseFinal->idoperacioncontable &&
            $paseInicial->debitoCredito == $paseFinal->debitoCredito &&
            $paseInicial->idcuenta == $paseFinal->idcuenta
        ) {
            $paseInicial->importe += $paseFinal->importe;
            $paseInicial->importemb += $paseFinal->importemb;
            $paseInicial->importemo += $paseFinal->importemo;
            return true;
        }
        return false;
    }

    /**
     * @return array
     */
    private function initCache()
    {
        return array(
            'operaciones' => array(),
            'clientes' => array(),
            'idCuentas' => array(),
            'concatCuentas' => array(),
        );
    }

    /**
     * @param $idSubsistema
     */
    public function setSubsistema($idSubsistema)
    {
        $this->subsistema = $idSubsistema;
    }

    /**
     * @param $idDocumento
     * @param $pase
     * @param string $cuenta
     * @return array
     */
    public function getImporteAnteriorRevaluacion($idDocumento, $pase, $cuenta = 'idcuenta')
    {
        $pases = array();
        $sql = "select dcc.{$cuenta} as idcuenta,sum(round(dm.importetotalalt,{$this->fRedondeo6})) as importe
                from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_producto dp on dm.idproducto = dp.idproducto
                inner join mod_logistica.nom_clasificacioncontable dcc on dcc.idclasificacioncontable = coalesce(dm.idclasificacion, dp.idclasificacioncontable)
                inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
                where idmovimiento in (
                    select	(
                        select mm.idmovimiento from mod_logistica.dat_movimiento mm
                            where mm.idproducto = m.idproducto and mm.cronologia > 0
                            and mm.cronologia < m.cronologia and mm.signo <> 'N'
                            order by mm.cronologia desc limit 1
                        )
                    from mod_logistica.dat_movimiento m where m.iddocumento = {$idDocumento}
                )
                group by dcc.{$cuenta}
                having sum(round(dm.importetotalalt,{$this->fRedondeo6})) > 0";
        $dataQuery = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $moneda = null;
        if ($cuenta != 'idcuenta') {
            $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        }
        foreach ($dataQuery as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            if (!is_null($moneda)) {
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
            }
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    /**
     * @param $idcuenta
     * @param $idParteFormato
     * @param $idNomenclador
     * @return mixed
     */
    protected function getCuentaAperturaNivel($idcuenta, $idParteFormato, $idNomenclador)
    {
        $sql = "SELECT ncg.codigocentrogrupo, ncg.concat
                FROM  mod_contabilidadcosto.nom_centrocosto ncg where ncg.idcentrogrupo = {$idNomenclador}";
        $dataCC = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $cuenta = $this->buscarCuentaPorId($idcuenta);
        $concate = $cuenta->concatcta . '.' . $dataCC[0]['concat'];
        $cuentaE = $this->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
        $idCuentaRes = $cuentaE->idcuenta;
        return ($idCuentaRes != null) ? $idCuentaRes : $idcuenta;
    }

    /**
     * @param $idDocumento
     * @param string $campo
     * @param bool $elemento
     * @return array
     */
    private function getValorElementosGasto($idDocumento, $campo = 'importecontable', $elemento = true)
    {
        $campoElem = $campo == 'importecontable' ? 'idelementogasto' : 'idelementogastoalt';
        if ($campo == 'ambos') {
            $campo = 'm.importecontable + m.importealternativo';
        } else {
            $campo = "m.{$campo}";
        }
        $sql = "SELECT DISTINCT SUM(round({$campo},{$this->fRedondeo6})) as importe";
        if ($elemento) {
            $sql .= ", coalesce(m.{$campoElem},p.{$campoElem},i.{$campoElem}) as idelemento";
        }
        $sql .= " FROM mod_logistica.dat_movimiento m "
            . " INNER JOIN mod_logistica.dat_producto p ON p.idproducto = m.idproducto"
            . " INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = p.idindicador"
            . " WHERE iddocumento = {$idDocumento}";
        if ($elemento) {
            $sql .= " GROUP BY idelemento"; //i.{$campoElem}, p.{$campoElem},m.{$campoElem}
        }
        return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * @param $idDocumento
     * @param bool $contable
     * @return mixed
     */
    private function buscarCuentaCentroVale($idDocumento, $contable = true)
    {
        $campo = $contable == true ? 'idcuenta' : 'idcuentaalternativa';
        $cuenta = Doctrine_Query::create()->select("$campo as idcuenta")
            ->from('DatEntrega')->where('iddocumento = ?', array($idDocumento))->fetchArray();
        return $cuenta[0]['idcuenta'];
    }

    /**
     * @return array
     */
    private function obtenerEstructurasEconomicas()
    {
        $sql = "select e.idestructuracomun,e.codigo,e.descripcion from mod_contabilidad.dat_estructurae e";
        return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * @param $idCuenta
     * @param $idEntidad
     * @param bool $invertir
     * @return mixed
     */
    public function buscarCuentaEstructuraE($idCuenta, $idEntidad, $invertir = false)
    {
        $apertOriDest = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'APERT_ORIGEN_DESTINO' and nv.valor = 'true'";
        $activaOD = LogisticaDoctrineHelper::__init()->getConnection()->execute($apertOriDest)->fetchAll(PDO::FETCH_COLUMN);
        $dataEstructura = array();
        if ($activaOD[0] > 0) {
            foreach ($this->dataEstructuraE as $estructuraE) {
                if ($estructuraE['idestructuracomun'] == $idEntidad) {
                    $dataEstructura = $estructuraE;
                }
                if ($estructuraE['idestructuracomun'] == $this->global->Estructura->idestructura) {
                    $dataEstructuraLocal = $estructuraE;
                }
            }
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idCuenta);
            $concate = $cuenta->concatcta . '.' . $dataEstructuraLocal['codigo'] . '' . $dataEstructura['codigo'];
            if ($invertir) {
                $concate = $cuenta->concatcta . '.' . $dataEstructura['codigo'] . '' . $dataEstructuraLocal['codigo'];
            }

            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            return $cuentaE;
        } else {
            foreach ($this->dataEstructuraE as $estructuraE) {
                if ($estructuraE['idestructuracomun'] == $idEntidad) {
                    $dataEstructura = $estructuraE;
                    break;
                }
            }
            $cuenta = $this->buscarCuentaPorId($idCuenta);
            $concate = $cuenta->concatcta . '.' . $dataEstructura['codigo'];
            $cuentaE = $this->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            return $cuentaE;
        }
    }

    /**
     * @param $idElemento
     * @return array
     */
    public function getElementosByIdElemento($idElemento)
    {
        $sql = "select idelementoobjeto, concat
                from mod_contabilidadcosto.nom_elementogasto
                where idelementoobjeto = {$idElemento}";
        return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * @param $idDocumento
     * @param $pase
     * @param $tipo
     * @return array
     */
    private function pasesCambioClasificacion($idDocumento, $pase, $tipo)
    {
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        $pases = array();
        $campoCuenta = $tipo == 1 ? 'idcalisficacioanterior' : 'idclasificacioncontable';
        $sqlContable = "SELECT ncc.idcuenta as idcuenta,sum(round(dm.importe, {$this->fRedondeo6})) as importe, {$moneda->idmoneda} as idmoneda, '{$moneda->codigoiso}' as moneda "
            . "FROM mod_logistica.dat_movcambioccontable dm "
            . "INNER JOIN mod_logistica.nom_clasificacioncontable ncc ON ncc.idclasificacioncontable = dm.{$campoCuenta} "
            . "WHERE dm.iddocumento = {$idDocumento} GROUP BY ncc.idcuenta HAVING sum(round(dm.importe, {$this->fRedondeo6})) > 0";
        $sqlAlternativa = "SELECT ncc.idcuentaalt as idcuenta,sum(round(dm.importealt, {$this->fRedondeo6})) as importe, {$moneda->idmonedaalternativa} as idmoneda, '{$moneda->codigoisoalt}' as moneda "
            . "FROM mod_logistica.dat_movcambioccontable dm "
            . "INNER JOIN mod_logistica.nom_clasificacioncontable ncc ON ncc.idclasificacioncontable = dm.{$campoCuenta} "
            . "WHERE dm.iddocumento = {$idDocumento} GROUP BY ncc.idcuentaalt HAVING sum(round(dm.importealt, {$this->fRedondeo6})) > 0";
        if ($moneda->idmonedaalternativa)
            $sqlContable .= " UNION " . $sqlAlternativa;
        $dataQuery = $this->doctrineHelper->getConnection()->execute($sqlContable)->fetchAll(PDO::FETCH_ASSOC);
        foreach ($dataQuery as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $this->objectHelper->synchronize($objPase, $value);
            $this->completarPase($objPase, $pase, $idDocumento, false);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    /**
     * @param $idDocumento
     * @return array
     */
    public function importeMonedaExtranjera($idDocumento)
    {
        $sql = "select dr.idmoneda, round(sum(round(dm.importealternativo,2)/dr.tasa),2) as importe
                from mod_logistica.dat_documento dd 
                inner join mod_loginventario.dat_recepcion dr on dr.iddocumento = dd.iddocumento
                inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
                where dd.iddocumento = {$idDocumento} group by dr.idmoneda";
        return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * @param $idDocumento
     * @param int $faltante
     * @return array
     */
    public function importesDiferencias($idDocumento, $faltante = 1)
    {
        $sqlExiste = "SELECT  count(cf.idestructuracomun) as existe  
            FROM mod_loginventario.conf_inventario cf where cf.idestructuracomun = {$this->global->Estructura->idestructura} and cf.registrarcantidad = 1";

        $sql = $faltante == 1 ? "select sum(round((mr.cantidad - m.cantidad )*  m.preciocontable,2)) as faltante ,
                    sum(round((mr.cantidad - m.cantidad )* m.precioalternativo,2)) as faltantealt
                    from mod_logistica.dat_movimiento m
                    inner join mod_loginventario.dat_movrecepcion mr on mr.idmovimiento = m.idmovimiento                
                    where m.iddocumento = {$idDocumento} and mr.cantidad > m.cantidad" :
            "select sum(round((m.cantidad - mr.cantidad)*  m.preciocontable,2)) as sobrante ,
                    sum(round((m.cantidad - mr.cantidad )* m.precioalternativo,2)) as sobrantealt
                    from mod_logistica.dat_movimiento m
                    inner join mod_loginventario.dat_movrecepcion mr on mr.idmovimiento = m.idmovimiento                
                    where m.iddocumento = {$idDocumento} and mr.cantidad < m.cantidad";

        if ($this->doctrineHelper->getConnection()->execute($sqlExiste)->fetchAll(PDO::FETCH_ASSOC)[0]['existe'] > 0) {
            return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return array(
                'sobrante' => 0, 'faltante' => 0, 'sobrantealt' => 0, 'faltantealt' => 0,
            );
        }
    }

    /**
     * @param $idDocumento
     * @param $pase
     * @param $signo
     * @param bool $alternativo
     * @return array
     */
    public function pasesConceptoPrecio($idDocumento, $pase, $signo, $alternativo = false, $total = false)
    {
        $pases = array();
        $aux = array();
        $sumaTotal = 0;
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        $idmoneda = ($alternativo) ? $moneda->idmonedaalternativa : $moneda->idmoneda;
        $conceptos = Doctrine_Query::create()
            ->select("dcir.idconceptorecep, "
                . "COALESCE(ROUND(coalesce(dcir.valorcalculomn,dcir.valormn),{$this->fRedondeo6}),0) as valormn,COALESCE(dcir.valoralt,0) as valoralt, dcir.idcondicionpago as idcondicionpago, dcir.idproveedor")
            ->from('DatConceptoimporterecep dcir')
            ->innerJoin('dcir.NomCategoriaprecio nci')
            ->where(
                "dcir.iddocumento = ? and nci.concepto = '{$signo}'",
                array($idDocumento)
            )
            ->fetchArray();
        foreach ($conceptos as $concp) {
            if (!$concp['idproveedor']) {
                $queryDocCliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($idDocumento));
                $concp['idproveedor'] = $queryDocCliente[0]['idcliente'];
                $concp['idcondicionpago'] = $queryDocCliente[0]['idcondicionpago'];
            }
            $prov = $this->configuracionHelper->getClientesProveedorByParams(
                $concp['idproveedor'],
                null,
                null,
                null,
                null,
                null
            );
            $idcuenta = false;
            foreach ($prov['datos'][0]['cobrospagos'] as $pos => $cuenta) {
                if (
                    $cuenta['idmoneda'] == $idmoneda && $cuenta['idclasificacion'] == 2 && $concp['idcondicionpago'] == $cuenta['idterminodepago']
                ) {
                    $idcuenta = $cuenta['idcuenta'];
                    break;
                }
            }
            $aux[$idcuenta]['importe'] += ($alternativo) ? $concp['valoralt'] : $concp['valormn'];
            $aux[$idcuenta]['idcuenta'] = $idcuenta;
            $sumaTotal += ($alternativo) ? $concp['valoralt'] : $concp['valormn'];
        }
        if ($total) {
            return $sumaTotal;
        }
        foreach ($aux as $id => $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase);
            if ($alternativo) {
                $objPase->idmoneda = $idmoneda;
                $objPase->moneda = $moneda->codigoisoalt;
            }
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    /**
     * @param $idDocumento
     * @param $subsistema
     * @return bool
     * @throws Doctrine_Query_Exception
     */
    public function anularDocumento($idDocumento, $subsistema)
    {
        if (count($idDocumento) > 0) {
            Doctrine_Query::create()
                ->update('DatDocumento')
                ->set('idcomprobante', -1)
                ->where('idcomprobante is null')
                ->andWhereIn('iddocumento', $idDocumento)
                ->execute();
        }
        return true;
    }

    /**
     * @param $idCuenta
     * @return mixed
     */
    public function buscarCuentaPorId($idCuenta)
    {
        if (!array_key_exists($idCuenta, $this->cache['idCuentas'])) {
            $this->cache['idCuentas'][$idCuenta] = $this->contabilidadHelper->obtenerCuentaPorId($idCuenta);
        }
        return $this->cache['idCuentas'][$idCuenta];
    }

    /**
     * @param $idestructura
     * @param $concate
     * @return mixed
     */
    public function obtenerCuentaPorConcat($idestructura, $concate)
    {
        if (!array_key_exists($concate, $this->cache['concatCuentas'])) {
            $this->cache['concatCuentas'][$concate] = $this->contabilidadHelper->obtenerCuentaPorConcat($idestructura, $concate);
        }
        return $this->cache['concatCuentas'][$concate];
    }

    public function getDetallesOperacion($idDocumento)
    {
        $sqlDetalle = "select upper(ndp.denominacion || ' NO: '|| coalesce(coalesce (dv.nrofactura,cast(ddf.nrofactura as varchar)), cast(dd.nrodoc as varchar)) ||' FECHA: '|| coalesce(ord.fechacierre, dd.fechacontable) ||' OPERACION: '|| nop.denominacion
        ||
               coalesce(
                   case when des.idsubsistema = 10 then (' ALMACEN: ' || valm.denominacion)
                   when des.idsubsistema = 11 then (' AREA RESP:' || valm.denominacion)
                   when des.idsubsistema = 13 and valmf.idestructura is not null then (' ALMACEN: ' || valmf.denominacion)   end
            , '')
        || ' DETALLE: '|| coalesce(dd.observaciones,'')) as detalle
        from mod_logistica.dat_documento dd
        join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
        join mod_datosmaestros.nom_docprim ndp on ddp.iddocumentos = ndp.iddocumentos
        join mod_datosmaestros.nom_operacion nop on dd.idoperacion = nop.idnomoperaciones
        join mod_datosmaestros.dat_estructurasubsist des on ddp.idestructurasubsist = des.idestructurasubsist
        join mod_estructuracomp.v_dametodasestructuras valm on valm.idestructura = dd.idestructuracomun
        left join mod_logfacturacion.dat_docfactura ddf on dd.iddocumento = ddf.idfactura
        left join mod_logtaller.dat_ordentrabajo ord on ord.idordentrabajo = dd.iddocumento
        left join mod_logpuntoventa.dat_ventas dv on dd.iddocumento = dv.idventas
        left join mod_estructuracomp.v_dametodasestructuras valmf on valmf.idestructura = ddf.iddeposito
        where dd.iddocumento = {$idDocumento}";
        $detail = $this->doctrineHelper->executeQuery($sqlDetalle)->fetchAll(PDO::FETCH_ASSOC);
        return $detail[0]['detalle'];
    }

    public function getAnticiposByIdcliente($iddocumento)
    {
        $anticiposId = [];
        $anticipos = [];
        $importe = 0;
        foreach ($iddocumento as $id) {
            $tipo = -1;
            $doc = Doctrine::getTable('DatDocumento')->find($id);
            if ($this->tipoDocFac->iddoc and $this->tipoDocFac->iddoc == $doc->iddoc) {
                $tipo = 1;
                $facturaService = new FacturacionService();
                $importeArray = $facturaService->getImportesFactura($id, 1);
                $importe += $importeArray['importecontable'];
            } else if ($this->tipoDocRecep->iddoc and $this->tipoDocRecep->iddoc == $doc->iddoc) {
                $tipo = 2;
                $importe += $this->importeParcialDocumento($id);
            }
            $docCliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ? and tipocliente = 1', array($id));
            if (count($docCliente)) {
                $anticiposCl = $this->contabilidadHelper->anticiposPendientesByClienteProveedor(
                    $this->global->Estructura->idestructura,
                    $docCliente[0]['idcliente'],
                    $tipo
                );
                foreach ($anticiposCl as $ant) {
                    if (!in_array($ant['idanticipo'], $anticiposId)) {
                        array_push($anticiposId, $ant['idanticipo']);
                        array_push($anticipos, $ant);
                    }
                }
            }
        }
        return array('datos' => $anticipos, 'importeTotal' => $importe);
    }

    public function insertDocumentoContabilidad($parametros)
    {
        if ($parametros['idComprobante'] != '') {
            $parametros['subsistema'] = ($parametros['subsistema']) ? $parametros['subsistema'] : LogisticaGlobal::SUBSISTEMA_INV;
            /* $sqlDeposito = "select (case when f.iddeposito is not null then f.iddeposito else d.idestructuracomun end) as iddeposito
                            from mod_logistica.dat_documento d
                            left join mod_logfacturacion.dat_docfactura f on f.idfactura = d.iddocumento
                            WHERE d.iddocumento = {$id}"; */
            $sqlInsert = "INSERT INTO mod_contabilidad.dat_comprobante_documento(idsubsistema, iddocumento, idcomprobante)
                                 VALUES";
            foreach ($parametros['iddocumento'] as $index => $id) {
                $sqlInsert .= " ({$parametros['subsistema']}, {$id}, {$parametros['idComprobante']})";
                if ($index + 1 < count($parametros['iddocumento'])) {
                    $sqlInsert .= ',';
                }
            }
            $this->doctrineHelper->getConnection()->fetchAll($sqlInsert);
        }
        return true;
    }
}
