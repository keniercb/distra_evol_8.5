<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class PlanificacionvacacionesController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function planificacionvacacionesAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista.
        $this->render('planificacionvacaciones');
    }

    public function getPersonasporcargoAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 30000);
        $idestructura = $this->_getParam('idestructura');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $filtro = $this->_getParam('filtro');
        $anno = $this->_getParam('anno');
        $personaspasadasvac = array();
        $personasproxvac = array();
        $datAsistencia = new DatAsistencia();
        //$planif = new DatPlanificacionvacacionesModel();
        // $result = $planif->getVacacionesByPeriodo($idestructura,null,'01/01/2019', '28/01/2019');

        $datAsistenciaModel = new DatAsistenciaModel();
        $arrayCargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $_SESSION['Zeolides']['perfil']['iddominio'], false);
        $cargos = array();
        foreach ($arrayCargos as $cargo) {
            array_push($cargos, $cargo['idcargo']);
        }
        $objDatos = $datAsistencia->GetDatosPersonaReporte($cargos, $filtro, $limit, $start);
        $cantidad = count($datAsistencia->GetDatosPersonaReporte($cargos, $filtro, null, 0));

        /* foreach ($objDatos as $k => $v) {
             //////////////////////////////Servicio de nomina///////////////////////
             $errorNomina = true;
             try {
                 $servicionomina = ZendExt_IoC::getInstance()->pvd->getDiasImpAcumuladosVacPersEntidad($v['idpersona'], $v['identidad']);
                 if ($servicionomina->dias != 0) {
                     $acumvac = explode('.', $servicionomina->dias);
                     if ($acumvac[0] >= 24) {
                         array_push(
                             $personaspasadasvac, '<li>' . $v['nombreapellidos'] . '</li>'
                         );
                     } else if ($acumvac[0] >= 20) {
                         array_push(
                             $personasproxvac, '<li>' . $v['nombreapellidos'] . '</li>'
                         );
                     }
                 }
             } catch (Exception $e) {
                 $errorNomina = false;
             }
         }*/
        $arrPersonas = $objDatos;
        if (count($arrPersonas) > 0) {
//            $cargos = array_unique($cargos);
//            $arrPersonas = $datAsistenciaModel->ordenarInfoByCargo($cargos, $arrPersonas);

            $denomarea = array();
            foreach ($arrPersonas as $p => $dat) {
                if (!in_array($dat['idarea'], $denomarea)) {
                    $denomarea[$dat['idarea']] = $dat['idarea'];
                }
            }
            foreach ($denomarea as $i => $e) {
                $area = array();
                $denomestructura = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($e), false);
                $partes = explode('/', $denomestructura[0]['rutaId']);
                foreach ($partes as $j => $v) {
                    $p = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v);
                    if ($p[0]->idconcepto == 3 || $p[0]->idconcepto == 5) {
                        array_push($area, $p[0]->denominacion);
                    }
                }
                $denomarea[$e] = implode('->', $area);
            }

            foreach ($arrPersonas as $key => $per) {
                $arrPersonas[$key]['area'] = (is_numeric($per['idarea'])) ? $denomarea[$per['idarea']] : 'NO ASIGNADO A CARGO';
                //////////////////////////////Servicio de nomina///////////////////////
                $errorNomina = true;
                try {
                    $servicionomina = ZendExt_IoC::getInstance()->pvd->getDiasImpAcumuladosVacPersEntidad($per['idpersona'], $per['identidad']);
                    $arrPersonas[$key]['saldovacacumuladas'] = $servicionomina->dias != 0 ? round($servicionomina->dias, 2) : "";
                    $arrPersonas[$key]['importevacacumuladas'] = $servicionomina->importe != 0 ? '$' . round($servicionomina->importe, 2) : "";
                    if ($servicionomina->dias != 0) {
                        $acumvac = explode('.', $servicionomina->dias);
                        if ($acumvac[0] >= 24) {
                            $arrPersonas[$key]['bandera'] = 1;
                        } else if ($acumvac[0] >= 20) {
                            $arrPersonas[$key]['bandera'] = 2;
                        } else {
                            $arrPersonas[$key]['bandera'] = 0;
                        }
                    }
                    $anno_anterior = date("Y", strtotime(date('Y-m-d') . " -1 year"));
                    $vacdiciembre = ZendExt_IoC::getInstance()->pvd->obtenerSaldosVacacionesPersonaEntidadMesAnno(array($per['idpersona']), $per['identidad'], 12, $anno_anterior);
                    $arrPersonas[$key]['saldodic'] = $vacdiciembre[0]['saldoentiempo'] != null ? round($vacdiciembre[0]['saldoentiempo'], 2) : "";
                    $arrPersonas[$key]['importedic'] = $vacdiciembre[0]['saldoenimporte'] != null ? '$' . round($vacdiciembre[0]['saldoenimporte'], 2) : "";
                } catch (Exception $e) {
                    $arrPersonas[$key]['saldovacacumuladas'] = "";
                    $arrPersonas[$key]['importevacacumuladas'] = "";
                    $errorNomina = false;
                }
                $arrPersonas[$key]['saldodic'] = '';
                $arrPersonas[$key]['importedic'] = '';
                $arrPersonas[$key]['importeactual'] = '';
                $datplanvac = new DatPlanificacionvacaciones();
                $planvac = $datplanvac->getPlanvacacionesIdPersona($per['idpersona'], $anno);
                $arrPersonas[$key]['priquinenero'] = $planvac[0]['priquincena'] != null ? $planvac[0]['priquincena'] : "";
                $arrPersonas[$key]['segquinenero'] = $planvac[0]['segquincena'] != null ? $planvac[0]['segquincena'] : "";
                $arrPersonas[$key]['priquinfebrero'] = $planvac[1]['priquincena'] != null ? $planvac[1]['priquincena'] : "";
                $arrPersonas[$key]['segquinfebrero'] = $planvac[1]['segquincena'] != null ? $planvac[1]['segquincena'] : "";
                $arrPersonas[$key]['priquinmarzo'] = $planvac[2]['priquincena'] != null ? $planvac[2]['priquincena'] : "";
                $arrPersonas[$key]['segquinmarzo'] = $planvac[2]['segquincena'] != null ? $planvac[2]['segquincena'] : "";
                $arrPersonas[$key]['priquinabril'] = $planvac[3]['priquincena'] != null ? $planvac[3]['priquincena'] : "";
                $arrPersonas[$key]['segquinabril'] = $planvac[3]['segquincena'] != null ? $planvac[3]['segquincena'] : "";
                $arrPersonas[$key]['priquinmayo'] = $planvac[4]['priquincena'] != null ? $planvac[4]['priquincena'] : "";
                $arrPersonas[$key]['segquinmayo'] = $planvac[4]['segquincena'] != null ? $planvac[4]['segquincena'] : "";
                $arrPersonas[$key]['priquinjunio'] = $planvac[5]['priquincena'] != null ? $planvac[5]['priquincena'] : "";
                $arrPersonas[$key]['segquinjunio'] = $planvac[5]['segquincena'] != null ? $planvac[5]['segquincena'] : "";
                $arrPersonas[$key]['priquinjulio'] = $planvac[6]['priquincena'] != null ? $planvac[6]['priquincena'] : "";
                $arrPersonas[$key]['segquinjulio'] = $planvac[6]['segquincena'] != null ? $planvac[6]['segquincena'] : "";
                $arrPersonas[$key]['priquinagosto'] = $planvac[7]['priquincena'] != null ? $planvac[7]['priquincena'] : "";
                $arrPersonas[$key]['segquinagosto'] = $planvac[7]['segquincena'] != null ? $planvac[7]['segquincena'] : "";
                $arrPersonas[$key]['priquinseptiembre'] = $planvac[8]['priquincena'] != null ? $planvac[8]['priquincena'] : "";
                $arrPersonas[$key]['segquinseptiembre'] = $planvac[8]['segquincena'] != null ? $planvac[8]['segquincena'] : "";
                $arrPersonas[$key]['priquinoctubre'] = $planvac[9]['priquincena'] != null ? $planvac[9]['priquincena'] : "";
                $arrPersonas[$key]['segquinoctubre'] = $planvac[9]['segquincena'] != null ? $planvac[9]['segquincena'] : "";
                $arrPersonas[$key]['priquinnoviembre'] = $planvac[10]['priquincena'] != null ? $planvac[10]['priquincena'] : "";
                $arrPersonas[$key]['segquinnoviembre'] = $planvac[10]['segquincena'] != null ? $planvac[10]['segquincena'] : "";
                $arrPersonas[$key]['priquindiciembre'] = $planvac[11]['priquincena'] != null ? $planvac[11]['priquincena'] : "";
                $arrPersonas[$key]['segquindiciembre'] = $planvac[11]['segquincena'] != null ? $planvac[11]['segquincena'] : "";
            }
            $result['cantidad'] = $cantidad;
            $result['datos'] = $arrPersonas;
            $result['personaspasadasvac'] = $personaspasadasvac;
            $result['personasproxvac'] = $personasproxvac;
            $result['cod'] = 1;
        } else {
            $result['cantidad'] = 0;
            $result['datos'] = array();
            $result['cod'] = 3;
        }
        echo(json_encode($result));
    }

    function guardarPlanVacacionesAction()
    {
        $datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $anno = $this->_request->getPost('anno');
        $result = true;
        try {
            $datplanvacModel = new DatPlanificacionvacacionesModel();
            $result = $datplanvacModel->guardarPlanVacaciones($datos, $anno);
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
            $result = false;
        }
        echo json_encode($result);
    }

    function exportarAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $denomestructura = $this->_getParam('estructura');
        $filtro = $this->_getParam('filtro');
        $idconcepto = $this->_getParam('idconcepto');
        $anno = $this->_getParam('anno');
        $fecha = $this->_getParam('fecha');
        $datAsistencia = new DatAsistencia();
        $datAsistenciaModel = new DatAsistenciaModel();
        $idpersonas = array();
        $idpersona = json_decode(stripslashes($this->_getParam('idpersonas')));

        $cargosPeople = array();
        if (count($idpersona) > 0) {
            $idpersonas = $idpersona;
            $person = $datAsistencia->getdatospersona($idpersonas);
            foreach ($person as $v) {
                array_push($cargosPeople, $v['idcargo']);
            }
        } else {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $arrayCargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $_SESSION['Zeolides']['perfil']['iddominio'], false);

            foreach ($arrayCargos as $in => $cargoest) {
                $cargosPeople[$in] = $cargoest['idcargo'];
            }
            $asistencia = new DatAsistencia();
            if (count($cargosPeople) > 0)
                $datos = $asistencia->GetDatosPersonaReporte($cargosPeople, $filtro);

            foreach ($datos as $i => $per) {
                $idpersonas[$i] = $per['idpersona'];
            }
            $person = $datAsistencia->getdatospersona($idpersonas);
        }

        if (count($idpersonas) > 0) {
            // $cargosPeople = array_unique($cargosPeople);
            // $arrPersonas = $datAsistenciaModel->ordenarInfoByCargo($cargosPeople, $person);
            $arrPersonas = $datAsistencia->OrderPersonasByCargo($person, null, 0);
            //$arrPersonas = array_reverse($arrPersonas);
            $denomarea = array();
            foreach ($arrPersonas as $p => $dat) {
                if (!in_array($dat['idarea'], $denomarea)) {
                    $denomarea[$dat['idarea']] = $dat['idarea'];
                }
            }
            foreach ($denomarea as $i => $e) {
                $area = array();
                $denomestructura = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($e), false);
                $partes = explode('/', $denomestructura[0]['rutaId']);
                foreach ($partes as $j => $v) {
                    $p = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v);
                    if ($p[0]->idconcepto == 3 || $p[0]->idconcepto == 5) {
                        array_push($area, $p[0]->denominacion);
                    }
                }
                $denomarea[$e] = implode('->', $area);
            }
            foreach ($arrPersonas as $key => $per) {
                $arrPersonas[$key]['area'] = (is_numeric($per['idarea'])) ? $denomarea[$per['idarea']] : 'NO ASIGNADO A CARGO';
                $arrPersonas[$key]['idarea'] = $per['idarea'];
                //////////////////////////////Servicio de nomina///////////////////////
                $errorNomina = true;
                try {
                    $servicionomina = ZendExt_IoC::getInstance()->pvd->getDiasImpAcumuladosVacPersEntidad($per['idpersona'], $per['identidad']);
                    $arrPersonas[$key]['vacacumuladas'] = $servicionomina->dias != 0 ? round($servicionomina->dias, 2) : "";
                } catch (Exception $e) {
                    $arrPersonas[$key]['vacacumuladas'] = "";
                    $errorNomina = false;
                }
                $datplanvac = new DatPlanificacionvacaciones();
                $planvac = $datplanvac->getPlanvacacionesIdPersona($per['idpersona'], $anno);
                $arrPersonas[$key]['priquinenero'] = $planvac[0]['priquincena'] != null ? $planvac[0]['priquincena'] : "";
                $arrPersonas[$key]['segquinenero'] = $planvac[0]['segquincena'] != null ? $planvac[0]['segquincena'] : "";
                $arrPersonas[$key]['priquinfebrero'] = $planvac[1]['priquincena'] != null ? $planvac[1]['priquincena'] : "";
                $arrPersonas[$key]['segquinfebrero'] = $planvac[1]['segquincena'] != null ? $planvac[1]['segquincena'] : "";
                $arrPersonas[$key]['priquinmarzo'] = $planvac[2]['priquincena'] != null ? $planvac[2]['priquincena'] : "";
                $arrPersonas[$key]['segquinmarzo'] = $planvac[2]['segquincena'] != null ? $planvac[2]['segquincena'] : "";
                $arrPersonas[$key]['priquinabril'] = $planvac[3]['priquincena'] != null ? $planvac[3]['priquincena'] : "";
                $arrPersonas[$key]['segquinabril'] = $planvac[3]['segquincena'] != null ? $planvac[3]['segquincena'] : "";
                $arrPersonas[$key]['priquinmayo'] = $planvac[4]['priquincena'] != null ? $planvac[4]['priquincena'] : "";
                $arrPersonas[$key]['segquinmayo'] = $planvac[4]['segquincena'] != null ? $planvac[4]['segquincena'] : "";
                $arrPersonas[$key]['priquinjunio'] = $planvac[5]['priquincena'] != null ? $planvac[5]['priquincena'] : "";
                $arrPersonas[$key]['segquinjunio'] = $planvac[5]['segquincena'] != null ? $planvac[5]['segquincena'] : "";
                $arrPersonas[$key]['priquinjulio'] = $planvac[6]['priquincena'] != null ? $planvac[6]['priquincena'] : "";
                $arrPersonas[$key]['segquinjulio'] = $planvac[6]['segquincena'] != null ? $planvac[6]['segquincena'] : "";
                $arrPersonas[$key]['priquinagosto'] = $planvac[7]['priquincena'] != null ? $planvac[7]['priquincena'] : "";
                $arrPersonas[$key]['segquinagosto'] = $planvac[7]['segquincena'] != null ? $planvac[7]['segquincena'] : "";
                $arrPersonas[$key]['priquinseptiembre'] = $planvac[8]['priquincena'] != null ? $planvac[8]['priquincena'] : "";
                $arrPersonas[$key]['segquinseptiembre'] = $planvac[8]['segquincena'] != null ? $planvac[8]['segquincena'] : "";
                $arrPersonas[$key]['priquinoctubre'] = $planvac[9]['priquincena'] != null ? $planvac[9]['priquincena'] : "";
                $arrPersonas[$key]['segquinoctubre'] = $planvac[9]['segquincena'] != null ? $planvac[9]['segquincena'] : "";
                $arrPersonas[$key]['priquinnoviembre'] = $planvac[10]['priquincena'] != null ? $planvac[10]['priquincena'] : "";
                $arrPersonas[$key]['segquinnoviembre'] = $planvac[10]['segquincena'] != null ? $planvac[10]['segquincena'] : "";
                $arrPersonas[$key]['priquindiciembre'] = $planvac[11]['priquincena'] != null ? $planvac[11]['priquincena'] : "";
                $arrPersonas[$key]['segquindiciembre'] = $planvac[11]['segquincena'] != null ? $planvac[11]['segquincena'] : "";
            }
            $result = $arrPersonas;
        } else {
            $result = array();
        }
        $array = array();
        foreach ($arrPersonas as $j => $value) {
            array_push($array, $value['area']);
        }
        $areas = array_unique($array);
        $obj = new DatpdfplanvacacionesModel();
        $var = $obj->construirReporte($result, $anno, $denomestructura, $fecha, $areas);
        echo(json_encode('ok'));
    }

    function exportaractaposposicionvacacionesAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $denomestructura = $this->_getParam('estructura');
        $filtro = $this->_getParam('filtro');
        $anno = $this->_getParam('anno');
        $fecha = $this->_getParam('fecha');
        $director = json_decode(stripslashes($this->_getParam('director')));
        $seccionsindical = json_decode(stripslashes($this->_getParam('seccionsindical')));
        $datAsistencia = new DatAsistencia();
        $DAM = new DatAsistenciaModel();
        $idpersonas = array();
        $idpersona = json_decode(stripslashes($this->_getParam('idpersonas')));

        if (count($idpersona) > 0) {
            $idpersonas = $idpersona;
        } else {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

            foreach ($cargosEstructura as $in => $cargoest) {
                $cargosPeople[$in] = $cargoest['idcargo'];
            }
            $asistencia = new DatAsistencia();
            if (count($cargosPeople) > 0)
                $datos = $asistencia->GetDatosPersonaReporte($cargosPeople, $filtro);

            foreach ($datos as $i => $per) {
                $idpersonas[$i] = $per['idpersona'];
            }
        }
        $person = $datAsistencia->getdatospersona($idpersonas);

        foreach ($person as $k => $v) {
            $datregistromodelovac = new DatRegistromodelovac();
            $datregistromodelovac->deleteRegitroModeloVac($v['idpersona'], $anno);
            $datregistromodelovac->idpersona = $v['idpersona'];
            $datregistromodelovac->idcargo = $v['idcargo'];
            $datregistromodelovac->idarea = $v['idarea'];
            $datregistromodelovac->anno = $anno;
            $datregistromodelovac->save();
        }
        $regmodelovac = array();
        $idsregmodelovac = array();
        $denomarea = array();
        $datregistromodelovac = new DatRegistromodelovac();
        $regmodelovac = $datregistromodelovac->getRegistrosmodelovac();
        foreach ($regmodelovac as $k => $v) {
            array_push($idsregmodelovac, $v['idpersona']);
            /*if (!in_array($v['idarea'], $denomarea)) {
                $denomarea[$v['idarea']] = $v['idarea'];
            }*/
        }
        $registros = $datAsistencia->getdatospersona($idsregmodelovac);

        /*foreach ($denomarea as $i => $e) {
            $denomestructura = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($e), false);

            $partes = explode('/', $denomestructura[0]['rutaDenominacion']);
            if ($partes[2] || $partes[3]) {
                if ($partes[3])
                    $area = $partes[2] . '->' . $partes[3];
                else
                    $area = $partes[2];
            } else {
                $area = $partes[1];
            }
            $denomarea[$e] = $area;
        }*/
        //print_r($denomestructura[0]['rutaDenominacion']);die;
        $obj = new DatpdfactaposposicionvacacionesModel();
        //$denEntAreas = $DAM->GetDenomEntAreas($person);
        $var = $obj->construirReporte($person, $anno, $denomestructura, $fecha/*, $denEntAreas*/, $director, $seccionsindical, $registros/*,$denomarea*/);
        echo(json_encode('ok'));
    }

    function recibirParametrosExportarModeloCVacacionesAction()
    {
        $_SESSION['modeloCVParametros'] = json_decode(stripslashes($this->_getParam('params')));
        echo json_encode(true);
    }

    function exportarmodeloscvacacionesAction()
    {
        $params = $_SESSION['modeloCVParametros'];
        $idestructura = $params->idestructura;
        $anno = $params->anno;
        $fecha = $params->fecha;
        $datAsistencia = new DatAsistencia();
        $DAM = new DatAsistenciaModel();
        $calendario = new ConfCalendario();
        $calendariopersona = new ConfCalendariopersona();
        $idpersonas = array();
        $idpersonasplanvac = $params->idpersonasplanvac;
        $revisadopor = $params->revisadopor;
        $aprobadopor = $params->aprobadopor;
        $condatos = $params->datos;
        $datapersonavac = array();
        $idpersona = array();
        $personasistencia = array();

        foreach ($idpersonasplanvac as $p => $dat) {
            $datapersonavac[$dat->idpersona][] = $dat;
            array_push($idpersona, $dat->idpersona);
        }
        if (count($idpersona) > 0) {
            $idpersonas = $idpersona;
        } else {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

            foreach ($cargosEstructura as $in => $cargoest) {
                $cargosPeople[$in] = $cargoest['idcargo'];
            }
            $asistencia = new DatAsistencia();
            if (count($cargosPeople) > 0)
                $datos = $asistencia->GetDatosPersonaReporte($cargosPeople);

            foreach ($datos as $i => $per) {
                $idpersonas[$i] = $per['idpersona'];
            }
        }
        $person = $datAsistencia->getdatospersona($idpersonas);

        $denEntAreas = $DAM->GetDenomEntAreas($person);

        $denomarea = array();
        $datpersona = array();
        foreach ($person as $p => $dat) {
            if (!in_array($dat['idarea'], $denomarea)) {
                $denomarea[$dat['idarea']] = $dat['idarea'];
            }
        }

        $arraypersonas = array();
        foreach ($person as $key => $per) {
            foreach ($datapersonavac[$per['idpersona']] as $i => $v) {
                $datpersona[$key][$v->idmes]['idpersona'] = $per['idpersona'];
                $datpersona[$key][$v->idmes]['nombreapellidos'] = $per['nombreapellidos'];
                $datpersona[$key][$v->idmes]['nombre'] = $per['nombre'];
                $datpersona[$key][$v->idmes]['snombre'] = $per['snombre'];
                $datpersona[$key][$v->idmes]['papel'] = $per['papel'];
                $datpersona[$key][$v->idmes]['sapel'] = $per['sapel'];
                $datpersona[$key][$v->idmes]['noidentidad'] = $per['noidentidad'];
                $datpersona[$key][$v->idmes]['idgrupodescanso'] = $per['idgrupodescanso'];
                $datpersona[$key][$v->idmes]['idturnotrabajo'] = $per['idturnotrabajo'];
                $datpersona[$key][$v->idmes]['idcargo'] = $per['idcargo'];
                $datpersona[$key][$v->idmes]['idpersonacontrola'] = $v->idpersonacontrola;
                $datpersona[$key][$v->idmes]['idpersonamodifica'] = $v->idpersonamodifica;
                $datpersona[$key][$v->idmes]['area'] = (is_numeric($per['idarea'])) ? $denEntAreas[$per['idarea']]['denominacion'] : 'NO ASIGNADO A CARGO';

                if ($condatos == 1) {
                    $datpersona[$key][$v->idmes]['fdesde'] = $v->fdesde;
                    $datpersona[$key][$v->idmes]['fhasta'] = $v->fhasta;
                    $datpersona[$key][$v->idmes]['diasnaturales'] = $v->diasnaturales;
                    if (!empty($v->fdesde) && !empty($v->fhasta)) {
                        $calend = $calendariopersona->getCalendarioPersonaTrabajo($v->fdesde, $v->fhasta, $per['idpersona']);
                        $diashabiles = count($calend);
                        $datpersona[$key][$v->idmes]['diashabiles'] = $diashabiles;
                        $data = array(array('idpersona' => $per['idpersona'], 'diashabiles' => $diashabiles));

                        $saldovacaciones = ZendExt_IoC_Inter::getInstance()->pvd->buscarsaldosVacacionesPersonas($per['identidad'], $data);
                        if ($saldovacaciones[0]['tienesaldo'] == true) {
                            $datpersona[$key][$v->idmes]['diasacumulados'] = round($saldovacaciones[0]['diasacumulados'], 2);
                            $datpersona[$key][$v->idmes]['importeacumulado'] = round($saldovacaciones[0]['importeacumulado'], 2);
                            $datpersona[$key][$v->idmes]['importecobrar'] = round($saldovacaciones[0]['importecobrar'], 2);
                            $datpersona[$key][$v->idmes]['saldotiempo'] = round($saldovacaciones[0]['saldotiempo'], 2);
                            $datpersona[$key][$v->idmes]['saldoimporte'] = round($saldovacaciones[0]['saldoimporte'], 2);
                        } else {
                            $datpersona[$key][$v->idmes]['diasacumulados'] = '';
                            $datpersona[$key][$v->idmes]['importeacumulado'] = '';
                            $datpersona[$key][$v->idmes]['importecobrar'] = '';
                            $datpersona[$key][$v->idmes]['saldotiempo'] = '';
                            $datpersona[$key][$v->idmes]['saldoimporte'] = '';
                        }
                    }
                }
            }
        }
        if (count($datpersona) > 0) {
            //Guardando la asistencia con la causa de vacaciones en Gestionar asistencia//
            foreach ($datpersona as $k => $p) {
                foreach ($p as $i => $v) {
                    $datasistencia = new DatAsistencia();
                    $configRegimen = new ConfCalendarioModel();
                    $fini = explode('T', $v['fdesde']);
                    if (count($fini) == 1) {
                        $desde = $v['fdesde'];
                    } else {
                        $fd = explode('-', $fini[0]);
                        $desde = $fd[2] . '/' . $fd[1] . '/' . $fd[0];
                    }
                    if (!empty($v['fdesde']) && !empty($v['fhasta'])) {
                        $fd = explode('/', $desde);
                        $fechd = $fd[2] . '-' . $fd[1] . '-' . $fd[0];
                        $fh = explode('/', $v['fhasta']);
                        $fechh = $fh[2] . '-' . $fh[1] . '-' . $fh[0];
                        $datasistencia->DeleteIncidenciasByRange($v['idpersona'], $fechd, $fechh);
                        $asistencia = new DatAsistencia();
                        $asistencia->idpersona = $v['idpersona'];
                        $asistencia->idcargo = $v['idcargo'];
                        $asistencia->idgrupodescanso = $v['idgrupodescanso'];
                        $asistencia->idturnotrabajo = $v['idturnotrabajo'];
                        $asistencia->fechahoraentrada = null;
                        $asistencia->idcausa = 4;
                        $asistencia->fdesde = $desde;
                        $asistencia->fhasta = $v['fhasta'];
                        $h = $calendariopersona->getHorasCalendarioPersona($desde, $v['fhasta'], $v['idpersona']);
                        $auxh = explode(':', $h[0]['sum']);
                        $asistencia->hrsdescontadas = ((int)$h[0]['sum'] > '00:00:00') ? $auxh[0] . ':' . $auxh[1] : null;
                        $asistencia->fecharegistro = $desde;
                        $asistencia->fechahorasalida = null;
                        $asistencia->observacion = null;
                        $asistencia->horasextras = null;
                        $asistencia->idpersonacontrola = null;
                        $asistencia->idpersonamodifica = null;
                        $asistencia->hrstrabajadas = '00:00:00';
                        $asistencia->idpersonacontrola = $_SESSION['Zeolides']['perfil']['idpersona'];
                        $asistencia->origen = 1;
                        $asistencia->save();
                    }
                }
            }

            
// Obtener los datos de pie de firma de la entidad para el documento
$pieFirmas = ZendExt_IoC_Inter::getInstance()->maestro->getPieFirmaDocumentoXIdEntidad($idestructura, 3);

// Inicializamos la variable para el nombre
$nombreHechoPor = "";

// Se busca el registro con 'tipofirma' igual a 'Hecho por'
if (!empty($pieFirmas)) {
    foreach ($pieFirmas as $firma) {
        // Se ajusta el texto 'Hecho por' según el valor real en tu base de datos
        if (isset($firma['tipofirma']) && trim(strtolower($firma['tipofirma'])) == 'hecho por') {
            $nombreHechoPor = $firma['persona'];
            break;
        }
    }
}

// Se crea el objeto elaboradopor y asignamos el nombre obtenido
$elaboradopor = new stdClass();
$elaboradopor->nombrepersona = $nombreHechoPor;

// Llamamos al método construirReporte con el nombre ya asignado
$obj = new DatpdfmodeloscvacacionesModel();
$var = $obj->construirReporte($datpersona, $anno, $fecha, $revisadopor, $aprobadopor, $elaboradopor);

// Retornamos confirmación y el nombre para verificar
echo json_encode([
    'status' => 'ok',
    'nombre_hechopor' => $elaboradopor->nombrepersona
]);



        }
        unset($_SESSION['modeloCVParametros']);
    }

    public function eliminarVacacionesAction()
    {
        $datos = json_decode(stripslashes($this->_getParam('datos')));
        foreach ($datos as $i => $v) {
            $datasistencia = new DatAsistencia();
            if (!empty($v->fdesde) && !empty($v->fhasta)) {
                $datasistencia->DelAsistenciaOnDatesByPerson($v->idpersona, $v->fdesde);
            }
        }
        echo json_encode(true);
    }

    public function getPersonasModeloVacAction()
    {
        $temp = $this->_getParam('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $idestructura = $this->_getParam('idestructura');
        $anno = $this->_getParam('anno');
        $idpersonas = array();
        $idpersona = json_decode(stripslashes($this->_getParam('idpersonas')));
        if (count($idpersona) > 0) {
            $idpersonas = $idpersona;
        } else {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

            foreach ($cargosEstructura as $in => $cargoest) {
                $cargosPeople[$in] = $cargoest['idcargo'];
            }
            $asistencia = new DatAsistencia();
            if (count($cargosPeople) > 0)
                $datos = $asistencia->GetDatosPersonaReporte($cargosPeople, $filtro);
            foreach ($datos as $i => $per) {
                $idpersonas[$i] = $per['idpersona'];
            }
        }
        $resultado = $this->getPersonasModeloVac($idpersonas, $anno);

        echo(json_encode($resultado));
    }

    private function getPersonasModeloVac($idpersonas, $anno)
    {
        $personassinvac = array();
        $result = array();
        $datAsistencia = new DatAsistencia();
        $datplanvac = new DatPlanificacionvacaciones();
        $calendario = new ConfCalendario();
        $calendariopersona = new ConfCalendariopersona();
        $planvac = $datplanvac->getPlanvacacionesIdPersonacondatos($idpersonas, $anno);
        $person = $datAsistencia->getdatospersona($idpersonas);
        $people = array();
        foreach ($person as $k => $p) {
            $people[$p['idpersona']] = $p;
        }
        $mes = date("m");

        $perodovac = array();
        try {
            $nomperiodovac = ZendExt_IoC_Inter::getInstance()->maestro->obtenerPeriodoVacaciones();
            if (!empty($nomperiodovac)) {
                if (!empty($nomperiodovac)) {
                    foreach ($nomperiodovac as $p => $v) {
                        $perodovac[$v['tiempootorgar']] = $v;
                    }
                }
            }
        } catch (Exception $e) {
            $perodovac = array();
        }

        $cant = 0;
        foreach ($planvac as $k => $p) {
            //if ($p['mes'] == $mes || $p['mes'] == $mes + 1) {
            $result[$cant]['nombreapellidos'] = $people[$p['idpersona']]['nombreapellidos'];
            $result[$cant]['idcargo'] = $people[$p['idpersona']]['idcargo'];
            $result[$cant]['denomcargo'] = $people[$p['idpersona']]['denomcargo'];
            $result[$cant]['identidad'] = $people[$p['idpersona']]['identidad'];
            $result[$cant]['idarea'] = $people[$p['idpersona']]['idarea'];
            $result[$cant]['noidentidad'] = $people[$p['idpersona']]['noidentidad'];
            $result[$cant]['idgrupodescanso'] = $people[$p['idpersona']]['idgrupodescanso'];
            $result[$cant]['anno'] = $p['anno'];
            $result[$cant]['idpersona'] = $p['idpersona'];
            $result[$cant]['idplanvacaciones'] = $p['idplanvacaciones'];
            $errorNomina = true;
            try {
                $servicionomina = ZendExt_IoC::getInstance()->pvd->getDiasImpAcumuladosVacPersEntidad($p['idpersona'], $people[$p['idpersona']]['identidad']);
                if ($servicionomina->dias != 0) {
                    $result[$cant]['vacacumuladas'] = round($servicionomina->dias, 2);
                } else {
                    $result[$cant]['vacacumuladas'] = "";
                }
            } catch (Exception $e) {
                $result[$cant]['vacacumuladas'] = "";
                $errorNomina = false;
            }

            $result[$cant]['idmes'] = $p['mes'];
            $result[$cant]['mes'] = $this->getMes($p['mes']);

            if (!empty($p['priquincena'])) {
                $quincena = '1ra';
                $diasnaturales = $p['priquincena'];
            } else if (!empty($p['segquincena'])) {
                $quincena = '2da';
                $diasnaturales = $p['segquincena'];
            }

            $result[$cant]['quincena'] = $quincena;
            $result[$cant]['diasnaturales'] = $diasnaturales;
            if (!empty($nomperiodovac)) {
                $diasnat = $diasnaturales . '.00';
                $diashabiles = explode('.', $perodovac[$diasnat]['tiempodescontar']);
            }

            if ($servicionomina->dias != 0) {
                $vac = explode('.', $servicionomina->dias);
                if ($diashabiles[0] > $vac[0]) {
                    $result[$cant]['bandera'] = 1;
                    array_push(
                        $personassinvac, '<li>' . $people[$p['idpersona']]['nombreapellidos'] . '</li>'
                    );
                } else
                    $result[$cant]['bandera'] = 0;
            }
            $result[$cant]['origen'] = 1;
            $cant++;
            // }
        }
        $result1 = array();
        $cant1 = 0;
        $asist = $datAsistencia->getAsistVacacionesByPersonANDAnno($idpersonas, $anno);
        if (count($asist) > 0) {
            foreach ($asist as $k => $p) {
                $result1[$cant1]['nombreapellidos'] = $people[$p['idpersona']]['nombreapellidos'];
                $result1[$cant1]['idcargo'] = $people[$p['idpersona']]['idcargo'];
                $result1[$cant1]['denomcargo'] = $people[$p['idpersona']]['denomcargo'];
                $result1[$cant1]['identidad'] = $people[$p['idpersona']]['identidad'];
                $result1[$cant1]['idarea'] = $people[$p['idpersona']]['idarea'];
                $result1[$cant1]['noidentidad'] = $people[$p['idpersona']]['noidentidad'];
                $result1[$cant1]['idgrupodescanso'] = $people[$p['idpersona']]['idgrupodescanso'];
                $result1[$cant1]['anno'] = $p['anno'];
                $result1[$cant1]['idpersona'] = $p['idpersona'];
                $result1[$cant1]['idplanvacaciones'] = $p['idplanvacaciones'];
                $errorNomina = true;
                try {
                    $servicionomina = ZendExt_IoC::getInstance()->pvd->getDiasImpAcumuladosVacPersEntidad($p['idpersona'], $people[$p['idpersona']]['identidad']);
                    if ($servicionomina->dias != 0) {
                        $result1[$cant1]['vacacumuladas'] = round($servicionomina->dias, 2);
                    } else {
                        $result1[$cant1]['vacacumuladas'] = "";
                    }
                } catch (Exception $e) {
                    $result1[$cant1]['vacacumuladas'] = "";
                    $errorNomina = false;
                }
                $fdesde = explode('/', $asist[$k]['fdesde']);
                $result1[$cant1]['idmes'] = $fdesde[1];
                $result1[$cant1]['mes'] = $this->getMes($fdesde[1]);
                $result1[$cant1]['anno'] = $anno;

                if ($fdesde[0] >= 1 && $fdesde[0] <= 15) {
                    $quincena = '1ra';
                } else {
                    $quincena = '2da';
                }
                $result1[$cant1]['quincena'] = $quincena;

                $result1[$cant1]['fdesde'] = $asist[$k]['fdesde'];
                $result1[$cant1]['fhasta'] = $asist[$k]['fhasta'];
                $calend = $calendariopersona->getCalendarioPersonaTrabajo($asist[$k]['fdesde'], $asist[$k]['fhasta'], $p['idpersona']);
                $calend1 = $calendariopersona->getCalendarioPersona($asist[$k]['fdesde'], $asist[$k]['fhasta'], $p['idpersona']);
                $diashabiles = count($calend);
                $diasnaturales = count($calend1);
                $result1[$cant1]['diashabiles'] = $diashabiles;
                $result1[$cant1]['diasnaturales'] = $diasnaturales;
                $result1[$cant1]['origen'] = 0;

                foreach ($result as $j => $i) {
                    if ($i['idpersona'] == $p['idpersona'] && $i['quincena'] == $quincena && $i['idmes'] == intval($fdesde[1]) && $i['origen'] == 1) {
                        $result1[$cant1]['origen'] = 1;
                        unset($result[$j]);
                    }
                }

                $cant1++;
            }
        }
        $res = array_merge($result, $result1);


        if (count($idpersonas) > 0) {
            $resultado['cantidad'] = count($res);
            $resultado['datos'] = $res;
            $resultado['personassinvac'] = $personassinvac;
            $resultado['cod'] = 1;
        } else {
            $resultado['cantidad'] = 0;
            $resultado['datos'] = array();
            $resultado['cod'] = 3;
        }

        return $resultado;
    }

    function getPersonasAllAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $temp = $this->_request->getPost('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $arrayCargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($this->_getParam('idestructura'), null, false);

        foreach ($arrayCargos as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $datAsistencia = new DatAsistencia();
        $personas = $datAsistencia->GetDatosPersonaReporte($cargosPeople, $filtro);
        $canttotal = count($personas);
        if (count($personas) > 0) {
            $personasordenadas = $datAsistencia->OrderPersonasByCargo($personas, $limit, $start);
            $personas = $personasordenadas;
        }

        $datAsistenciaModel = new DatAsistenciaModel();
        $denEntAreas = $datAsistenciaModel->GetDenomEntAreas($personas);
        $denomarea = array();
        foreach ($personas as $p => $dat) {
            if (!in_array($dat['idarea'], $denomarea)) {
                $denomarea[$dat['idarea']] = $dat['idarea'];
            }
        }
        foreach ($denomarea as $i => $e) {
            $denomestructura = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($e), false);
            $partes = explode('/', $denomestructura[0]['rutaDenominacion']);
            if ($partes[2] || $partes[3]) {
                if ($partes[3])
                    $area = $partes[2] . '->' . $partes[3];
                else
                    $area = $partes[2];
            } else {
                $area = $partes[1];
            }
            $denomarea[$e] = $area;
        }
        foreach ($personas as $a => $pers) {
            $personas[$a]['denomarea'] = (is_numeric($pers['idarea'])) ? $denomarea[$pers['idarea']] : 'Sin cargo';
        }
        $personas['data'] = $personas;
        $personas['cantidad'] = $canttotal;
        echo(json_encode($personas));
    }

    public function diasHabilesAction()
    {
        $fdesde = $this->_getParam('fdesde');
        $fhasta = $this->_getParam('fhasta');
        $idpersona = $this->_getParam('idpersona');
        $calendariopersona = new ConfCalendariopersona();
        $calend = $calendariopersona->getCalendarioPersonaTrabajo($fdesde, $fhasta, $idpersona);
        $diashabiles = count($calend);
        echo json_encode($diashabiles);
    }

    private function getMes($mesnum)
    {
        if ($mesnum == 1) {
            return 'Enero';
        } else if ($mesnum == 2) {
            return 'Febrero';
        } else if ($mesnum == 3) {
            return 'Marzo';
        } else if ($mesnum == 4) {
            return 'Abril';
        } else if ($mesnum == 5) {
            return 'Mayo';
        } else if ($mesnum == 6) {
            return 'Junio';
        } else if ($mesnum == 7) {
            return 'Julio';
        } else if ($mesnum == 8) {
            return 'Agosto';
        } else if ($mesnum == 9) {
            return 'Septiembre';
        } else if ($mesnum == 10) {
            return 'Octubre';
        } else if ($mesnum == 11) {
            return 'Noviembre';
        } else if ($mesnum == 12) {
            return 'Diciembre';
        } else {
            return '';
        }
    }

}

?>