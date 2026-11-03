<?php

/**
 * Clase que gestiona la generacion de derechos de cobro y obligaciones de pago desde los subsistemas de logistica
 *
 * @package utiles
 * @author  Kenier Cumba Bueno
 */
class LogisticaObligacionesCPModel extends BaseModel
{

    private $idDocsObligaciones, $aliasIddocs, $documentoModel, $aftComprobanteModel, $iddocNC, $iddocCompDev, $iddocCompVenta;

    public function __construct($aftComprobanteModel = null)
    {
        parent::__construct();
        $this->aliasIddocs = array(
            'recepcionLog' => LogisticaGlobal::SUBSISTEMA_INV,
            'facturaLog' => LogisticaGlobal::SUBSISTEMA_FAC,
            'debitoLog' => LogisticaGlobal::SUBSISTEMA_FAC,
            'creditoLog' => LogisticaGlobal::SUBSISTEMA_FAC,
            'compventaLog' => LogisticaGlobal::SUBSISTEMA_FAC,
            'compdevLog' => LogisticaGlobal::SUBSISTEMA_FAC,
            'MMAFT' => LogisticaGlobal::SUBSISTEMA_AFT,
            'cuhe' => LogisticaGlobal::SUBSISTEMA_AFT,
        );
        $this->idDocsObligaciones = array();
        $this->initIdDocsObligaciones();
        $this->documentoModel = new DocumentoLogisticaModel(array('noexception' => true));
        $this->aftComprobanteModel = $aftComprobanteModel;
        $this->iddocNC = $this->documentosHelper->devuelveIddocByIdEstructura(
            'creditoLog',
            $this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->iddocCompDev = $this->documentosHelper->devuelveIddocByIdEstructura(
            'compdevLog',
            $this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_FAC
        );

        $this->iddocCompVenta = $this->documentosHelper->devuelveIddocByIdEstructura(
            'compventaLog',
            $this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_FAC
        );
    }

    public function generarObligaciones($datosDocumentos)
    {
        $datosDocumentos['iddoc'] = $this->idDocsObligaciones;
        if (is_null($datosDocumentos['subsistema'])) {
            $datosDocumentos['subsistema'] = LogisticaGlobal::SUBSISTEMA_INV;
            $this->documentoModel->setIdSubsistema($datosDocumentos['subsistema']);
        }
        LogisticaObjectHelper::__init()->unsetArrayValues(
            $datosDocumentos,
            array('start', 'limit', 'action', 'id' /*, 'idComprobante', 'subsistema'*/)
        );
        if (LogisticaGlobal::SUBSISTEMA_INV == $datosDocumentos['subsistema'] || LogisticaGlobal::SUBSISTEMA_FAC == $datosDocumentos['subsistema']) {
            $datosDocumentos['estado'] = array(EstadoDocumentoModel::ESTADO_CANCELADO, EstadoDocumentoModel::ESTADO_CONTABILIZADO);
        } else {
            $datosDocumentos['estado'] = array(EstadoDocumentoModel::ESTADO_APROBADO);
        }
        /*$fecha = $this->configuracionHelper->getFechaContableSubsistemaObj(
            $this->global->Estructura->idestructura, $datosDocumentos['subsistema']
        );
        $datosDocumentos['hasta'] = $fecha->fecha;*/

        $idejercicio = $this->configuracionHelper
            ->getEjercicioActualSubsistema($this->global->Estructura->idestructura, $datosDocumentos['subsistema']);
        $fecha = $this->configuracionHelper->obtenerEjercicio($idejercicio);
        $datosDocumentos['hasta'] = $fecha[0]->fin;
        $datosDocumentos['generaobligaciones'] = 1;
        $datos = $this->documentoModel->devolverDocumentos($datosDocumentos)->fetchArray();
        $periodo = $this->configuracionHelper->getPeriodoActualSubsistema(
            $this->global->Estructura->idestructura,
            $datosDocumentos['subsistema']
        );
        $monedaContable = LogisticaGlobal::__init()->getMonedaEntidad();
        $idmoneda = $this->configuracionHelper->buscarIdMonedaEntidad(
            $monedaContable->idmoneda,
            $this->global->Estructura->idestructura
        );
        $tasaObj = $this->configuracionHelper->BuscarTasaActual($idmoneda);
        $facturaService = new FacturacionService();
        $obligaciones = array();
        $obligacionesNC = array();
        $conn = Doctrine_Manager::connection();
        foreach ($datos as $documento) {
            $finaciamientoOption = false;
            $nroDocFin = null;
            if ((new VariablesGlobalesModel())->obtenerValor('isNovaBank') == 1) {
                /** TODO Crear la obligacion en la entidad de arriba para fideicomiso */
                $iddocumento = $documento['iddocumento'];
                $documentOperation = (new VariablesGlobalesModel())->obtenerValor('novaBankFinancialOperationId');
                $operationId = LogisticaDoctrineHelper::__init()
                    ->executeQuery("select idoperacion from mod_logistica.dat_documento where iddocumento = {$iddocumento}")
                    ->fetchAll(PDO::FETCH_ASSOC);
                if ($documentOperation == $operationId[0]['idoperacion']) {
                    $this->generarObligacionFinanciamiento($iddocumento);
                    $nroDocFin = $this->getInvoiceNumber($iddocumento);
                }
            }
            if (
                $datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_FAC &&
                $facturaService->getOperacionObligaciones($documento['idoperacion']) == -1
            ) {
                continue;
            }
            if ($datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_AFT) {
                $mComunAFT = ComunAFTModel::getInstance();
                $tipoDocumento = $mComunAFT->getDatosInterfazByIdOperacion($documento['idoperacion']);
                if ($tipoDocumento['codigo'] != 'OPER_COMPRA' && $tipoDocumento['codigo'] != 'OPER_COMPRA_UH') {
                    continue;
                }
            }
            if ($documento['estado'] == EstadoDocumentoModel::ESTADO_CANCELADO) {
                if ($this->iddocNC->iddoc && $this->iddocNC->iddoc == $documento['iddoc']) {
                    ServiciosContabilidadFinanzasHelper::__init()->cancelarLiquidacionNC($datosDocumentos, $documento);
                } else {
                    $arrayData = array(
                        'iddocumento' => $documento['iddocumento'],
                        'idcomprobante' => $datosDocumentos['idComprobante'],
                        'numerocomprobante' => $datosDocumentos['numComprobante'],
                        'fechacomprobante' => $datosDocumentos['fechaComprobante'],
                    );
                    $this->contabilidadHelper->cancelarDuoContabilizadoExterno($arrayData);
                }
            } else {
                $stdPase = new stdClass();
                $stdPase->tipo = $datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_FAC ? 1 : 2;
                if ($this->iddocNC->iddoc && $documento['iddoc'] == $this->iddocNC->iddoc) {
                    $docOrigen = $this->doctrineHelper->getConnection()->execute(
                        "select ddp.idpadre from mod_logistica.dat_documentopadre ddp where ddp.iddocumento = {$documento['iddocumento']}"
                    )->fetchAll(PDO::FETCH_COLUMN);
                    $stdPase->iddocumentoorigen = $docOrigen[0];
                } else if ($this->iddocCompDev->iddoc && $documento['iddoc'] == $this->iddocCompDev->iddoc) {
                    $docOrigen = $this->doctrineHelper->getConnection()->execute(
                        "select ddp.idventas from mod_logpuntoventa.dat_devolucion ddp where ddp.iddevolucion = {$documento['iddocumento']}"
                    )->fetchAll(PDO::FETCH_COLUMN);
                    $stdPase->iddocumentoorigen = $docOrigen[0];
                }

                $stdPase->iddocumento = $documento['iddocumento'];
                $stdPase->idcomprobante = $datosDocumentos['idComprobante'];
                $stdPase->numcomprobante = $datosDocumentos['numComprobante'];
                $stdPase->fechacomprobante = $datosDocumentos['fechaComprobante'];
                $this->obtenerCondicionPago($documento['iddocumento'], $datosDocumentos['subsistema'], $stdPase);
                $stdPase->numero = !is_null($nroDocFin) ? $nroDocFin : $documento['nrodoc'];
                $stdPase->idsubsistema = $datosDocumentos['subsistema'];
                $stdPase->idperiodo = $periodo;
                $stdPase->fecha = $documento['fechacontable'];
                $stdPase->fechaemision = $documento['fechacontable'];
                if (LogisticaGlobal::SUBSISTEMA_INV == $datosDocumentos['subsistema']) {
                    $dqlResult = Doctrine_Query::create()->from("DatRecepcion t")->select("t.nrodocorigen,t.fechadocorigen")
                        ->where("t.iddocumento = ?", array($documento['iddocumento']))->fetchOne()->toArray();
                    $stdPase->fechaemision = $dqlResult['fechadocorigen'];
                    $stdPase->numero = $dqlResult['nrodocorigen'];
                    $stdPase->tipo = $finaciamientoOption == false ? 2 : 1;
                    $stdPase->comentario = $finaciamientoOption == false ? "Obligación de pago de factura" : "Cobro de comision de financiamiento";
                } elseif (LogisticaGlobal::SUBSISTEMA_AFT == $datosDocumentos['subsistema']) {
                    $stdPase->comentario = "Obligación de pago de factura";
                    $stdPase->numero = $this->aftComprobanteModel->getNumeroFactura($documento['iddocumento']);
                } else {
                    $recdesc = 0;
                    if ($this->iddocCompVenta->iddoc && $documento['iddoc'] == $this->iddocCompVenta->iddoc) {
                        $sql = "select v.nrofactura, v.calculoconcepto, v.conceptoventa from mod_logpuntoventa.dat_ventas v where v.idventas = {$documento['iddocumento']}";
                        $datos = $this->doctrineHelper->getConnection()->fetchAll($sql);
                        $stdPase->numero = $datos[0]['nrofactura'];
                        $stdPase->comentario = "Efectivo pendiente por  acreditar";

                        if ($datos[0]['calculoconcepto'] > 0) {
                            $recdesc = $datos[0]['calculoconcepto'];
                            if ($datos[0]['conceptoventa'] == '-') {
                                $recdesc *= -1;
                            }
                        }

                    } else {
                        $stdPase->numero = !is_null($nroDocFin) ? $nroDocFin : $facturaService->getNumeroFactura($documento['iddocumento']);
                        $stdPase->comentario = "Derecho de cobro de factura";
                        $facAux = Doctrine::getTable('DatDocfactura')->find($documento['iddocumento']);
                        $stdPase->referenciaext = $facAux->nrorden;

                        if ($facAux->calculoconcepto > 0) {
                            $recdesc = $facAux->calculoconcepto;
                            if ($facAux->conceptoventa == '-') {
                                $recdesc *= -1;
                            }
                        }
                    }
                }
                $stdPase->idcliente = $documento['idcliente'];
                $stdPase->tipodocumento = $documento['iddoc'];
                $comprobanteModel = new LogisticaComprobanteModel();
                $comprobanteModel->setSubsistema($datosDocumentos['subsistema']);
                $importe = $datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_AFT ?
                    $this->aftComprobanteModel->importeTotalDocumento($documento['iddocumento']) :
                    $comprobanteModel->importeParcialDocumento($documento['iddocumento']);
                $importeAlt = $datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_AFT ?
                    $this->aftComprobanteModel->importeTotalDocumentoAlternativo($documento['iddocumento']) :
                    $comprobanteModel->importeParcialDocumentoAlternativo($documento['iddocumento']);
                $idmonedaCxC = $monedaContable->idmoneda;
                if ($datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_FAC) {
                    $importes = $facturaService->getImportesFactura($documento['iddocumento']);
                    if ($this->iddocCompDev->iddoc && ($documento['iddoc'] == $this->iddocCompDev->iddoc || $documento['iddoc'] == $this->iddocCompVenta->iddoc)) {
                        $importe = $importes['importecontable'] + $importes['importealternativo'] + $recdesc;
                        $sqlMoneda = "Select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                      on dm.idmovimiento = mm.idmovimiento
                      where dm.iddocumento = {$documento['iddocumento']} limit 1";
                        $arrayMoneda = $conn->execute($sqlMoneda)
                            ->fetchAll(PDO::FETCH_ASSOC);
                        if (!count($arrayMoneda)) {
                            $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
                            where mm.idventas = {$documento['iddocumento']} limit 1";
                            $arrayMoneda = $conn->execute($sqlMoneda)
                                ->fetchAll(PDO::FETCH_ASSOC);
                        }
                        $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
                        $arrayTasa = $conn->execute($sqlTasa)
                            ->fetchAll(PDO::FETCH_ASSOC);
                        $idDocComision = $documento['iddocumento'];
                        $recdescTC = 0;
                        if ($this->iddocCompDev->iddoc && $documento['iddoc'] == $this->iddocCompDev->iddoc) {
                            $idDocComision = $stdPase->iddocumentoorigen;
                            $devolucion = true;

                            $auxVentaTC = Doctrine::getTable('DatVenta')->find($idDocComision);
                            if ($auxVentaTC->valorconcepto > 0) {
                                $recdescTC = $importe * $auxVentaTC->valorconcepto / 100;
                                if ($auxVentaTC->conceptoventa == '-') {
                                    $recdescTC *= -1;
                                }
                            }
                        }
                        $sqlIdOP = "select coalesce(pt.idopcomercio,'') as idopcomercio, pt.comision from mod_logpuntoventa.dat_pedidotienda pt
                        inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda
                        inner join mod_logpuntoventa.dat_ventas dv on dv.idventas = pd.iddocumento and pd.tipo = 4
                        where dv.idventas = {$idDocComision}";
                        $idopcomercioAux = $conn->execute($sqlIdOP)->fetchAll(PDO::FETCH_ASSOC);
                        if (count($idopcomercioAux) && strlen($idopcomercioAux[0]['idopcomercio']) > 1) {
                            $idopcomercio = $idopcomercioAux[0]['idopcomercio'];
                            if (is_numeric($idopcomercioAux[0]['comision'])) {
                                $importe = $importe - ($importe * $idopcomercioAux[0]['comision'] / 100);
                            }
                        }
                        $importe = $importe + $recdescTC;
                        $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
                        if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
                            $idmonedaCxC = $arrayMoneda[0]['idmoneda'];
                            $tasa = $this->configuracionHelper->getTasaByMonedas(
                                $idmonedacontable,
                                $arrayMoneda[0]['idmoneda'],
                                $arrayTasa[0]['idtipotasa']
                            );
                            if (count($tasa)) {
                                $importes['importecontable'] = $importe * $tasa[0]['factordeconversion'];
                            }
                        }
                        $importe = $importes['importecontable'];
                        $importeAlt = 0;
                    } else {
                        if ($facAux->idmonedaprod || $facAux->idmoneda) {
                            $importes['importealternativo'] = $importes['importecontable'];
                            $importes['importecontable'] = 0;
                        }
                        $importe = ($importes['importecontable'] + $recdesc) * (($facAux->factorconvercion) ? $facAux->factorconvercion : 1);
                        $importeAlt = is_null($importes['importealternativo']) ? 0 : $importes['importealternativo'];
                    }
                    if (isset($importes['importeconceptocup']) && $importes['importeconceptocup'] > 0) {
                        $importe += $importes['importeconceptocup'];
                    }
                    if (isset($importes['importenoexterior']) && $importes['importenoexterior'] > 0)
                        $importe = $importes['importenoexterior'];
                }
                $stdPase->importe = $finaciamientoOption == true ? $comprobanteModel->importeTotalDocumentoDiscount($documento['iddocumento']) : $importe;
                if ($datosDocumentos['anticipos'] && $datosDocumentos['anticipos'] != null && $datosDocumentos['anticipos'] != 'null') {
                    $sqlAnticipo = "select COALESCE(sum(c.importe),0) as importe from mod_logistica.dat_documentoanticipo c where c.iddocumento = {$documento['iddocumento']}";
                    $importeAnticipos = $conn->execute($sqlAnticipo)
                        ->fetchAll(PDO::FETCH_ASSOC);
                    if (count($importeAnticipos))
                        $stdPase->importe = $importe - $importeAnticipos[0]['importe'];
                }
                $copyPase = null;
                $pagar = false;
                if (in_array($datosDocumentos['subsistema'], array(LogisticaGlobal::SUBSISTEMA_INV, LogisticaGlobal::SUBSISTEMA_AFT))) {
                    $pagar = $finaciamientoOption == true ? false : true;
                }
                $stdPase->idcuenta = $comprobanteModel->buscarCuentaClienteProveedor(
                    $documento['iddocumento'],
                    $pagar,
                    $idmonedaCxC
                );
                $stdPase->idoperacioncontable = $documento['idoperacion'];
                $this->getPaseOperacion($stdPase, $monedaContable->idmoneda, $tasaObj->idtasa);
                if (isset($idopcomercio) && !isset($devolucion)) {
                    $stdPase->idopcomercio = $idopcomercio;
                }
                if ($stdPase->idcuenta && $stdPase->importe > 0) {
                    if (($this->iddocNC->iddoc && $documento['iddoc'] == $this->iddocNC->iddoc) || ($this->iddocCompDev->iddoc && $documento['iddoc'] == $this->iddocCompDev->iddoc)) {
                        array_push($obligacionesNC, $stdPase);
                    } else {
                        array_push($obligaciones, $stdPase);
                    }
                }
                if ($importeAlt > 0) {
                    /*$idmoneda = $this->configuracionHelper->buscarIdMonedaEntidad(
                        $monedaContable->idmonedaalternativa, $this->global->Estructura->idestructura
                    );*/
                    $idmoneda = ($datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_FAC) ? ($facAux->idmoneda ? $facAux->idmoneda : $facAux->idmonedaprod) : $this->configuracionHelper->buscarIdMonedaEntidad(
                        $monedaContable->idmonedaalternativa,
                        $this->global->Estructura->idestructura
                    );
                    $copyPase = clone $stdPase;
                    $copyPase->importe = $importeAlt;

                    if ($datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_INV) {
                        $datos = $comprobanteModel->importeMonedaExtranjera($documento['iddocumento']);
                        $copyPase->importeOrigen = $datos[0]['importe'];
                        $copyPase->idMonedaOrigen = $datos[0]['idmoneda'];
                    }
                    if ($datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_FAC) {
                        $copyPase->importe = $importeAlt * (($facAux->factorconvercion) ? $facAux->factorconvercion : 1);
                        $copyPase->idcuenta = $comprobanteModel->buscarCuentaClienteProveedor(
                            $documento['iddocumento'],
                            $pagar,
                            $idmoneda
                        );
                        $copyPase->idoperacioncontable = $documento['idoperacion'];
                        $this->getPaseOperacion($copyPase, $monedaContable->idmoneda, $tasaObj->idtasa);
                    } else {
                        $copyPase->idcuenta = $comprobanteModel->buscarCuentaClienteProveedor(
                            $documento['iddocumento'],
                            $pagar,
                            $monedaContable->idmonedaalternativa
                        );
                        $copyPase->idoperacioncontable = $documento['idoperacion'];
                        $this->getPaseOperacion($copyPase, $monedaContable->idmonedaalternativa, $tasaObj->idtasa);
                    }
                    if (!is_null($copyPase) && $copyPase->idcuenta && !is_null($copyPase->importe)) {
                        if (($this->iddocNC->iddoc && $documento['iddoc'] == $this->iddocNC->iddoc) || $this->iddocCompDev->iddoc && $documento['iddoc'] == $this->iddocCompDev->iddoc) {
                            array_push($obligacionesNC, $copyPase);
                        } else {
                            array_push($obligaciones, $copyPase);
                        }
                    }
                }
                if ($datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_INV) {
                    $this->generarObligacionesConceptos(
                        $documento['iddocumento'],
                        $stdPase,
                        $obligaciones,
                        $monedaContable->idmoneda,
                        $monedaContable->idmonedaalternativa,
                        $tasaObj->idtasa
                    );
                }

                $desgloseVenta = (new VariablesGlobalesModel)->obtenerValor('DESGLOSE_VENTA');
                if (
                    $datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_FAC
                    && ($this->iddocCompVenta->iddoc && $documento['iddoc'] == $this->iddocCompVenta->iddoc
                        && ($desgloseVenta && $desgloseVenta == 'true' ?: false))
                ) {
                    $this->obligacionesTPV(
                        $documento['iddocumento'],
                        $stdPase,
                        $obligaciones,
                        null,
                        null,
                        $tasaObj->idtasa
                    );
                }
            }
        }
        if (count($obligaciones)) {
            $this->contabilidadHelper->insertarDerechoObligacionSubsistemaExterno(
                $obligaciones,
                $this->global->Estructura->idestructura,
                $datosDocumentos['subsistema']
            );
        }
        if (count($obligacionesNC)) {
            $this->contabilidadHelper->actualizarDerechoObligacion(
                $obligacionesNC,
                $this->global->Estructura->idestructura
            );
        }
        if (isset($importeAnticipos) && $importeAnticipos[0]['importe'] > 0) {
            $sqlAnticipo = "select c.* from mod_logistica.dat_documentoanticipo c where c.iddocumento = {$documento['iddocumento']}
            and c.importe > 0";
            $anticipos = $conn->execute($sqlAnticipo)
                ->fetchAll(PDO::FETCH_ASSOC);
            $dataLiquidar = array();
            foreach ($anticipos as $a) {
                $data = new stdClass();
                $data->idAnticipo = $a['idanticipo'];
                $data->tipoAnticipo = ($datosDocumentos['subsistema'] == LogisticaGlobal::SUBSISTEMA_INV) ? 2 : 1;
                $data->importe = $a['importe'];
                $data->comentario = 'Liquidacion de anticipo';
                $data->idCmp = $datosDocumentos['idComprobante'];
                $data->numCmp = $datosDocumentos['numComprobante'];
                $data->fechaCmp = $datosDocumentos['fechaComprobante'];
                array_push($dataLiquidar, $data);
            }
            $this->contabilidadHelper->liquidarAnticipoExterno(json_encode($dataLiquidar));
        }
    }

    private function generarObligacionesConceptos($idDocumento, $paseOriginal, &$arrayObligaciones, $idMoneda, $idMonedaAlt, $idtasa)
    {
        $comprobanteModel = LogisticaComprobanteModel::getInstance();
        $conceptos = Doctrine_Query::create()
            ->select("dcir.idconceptorecep, "
                . "COALESCE(COALESCE(dcir.valorcalculomn,dcir.valormn),0) as valormn, COALESCE(dcir.valoralt,0) as valoralt, dcir.idcondicionpago as idcondicionpago, dcir.idproveedor, dcir.nrofactura")
            ->from('DatConceptoimporterecep dcir')
            ->innerJoin('dcir.NomCategoriaprecio nci')
            ->where(
                "dcir.iddocumento = ? and nci.concepto = '+'",
                array($idDocumento)
            )
            ->fetchArray();
        $qAux = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($idDocumento));
        foreach ($conceptos as $c) {
            if ($c['nrofactura']) {
                if ($c['idproveedor'] && $c['idcondicionpago']/*($c['idproveedor'] && $qAux[0]['idcliente'] != $c['idproveedor']) || ($c['idcondicionpago'] && $qAux[0]['idcondicionpago'] != $c['idcondicionpago'])*/) {
                    if ($c['valormn'] > 0) {
                        $copyPaseConcepto = clone $paseOriginal;
                        $copyPaseConcepto->idcondicionpago = $c['idcondicionpago'];
                        if ($copyPaseConcepto->idcondicionpago) {
                            $sql = "select c.* from mod_datosmaestros.nom_terminosdepago c where c.idterminodepago = "
                                . $copyPaseConcepto->idcondicionpago;
                            $plazo = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                            $copyPaseConcepto->plazo = $plazo[0]['plazo'];
                        }
                        $copyPaseConcepto->numero = ($c['nrofactura']) ? $c['nrofactura'] : $paseOriginal->numero; //columna nueva
                        $copyPaseConcepto->idcliente = $c['idproveedor'];
                        $copyPaseConcepto->importe = $c['valormn'];
                        $copyPaseConcepto->idcuenta = $comprobanteModel->buscarCuentaProveedorConcepto($c['idproveedor'], $c['idcondicionpago'], $idMoneda);
                        $this->getPaseOperacion($copyPaseConcepto, $idMoneda, $idtasa);
                        if ($copyPaseConcepto->idcuenta && $copyPaseConcepto->importe > 0) {
                            array_push($arrayObligaciones, $copyPaseConcepto);
                        }
                    }
                    if ($c['valoralt'] > 0) {
                        $copyPaseConceptoAlt = clone $paseOriginal;
                        $copyPaseConceptoAlt->idcondicionpago = $c['idcondicionpago'];
                        if ($copyPaseConceptoAlt->idcondicionpago) {
                            $sql = "select c.* from mod_datosmaestros.nom_terminosdepago c where c.idterminodepago = "
                                . $copyPaseConceptoAlt->idcondicionpago;
                            $plazo = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                            $copyPaseConceptoAlt->plazo = $plazo[0]['plazo'];
                        }
                        $copyPaseConceptoAlt->numero = ($c['nrofactura']) ? $c['nrofactura'] : $paseOriginal->numero; //columna nueva
                        $copyPaseConceptoAlt->idcliente = $c['idproveedor'];
                        $copyPaseConceptoAlt->importe = $c['valoralt'];
                        $copyPaseConceptoAlt->idcuenta = $comprobanteModel->buscarCuentaProveedorConcepto($c['idproveedor'], $c['idcondicionpago'], $idMonedaAlt);
                        $this->getPaseOperacion($copyPaseConceptoAlt, $idMonedaAlt, $idtasa);
                        if ($copyPaseConceptoAlt->idcuenta && $copyPaseConceptoAlt->importe > 0) {
                            array_push($arrayObligaciones, $copyPaseConceptoAlt);
                        }
                    }
                }
            }
        }
    }

    private function obligacionesTPV($idDocumento, $paseOriginal, &$arrayObligaciones, $idMoneda, $idMonedaAlt, $idtasa)
    {
        $arrayObligaciones = array();
        $sqlMoneda = "select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                  on dm.idmovimiento = mm.idmovimiento where dm.iddocumento = {$idDocumento} limit 1";
        $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
        if (!count($arrayMoneda)) {
            $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
                        where mm.idventas = {$idDocumento} limit 1";
            $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
        }
        $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
        $arrayTasa = $this->doctrineHelper->getConnection()->fetchAll($sqlTasa);
        $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
        $tasaCambio = 1;
        $tasa = array();
        if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
            $tasa = $this->configuracionHelper->getTasaByMonedas(
                $idmonedacontable,
                $arrayMoneda[0]['idmoneda'],
                $arrayTasa[0]['idtipotasa']
            );
            if (count($tasa)) {
                $tasaCambio = $tasa[0]['factordeconversion'];
            }
        }
        $idMoneda = (count($arrayMoneda) && $arrayMoneda[0]['idmoneda']) ? $arrayMoneda[0]['idmoneda'] : $idmonedacontable;//falta poner la moneda de la venta
        $iso = (count($arrayMoneda) && $arrayMoneda[0]['iso']) ? $arrayMoneda[0]['iso'] : LogisticaGlobal::__init()->getMonedaEntidad()->codigoiso;
        $sqlCuenta = "SELECT cp.idcuenta, ncc.parent_path FROM mod_logpuntoventa.dat_ventas dv
        join mod_logpuntoventa.dat_areaventa av ON av.idareaventa = dv.idareaventa
        join mod_datosmaestros.nom_clientesproveedor nc on av.idcliente = nc.idclientesproveedores
        join mod_datosmaestros.dat_clienteproveedorcobropago cp on nc.idclientesproveedores = cp.idclienteproveedor
        join mod_contabilidad.nom_cuenta ncc on ncc.idcuenta = cp.idcuenta
        where  dv.idventas = {$idDocumento} and cp.clasificacion = 1 and cp.idmoneda = {$idMoneda} and cp.idestructura = {$this->global->Estructura->idestructura}";
        $datosCuenta = $this->doctrineHelper->getConnection()->fetchAll($sqlCuenta);

        $sql = "select mp.codigo, sum(dp.importe)*{$tasaCambio} as importe from mod_logpuntoventa.dat_desglosepago dp
                join mod_logpuntoventa.nom_modopago mp ON mp.idmodopago = dp.idformapago
                where iddocumento = {$idDocumento} and mp.efectivo <> 1
                group by mp.codigo";
        $datos = $this->doctrineHelper->getConnection()->fetchAll($sql);
        $cuentaPadre = explode('.', $datosCuenta[0]['parent_path']);
        foreach ($datos as $value) {
            $copyPase = clone $paseOriginal;
            $copyPase->idmoneda = $idMoneda;
            $copyPase->moneda = $iso;
            //$idcuenta = $datosCuenta[0]['idcuenta'];
            $idcuenta = $cuentaPadre[0];
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            $concate = $cuenta->concatcta . '.' . $value['codigo'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $copyPase->idcuenta = $cuentaE->idcuenta;
            $this->objectHelper->synchronize($copyPase, $value);
            $this->getPaseOperacion($copyPase, $idMoneda, count($tasa) ? $tasa[0]['idtasa'] : $idtasa);
            array_push($arrayObligaciones, $copyPase);
        }
    }

    private function getPaseOperacion($stdPase, $idmoneda, $idtasa)
    {
        $stdPase->operaciones = array();
        $stdOperacion = new stdClass();
        $stdOperacion->importemb = $stdPase->importe;
        $stdOperacion->importemo = $stdPase->importe;
        $stdOperacion->idmoneda = $idmoneda;
        $stdOperacion->tasa = $idtasa;
        array_push($stdPase->operaciones, $stdOperacion);
    }

    public function initIdDocsObligaciones()
    {
        foreach ($this->aliasIddocs as $alias => $subsistema) {
            $iddoc = $this->documentosHelper->devuelveIddocByIdEstructura(
                $alias,
                $this->global->Estructura->idestructura,
                $subsistema
            );
            array_push($this->idDocsObligaciones, $iddoc->iddoc);
        }
    }

    public function importeTotalDocumento($idDocumento)
    {
        $importe = $this->doctrineHelper->query(
            "SELECT SUM(round(m.importecontable,2)) as importe FROM DatMovimientos m WHERE m.iddocumento = {$idDocumento}"
        )->getFirst()->toArray();
        $conceptos = Doctrine_Query::create()
            ->select("dcir.idconceptorecep, "
                . "COALESCE(dcir.valormn,0) as valormn, dcir.idcondicionpago as idcondicionpago, dcir.idproveedor")
            ->from('DatConceptoimporterecep dcir')
            ->innerJoin('dcir.NomCategoriaprecio nci')
            ->where(
                "dcir.iddocumento = ? and nci.concepto = '+'",
                array($idDocumento)
            )
            ->fetchArray();
        $qAux = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($idDocumento));
        $importe = is_null($importe['importe']) ? 0 : $importe['importe'];
        foreach ($conceptos as $c) {
            if (($c['idproveedor']) && ($qAux[0]['idcliente'] != $c['idproveedor'])) {
                $importe -= $c['valormn'];
            } else {
                if (($c['idcondicionpago']) && ($qAux[0]['idcondicionpago'] != $c['idcondicionpago'])) {
                    $importe -= $c['valormn'];
                }
            }
        }
        return $importe;
    }

    public function importeTotalAlternativoDocumento($idDocumento)
    {
        $importe = $this->doctrineHelper->query(
            "SELECT SUM(round(m.importealternativo,2)) as importe FROM DatMovimientos m WHERE m.iddocumento = {$idDocumento}"
        )->getFirst()->toArray();
        $conceptos = Doctrine_Query::create()
            ->select("dcir.idconceptorecep, "
                . "COALESCE(dcir.valoralt,0) as valoralt,COALESCE(dcir.valormn,0) as valormn, dcir.idcondicionpago as idcondicionpago, dcir.idproveedor")
            ->from('DatConceptoimporterecep dcir')
            ->innerJoin('dcir.NomCategoriaprecio nci')
            ->where(
                "dcir.iddocumento = ? and nci.concepto = '+'",
                array($idDocumento)
            )
            ->fetchArray();
        $importe = is_null($importe['importe']) ? 0 : $importe['importe'];
        $qAux = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($idDocumento));
        $recepcion = Doctrine::getTable('DatRecepcion')->find($idDocumento);
        foreach ($conceptos as $c) {
            if (($c['idproveedor']) && ($qAux[0]['idcliente'] != $c['idproveedor'])) {
                if (!$recepcion->salidafactura) {
                    $importe -= $c['valoralt'];
                    $importe -= $c['valormn'];
                }
            } else {
                if (($c['idcondicionpago']) && ($qAux[0]['idcondicionpago'] != $c['idcondicionpago'])) {
                    if (!$recepcion->salidafactura) {
                        $importe -= $c['valoralt'];
                        $importe -= $c['valormn'];
                    }
                }
            }
        }
        return $importe;
    }

    public function obtenerCondicionPago($idDocumento, $idSubsistema, &$objPase)
    {
        /**
         * TODO Obtener los datos de la condicion de pago y pasarselas al pase del comprobante
         */
        $tabla = LogisticaGlobal::SUBSISTEMA_INV == $idSubsistema ? 'DatRecepcion' : 'DatDocfactura';
        //        $idDocumentoField = LogisticaGlobal::SUBSISTEMA_INV == $idSubsistema ? 'iddocumento' : 'idfactura';
        $dqlResult = Doctrine_Query::create()->from("DatDocumentoCliente t")
            ->select("t.idcondicionpago")
            ->where("t.iddocumento = ?", array($idDocumento))
            ->fetchArray();
        $dqlResultFac = Doctrine_Query::create()->from("DatDocfactura t")
            ->select("t.idcondicionpago")
            ->where("t.idfactura = ?", array($idDocumento))
            ->fetchArray();

        $objPase->idcondicionpago = $dqlResult[0]['idcondicionpago'] ? $dqlResult[0]['idcondicionpago'] : 16;
        if ($objPase->idcondicionpago) {
            $sql = "select c.idterminodepago, c.plazo from mod_datosmaestros.nom_terminosdepago c where c.idterminodepago = "
                . $objPase->idcondicionpago;
            $plazo = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $objPase->plazo = $plazo[0]['plazo'];
        } else {
            $objPase->idcondicionpago = 16;
            $objPase->plazo = 30;
        }
    }

    public function generarObligacionFinanciamiento($idDocumento)
    {
        $idEstructura = $this->global->Estructura->idestructura;
        $idEntidad = (new VariablesGlobalesModel())->obtenerValor('novaBankCentralEntity');
        $tasa = (new VariablesGlobalesModel())->obtenerValor('novaBankEntityDiscount_' . $idEstructura);
        $contrapartida = (new VariablesGlobalesModel())->obtenerValor('novaBankAccount');
        LogisticaDoctrineHelper::__init()->executeQuery("select from mod_logistica.f_crearobligacionfinanciamiento(
                        p_iddocumento := $idDocumento ,
                        p_identidad := $idEntidad,
                        p_tasa := $tasa,
                        p_moneda := 9900000000,
                        p_contrapartida := $contrapartida
                        );"
        );
    }

    private function getInvoiceNumber($iddocumento)
    {
        $dataTransp = $this->doctrineHelper
            ->getConnection()->execute("select dft.prodgenerico from mod_logfacturacion.dat_docfacturatransportacion dft
            where dft.idfactura = {$iddocumento}"
            )->fetchAll(PDO::FETCH_ASSOC);
        return $dataTransp[0]['prodgenerico'];
    }
}
