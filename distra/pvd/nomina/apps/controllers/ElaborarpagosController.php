<?php

class ElaborarpagosController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function elaborarpagosAction()
    {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    public function buscarValorEnArray($array, $claveEle, $valorEle)
    {
        foreach ($array as $arrayInfoPagos) {
            foreach ($arrayInfoPagos as $clave => $valor) {
                if ($clave == $claveEle && $valor == $valorEle) {
                    return true;
                }
            }
        }
        return false;
    }

    public function obtenerperiodosdepagoAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idtipopago = $this->_request->getPost('idtipopago');
        $modopago = $this->_request->getPost('modopago');
        $cargarsinaprobar = $this->_request->getPost('cargarsinaprobar');
        $obj = new DatElaborarPagos();
        $identidades = Zend_Json::decode(stripslashes($this->_request->getPost('identidades')));
        $arrayidentidades = Zend_Json::decode(stripslashes($this->_request->getPost('arrayidentidades')));


        $sync =  $this->sincronizarPeriodosPagoMesPago($identidad, $idtipopago, $modopago, $cargarsinaprobar);
        $r = array();
        if($sync == 'ok'){
            if (!empty($arrayidentidades) && $arrayidentidades != -1) {
                //Pagos x resultados para varias entidades
                $r = $obj->obtenerPeriodosPagosEntidades($arrayidentidades, $idtipopago, $modopago, $cargarsinaprobar);
            } else if ($identidades) {
                //$identidades =  Zend_Json::decode(stripslashes($this->_request->getPost('identidades')));
                $idtipopagos = Zend_Json::decode(stripslashes($this->_request->getPost('idtipopagos')));
                $r1 = $obj->obtenerPeriodosPagosPorEntidades($identidades, $idtipopagos, 1, 1, 1, $this->integrator->metadatos);
                $r = array();
                foreach ($r1 as $arrayInfoPagos) {
                    if (!$this->buscarValorEnArray($r, 'periodopago', $arrayInfoPagos['periodopago'])) {
                        array_push($r, $arrayInfoPagos);
                    }
                }
            } else {
                //Pago del salario
                $r = $obj->obtenerPeriodosPagos($identidad, $idtipopago, $modopago, $cargarsinaprobar);
            }
        }

        //Ordenando los años descendentes
        /*foreach ($r as &$v) {
            $v['anyo'] = (1 / $v['anyo']) . '-' . $v['anyo'];
        }*/


        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function sincronizarPeriodosPagoMesPago($identidad, $idtipopago, $modopago, $cargarsinaprobar){
        $obj = new DatElaborarPagos();
        $dep = $obj->obtenerPeriodosPagos($identidad, $idtipopago, $modopago, $cargarsinaprobar);
        //Recorriendo los periodos de pago para actualizarle la fecha inicio y fin a los periodos que tengan mes de pago y no tengan fechas
        foreach ($dep as $rep){
            if($rep['mesanyopago']){
                $rexpmap = explode('-', $rep['mesanyopago']);
                $annopago = $rexpmap[0];
                $mespago = $rexpmap[1];
                $ultimodia = date("d",(mktime(0,0,0,$mespago+1,1,$annopago)-1));
                $pd = 1;
                $fechainiciop = $annopago.'-'.$mespago.'-'.$pd;
                $fechafin = $annopago.'-'.$mespago.'-'.$ultimodia;
                //Actualizando las fechas
                if(!$rep['fechainicioperiodo'] || !$rep['fechafinperiodo']){
                    $idelaborarpagos = $rep['idelaborarpagos'];
                    $sqldatosElabP = "UPDATE mod_nomina.dat_elaborarpagos SET fechainicioperiodo = '{$fechainiciop}'::date,
                                                                          fechafinperiodo = '{$fechafin}'::date
                                  where idelaborarpagos = {$idelaborarpagos};";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $conn->execute($sqldatosElabP);
                }
            }
        }
        return 'ok';
    }

    public function obtenertipospagoAction()
    {
        $arrtipospago = Zend_Json::decode(stripslashes($this->_request->getPost('arrtipospago')));
        $obj = new NomTipoPago();
        $r = array();
        if(count($arrtipospago) == 0){
            $r = $obj->obtenerListadoTiposPago(0, 1000);
        }else{
            $r = $obj->obtenerListadoTiposPagoArrayId($arrtipospago);
        }
        echo json_encode($r);
    }

    public function obtenerperiodospagoAction()
    {
        $obj = new NomPeriodoPago();
        $r = $obj->obtenerListadoPeriodosPago(0, 1000);
        echo json_encode($r);
    }

    public function adicionarperiodopagoAction()
    {
        $objM = new DatElaborarPagosModel();
        $datos = new stdClass();
        $r = new stdClass();
        $datos->identidad = $this->_request->getPost('identidad');
        $datos->idtipopago = $this->_request->getPost('idtipopago');
        $datos->idperiodopago = $this->_request->getPost('idperiodopago');
        $datos->modopago = $this->_request->getPost('modopago');
        $datos->modoseleccionpersonas = $this->_request->getPost('modoseleccionpersonas');

        if ($datos->modopago == 1) {
            $datos->fechainicioperiodo = $this->_request->getPost('fechainicioperiodo');
            $datos->fechafinperiodo = $this->_request->getPost('fechafinperiodo');
            $datos->fechapago = $this->_request->getPost('fechapago');

            //Tratando las fechas
            $objfechainicio = new DateTime($datos->fechainicioperiodo);
            $fechainicio = $objfechainicio->format('d/m/Y');
            $objfechafin = new DateTime($datos->fechafinperiodo);
            $fechafin = $objfechafin->format('d/m/Y');
            $objfechapago = new DateTime($datos->fechapago);

            //Fecha pago
            $start_date = strtotime($objfechainicio->format('Y-m-d'));
            $end_date = strtotime($objfechafin->format('Y-m-d'));
            $fechapago = strtotime($objfechapago->format('Y-m-d'));
            $sepagaadelantado = NomTipoPago::obtenerPagoAdelantado($datos->idtipopago);
            $mismomes = NomTipoPago::obtenerValorMismomes($datos->idtipopago);
            /*if ($sepagaadelantado == 1) { //Pago del período adelantado
                if (!(($fechapago >= $start_date) && ($fechapago <= $end_date))) {
                    $r->codigo = 'NO-FECHA-PAGO-ADELANTADA';
                    echo json_encode($r);
                    return;
                }
            } else*/ if($sepagaadelantado == 0 && $mismomes == 0){ //Pago del período vencido
                if ($fechapago <= $end_date) {
                    $r->codigo = 'NO-FECHA-PAGO-VENCIDO';
                    echo json_encode($r);
                    return;
                }
            }

            //Validando  cuando ya existe el periodo de pago
            $arrayperidos = DatElaborarPagos::obtenerPeriodosXIdEntidadIdTPIdPP($datos->identidad, $datos->idtipopago, $datos->idperiodopago);
            $contfechaexistente = 0;
            foreach ($arrayperidos as $fechaactual) {
                if ($fechaactual['fechainicioperiodo'] == $fechainicio && $fechaactual['fechafinperiodo'] == $fechafin) {
                    $contfechaexistente++;
                }
            }
            if ($contfechaexistente > 0) {
                $r->codigo = 'EXISTE';
                echo json_encode($r);
                return;
            }/* else {
                $arrayperiodo = ConfPeriodosTiposPago::obtenerListadoFechas($datos->identidad, $datos->idtipopago, $datos->idperiodopago);
                $contfecha = 0;
                //Validando  cuando no hay Configuraciones de fechas y cuando No coinciden las fechas
                if (count($arrayperiodo) > 0) {
                    foreach ($arrayperiodo[0]['ConfDesglosePeriodos'] as $f => $fecha) {
                        if ($fecha['fdesde'] == $fechainicio && $fecha['fhasta'] == $fechafin) {
                            $contfecha++;
                        }
                    }

                    if ($contfecha == 0) {
                        $r->codigo = 'NO-COINCIDENCIA-FECHAS';
                        echo json_encode($r);
                        return;
                    }
                } else {
                    $r->codigo = 'NO-EXISTE-CONFIGURACION';
                    echo json_encode($r);
                    return;
                }
            }*/

        } else {
            $datos->fechapago = $this->_request->getPost('fechapago');
            $datos->mesanyopago = $this->_request->getPost('mesanyopago');
            $datos->mes = $this->_request->getPost('mes');
        }

        //Periodos abiertos
        $periodospagoabiertos = $objM->obtenerPeriodoPagoAbiertosXTipoPago($datos->identidad, $datos->idtipopago);
        if ($periodospagoabiertos) {
            $r->codigo = 'PER-ABIERTOS';
            echo json_encode($r);
            return;
        }

        //Aperturado
        /*$estaAperturadoModeloNomina = $objM->estaAperturadoModeloNomina($datos->identidad, $datos->idtipopago);
        if (!$estaAperturadoModeloNomina) {
            $r->codigo = 'NO-APERTURADO';
            echo json_encode($r);
            return;
        }*/

        //Dependencias
        // $dependencias = $objM->obtenerDependenciasPeriodos($datos->identidad, $datos->idtipopago, $this->_request->getPost('fechainicioperiodo'),
        //     $this->_request->getPost('fechafinperiodo'));
        // if (!empty($dependencias)) {
        //     $r->codigo = 'NO-DEPENDENCIAS';
        //     $r->dependencias = $dependencias;
        //     $r->cantdependencias = count(explode(";", $dependencias));
        //     echo json_encode($r);
        //     return;
        // }

        /* todo ok */
        $idelaborarpagos = $objM->adicionarPeriodoPago($datos);
        $this->adicionarpersonasperiodo($idelaborarpagos, $datos->identidad, $datos->idperiodopago,
            $datos->modoseleccionpersonas, $datos->idtipopago, $this->_request->getPost('fechainicioperiodo'),
            $this->_request->getPost('fechafinperiodo'));
        $r->codigo = 'ADD-1';
        echo json_encode($r);
        return;

    }

    public function modificarperiodopagoAction()
    {
        $datos->idelaborarpagos = $this->_request->getPost('idelaborarpagos');
        $datos->identidad = $this->_request->getPost('identidad');
        $datos->idtipopago = $this->_request->getPost('idtipopago');
        $datos->modopago = $this->_request->getPost('modopago');
        $datos->idperiodopago = $this->_request->getPost('idperiodopago');
        if ($datos->modopago == 1) {
            $datos->fechafinperiodo = $this->_request->getPost('fechafinperiodo');
            $datos->fechainicioperiodo = $this->_request->getPost('fechainicioperiodo');
            $datos->fechapago = $this->_request->getPost('fechapago');
        } else {
            $datos->fechapago = $this->_request->getPost('fechapago');
            $datos->mesanyopago = $this->_request->getPost('mesanyopago');
        }

        $objM = new DatElaborarPagosModel();
        $objM->modificarPeriodoPago($datos);

        $r->codigo = 'MOD-1';
        echo json_encode($r);
    }

    public function eliminarperiodopagoAction()
    {
        $idelaborarpagos = $this->_request->getPost('idelaborarpagos');
        $objM = new DatElaborarPagosModel();
        $r = new stdClass();
        $arrestadonominas = $objM->estadoNominas($idelaborarpagos);
        $estadonomina = (count($arrestadonominas) > 0) ? $arrestadonominas[0]['aprobada'] : 0;
        if ($estadonomina != 0) {
            $r->codigo = 'PERIODO-EN-USO';
            $r->estadonomina = ($estadonomina == 1) ? 'aprobadas' : 'certificadas';
        } else {
            $objM->eliminarPeriodoPago($idelaborarpagos);
            $r->codigo = 'DEL-1';
        }
        echo json_encode($r);
    }

    public function concluirperiodopagoAction()
    {
        $idelaborarpagos = $this->_request->getPost('idelaborarpagos');
        $identidad = $this->_request->getPost('identidad');

        $objM = new DatElaborarPagosModel();
        $estadonominas = $objM->concluirPeriodoPago($idelaborarpagos, $identidad);

        if ($estadonominas == 'PERIODO-CONCLUIDO') {
            $r->codigo = 'OK';
            echo json_encode($r);
        } else {
            $r->codigo = 'NOMINAS-NO-APROBADAS';
            echo json_encode($r);
        }

    }

    public function obtenerpersonasperiodosdepagoAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idelaborarpagos = $this->_request->getPost('idelaborarpagos');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');

        $objPEP = new DatPersonaElaborarPagos();
        if ($this->_request->getPost('critbusq') != '') {
            $r = $objPEP->obtenerPersonaElaborarPagos($idelaborarpagos, $limit, $start, $this->_request->getPost('critbusq'));
            $c = $objPEP->obtenerCantidadPersonaElaborarPagos($idelaborarpagos, $this->_request->getPost('critbusq'));
        } else {
            $r = $objPEP->obtenerPersonaElaborarPagos($idelaborarpagos, $limit, $start);
            $c = $objPEP->obtenerCantidadPersonaElaborarPagos($idelaborarpagos);
        }
        //Codigo contable
        foreach ($r as $p => $persona) {
            $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($persona['idpersona'], $identidad);
            $r[$p]['codcontable'] = $cdgocontable[0]['cdgocontable'];
            $r[$p]['nombreplantilla'] = (!empty($persona['nombreplantilla'])) ? $persona['nombreplantilla'] : 'Sin plantilla nominal';
            if ($persona['nombreplantilla'] != 'Sin plantilla nominal') {
                list($ordenplantilla,) = explode('-', $persona['nombreplantilla']);
                $longorden = strlen($ordenplantilla . '');
                $r[$p]['nombreplantilla'] = chr(96 + $longorden) . $persona['nombreplantilla'];//chr(96) caracter antes de letra "a"
            } else {
                $r[$p]['nombreplantilla'] = 'z-' . $persona['nombreplantilla'];
            }
        }
        echo json_encode(array('datos' => $r, 'cantidad' => $c));
    }

    public function obtenerpersonasexcluidasperiodosdepagoAction()
    {
        $idelaborarpagos = $this->_request->getPost('idelaborarpagos');
        $objPEP = new DatPersonaElaborarPagos();
        $arrayexcluidos = $objPEP->obtenerPersonaExcluidasElaborarPagos($idelaborarpagos);
        echo json_encode(array('datos' => $arrayexcluidos));
    }

    public function adicionarpersonasperiodopagoAction()
    {
        $idelaborarpagos = $this->_request->getPost('idelaborarpagos');
        $identidad = $this->_request->getPost('identidad');
        $modoseleccionpersonas = $this->_request->getPost('modoseleccionpersonas');
        $idreportescertificaciones = $this->_request->getPost('idreportescertificaciones');
        $arrpersonas = Zend_Json::decode(stripslashes($this->_getParam('arrpersonas')));
        $idperiodopago = $this->_request->getPost('idperiodopago');
        $objCO = new DatCargosOcupados();
        $objDatElaborarPago = DatElaborarPagos::obtenerPeriodosPagoEntidad($idelaborarpagos);
        $categoriaspersonalpago = ConfigModeloNomina::obtenerIdCategoriasPersonalPorTipoPago($objDatElaborarPago[0]['idtipopago']);
        $co = array();
        if ($modoseleccionpersonas == 1) { //Todas las personas
            $arrayc = array();
            foreach ($categoriaspersonalpago as $ic => $rc) {
                array_push($arrayc, $rc['idcategoria']);
            }
            $arrP = $objCO->obtenerPersonasOcupanCargosPeriodo($identidad, $idperiodopago);

            if (count($arrP) > 0) {
                $a = array();
                foreach ($arrP as $k => $v) {
                    $a[] = $v['idpersona'];
                }
                $a = array_unique($a);

                foreach ($a as $i => $p) {
                    foreach ($arrP as $j => $pe) {
                        if ($pe['idpersona'] == $p) {
                            $co[$p][] = $pe['idcargosocupados'];
                        }
                    }
                }

            }
        } elseif ($modoseleccionpersonas == 2) { //Personas especificas
            $arrP = $objCO->obtenerCargosOcupadosPersonas($arrpersonas, $identidad);
            $a = $arrpersonas;
            $a = array_unique($a);
            foreach ($a as $i => $p) {
                foreach ($arrP as $j => $pe) {
                    if ($pe['idpersona'] == $p) {
                        $co[$p][] = $pe['idcargosocupados'];
                    }
                }
            }
        } else { //Todas las personas reporte
            $datospersonas = DatElaborarPagos::obtenerPersonasReportes($identidad, $objDatElaborarPago[0]['idtipopago'],
                $objDatElaborarPago[0]['fechainicioperiodo'], $objDatElaborarPago[0]['fechafinperiodo'], $idelaborarpagos);

            $a = array();
            foreach ($datospersonas as $persona) {
                $a[] = $persona['idelemento'];
            }

            if (!empty($a)) { //Validando que halla personas
                $arrP = $objCO->obtenerCargosOcupadosPersonas($a, $identidad);
                $a = array_unique($a);
                foreach ($a as $i => $p) {
                    foreach ($arrP as $j => $pe) {
                        if ($pe['idpersona'] == $p) {
                            $co[$p][] = $pe['idcargosocupados'];
                        }
                    }
                }
            }
        }
        $m = new stdClass();
        if (count($a) > 0) {
            $datos = new stdClass();
            $objPEP = new DatPersonaElaborarPagos();
            $objPEPModel = new DatPersonaElaborarPagosModel();
            $objM = new DatElaborarPagosModel();

            //Dependencias
            $dependencias = $objM->obtenerDependenciasPeriodos($identidad, $objDatElaborarPago[0]['idtipopago'],
                $objDatElaborarPago[0]['fechainicioperiodo'], $objDatElaborarPago[0]['fechafinperiodo']);
            if (!empty($dependencias)) {
                $m->codigo = 'NO-DEPENDENCIAS';
                $m->dependencias = $dependencias;
                $m->cantdependencias = count(explode(";", $dependencias));
            } else {
                $arrPersonas = $objPEP->devolverPersonasNoCoinciden($idelaborarpagos, $a);
                $datos->idelaborarpagos = $idelaborarpagos;
                $datos->idreportescertificaciones = $idreportescertificaciones;
                $datos->modoseleccionpersonas = $modoseleccionpersonas;
                $datos->arrpersonas = $arrPersonas;
                $datos->arrcargosocupados = $co;
                $objPEPModel->adicionarPersonasElaborarPago($datos);
                $m->codigo = 'ADD-1';
            }
        } else {
            $m->codigo = 'NO-EXISTEN-1';
        }

        echo json_encode($m);
    }

    public function eliminarpersonasperiodopagoAction()
    {
        $arridpersonaelaborarpagos = json_decode($this->_request->getPost('arridpersonaelaborarpagos'));
        $objPEPModel = new DatPersonaElaborarPagosModel();
        $objPEPModel->eliminarPersonasElaborarPago($arridpersonaelaborarpagos);
        $m->codigo = 'DEL-1';
        echo json_encode($m);
    }

    public function excluirdenominaAction()
    {
        $arridpersonaelaborarpagos = json_decode($this->_request->getPost('arridpersonaelaborarpagos'));
        $excluir = $this->_request->getPost('excluir');
        $idcausaexclusion = $this->_request->getPost('idcausaexclusion');

        $objPEPModel = new DatPersonaElaborarPagosModel();
        $objPEPModel->excluiroNoPersonasElaborarPago($arridpersonaelaborarpagos, $excluir, $idcausaexclusion);
        $m->codigo = 'EXCLUIDOS';
        echo json_encode($m);
    }

    //Incluir persona a nomina
    public function incluirpersonanominaAction()
    {
        $arreglo = Zend_Json::decode(stripslashes($this->_getParam('arreglo')));

        $objPEPModel = new DatPersonaElaborarPagosModel();
        $objPEPModel->incluirNoPersonasElaborarPago($arreglo);
        $m->codigo = 'INCLUIDOS';
        echo json_encode($m);
    }

    public function obtenercargosysituacionlaboralAction()
    {
        $idpersonaelaborarpagos = $this->_request->getPost('idpersonaelaborarpagos');
        $identidad = $this->_request->getPost('identidad');
        $objEPPCO = new DatPersonaElaborarPagosCargosOcupados();
        $arrEPPCO = $objEPPCO->obtenerCargosOcupadosPersonaElaborarPago($idpersonaelaborarpagos);
        if (count($arrEPPCO) > 0) {
            $arrCO = array();
            foreach ($arrEPPCO as $i => $co) {
                $arrCO[] = $co['idcargosocupados'];
            }
            $objDomainCargosOcupados = new DatCargosOcupados();
            $arrCargoOcupPersona = $objDomainCargosOcupados->obtenerPersonaElaborarPagoCargosOcupados($arrCO);
            //$arrCargoOcupPersona = $objDomainCargosOcupados->obtenerCargosOcupadosPersonaPeriodo($identidad, $idpersona, $idperiodopago);
            $i = 0;
            $idcargo = 0;
            $arrCargo = array();
            $arrCargosSituacion = array();
            foreach ($arrCargoOcupPersona as $n => $s) {
                $idcargo = $s['idcargo'];
                if ($idcargo != '') {
                    $arrCargo = $this->integrator->metadatos->DameEstructura($idcargo);
                    $arrCargosSituacion[$i]['denomcargo'] = $arrCargo[0]->denominacion;
                } else {
                    $arrCargosSituacion[$i]['denomcargo'] = 'Sin cargo';
                }
                $arrCargosSituacion[$i]['idcargo'] = $s['idcargo'];

                if ($s['idsituacionlaboral'] != null) {
                    $arrCargosSituacion[$i]['idsituacionlaboral'] = $s['idsituacionlaboral'];
                    $arrCargosSituacion[$i]['denomsituacionlaboral'] = $s['denomsituacionlaboral'];
                } else {
                    $arrCargosSituacion[$i]['idsituacionlaboral'] = null;
                    $arrCargosSituacion[$i]['denomsituacionlaboral'] = "Sin situaci&oacute;n";
                }
                $arrCargosSituacion[$i]['idcargosocupados'] = $s['idcargosocupados'];
                $i++;
            }
            $cantTotalFinal = $objDomainCargosOcupados->cantdCargosOcupadosxPersona($idpersona, $identidad);
        }
        echo json_encode(array('datos' => $arrCargosSituacion, 'cantidad' => $cantTotalFinal));
    }

    public function obtenercausaexclusionAction()
    {
        $objCE = new NomCausasExclusionNomina();
        $r = $objCE->obtenerListadoCausasExclusionNomina(0, 1000000);
        echo json_encode($r);
    }

    public function verificarvariablespersonaAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idtipopago = $this->_request->getPost('idtipopago');
        $idsistemapago = $this->_request->getPost('idsistemapago');
        $sedesglosa = $this->_request->getPost('sedesglosa');
        $idperiodopago = $this->_request->getPost('idperiodopago');
        $idcargosocupados = $this->_request->getPost('idcargosocupados');
        $idpersonaelaborarpagos = $this->_request->getPost('idpersonaelaborarpagos');

        $objCO = new DatCargosOcupados();

        $objConceptosPDCargoSituacion = $objCO->obtenerConceptosPDAsociados($idcargosocupados);
        $objConfElementos = $objCO->obtenerConfElementosAsociados($idcargosocupados);

        if ($objConceptosPDCargoSituacion->resultado == 1) {
            foreach ($objConceptosPDCargoSituacion->datos as $k => $v) {
                $arrConceptos[] = $v['idconceptopercepciondescuento'];
            }
            if ($objConfElementos->resultado == 1) {
                $idsistemapago = $objConfElementos->datos[0]['idsistemapago'];
                $objCTSP = new ConfConceptosporTiposySistemasPago();
                $arr = $objCTSP->obtenerConfConceptosExistentes($identidad, $idtipopago, $idsistemapago, $sedesglosa, $arrConceptos);
                $objVNCPD = new NomVariableAuxiliarFormula();
                $arrC = $objVNCPD->obtenerVariablesPorArrConceptos(2, $arrConceptos);

                //Verifico si existen variables que no se han guardado
                $vars = null;
                $objVEP = new DatVariablesPersonasElaborarPagos();
                $a1 = array();
                foreach ($arr->conceptos as $i => $v) {
                    $a1[] = $v['id'];
                }

                $a2 = array();
                foreach ($arr->variables as $i => $v) {
                    $a2[] = $v['id'];
                }

                $a3 = array();
                foreach ($arrC as $i => $v) {
                    $a3[] = $v['id'];
                }

                $v1 = $objVEP->obtenerVariablesVerificarPersonaElaborarPagos(1, $idpersonaelaborarpagos, $idcargosocupados);
                $v2 = $objVEP->obtenerVariablesVerificarPersonaElaborarPagos(2, $idpersonaelaborarpagos, $idcargosocupados);
                $v3 = $objVEP->obtenerVariablesVerificarPersonaElaborarPagos(3, $idpersonaelaborarpagos, $idcargosocupados);

                $d1 = (count($a1) > 0 ? array_diff($a1, $v1) : array());
                $d2 = (count($a2) > 0 ? array_diff($a2, $v2) : array());
                $d3 = (count($a3) > 0 ? array_diff($a3, $v3) : array());

                $objVEPModel = new DatVariablesPersonasElaborarPagosModel();
                if (count($d1) > 0) {
                    $objVEPModel->adicionarVariables($d1, 1, $idpersonaelaborarpagos, $idcargosocupados);
                }
                if (count($d2) > 0) {
                    $objVEPModel->adicionarVariables($d2, 2, $idpersonaelaborarpagos, $idcargosocupados);
                }
                if (count($d3) > 0) {
                    $objVEPModel->adicionarVariables($d3, 3, $idpersonaelaborarpagos, $idcargosocupados);
                }

                $m->codigo = 'OK';

            } else {
                $m->codigo = 'NOSISTEMAPAGO';
            }
        } else {
            $m->codigo = 'NOCONCEPTOSPD';
        }
        echo json_encode($m);
    }

    public function obtenervariablespersonaAction()
    {
        $idpersonaelaborarpagos = $this->_request->getPost('idpersonaelaborarpagos');
        $idcargosocupados = $this->_request->getPost('idcargosocupados');
        $obj = new DatVariablesPersonasElaborarPagos();
        $r = $obj->obtenerVariablesPersonaElaborarPagos($idpersonaelaborarpagos, $idcargosocupados);
        $c = count($r);
        echo json_encode(array('datos' => $r, 'cantidad' => $c));
    }

    public function guardarvariablespersonaAction()
    {
        $arrVariablesValor = json_decode($this->_request->getPost('arrvariablesvalor'));
        $objM = new DatVariablesPersonasElaborarPagosModel();
        $objM->guardarValoresVariables($arrVariablesValor);
        $m->codigo = 'GUARDO';
        echo json_encode($m);
    }

    public function adicionarpersonasperiodo($idelaborarpagos, $identidad, $idperiodopago, $modoseleccionpersonas, $idtipopago, $fechainicio, $fechafin)
    {
        $objCO = new DatCargosOcupados();
        $objDatElaborarPago = DatElaborarPagos::obtenerPeriodosPagoEntidad($idelaborarpagos);
        $categoriaspersonalpago = ConfigModeloNomina::obtenerIdCategoriasPersonalPorTipoPago($objDatElaborarPago[0]['idtipopago']);
        $a = array();
        $co = array();
        if ($modoseleccionpersonas == 1) { //Todas las personas
            $arrayc = array();
            foreach ($categoriaspersonalpago as $ic => $rc) {
                array_push($arrayc, $rc['idcategoria']);
            }
            $arrP = $objCO->obtenerPersonasOcupanCargosPeriodo($identidad, $idperiodopago);
            if (count($arrP) > 0) {
                foreach ($arrP as $k => $v) {
                    $a[] = $v['idpersona'];
                }
                $a = array_unique($a);
                foreach ($a as $i => $p) {
                    foreach ($arrP as $j => $pe) {
                        if ($pe['idpersona'] == $p) {
                            $co[$p][] = $pe['idcargosocupados'];
                        }
                    }
                }
            }
        } elseif ($modoseleccionpersonas == 3) { //Todas las personas reporte
            $datospersonas = DatElaborarPagos::obtenerPersonasReportes($identidad, $idtipopago, $fechainicio, $fechafin, $idelaborarpagos);
            foreach ($datospersonas as $persona) {
                $a[] = $persona['idelemento'];
            }

            if (!empty($a)) { //Validando que halla personas
                $arrP = $objCO->obtenerCargosOcupadosPersonas($a, $identidad);
                $a = array_unique($a);
                foreach ($a as $i => $p) {
                    foreach ($arrP as $j => $pe) {
                        if ($pe['idpersona'] == $p) {
                            $co[$p][] = $pe['idcargosocupados'];
                        }
                    }
                }
            }
        }

        if (count($a) > 0) {
            $objPEP = new DatPersonaElaborarPagos();
            $arrPersonas = $objPEP->devolverPersonasNoCoinciden($idelaborarpagos, $a);
            $objPEPModel = new DatPersonaElaborarPagosModel();
            $datos = new stdClass();
            $datos->idelaborarpagos = $idelaborarpagos;
            $datos->modoseleccionpersonas = $modoseleccionpersonas;
            $datos->arrpersonas = $arrPersonas;
            $datos->arrcargosocupados = $co;
            $objPEPModel->adicionarPersonasElaborarPago($datos);
        }
    }

    public function obtenerconfigperiodospagosAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idtipopago = $this->_request->getPost('idtipopago');
        $idperiodopago = $this->_request->getPost('idperiodopago');
        $arrayFechas = ConfPeriodosTiposPagoModel::obtenerListadoFechas($identidad, $idtipopago, $idperiodopago);
        $r = array();
        foreach ($arrayFechas[0]['ConfDesglosePeriodos'] as $i => $fechas) {
            $r[$i]['iddesgloseperiodos'] = $fechas['iddesgloseperiodos'];
            $r[$i]['idperiodostipospago'] = $arrayFechas[0]['idperiodostipospago'];
            $r[$i]['idtipopago'] = $arrayFechas[0]['idtipopago'];
            $r[$i]['idperiodopago'] = $arrayFechas[0]['idperiodopago'];
            $r[$i]['fechainicioperiodo'] = $fechas['fdesde'];
            $r[$i]['fechafinperiodo'] = $fechas['fhasta'];
            $r[$i]['anno'] = explode('/', $fechas['fdesde'])[2];
        }

        //Ordenando los años descendentes
        foreach ($r as &$v) {
            $v['anno'] = (1 / $v['anno']) . '-' . $v['anno'];
        }

        //Imprimiendo el listado de las fechas de los periodos de pagos.
        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerperiodosdepagoreferenciadosAction(){
        $idelaborarpago = $this->_request->getPost('idelaborarpago');
        //Datos de los periodos referenciados
        $rperiodosref = DatElaborarPagosReferencia::obtenerIdElaborarPagosReferenciadosdadoIdElaborarPagos($idelaborarpago);
        $arrayidelaborarpagosref = array(); $cont = 0;
        foreach ($rperiodosref as $idepref){
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "SELECT ep.*, ntp.denominacion as tipopago
                FROM mod_nomina.dat_elaborarpagos ep
                INNER JOIN mod_nomina.nom_tipopago ntp ON (ntp.idtipopago = ep.idtipopago)
                WHERE ep.idelaborarpagos = ?";
            $datos = $conn->fetchAll($sql, array($idepref['idelaborarpagosreferenciados']));
            if(count($datos)>0){
                foreach ($datos as $rd){
                    $arrayidelaborarpagosref[$cont]['idelaborarpagosreferencia'] = $idepref['idelaborarpagosreferencia'];
                    $arrayidelaborarpagosref[$cont]['idelaborarpagos'] = $datos[0]['idelaborarpagos'];
                    $arrayidelaborarpagosref[$cont]['idtipopago'] = $datos[0]['idtipopago'];
                    $arrayidelaborarpagosref[$cont]['idperiodopago'] = $datos[0]['idperiodopago'];
                    $arrayidelaborarpagosref[$cont]['fechapago'] = $datos[0]['fechapago'];
                    $arrayidelaborarpagosref[$cont]['fechainicioperiodo'] = $datos[0]['fechainicioperiodo'];
                    $arrayidelaborarpagosref[$cont]['fechafinperiodo'] = $datos[0]['fechafinperiodo'];
                    $arrayidelaborarpagosref[$cont]['mesanyopago'] = $datos[0]['mesanyopago'];
                    $arrayidelaborarpagosref[$cont]['estado'] = $datos[0]['estado'];
                    $arrayidelaborarpagosref[$cont]['identidad'] = $datos[0]['identidad'];
                    $arrayidelaborarpagosref[$cont]['descripcion'] = $datos[0]['descripcion'];
                    $arrayidelaborarpagosref[$cont]['periodopago'] = $datos[0]['fechainicioperiodo'] .' al '. $datos[0]['fechafinperiodo'];
                    $arrayidelaborarpagosref[$cont]['denomtipopago'] = $datos[0]['tipopago'];
                    $cont++;
                }
            }
        }
        echo json_encode(array('datos'=>$arrayidelaborarpagosref, 'cantidad'=>count($arrayidelaborarpagosref)));
    }

    public function adicionarPeriodosReferenciadosAction(){
        $idelaborarpago = $this->_request->getPost('idelaborarpago');
        $arrayidep = Zend_Json::decode(stripslashes($this->_request->getPost('arrayidep')));
        if(count($arrayidep)>0){
            foreach ($arrayidep as $idepref){
                $objSave = new DatElaborarPagosReferencia();
                $objSave->idelaborarpagos = $idelaborarpago;
                $objSave->idelaborarpagosreferenciados = $idepref;
                $objSave->save();
            }
        }
        echo json_encode('ok');
    }

    public function validarReferenciasPeriodosPagoAction(){
        $idtipopago = $this->_request->getPost('idtipopago');
        $identidad = $this->_request->getPost('identidad');
        //Tipo de nomina del tipo de pago
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT cemn.*, ntp.idtipopago
        FROM mod_nomina.nom_tipopago ntp
        INNER JOIN mod_nomina.conf_modelonomina mn ON (mn.idtipopago = ntp.idtipopago)
        INNER JOIN mod_nomina.nom_tiponomina tn ON (tn.idtiponomina = mn.idtiponomina)
        INNER JOIN mod_nomina.conf_estructuramodelosnomina cemn ON (cemn.idtiponomina = tn.idtiponomina)
        INNER JOIN mod_nomina.conf_estructuramodelosnominaentidad cemnen ON (cemnen.idestructuramodelodomina = cemn.idestructuramodelodomina)
        WHERE ntp.idtipopago = ? and cemnen.idestructura = ? and cemn.idtipocampo = 4 and cemn.tiporeferencia = 2";
        $arrestnomina = $conn->fetchAll($sql, array($idtipopago, $identidad));
        if(count($arrestnomina)>0){
            foreach ($arrestnomina as $remn){
                //Si es un campo de referencias y las referencias son a periodos especificos
                $respuesta = $this->pIntegrator->comun->GuardarExpresionesMatematicas(array($remn['idvalormostrar']));
                $arrIndFormulas = $this->pIntegrator->comun->ObtenerarrIdIndicadoresporArrayExpresionMatematica(array($remn['idvalormostrar']));
                foreach ($arrIndFormulas as $ridfref) {
                    foreach ($ridfref as $ridestnominacampoformularef) {
                        $rexplode = explode('_', $ridestnominacampoformularef);
                        $arridtiposnominasref[] = $rexplode[0];
                    }
                }
            }
            $arridtiposnominasref = array_unique($arridtiposnominasref);
            if(count($arridtiposnominasref)>0){
                //Obteniendo los tipos de pagos de los tipos de nomina referenciados
                $sqltipospago = "SELECT ntp.idtipopago, ntp.denominacion
                FROM mod_nomina.nom_tipopago ntp
                INNER JOIN mod_nomina.conf_modelonomina mn ON (mn.idtipopago = ntp.idtipopago)
                INNER JOIN mod_nomina.nom_tiponomina tn ON (tn.idtiponomina = mn.idtiponomina)
                WHERE tn.idtiponomina IN (" . implode(',', $arridtiposnominasref) . ")";
                $arridtipospagoref = $conn->fetchAll($sqltipospago);
                $rtipospagorref = array();
                $rtipospagorrefinal = array();
                foreach ($arridtipospagoref as $rtp){
                    $rtipospagorref[] = $rtp['idtipopago'];
                    $rdenomtipospagorref[] = $rtp['denominacion'];
                }
                $rtipospagorrefinal['denominacion'] = implode(',', $rdenomtipospagorref);
                $rtipospagorrefinal['tipospago'] = $rtipospagorref;
                echo json_encode($rtipospagorrefinal);
            }else{
                json_encode(array('tipospago'=>array()));
            }

        }else{
            echo json_encode(array('tipospago'=>array()));
        }
    }

    public function eliminarReferenciasPeriodosPagoAction(){
        $arrayidelaborarpagosreferencia = Zend_Json::decode(stripslashes($this->_request->getPost('arrayidelaborarpagosreferencia')));
        foreach ($arrayidelaborarpagosreferencia as $idelaborarpagosreferencia){
            $objDelete = Doctrine::getTable('DatElaborarPagosReferencia')->find($idelaborarpagosreferencia);
            $objDelete->delete();
        }
        echo json_encode('ok');
    }
}
