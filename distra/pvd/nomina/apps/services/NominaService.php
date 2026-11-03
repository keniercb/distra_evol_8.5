<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class NominaService extends ZendExt_Model
{

    /**
     * Enter description here...
     *
     * @var DatNomina
     */
    var $objdatnomina;

    /**
     * Enter description here...
     *
     * @var DatcargoModel
     */
    var $objdatnominamodel;

    /**
     * Enter description here...
     *
     * @var DatNominaModel
     */
    var $cargomilitar;

    function __construct()
    {
        $this->objdatnomina = new DatNomina();
        $this->objdatnominamodel = new DatNominaModel();
    }

    /**
     * Enter description here...
     *
     * @param numeric $idpersona
     * @param numeric $identidad
     * @return array
     */
    function obtenerDatosNominaPersona($cargo, $idpersona, $idestructura)
    {
        //print_r("lol");die;
        $arraydatosnominapersona = $this->objdatnomina->obtenerDatosAnexo3($cargo, $idpersona, $idestructura);
        return $arraydatosnominapersona;
    }

    function getInfoElementoSalarialService($idcargo)
    {
        $objelementosalarial = new ConfigElementoSalarialCargo();
        $arraydatoselementosalarial = $objelementosalarial->getInfoElementoSalarialService($idcargo);
        return $arraydatoselementosalarial;
    }

    function obtenerCampoReporteAusencia()
    {
        $objcampoausencia = new ConfReportesCertificaciones();
        $arraydatoscampoausencia = $objcampoausencia->obtenerTodosReportesCertificaciones();
        return $arraydatoscampoausencia;
    }

    function getDenominacionDadoIdService($idvariablesconfreportescertificaciones)
    {
        $objConfVariablesReportesCertificacionesModel = new ConfVariablesReportesCertificacionesModel();
        $denominacion = $objConfVariablesReportesCertificacionesModel->obtenerDenominacionDadoIdVariablesCertificacion($idvariablesconfreportescertificaciones);
        return $denominacion;
    }

    function GetAllConceptosPD($idconcepto = null, $start = 0, $limit = 0, $busqueda = '')
    {
        $nomconceptospd = new NomConceptoPercepcionDescuento();
        $allconcepts = $nomconceptospd->obtenerListadoTodosConceptosPD($idconcepto, $start, $limit, $busqueda);
        return $allconcepts;
    }

    /**
     * @param $arraycargos
     * @param $arrayconceptospd
     * @return mixed
     */
    function obtenerDatosPagosAdicionalesCargo($arraycargos, $arrayconceptospd)
    {
        $configConceptos = new ConfigConceptospdElementosSalarialesModel();
        $arrayConceptosCargo = $configConceptos->obtenerDatosPagosAdicionalesCargo($arraycargos, $arrayconceptospd);
        return $arrayConceptosCargo;
    }

    function obtenerCCostoPersona($idpersona, $identidad)
    {
        return DatCargosOcupados::obtenerCCostoPersona($idpersona, $identidad);
    }

    function obtenerDatosCierreNomina($identidad, $cajacajero, $objMoneda)
    {
        $objCierre = new StdClass();
        $objDatFechaCierre = new DatFechasCierrePeriodo();
        $objDatElaborarPago = new DatElaborarPagos();
        $objTipoPago = new NomTipoPago();
        $objCierrePeriodo = new DatCierrePeriodosNomina();

        $arrfechacierre = $objDatFechaCierre->obtenerFechasCierrePeriodoAbertoEntidad($identidad);

        if ($cajacajero == 1)/* CAJA */ {
            if (count($arrfechacierre) > 0) {
                if (($objMoneda->codigo == '01' && $arrfechacierre[0]['estadocajacup'] == 1) || ($objMoneda->codigo == '02' && $arrfechacierre[0]['estadocajacuc'] == 1)) {
                    $objCierre->idfechacierre = $arrfechacierre[0]['idfechascierre'];
                    $objCierre->fechacierre = $arrfechacierre[0]['fechacierre'];
                    if ($objMoneda->codigo == '01') {/* CUP */
                        $objCierre->monto = $arrfechacierre[0]['montocajacup'];
                    } else if ($objMoneda->codigo == '02') {
                        $objCierre->monto = $arrfechacierre[0]['montocajacuc'];
                    }
                    $arraycierresperiodo = $objCierrePeriodo->obtenerListadoDatCierrePeriodos($objCierre->idfechacierre);

                    $arrPersonas = array();
                    $arrIdsElaborarPagos = array();
                    foreach ($arraycierresperiodo as $i => $cierre) {
                        $arrIdsElaborarPagos[] = $cierre['idelaborarpagos'];
                        $personas = unserialize($cierre['personascaja']);
                        foreach ($personas as &$p) {
                            $p['idelaborarpagos'] = $cierre['idelaborarpagos'];
                            $arrPersonas[] = $p;
                        }
                    }

                    $arrTP = $objDatElaborarPago->obtenerDatosPagoparaCierrePorMoneda($arrIdsElaborarPagos, $objMoneda->codigo);

                    $arrPagos = array();
                    foreach ($arrTP as $tp) {
                        $arrPagos[$tp['idelaborarpagos']] = $tp;
                    }

                    $objCierre->personas = array();
                    foreach ($arrPersonas as $p) {
                        if(($objMoneda->codigo == '01' && $p['importe_n']>0) || ($objMoneda->codigo == '02' && $p['importe_d'] > 0)){
                            $objCierre->personas[$p['idpersona']]['idpersona'] = $p['idpersona'];
                            $objCierre->personas[$p['idpersona']]['nombreyapellidos'] = $p['nombreyapellidos'];
                            $objCierre->personas[$p['idpersona']]['ci'] = $p['num_ideper'];
                            $objCierre->personas[$p['idpersona']]['idplantillanominal'] = $p['idplantillanominal'];
                            $objCierre->personas[$p['idpersona']]['plantillanominal'] = $p['denominacion'];
                            if (array_key_exists($p['idelaborarpagos'], $arrPagos)) {
                                $pago = array();
                                $pago['idelaborarpagos'] = $p['idelaborarpagos'];
                                $pago['tipopago'] = $arrPagos[$p['idelaborarpagos']]['tipopago'];
                                $pago['idtiponomina'] = $arrPagos[$p['idelaborarpagos']]['idtiponomina'];
                                $pago['operacion'] = ($arrPagos[$p['idelaborarpagos']]['reintegro'] == 2) ? 1 : 2;

                                if($objCierre->personas[$p['idpersona']]['pagos'][$p['idelaborarpagos']]){
                                    $pago = $objCierre->personas[$p['idpersona']]['pagos'][$p['idelaborarpagos']];
                                }
                                if ($objMoneda->codigo == '01' && $p['importe_n']!= 0) {/* CUP */
                                    $pago['monto'] += $p['importe_n'];
                                } else if ($objMoneda->codigo == '02') {/* CUC */
                                    $pago['monto'] += $p['importe_d'];
                                } else {
                                    $pago['monto'] = 0.00;
                                }

                                $objCierre->personas[$p['idpersona']]['pagos'][$p['idelaborarpagos']] = $pago;
                            }
                            if (!array_key_exists('pagos', $objCierre->personas[$p['idpersona']])) {
                                unset($objCierre->personas[$p['idpersona']]);
                            }
                        }
                    }return $objCierre;
                } else {
                    return new stdClass();
                }
            }
        } else if ($cajacajero == 2)/* CAJERO */ {
            $objCierre->idfechacierre = $arrfechacierre[0]['idfechascierre'];
            $objCierre->fechacierre = $arrfechacierre[0]['fechacierre'];
            if ($objMoneda->codigo == '01') {/* CUP */
                if ($arrfechacierre[0]['estadobancocup'] == 1) {
                    $objCierre->monto = $arrfechacierre[0]['montocajerocup'];
                    return $objCierre;
                } else {
                    return new stdClass();
                }
            } else if ($objMoneda->codigo == '02') {/* CUC */
                if ($arrfechacierre[0]['estadobancocuc'] == 1) {
                    $objCierre->monto = $arrfechacierre[0]['montocajerocuc'];
                    return $objCierre;
                } else {
                    return new stdClass();
                }
            }
        }
    }

    function obtenerDatosCierreDadoId($idfechascierre, $cajaCajero, $objMoneda)
    {
        $obj = new DatFechasCierrePeriodo();
        $c = $obj->obtenerObjDatFechasCierrePeriodo($idfechascierre);
        $objCierre = new StdClass();
        if (empty($c)) {
            $objCierre->codigo = "ERROR";
            $objCierre->codigoerror = 1;
            $objCierre->descripcionerror = "El cierre del período no existe.";
        } else {
            $objCierre->codigo = "OK";
            $objCierre->idfechacierre = $c->idfechascierre;
            $objCierre->fechacierre = $c->fechacierre;
            if ($cajaCajero == 2) {
                if ($objMoneda->codigo == '01') {
                    $objCierre->monto = $c->montocajerocup;
                } else if ($objMoneda->codigo == '02') {
                    $objCierre->monto = $c->montocajerocuc;
                }
            } else if ($cajaCajero == 1) {
                if ($objMoneda->codigo == '01') {
                    $objCierre->monto = $c->montocajacup;
                } else if ($objMoneda->codigo == '02') {
                    $objCierre->monto = $c->montocajacuc;
                }
            } else {
                $objCierre->montocup = 0.00;
                $objCierre->montocuc = 0.00;
            }
        }
        return $objCierre;
    }

    function CerrarPeriodo($idfechacierre, $cajacajero, $cerrar, $objMoneda, $perosnasCaja = NULL)
    {
        $obj = new StdClass();
        $objFechasCierre = new DatFechasCierrePeriodo();
        $c = $objFechasCierre->obtenerObjDatFechasCierrePeriodo($idfechacierre);
        if (!empty($c)) {
            if ($c->estado == 2) {
                $obj->codigo = "ERROR";
                $obj->codigoerror = 2;
                $obj->descripcionerror = "El cierre del período está terminado.";
            } else {
                if ($cajacajero == 1) /* CAJA */ {
                    if ($objMoneda->codigo == '01') {
                        $c->estadocajacup = $cerrar;
                    }
                    if ($objMoneda->codigo == '02') {
                        $c->estadocajacuc = $cerrar;
                    }

                    /* if ($cerrar == 2)
                      {
                      if ($c->estadobancocup == 2 && $c->estadobancocuc == 2)
                      {
                      $c->estado = 2;
                      }
                      } */
                } else /* CAJERO */ {
                    if ($objMoneda->codigo == '01') {
                        $c->estadobancocup = $cerrar;
                    } else if ($objMoneda->codigo == '02') {
                        $c->estadobancocuc = $cerrar;
                    }
                    if ($cerrar == 2) {
                        /* if ($c->estadocajacup == 2 && $c->estadocajacuc == 2)
                          {
                          $c->estado = 2;
                          } */
                    }
                }
                $c->save();
                $obj->codigo = "OK";
            }
        } else {
            $obj->codigo = "ERROR";
            $obj->codigoerror = 1;
            $obj->descripcionerror = "El cierre del período no existe.";
        }

        return $obj;
    }

    //Funcion para actualizar el submayor de reintegros desde banco
    function actualizarSubmayorReintegro($objCierre, $objMoneda, $idestructura)
    {
        if (count($objCierre) > 0) {
            foreach ($objCierre->personas as $p) {
                foreach ($p->pagos as $rp) {
                    //Si la nomina genera una acumulacion y la persona no cobro
                    if (($rp->operacion == 1 && $rp->cobro == 0) || ($rp->operacion == 2 && $rp->cobro == 1)) {
                        $objReintegro = new DatReintegros();
                        $objReintegro->fecha = $objCierre->fechacierre;
                        $objReintegro->importe = $rp->monto;
                        $objReintegro->idpersona = $p->idpersona;
                        $objReintegro->idestructura = $idestructura;
                        $objReintegro->idtiponomina = $rp->idtiponomina;
                        $objReintegro->operacion = $rp->operacion;
                        $objReintegro->tipomoneda = $objMoneda->codigo;
                        $objReintegro->idelaborarpagos = $rp->idelaborarpagos;
                        $objReintegro->idcuenta = $objCierre->idcuenta;
                        $objReintegro->iddocumentoobligacion = $p->idderechouobligacion;
                        $objReintegro->save();
                    }
                }
            }
        }
    }

    function obtenerDatosPagosAdicionalesCargoyPersona($idestructura, $arrayIdsPersonas, $arrayconceptospd)
    {
        $configConceptos = new ConfigElementoSalarialCargoModel();
        return $configConceptos->cargarElementosSalarialesalCargoyPersona($idestructura, $arrayIdsPersonas, $arrayconceptospd);
    }

    function obtenerUltimoCierreSalarioEntidad($identidad)
    {
        //Obteniendo el ultimo cierre de la entidad
        $sql = "SELECT idtipopago, denominacion FROM mod_nomina.nom_tipopago where fechafin IS NULL OR fechafin >= now();";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        try {
            $resultado = array();
            $arrIdsTiposPagos = $conn->fetchAll($sql);
            if (!empty($arrIdsTiposPagos)) {
                foreach ($arrIdsTiposPagos as $idTP) {
                    $sql = "SELECT MAX(idelaborarpagos) as ultimo FROM mod_nomina.dat_elaborarpagos WHERE identidad = ? AND idtipopago = ?;";
                    $arrEP = $conn->fetchAll($sql, array($identidad, $idTP['idtipopago']));
                    if (!empty($arrEP)) {
                        $sql = "SELECT dnd.*, dn.cajacajero FROM mod_nomina.dat_nomina dn
                        INNER JOIN mod_nomina.dat_nominadatos dnd ON (dnd.idnomina = dn.idnomina)
                        WHERE dn.idelaborarpago = ?;";
                        $arrNominas = $conn->fetchAll($sql, array($arrEP[0]['ultimo']));
                        $r = array();
                        $a = array();
                        $a['idtipopago'] = $idTP['idtipopago'];
                        $a['tipopago'] = $idTP['denominacion'];
                        foreach ($arrNominas as $n) {
                            $r['estructura'] = unserialize($n['estructura']);
                            $valores = unserialize($n['valores']);
                            foreach ($valores as $v) {
                                $r['valores'][] = $v;
                            }

                        }
                        $a['nomina'] = $r;
                        $resultado[] = $a;
                    }
                }
            }
            $conn->commit();
            return json_encode($resultado);
        } catch (Exception $e) {
            $conn->rollBack();
            print_r($e);
            die;
        }
    }

    /*
     * Funcion que devuelve los datos de las vacaciones de las personas
     * $params: $identidad,  $arraypersonas = array(['idpersona'=>252, 'diashabiles'=>10], ['idpersona'=>221, 'diashabiles'=>5]);
     * */
    function buscarsaldosVacacionesPersonas($identidad, $arraypersonas)
    {
        $objDatVac = new DatVacacionesPersonaModel();
        return $objDatVac->buscarsaldosVacacionesPersonas($identidad, $arraypersonas);
    }

    function getDiasImpAcumuladosVacPersEntidad($idpersona, $identidad)
    {
        $objHisVacacionesPersonaModel = new HisVacacionesPersonaModel();
        $dias = HisVacacionesPersonaModel::calcularDiasAcumulados($idpersona, $identidad);
        $importe = HisVacacionesPersonaModel::calcularImporteAcumulado($idpersona, $identidad);
        $obj->dias = $dias;
        $obj->importe = $importe;
        return $obj;
    }

    /*
     * Servicio q devuelve el saldo de un arreglo de personas dado la entidad, el año y el mes
     * */
    function obtenerSaldosVacacionesPersonaEntidadMesAnno($arraypersonas, $idestructura, $mes, $anno)
    {
        $objHisVacacionesPersona = new HisVacacionesPersonaModel();
        //Recorriendo las personas para obtener el saldo de vacaciones dado una entidad, una año y un mes
        $arrayp = array();
        $cont = 0;
        foreach ($arraypersonas as $idpersona) {
            $saldovacacionesmesanno = $objHisVacacionesPersona->obtenerSaldosVacacionesPersonaEntidadMesAnno($idpersona, $idestructura, $mes, $anno);
            $saldotiempo = $saldovacacionesmesanno[0]['saldoentiempo'];
            $saldoimporte = $saldovacacionesmesanno[0]['saldoenimporte'];
            $arrayp[$cont]['idpersona'] = $idpersona;
            $arrayp[$cont]['saldoentiempo'] = $saldotiempo;
            $arrayp[$cont]['saldoenimporte'] = $saldoimporte;
            $cont++;
        }
        return $arrayp;
    }

    /*
     * Servicio que devuelve un arreglo con todas las fechas de cierre de una persona en una entidad.
     * */
    public function obtenerFechasCierresPeriodos($idpersona)
    {
        $arrayidfechascierre = null;
        $r = DatCargosOcupados::buscarPlantillaPersona($idpersona);
        $identidad = (!empty($r)) ? $r[0]['identidad'] : -1;
        $objcierre = DatCierrePeriodosNomina::obtenerListadoDatFechasCierrePeriodos($identidad);
        return $objcierre;
    }

    /*
     * Servicio que devuelve un arreglo con todos los conceptos de salario para una o varias fechas de cierre,
     * de una o varias personas, dado el listado de fechas de cierre y el listado de personas.
     * */
    public function obtenerSalarioFechaCierrePeriodosPersona($arrayidfechascierre, $arraypersonas)
    {
        $dat = new DatExportarbancoModel();
        $objcierre = DatCierrePeriodosNomina::obtenerListadoDatCierrePeriodos($arrayidfechascierre);
        $identidad = (!empty($objcierre)) ? $objcierre[0]['identidad'] : -1;
        $objelaborarpagos = new DatElaborarPagos();
        $arrayidelaborarpagos = array();
        foreach ($objcierre as $cierreperiodo) {
            $arrayidelaborarpagos[/*$cierreperiodo['idfechascierre'].'-'.*/
            $cierreperiodo['fechacierre']][] =
                array('idelaborarpagos' => $cierreperiodo['idelaborarpagos'],
                    'fechainicio' => $objelaborarpagos->obtenerFechaInicioPeriodoPago($cierreperiodo['idelaborarpagos']));

        }
        $result = array();
        foreach ($arrayidelaborarpagos as $idfechacierre => $rperiodos) {
            $result[$idfechacierre] = $dat->todosSalariosPeriodosPersona($rperiodos, $identidad, $arraypersonas);
        }
        return $result;
    }

    public function acualizarCuentasPorCobrarRetencionesDesdeCaja($idDocumetoObligacion, $montoliquidado = null){
        if($idDocumetoObligacion){
            //Obteniendo la retencion de la persona que es una cuenta por cobrar y se liquido en Caja
            $datosRetencionCC = DatRetencionPersona::obtenerRetencionesDadoIdDocObligacionCobrosyPagos($idDocumetoObligacion);
            $idretencion = $datosRetencionCC[0]['idretencionpersona'];
            $saldoinicial = $datosRetencionCC[0]['saldoinicial'];
            $mensualidad = $datosRetencionCC[0]['mensualidad'];
            $objHisRetencionSave = new HisRetencionesPersona();
            //Saldo adeudo ultima operacion de esa persona para saber cuanto debe
            $saldoadeudoultimaopreacion = HisRetencionesPersona::obtenerSaldoAdeudoUltimaOperacion($idretencion);
            //Si existe una retencion con ese iddocumentoobligacion
            if($idretencion){
                //Si caja manda el monto liquidado ese monto se rebaja del submayor de retenciones
                if($montoliquidado){
                    if($saldoadeudoultimaopreacion){
                        $objHisRetencionSave->idretencionpersona = $idretencion;
                        $objHisRetencionSave->retenido = $montoliquidado;
                        $objHisRetencionSave->saldodeladeudo = $saldoadeudoultimaopreacion - $montoliquidado;
                        $objHisRetencionSave->save();
                    }else{
                        $objHisRetencionSave->idretencionpersona = $idretencion;
                        $objHisRetencionSave->retenido = $montoliquidado;
                        $objHisRetencionSave->saldodeladeudo = $datosRetencionCC[0]['saldoinicial'] - $montoliquidado;
                        $objHisRetencionSave->save();
                    }
                    //Sino mandan el monto por el servicio se liquida la mensualidad o lo que le queda por liquidar
                }else{
                    if($saldoadeudoultimaopreacion){
                        if($saldoadeudoultimaopreacion < $mensualidad){
                            $objHisRetencionSave->idretencionpersona = $idretencion;
                            $objHisRetencionSave->retenido = $saldoadeudoultimaopreacion;
                            $objHisRetencionSave->saldodeladeudo = 0.00;
                            $objHisRetencionSave->save();
                        }else{
                            $objHisRetencionSave->idretencionpersona = $idretencion;
                            $objHisRetencionSave->retenido = $mensualidad;
                            $objHisRetencionSave->saldodeladeudo = $saldoadeudoultimaopreacion - $mensualidad;
                            $objHisRetencionSave->save();
                        }
                    }else{
                        $objHisRetencionSave->idretencionpersona = $idretencion;
                        $objHisRetencionSave->retenido = $mensualidad;
                        $objHisRetencionSave->saldodeladeudo = $datosRetencionCC[0]['saldoinicial'] - $mensualidad;
                        $objHisRetencionSave->save();
                    }
                }
            }
        }
        return 'COD-1';
    }

    function cancelarCuentasPorCobrarRetencionesDesdeCaja($idDocumetoObligacion, $importe){
        //Obteniendo la retencion de la persona que es una cuenta por cobrar y se liquido en Caja
        $datosRetencionCC = HisRetencionesPersona::obtenerIdDocObligacionUltimaOperacionRetencionCuentaCobrar($idDocumetoObligacion, $importe);
        $idretencionpersona = $datosRetencionCC[0]['idhisretencionpersona'];
        if($idretencionpersona){
            $objHisRetencionDelete = Doctrine::getTable('HisRetencionesPersona')->find($idretencionpersona);
            $objHisRetencionDelete->delete();
            return 'COD-1';
        }
    }

    function cancelarReintegrosDesdeFinanzas($arraydatos, $operacion){

        if((count($arraydatos)>0) and ($operacion == 1 || $operacion == 2)){
            $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        foreach($arraydatos as $datos){
        $sqlreintegro = "SELECT * from mod_nomina.dat_reintegropersona where idpersona = ? and iddocumentoobligacion = ?";
        $reintegropersona = $conn->fetchAll($sqlreintegro,array($datos['idpersona'], $datos['iddocumentoobligacion']));
        $reintegropersona = $reintegropersona[0];
        $objReintegro = new DatReintegros();
        $objReintegro->fecha = date('Y-m-d');
        $objReintegro->importe = $datos['importe'];
        $objReintegro->idpersona = $datos['idpersona'];
        $objReintegro->idestructura = $reintegropersona['idestructura'];
        $objReintegro->idtiponomina = $reintegropersona['idtiponomina'];
        $objReintegro->operacion = $operacion;
        $objReintegro->tipomoneda = $reintegropersona['tipomoneda'];
        $objReintegro->idelaborarpagos = $reintegropersona['idelaborarpagos'];
        $objReintegro->idcuenta = $reintegropersona['idcuenta'];
        $objReintegro->iddocumentoobligacion = $datos['iddocumentoobligacion'];
        $objReintegro->save();
        }
        return true;
        }
        else{
        return false;
        }

    }

}
