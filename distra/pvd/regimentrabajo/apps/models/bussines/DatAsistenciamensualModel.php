<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class DatAsistenciamensualModel extends ZendExt_Model
{
    protected $DatAsistenciamensual;
    protected $DatAsistenciaModel;

    function __construct()
    {
        $this->DatAsistenciamensual = new DatAsistenciamensual();
        $this->DatAsistenciaModel = new DatAsistenciaModel();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
        $this->DatAsistenciamensual = new DatAsistenciamensual();
        $this->DatAsistenciaModel = new DatAsistenciaModel();
    }


    public function GetReporte($idestructura, $mes, $year, $limit, $start, $filtro,
                               $quincena = 0, $tiporeporte = 0, $analisis, $fdesde, $fhasta, $certificacion, $historico)
    {
        $datAsistenciaModel = new DatAsistenciaModel();
        $datAsistencia = new DatAsistencia();
        $calendario = new ConfCalendario();
        $diaferiadohabilitado = new DatDiaferiadohabilitado();
        $calendariopersona = new ConfCalendariopersona();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];

        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

        $mes2 = $mes;
        $year2 = $year;
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        if ($analisis == 1) {
            $cantDiasMes = date('t', mktime(0, 0, 0, $mes2, 1, $year2));
            if ($mes2 < 10)
                $mes1 = '0' . $mes2;
            else
                $mes1 = $mes2;
            $fechdesde = '01/' . $mes1 . '/' . $year2;
            $fechhasta = $cantDiasMes . '/' . $mes1 . '/' . $year2;
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }
        $reporte = $datAsistencia->GetDatosPersonaReporteAsistMensual($cargosPeople, $filtro, $limit, $start, $fechdesde, $fechhasta,null,null,null,$historico);
        $cantidad = count($datAsistencia->GetDatosPersonaReporteAsistMensual($cargosPeople, $filtro, null, 0, $fechdesde, $fechhasta,null,null,null,$historico));

        foreach ($reporte as $k => $per) {
            $idsPeople[$k]['idpersona'] = $per['idpersona'];
            $idsPeople[$k]['idcargo'] = $per['idcargo'];
        }

        $fechainicio = explode('/', $fechdesde);
        $fechafin = explode('/', $fechhasta);
        $finicio = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
        $fechainicio1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
        $ffin = date_create($fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0]);
        $diferencia = $finicio->diff($ffin);
        $cantidadmeses = ($diferencia->y * 12) + $diferencia->m + 1;

        $columnasGrid = array();
        while ($fechainicio1 <= $ffin) {
            $fi = explode('/', $fechainicio1->format('d/m/Y'));
            array_push($columnasGrid, $fi[0] . '/' . $fi[1]);
            date_add($fechainicio1, date_interval_create_from_date_string('1 day'));
            $FITEMPORAL = explode('/', $fechainicio1->format('d/m/Y'));
            $fechainicio1 = date_create($FITEMPORAL[2] . '-' . $FITEMPORAL[1] . '-' . $FITEMPORAL[0]);
        }

        $confHorarioNoct = new ConfHabhorarionocturnidad();
        $confNocturnidad = $confHorarioNoct->getHabilitarhorarionocturnidad();
        $confNocturnidadfer = $confNocturnidad;
        foreach ($confNocturnidad as $k => $noct) {
            $confNocturnidad[$k]['idnocturnidad'] = 'noct_' . $noct['horainicio'] . '_' . $noct['horafin'];
            $confNocturnidadfer[$k]['idnocturnidad'] = 'noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'];
        }

        if (count($idsPeople) > 0) {
            $asistencia = $datAsistencia->GetAllByRangoAndPersonas($fechdesde, $fechhasta, $idsPeople, $certificacion, null, $historico);
//print_r($asistencia);die;
            //filtrando las personas por certificacion
            if ($certificacion != null) {
                $tempids = array();
                $temprep = array();
                foreach ($asistencia as $keya => $as) {
                    $tempids[] = $keya;
                }
                $tempids = array_unique($tempids);
                foreach ($reporte as $re) {
                    if (in_array($re['idpersona'], $tempids)) {
                        $temprep[] = $re;
                    }
                }
                $reporte = $temprep;
            }

//            if (count($reporte) > 0) {
//                $cargosPeople = array_unique($cargosPeople);
//                $reporte = $datAsistenciaModel->ordenarInfoByCargo($cargosPeople, $reporte);
//            }

            /*************************ÁREA DE LA PERSONA*************************/
            $denEntAreas = $this->DatAsistenciaModel->GetDenomEntAreas($reporte);

            foreach ($reporte as $ind => $persona) {
                $diasfer = array();
                $reporte[$ind]['denomarea'] = (is_numeric($persona['idarea'])) ? $denEntAreas[$persona['idarea']]['denominacion'] : 'Sin cargo';
                $reporte[$ind]['certificado'] = '1';
                if (empty($persona['idgrupodescanso'])) {
                    $reporte[$ind]['ft'] = 0;
                    $reporte[$ind]['trt'] = 0;
                    $reporte[$ind]['hp'] = 0;
                    $reporte[$ind]['he'] = 0;
                    $reporte[$ind]['hf'] = 0;
                    $reporte[$ind]['hft'] = 0;
                } else {
                    /*************************FONDO DE TIEMPO*************************/
                    $regimen = NomRegimentrabajo::getDenomRegimenById($persona['idregimentrabajo']);
                    if ($regimen[0]['tipofondotiempo'] == 3) {
                        //$fon = explode('.', $regimen[0]['fondotiempo']);
                        $reporte[$ind]['ft'] = $regimen[0]['fondotiempo'];
                    } else if ($regimen[0]['tipofondotiempo'] == 1) {
                        $reporte[$ind]['ft'] = $persona['ft'];
                    } elseif ($regimen[0]['tipofondotiempo'] == 2) {
                        $cont = 0;
                        $configuracion1 = $calendariopersona->getCalendarioByPersonaandYear($persona['idpersona'], $year2);
                        foreach ($configuracion1 AS $k => $v) {
                            $cont += $v['horas'];
                        }
                        $reporte[$ind]['ft'] = round($cont / 12, 2);
                    }

                    /*************************HORAS FERIADAS*************************/
                    $fechdiaferiado = array();
                    $fechdiasferiadoshab = array();
                    $diasferiadospuros = array();


                    $calendario = $calendariopersona->getCalendarioPersonaTrabajo($finicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idpersona']);
                    $reporte[$ind]['diaslab'] = count($calendario);
                    if ($regimen[0]['tipofondotiempo'] == 3 && !empty($regimen[0]['diaslaborables'])) {
                        $reporte[$ind]['diaslab'] = $regimen[0]['diaslaborables'];
                    }

                    $diasreceso = $calendariopersona->getRecesoLab($finicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idpersona'], $persona['idgrupodescanso']);

                    $fechincidencia = array();
                    $fechincidenciaRecLab = array();
                    $encontrado = array();
                    $conasist = array();
                    $fechrango = array();
                    $grupoasistecia = -1;

                    $habfinmes = array();
                    try {
                        $Confhabfinmes = new ConfHabilitarfinmesModel();
                        $habfinmes = $Confhabfinmes->getHabilitarfinmes();
                    } catch (Exception $e) {
                        $habfinmes[0]['habilitado'] = 0;
                    }

                    if ($habfinmes[0]['habilitado'] == 1) {
                        if ($fechainicio[1] == 1) {
                            $mesant = 12;
                            $annoant = $fechainicio[2] - 1;
                        } else {
                            $mesant = $fechainicio[1] - 1;
                            $annoant = $fechainicio[2];
                        }

                        list($dd, $mm, $yy) = explode("/", $fechdesde);
                        if ($dd == 1) {
                            $cantDiasMesanterior = date('t', mktime(0, 0, 0, $mesant, 1, $annoant));
                            $ultimodiamesante = $cantDiasMesanterior . '/' . ($mesant) . '/' . $annoant;
                            $personacargo = array(0 => array('idpersona' => $persona['idpersona'], 'idcargo' => $persona['idcargo']));
                            $asistenciapersona = $datAsistencia->GetAllByRangoAndPersonas($ultimodiamesante, $ultimodiamesante, $personacargo, $certificacion, null);
                            if (count($asistenciapersona) > 0 && $asistenciapersona[$persona['idpersona']][0]['otrodia'] == 1) {
                                if (!isset($asistencia[$persona['idpersona']]))
                                    $asistencia[$persona['idpersona']] = array();
                                array_push($asistencia[$persona['idpersona']], $asistenciapersona[$persona['idpersona']][0]);
                            }
                        } else {
                            //Ver si el dia anterior del rango es trabajo de 24 horas
                            $diaant = (intval($dd) - 1) . "/" . $mm . "/" . $yy;
                            $personacargo = array(0 => array('idpersona' => $persona['idpersona'], 'idcargo' => $persona['idcargo']));
                            $asistenciapersona = $datAsistencia->GetAllByRangoAndPersonas($diaant, $diaant, $personacargo, $certificacion, null);
                            if (count($asistenciapersona) > 0 && $asistenciapersona[$persona['idpersona']][0]['otrodia'] == 1) {
                                if (!isset($asistencia[$persona['idpersona']]))
                                    $asistencia[$persona['idpersona']] = array();
                                array_push($asistencia[$persona['idpersona']], $asistenciapersona[$persona['idpersona']][0]);
                            }
                        }
                    }

                    $tempfinicio = new DateTime($finicio->format("Y-m-d"));
                    //Si la asistencia del dia anterior es de 24 horas
                    if (count($asistenciapersona) > 0 && $asistenciapersona[$persona['idpersona']][0]['otrodia'] == 1) {
                        $finiciomesant = date_add($tempfinicio, date_interval_create_from_date_string('-1 day'));
                        $FIT = explode('/', $tempfinicio->format('d/m/Y'));
                        $tempfinicio = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                    }
                    $diasferiados = $calendariopersona->getDiasFeriadosBypersona(
                        $tempfinicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idpersona']);

                    foreach ($diasferiados as $v) {
                        array_push($fechdiaferiado, $v['fecha']);
                    }

                    $diasferiadoshabilitados = $diaferiadohabilitado->GetDiasFeriadosHabByDateRange($persona['idpersona'],
                        $tempfinicio->format('d/m/Y'), $ffin->format('d/m/Y'));

                    foreach ($diasferiadoshabilitados as $v) {
                        if (!in_array($v['fecha'], $fechdiasferiadoshab))
                            array_push($fechdiasferiadoshab, $v['fecha']);
                    }
                    $diasferiadospuros = array_diff($fechdiaferiado, $fechdiasferiadoshab);

                    foreach ($asistencia[$persona['idpersona']]/*[$persona['idcargo']]*/ as $key => $valor) {

                        $fech1 = explode('/', $valor['fecharegistro']);
                        if ($analisis == 1)
                            $mes3 = $fechainicio[1];
                        else
                            $mes3 = $fech1[1];
                        $ferper = null;
                        array_push($conasist, $valor['fecharegistro']);

                        $horas = $calendariopersona->getHrsCalendarioPersona($valor['fecharegistro'], $valor['fecharegistro'], $valor['idpersona']);
                        $diaferiadohab = $datAsistenciaModel->GetDiaFeriadoHabilitado($persona['idpersona'], $valor['fecharegistro']);

                        if(($valor['fechahoraentrada'] != null && $valor['fechahorasalida'] != null))
                        {
                            $diaferhab = $datAsistenciaModel->GetDiaFeriadoHabilitado($persona['idpersona'], $valor['fecharegistro']);
                            if(count($diaferhab)>0){
                                $reporte[$ind] = $this->NocturnidadconCausaFeriado($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                            }else{
                                if($valor['trabajo'] == 1 && $valor['feriado'] == 0){
                                    $reporte[$ind] = $this->NocturnidadconCausa($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                }
                            }
                        }

                        /*************************HORAS TRABAJADAS*************************/
                        // $hrstrabajadas = '00:00:00';
                        $hrstrabajadas = $valor['hrstrabajadas'];//print_r();die;
                        $hrsferiadastrabajadas = '00:00:00';
                        $hrsDiariasFeriadas = $calendariopersona->getHrsFeriadasPersona($valor['fecharegistro'], $valor['fecharegistro'], $valor['idpersona']);
                        //Cuando el dia es feriado
                        if ($valor['feriado'] == 1) {
                            if ($fech1[1] == $mes3) {
                                if (!empty($valor['fechahoraentrada'])) {
                                    if (!empty($valor['fechahorasalida'])) {
                                        $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($hrsDiariasFeriadas[0]['sum'], $valor['hrsdescontadas']);
                                        $hrsferiadastrabajadas = $hrstrabajadas;
                                    }
                                }
                            } else {
                                if (!empty($valor['fechahoraentrada'])) {
                                    if (!empty($valor['fechahorasalida'])) {
                                        $hrsttmp = $datAsistenciaModel->RestOnlyTime($hrsDiariasFeriadas[0]['sum'], $valor['hrsdescontadas']);
                                        $hrsferiadastrabajadas = $hrsttmp;
                                    }
                                }
                            }
                            //Cuando el dia es feriado y es de 24 horas
                            if ($valor['otrodia'] == 1 && count($fechdiasferiadoshab) > 0) {
                                array_push($diasfer, $valor['fecharegistro']);
                                $HSal = explode(' ', $valor['fechahorasalida']);
                                $fech1 = explode('/', $valor['fecharegistro']);
                                $f2 = date_create($fech1[2] . '-' . $fech1[1] . '-' . $fech1[0]);
                                $fech2 = date_add($f2, date_interval_create_from_date_string('1 day'));
                                $fech22 = explode('/', $fech2->format('d/m/Y'));
                                $f2 = date_create($fech22[2] . '-' . $fech22[1] . '-' . $fech22[0]);

                                $otrodiafer = $calendariopersona->getFeriadoPersonaByFecha($valor['idpersona'], $fech2->format('d/m/Y'));

                                $hfttemp = $datAsistenciaModel->RestOnlyTime($hrsferiadastrabajadas, $HSal[1]);
                                $ht = $datAsistenciaModel->RestOnlyTime($hrsferiadastrabajadas, $hfttemp);
                                $hfttemp1 = explode(':', $hfttemp);

                                $hiarray = explode(':', $valor['horainicio']);
                                $hfarray = explode(':', $valor['horafin']);
                                if ($tiporeporte == 1) {
                                    $ht1 = explode(':', $ht);
                                    //Si el otro dia es feriado tambien
                                    if (!empty($otrodiafer)) {
                                        $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = '<b> Feriado - </b>' . $ht1[0] . ':' . $ht1[1];
                                    } else {
                                        $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = $ht1[0] . ':' . $ht1[1];
                                    }
                                    //Si esta habilitado picar las horas al final del mes solo se toman las horas feriadas del ultimo dia
                                    if ($fech22[1] > $mes3 || ($fech22[1] == 1 && $mes3 == 12)) {
                                        if ($habfinmes[0]['habilitado'] == 1) {
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = '<b> Feriado - </b>' . $hfttemp1[0] . ':' . $hfttemp1[1];
                                        } else {//Si no esta habilitado se toman las horas trabajadas en total que son las horas feriadas tambien
                                            $hfertotal = explode(':', $hrstrabajadas);
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = '<b> Feriado - </b>' . $hfertotal[0] . ':' . $hfertotal[1];
                                        }
                                    } else {
                                        //Si vienen datos en la fecha actual del dia anterior y en este mismo dia trabaja otra vez por la tarde, se suman esas otras horas
                                        if (isset($reporte[$ind][$fech1[0] . '/' . $fech1[1]])) {
                                            $fechaant = explode('<b> Feriado - </b>', $reporte[$ind][$fech1[0] . '/' . $fech1[1]]);
                                            if (isset($fechaant[1])) {
                                                $sumanthoy = $datAsistenciaModel->SumOnlyTime($fechaant[1], $hfttemp1[0] . ':' . $hfttemp1[1]);
                                                $sumanthoy = explode(':', $sumanthoy);
                                                $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = '<b> Feriado - </b>' . $sumanthoy[0] . ':' . $sumanthoy[1];
                                            }
                                        } else
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = '<b> Feriado - </b>' . $hfttemp1[0] . ':' . $hfttemp1[1];
                                    }
                                } else {
                                    $HEnt = explode(' ', $valor['fechahoraentrada']);
                                    $hearray = explode(':', $HEnt[1]);
                                    if ($hearray[0] < $hiarray[0])
                                        $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = '00:00';
                                    else {
                                        $resto = $datAsistenciaModel->RestOnlyTime($HEnt[1], $valor['horainicio']);
                                        $hfttemp1 = explode(':', $resto);
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = '<b> Feriado - </b>' . $hfttemp1[0] . ':' . $hfttemp1[1];
                                    }
                                    $hsarray = explode(':', $HSal[1]);
                                    if ($hsarray[0] > $hfarray[0] || ($hsarray[0] == $hfarray[0] && $hsarray[1] > $hfarray[1]))
                                        $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = '00:00';
                                    else {
                                        $resto = $datAsistenciaModel->RestOnlyTime($valor['horafin'], $HSal[1]);
                                        $hfttemp1 = explode(':', $resto);
                                        $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = $hfttemp1[0] . ':' . $hfttemp1[1];
                                    }
                                }

                                //Si el otro dia es feriado tambien.
                                if (!empty($otrodiafer)) {
                                    if ($fech22[1] > $mes3 || ($fech22[1] == 1 && $mes3 == 12)) {
                                        if ($habfinmes[0]['habilitado'] == 1) {
                                            $hrsferiadastrabajadas = $hfttemp;
                                            $ft1 = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $ht);
                                            $hft1 = explode(':', $ft1);
                                            $reporte[$ind]['ft'] = intval($hft1[0]);
                                        } else {
                                            $hrsferiadastrabajadas = $hrstrabajadas;
                                        }
                                    } else {
                                        /*Analizando el dia antes del rango, el ultimo dia del mes anterior*/
                                        if ($fech1[1] < $mes3 || ($fech1[1] == 12 && $mes3 == 1)) {
                                            if ($habfinmes[0]['habilitado'] == 1) {
                                                $hrsferiadastrabajadas = $ht;
                                                if (empty($reporte[$ind]['ft'])) {
                                                    $hft1 = explode(':', $ht);
                                                    $reporte[$ind]['ft'] = intval($hft1[0]);
                                                } else {
                                                    $ft1 = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $ht);
                                                    $hft1 = explode(':', $ft1);
                                                    $reporte[$ind]['ft'] = intval($hft1[0]);
                                                }
                                            }
                                        } else
                                            $hrsferiadastrabajadas = $hrstrabajadas;
                                    }
                                    array_push($diasfer, $fech2->format('d/m/Y'));
                                } else {
                                    if ($fech22[1] > $mes3 || ($fech22[1] == 1 && $mes3 == 12)) {
                                        if ($habfinmes[0]['habilitado'] == 1) {
                                            $hrsferiadastrabajadas = $hfttemp;
                                            $hrstrabajadas = null;
                                            $ft1 = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $ht);
                                            $hft1 = explode(':', $ft1);
                                            $reporte[$ind]['ft'] = intval($hft1[0]);
                                        } else {
                                            $hrsferiadastrabajadas = $hfttemp;
                                            $hrstrabajadas = $ht;
                                            $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $ht);
                                        }
                                    } else {
                                        if ($fech1[1] < $mes3 || ($fech1[1] == 12 && $mes3 == 1)) {
                                            if ($habfinmes[0]['habilitado'] == 1) {
                                                $hrstrabajadas = $ht;
                                                if (!empty($reporte[$ind]['ft']))
                                                    $ft1 = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $ht);
                                                else
                                                    $ft1 = $ht;
                                                $hft1 = explode(':', $ft1);
                                                $reporte[$ind]['ft'] = intval($hft1[0]);
                                                $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $ht);
                                                $hrsferiadastrabajadas = null;
                                            } else {
                                                $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $ht);
                                                $hrsferiadastrabajadas = $hfttemp;
                                                $hrstrabajadas = $ht;
                                            }
                                        } else {
                                            $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $ht);
                                            $hrsferiadastrabajadas = $hfttemp;
                                            $hrstrabajadas = $ht;
                                        }


                                    }
                                }
                            }
                        } else if ($valor['idtipodedia'] == 12) {//Trabajo extraordinario
                            if (!empty($valor['fechahoraentrada'])) {
                                if (!empty($valor['fechahorasalida'])) {
                                    $HS = explode(' ', $valor['fechahorasalida']);
                                    $HE = explode(' ', $valor['fechahoraentrada']);
                                    $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($HS[1], $HE[1]);
                                }
                            }
                        } else if ($valor['idtipodedia'] == 8) {//Dia irregular
                            if (!empty($valor['fechahoraentrada'])) {
                                if (!empty($valor['fechahorasalida'])) {
                                    $HS = explode(' ', $valor['fechahorasalida']);
                                    $HE = explode(' ', $valor['fechahoraentrada']);
                                    $HA = $datAsistencia->getHorarioByPersona($valor['idpersona'], $valor['fecharegistro']);
                                    $hrstrab = $datAsistenciaModel->RestOnlyTime($HS[1], $HE[1]);
                                    $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($hrstrab, $HA['tdescanso']);
                                }
                            }
                        } else {
                            //Un dia que no es feriado
                            $fech1 = explode('/', $valor['fecharegistro']);
                            //Cuando la fecha de registro de la asistencia actual esta dentro del mes analizado
                            if ($fech1[1] == $mes3) {
                                if (!empty($valor['fechahoraentrada'])) {
                                    if (!empty($valor['fechahorasalida'])) {
                                        //if(!empty($valor['hrsdescontadas']))
                                        $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($horas[0]['sum'], $valor['hrsdescontadas']);
                                    }
                                }
                            }
                            //Cuando el dia no es feriado pero es de 24 horas
                            if ($valor['otrodia'] == 1) {
                                $fech1 = explode('/', $valor['fecharegistro']);
                                $f2 = date_create($fech1[2] . '-' . $fech1[1] . '-' . $fech1[0]);
                                $fech2 = date_add($f2, date_interval_create_from_date_string('1 day'));
                                $fecht = explode('/', $f2->format('d/m/Y'));
                                $f2 = date_create($fecht[2] . '-' . $fecht[1] . '-' . $fecht[0]);
                                $ferper = $calendariopersona->getFeriadoPersonaByFecha($valor['idpersona'], $fech2->format('d/m/Y'));
                                //Cuando el dia no es feriado, es de 24 horas, pero el proximo dia es feriado
                                if (!empty($ferper)) {
                                    array_push($diasfer, $fech2->format('d/m/Y'));
                                    $HSal = explode(' ', $valor['fechahorasalida']);
                                    if ($hrstrabajadas == "00:00:00") {
                                        $hfttemp = $HSal[1];
                                        $hfttemp1 = explode(':', $hfttemp);
                                    } else {
                                        $ht = $datAsistenciaModel->RestOnlyTime($hrstrabajadas, $HSal[1]);
                                        $hfttemp = $datAsistenciaModel->RestOnlyTime($hrstrabajadas, $ht);
                                        $hfttemp1 = explode(':', $hfttemp);
                                        $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($hrstrabajadas, $hfttemp);
                                    }
                                    $fech22 = explode('/', $fech2->format('d/m/Y'));
                                    if ($tiporeporte == 1) {
                                        $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = '<b> Feriado - </b>' . $hfttemp1[0] . ':' . $hfttemp1[1];

                                        //Si vienen datos en la fecha actual del dia anterior y en este mismo dia trabaja otra vez por la tarde, se suman esas otras horas
                                        if (isset($reporte[$ind][$fech1[0] . '/' . $fech1[1]])) {
                                            $sumanthoy = $datAsistenciaModel->SumOnlyTime($reporte[$ind][$fech1[0] . '/' . $fech1[1]], $ht);
                                            $sumanthoy = explode(':', $sumanthoy);
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $sumanthoy[0] . ':' . $sumanthoy[1];
                                        } else {
                                            $httemp = explode(':', $ht);
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $httemp[0] . ':' . $httemp[1];
                                        }
                                        if ($habfinmes[0]['habilitado'] == 0) {
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $reporte[$ind][$fech1[0] . '/' . $fech1[1]];
                                        }
                                    } else {
                                        $hfarray = explode(':', $ferper[0]['horafin']);
                                        $hsarray = explode(':', $HSal[1]);
                                        if ($hsarray[0] > $hfarray[0] || ($hsarray[0] == $hfarray[0] && $hsarray[1] > $hfarray[1]))
                                            $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = '<b> Feriado - </b>' . '00:00';
                                        else {
                                            $resto = $datAsistenciaModel->RestOnlyTime($ferper[0]['horafin'], $HSal[1]);
                                            $hfttemp1 = explode(':', $resto);
                                            $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = '<b> Feriado - </b>' . $hfttemp1[0] . ':' . $hfttemp1[1];
                                        }
                                    }

                                    if (($habfinmes[0]['habilitado'] == 1 && $fech22[1] == $mes3) || ($habfinmes[0]['habilitado'] == 0 && ($fech22[1] > $mes3) || ($mes3 == 12 && $fech22[1] == 1)))
                                        $reporte[$ind]['hft'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $hfttemp);
                                    else
                                        if (($habfinmes[0]['habilitado'] == 1 && ($fech22[1] < $mes3) || ($mes3 == 1 && $fech22[1] == 12)))
                                            $reporte[$ind]['hft'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $hfttemp);
                                        else if ($habfinmes[0]['habilitado'] == 0 && $fech1[1] == $mes3)
                                            $reporte[$ind]['hft'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $hfttemp);
                                        else if (($habfinmes[0]['habilitado'] == 1 && ($fech1[1] < $mes3) || ($mes3 == 1 && $fech1[1] == 12)))
                                            $reporte[$ind]['hft'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $ht);


                                    if ($habfinmes[0]['habilitado'] == 1) {
                                        if (($fech1[1] < $mes3 || ($mes3 == 1 && $fech1[1] == 12))) {
                                            $ft1a = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $valor['horafin']);
                                            $hft1a = explode(':', $ft1a);
                                            $reporte[$ind]['ft'] = intval($hft1a[0]);
                                        } else if ($fech1[1] == $mes3) {
                                            if (isset($reporte[$ind]['trt'])) {
                                                if ($fech22[1] < $mes3 || ($fech22[1] == 12 && $mes3 == 1))
                                                    $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['trt'], $hfttemp);
                                            }

                                            if ($fech22[1] > $mes3 || ($fech22[1] == 12 && $mes3 == 1)) {
                                                $ft1 = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $hfttemp);
                                                $hft1 = explode(':', $ft1);
                                                $reporte[$ind]['ft'] = intval($hft1[0]);
                                            }
                                        }
                                    }
                                } else { //Cuando el dia no es feriado, es de 24 horas, y el proximo dia es normal
                                    if (intval($fech2->format('d')) == 1) {//Si es fin de mes
                                        if ($habfinmes[0]['habilitado'] == 1) {
                                            $HSal = explode(' ', $valor['fechahorasalida']);
                                            $temptotalhorastrab = $datAsistenciaModel->RestOnlyTime($horas[0]['sum'], $valor['hrsdescontadas']);
                                            if ($hrstrabajadas == "00:00:00") {
                                                $ht = $datAsistenciaModel->RestOnlyTime($temptotalhorastrab, $HSal[1]);
                                                $hfttemp = $datAsistenciaModel->RestOnlyTime($temptotalhorastrab, $ht);
                                                $hrstrabajadas = $hfttemp;
                                            } else {
                                                $ht = $datAsistenciaModel->RestOnlyTime($hrstrabajadas, $HSal[1]);
                                                $hfttemp = $datAsistenciaModel->RestOnlyTime($hrstrabajadas, $ht);
                                                $hrstrabajadas = $hfttemp;
                                            }

                                            $hfttemp1 = explode(':', $hfttemp);
                                            $fech22 = explode('/', $fech2->format('d/m/Y'));
                                            if ($tiporeporte == 1) {
                                                $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = $hfttemp1[0] . ':' . $hfttemp1[1];
                                                $httemp = explode(':', $ht);
                                                $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $httemp[0] . ':' . $httemp[1];
                                            } else {
                                                $hfarray = explode(':', $ferper[0]['horafin']);
                                                $hsarray = explode(':', $HSal[1]);
                                                if ($hsarray[0] > $hfarray[0] || ($hsarray[0] == $hfarray[0] && $hsarray[1] > $hfarray[1]))
                                                    $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = '00:00';
                                                else {
                                                    $resto = $datAsistenciaModel->RestOnlyTime($ferper[0]['horafin'], $HSal[1]);
                                                    $hfttemp1 = explode(':', $resto);
                                                    $reporte[$ind][$fech22[0] . '/' . $fech22[1]] = $hfttemp1[0] . ':' . $hfttemp1[1];
                                                }
                                            }
                                            if ($fech1[1] == $mes3) {
                                                $ft1 = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $hfttemp);
                                                $hft1 = explode(':', $ft1);
                                                $reporte[$ind]['ft'] = intval($hft1[0]);
                                                $hrstrabajadas = $ht;
                                            } else {
                                                $ft1 = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $hfttemp);
                                                $hft1 = explode(':', $ft1);
                                                $reporte[$ind]['ft'] = intval($hft1[0]);
                                                $hrstrabajadas = $hfttemp;
                                            }
                                        } else {//Es fin de mes, es un dia que no es feriado, es de 24 horas y el proximo dia es normal
                                            $hrstrab = explode(':', $hrstrabajadas);
                                            if (isset($reporte[$ind][$fech1[0] . '/' . $fech1[1]])) {
                                                $sumanthoy = $datAsistenciaModel->SumOnlyTime($reporte[$ind][$fech1[0] . '/' . $fech1[1]], $hrstrab[0] . ':' . $hrstrab[1]);
                                                $sumanthoy = explode(':', $sumanthoy);
                                                $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $sumanthoy[0] . ':' . $sumanthoy[1];
                                            } else {
                                                $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $hrstrab[0] . ':' . $hrstrab[1];
                                            }
                                        }
                                    } else {//No es fin de mes, es un dia que no es feriado, es de 24 horas y el proximo dia es normal
                                        $hrstrab = explode(':', $hrstrabajadas);
                                        if (isset($reporte[$ind][$fech1[0] . '/' . $fech1[1]])) {
                                            $sumanthoy = $datAsistenciaModel->SumOnlyTime($reporte[$ind][$fech1[0] . '/' . $fech1[1]], $hrstrab[0] . ':' . $hrstrab[1]);
                                            $sumanthoy = explode(':', $sumanthoy);
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $sumanthoy[0] . ':' . $sumanthoy[1];
                                        } else {
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $hrstrab[0] . ':' . $hrstrab[1];
                                        }
                                    }
                                }
                                $reporte[$ind][$fech22[0] . '/' . $fech22[1] . '_certificado'] = $valor['certificado'];
                                $reporte[$ind][$fech22[0] . '/' . $fech22[1] . '_aprobado'] = $valor['aprobado'];
                                $reporte[$ind][$fech22[0] . '/' . $fech22[1] . '_color'] = $valor['color'];
                                $reporte[$ind][$fech22[0] . '/' . $fech22[1] . '_causa'] = $valor['denomcausa'];
                            }
                        }

                        //Para saber en la vista si el dia es de trabajo o no
                        if ($valor['trabajo'] == 1 || ($valor['feriado'] == 1 && count($fechdiasferiadoshab) > 0)) {
                            $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_trabajo'] = '1';
                        } else {
                            $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_trabajo'] = '0';
                        }

                        /*************************TIEMPO DE TRABAJO EXTRAORDINARIO*************************/
                        if ($valor['idtipodedia'] == 12
                        ) {
                            if (!empty($hrstrabajadas))
                                $reporte[$ind]['hte'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hte'], $hrstrabajadas);
                        }
                        if (empty($valor['fdesde']) && empty($valor['fhasta'])) {
                            if($valor['idcausa'] == -1){
                                $valor['abreviatura'] = 'MC';
                                $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($horas[0]['sum'], $valor['hrsdescontadas']);       
                            }                                
                            if ($valor['otrodia'] == 1 && $valor['feriado'] == 1 && count($fechdiasferiadoshab) > 0)
                                $hrstrab = explode(':', $hrsferiadastrabajadas);
                            else
                                $hrstrab = explode(':', $hrstrabajadas);
                            $fech1 = explode('/', $valor['fecharegistro']);
                            if ($tiporeporte == 1) {
                                if ((!empty($hrstrabajadas)) && !empty($valor['idcausa']) && ($valor['trabajo'] == 1 || ($valor['otrodia'] == 0 && $valor['feriado'] == 1))) {
                                    if (isset($reporte[$ind][$fech1[0] . '/' . $fech1[1]])) {
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $reporte[$ind][$fech1[0] . '/' . $fech1[1]] . " (" . $valor['abreviatura'] . ")";
                                    } else {
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $hrstrab[0] . ':' . $hrstrab[1] . " (" . $valor['abreviatura'] . ")";
                                    }
                                } else {
                                    if (!empty($hrstrabajadas) && empty($valor['idcausa']) && $valor['trabajo'] == 1 && $valor['otrodia'] == 0) {
                                        //Si vienen datos en la fecha actual del dia anterior y en este mismo dia trabaja otra vez por la tarde, se suman esas otras horas
                                        if (isset($reporte[$ind][$fech1[0] . '/' . $fech1[1]])) {
                                            $sumanthoy = $datAsistenciaModel->SumOnlyTime($reporte[$ind][$fech1[0] . '/' . $fech1[1]], $hrstrab[0] . ':' . $hrstrab[1]);
                                            $sumanthoy = explode(':', $sumanthoy);
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $sumanthoy[0] . ':' . $sumanthoy[1];
                                        } else {
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $hrstrab[0] . ':' . $hrstrab[1];
                                        }
                                    } else {
                                        if (!empty($hrstrabajadas) && empty($valor['idcausa']) && $valor['otrodia'] == 0 && $valor['feriado'] == 1) {
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = '<b> Feriado - </b>' . $hrstrab[0] . ':' . $hrstrab[1];
                                        }

                                    }
                                }
                            } else {
                                if (!empty($valor['hrsdescontadas']) && !empty($valor['idcausa']) && ($valor['trabajo'] == 1 || ($valor['otrodia'] == 0 && $valor['feriado'] == 1))) {
                                    $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $valor['hrsdescontadas'] . " (" . $valor['abreviatura'] . ")";
                                } else if (!empty($valor['hrsdescontadas']) && empty($valor['idcausa']) && ($valor['trabajo'] == 1 || ($valor['otrodia'] == 0 && $valor['feriado'] == 1)))
                                    $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $valor['hrsdescontadas'];
                                else if (empty($valor['hrsdescontadas']) && ((!empty($valor['fdesde']) && !empty($valor['fhasta'])) || (!empty($valor['fechahoraentrada']) && !empty($valor['fechahorasalida']))))
                                    $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = '00:00';
                                else if ($valor['trabajo'] == 1 || ($valor['otrodia'] == 0 && $valor['feriado'] == 1)) {
                                    $h = explode(':', $horas[0]['sum']);
                                    $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $h[0] . ':' . $h[1];
                                }
                            }
                            $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_certificado'] = $valor['certificado'];
                            $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_aprobado'] = $valor['aprobado'];
                            $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_color'] = $valor['color'];
                            $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_causa'] = $valor['denomcausa'];

                            /*************************HORAS PERDIDAS*************************/
                            if (($valor['trabajo'] == 1 || count($diaferiadohab) > 0) && ($valor['afectasalario'] == 1 || empty($valor['idcausa']))) {
                                if (!empty($valor['hrsdescontadas'])) {
                                    $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $valor['hrsdescontadas']);
                                } else {
                                    if (empty($valor['hrsdescontadas']) && ((empty($valor['fdesde']) && empty($valor['fhasta'])) && (empty($valor['fechahoraentrada']) && empty($valor['fechahorasalida'])))) {
                                        $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $horas[0]['sum']);
                                    }
                                }
                            }
                            if($valor['idcausa'] == -1){
                                $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $valor['hrsdescontadas']);
                            }
                            /*************************SIN SALIDA*************************/
                            if (!empty($valor['fechahoraentrada']) && empty($valor['fechahorasalida']) && empty($valor['fdesde']) &&
                                empty($valor['fhasta'])
                            ) {
                                $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_certificado'] = $valor['certificado'] == null ? '0' : $valor['certificado'];
                                $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = 'Sin salida';
                                $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($horas[0]['sum'], $reporte[$ind]['hp']);
                            }
                            /*************************SIN ENTRADA*************************/
                            if (empty($valor['fechahoraentrada']) && !empty($valor['fechahorasalida']) && empty($valor['fdesde']) &&
                                empty($valor['fhasta'])
                            ) {
                                $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_certificado'] = $valor['certificado'] == null ? '0' : $valor['certificado'];
                                $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = 'Sin entrada';
                                $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($horas[0]['sum'], $reporte[$ind]['hp']);
                            }
                            /*************************TIEMPO REAL TRABAJADO*************************/
                            if (($valor['trabajo'] == 1 || count($diaferiadohab) > 0) && ($valor['idtipodedia'] != 12) && ((!empty($valor['fechahoraentrada']) && !empty($valor['fechahorasalida']))
                                    || (!empty($valor['fechahoraentrada']) && !empty($valor['fechahorasalida']) && !empty($valor['idcausa']))
                                    || (empty($valor['fechahoraentrada']) && empty($valor['fechahorasalida']) && !empty($valor['idcausa'])))
                            ) {
                                if (!empty($hrstrabajadas) && $valor['feriado'] == 0) {
                                    $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $hrstrabajadas);
                                }
                            }
                            if (!empty($hrstrabajadas) && $hrstrabajadas > '00:00:00'
                            ) {
                                $reporte[$ind]['diastrab'] = $reporte[$ind]['diastrab'] + 1;
                            }
                            if(($reporte[$ind][$fech1[0] . '/' . $fech1[1]] == '00:00' || $reporte[$ind][$fech1[0] . '/' . $fech1[1]] == "<b> Feriado - </b>00:00") && $tiporeporte == 1){
                                $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = 'Sin registro';
                            }
                        } else {
                            $fdesde = explode('/', $valor['fdesde']);
                            $fhasta = explode('/', $valor['fhasta']);
                            $fd = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                            $fh = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);

                            $temphasta = $fh > $ffin ? $ffin : $fh;
                            $tempinicio = $fd < $finicio ? $finicio : $fd;

                            $confCalendario = new ConfCalendario();
                            $nomGrupodescanso = new NomGrupodescanso();
                            $confHabgrupospredeterminados = new ConfHabgrupospredeterminados();
                            $existegrupo = $confHabgrupospredeterminados->existe($valor['idgrupodescanso']);
                            $grupopredeterminado = $nomGrupodescanso->getGrupoPredeterminado();
                            if(!empty($grupopredeterminado) && count($existegrupo) != 0){
                                $horasperdidasbd = $confCalendario->getHrsCalendario($tempinicio->format('d/m/y'), $temphasta->format('d/m/y'), $grupopredeterminado[0]['idgrupodescanso']);
                            }else{
                                $horasperdidasbd = $calendariopersona->getHrsCalendarioPersona($tempinicio->format('d/m/y'), $temphasta->format('d/m/y'), $valor['idpersona'], $valor['idcargo']);
                            }
                            if (!empty($valor['idcausa'])) {
                                if ($valor['afectasalario'] == 0) {
                                    $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $horasperdidasbd[0]['sum']);
                                    $reporte[$ind]['diastrab'] += $horasperdidasbd[0]['count'];
                                } else {
                                    $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $horasperdidasbd[0]['sum']);
                                }
                            }

                            if (($fd >= $finicio && $fd <= $ffin) && ($fh >= $finicio && $fh <= $ffin)) {
                                $fecha1 = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                                $fecha2 = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);
                                while ($fecha1 <= $fecha2) {
                                    $f1 = explode('/', $fecha1->format('d/m/Y'));
                                    $reporte[$ind][$f1[0] . '/' . $f1[1]] = $valor['abreviatura'];
                                    $reporte[$ind][$f1[0] . '/' . $f1[1] . '_color'] = $valor['color'];
                                    $reporte[$ind][$f1[0] . '/' . $f1[1] . '_certificado'] = $valor['certificado'];
                                    $reporte[$ind][$f1[0] . '/' . $f1[1] . '_aprobado'] = $valor['aprobado'];
                                    $reporte[$ind][$f1[0] . '/' . $f1[1] . '_causa'] = $valor['denomcausa'];
                                    //Para saber en la vista si el dia es de trabajo o no
                                    $diadetrabajo = $calendariopersona->getCalendarioPersonaTrabajo($fecha1->format('d/m/Y'), $fecha1->format('d/m/Y'), $valor['idpersona']);
                                    $diadetrabajo1 = $diadetrabajo;
                                    if(!empty($grupopredeterminado) && count($existegrupo) != 0)
                                        $diadetrabajo = $confCalendario->CalendarioByDateRangeTrabajo($fecha1->format('d/m/Y'), $fecha1->format('d/m/Y'),$grupopredeterminado[0]['idgrupodescanso']);

                                    (!empty($diadetrabajo))?$reporte[$ind][$f1[0] . '/' . $f1[1] . '_trabajo'] = '1':$reporte[$ind][$f1[0] . '/' . $f1[1] . '_trabajo'] = '0';
                                    if (!array_key_exists($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]))
                                        array_push($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]);
                                    date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                    $fechtemp1 = explode('/', $fecha1->format('d/m/Y'));
                                    $fecha1 = date_create($fechtemp1[2] . '-' . $fechtemp1[1] . '-' . $fechtemp1[0]);

                                    if(!empty($diadetrabajo1) && $valor['afectasalario'] == 0)
                                    {
                                        if($diadetrabajo1[0]['feriado'] == 1){
                                            $diaferhab = $datAsistenciaModel->GetDiaFeriadoHabilitado($persona['idpersona'], $diadetrabajo1[0]['fecha']);
                                            if(count($diaferhab)>0)
                                                $reporte[$ind] = $this->NocturnidadconCausaFeriado($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                        }else{
                                            if($diadetrabajo1[0]['trabajo'] == 1 && $diadetrabajo1[0]['feriado'] == 0){
                                                $reporte[$ind] = $this->NocturnidadconCausa($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                            }
                                        }
                                    }

                                }
                            } else {
                                if (($fd < $finicio) && ($fh >= $finicio && $fh <= $ffin)) {
                                    $fecha1 = new DateTime($finicio->format("Y-m-d"));
                                    $fecha2 = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);
                                    while ($fecha1 <= $fecha2) {
                                        $f1 = explode('/', $fecha1->format('d/m/Y'));
                                        $reporte[$ind][$f1[0] . '/' . $f1[1]] = $valor['abreviatura'];
                                        $reporte[$ind][$f1[0] . '/' . $f1[1] . '_color'] = $valor['abreviatura'];
                                        $reporte[$ind][$f1[0] . '/' . $f1[1] . '_certificado'] = $valor['certificado'];
                                        $reporte[$ind][$f1[0] . '/' . $f1[1] . '_aprobado'] = $valor['aprobado'];
                                        $reporte[$ind][$f1[0] . '/' . $f1[1] . '_causa'] = $valor['denomcausa'];
                                        //Para saber en la vista si el dia es de trabajo o no
                                        $diadetrabajo = $calendariopersona->getCalendarioPersonaTrabajo($fecha1->format('d/m/Y'), $fecha1->format('d/m/Y'), $valor['idpersona']);
                                        $diadetrabajo1 = $diadetrabajo;
                                        if(!empty($grupopredeterminado) && count($existegrupo) != 0)
                                            $diadetrabajo = $confCalendario->CalendarioByDateRangeTrabajo($fecha1->format('d/m/Y'), $fecha1->format('d/m/Y'),$grupopredeterminado[0]['idgrupodescanso']);

                                        (!empty($diadetrabajo))?$reporte[$ind][$f1[0] . '/' . $f1[1] . '_trabajo'] = '1':$reporte[$ind][$f1[0] . '/' . $f1[1] . '_trabajo'] = '0';
                                        if (!array_key_exists($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]))
                                            array_push($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]);
                                        date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                        $fechtemp2 = explode('/', $fecha1->format('d/m/Y'));
                                        $fecha1 = date_create($fechtemp2[2] . '-' . $fechtemp2[1] . '-' . $fechtemp2[0]);

                                        if(!empty($diadetrabajo1) && $valor['afectasalario'] == 0)
                                        {
                                            if($diadetrabajo1[0]['feriado'] == 1){
                                                $diaferhab = $datAsistenciaModel->GetDiaFeriadoHabilitado($persona['idpersona'], $diadetrabajo1[0]['fecha']);
                                                if(count($diaferhab)>0)
                                                    $reporte[$ind] = $this->NocturnidadconCausaFeriado($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                            }else{
                                                if($diadetrabajo1[0]['trabajo'] == 1 && $diadetrabajo1[0]['feriado'] == 0){
                                                    $reporte[$ind] = $this->NocturnidadconCausa($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (($fd >= $finicio && $fd <= $ffin) && ($fh > $ffin)) {
                                        $fecha1 = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                                        $fecha2 = $ffin;
                                        while ($fecha1 <= $fecha2) {
                                            $f1 = explode('/', $fecha1->format('d/m/Y'));
                                            $reporte[$ind][$f1[0] . '/' . $f1[1]] = $valor['abreviatura'];
                                            $reporte[$ind][$f1[0] . '/' . $f1[1] . '_color'] = $valor['color'];
                                            $reporte[$ind][$f1[0] . '/' . $f1[1] . '_certificado'] = $valor['certificado'];
                                            $reporte[$ind][$f1[0] . '/' . $f1[1] . '_aprobado'] = $valor['aprobado'];
                                            $reporte[$ind][$f1[0] . '/' . $f1[1] . '_causa'] = $valor['denomcausa'];
                                            //Para saber en la vista si el dia es de trabajo o no
                                            $diadetrabajo = $calendariopersona->getCalendarioPersonaTrabajo($fecha1->format('d/m/Y'), $fecha1->format('d/m/Y'), $valor['idpersona']);
                                            $diadetrabajo1 = $diadetrabajo;
                                            if(!empty($grupopredeterminado) && count($existegrupo) != 0)
                                                $diadetrabajo = $confCalendario->CalendarioByDateRangeTrabajo($fecha1->format('d/m/Y'), $fecha1->format('d/m/Y'),$grupopredeterminado[0]['idgrupodescanso']);

                                            (!empty($diadetrabajo))?$reporte[$ind][$f1[0] . '/' . $f1[1] . '_trabajo'] = '1':$reporte[$ind][$f1[0] . '/' . $f1[1] . '_trabajo'] = '0';
                                            if (!array_key_exists($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]))
                                                array_push($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]);
                                            date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                            $fechtemp3 = explode('/', $fecha1->format('d/m/Y'));
                                            $fecha1 = date_create($fechtemp3[2] . '-' . $fechtemp3[1] . '-' . $fechtemp3[0]);

                                            if(!empty($diadetrabajo1) && $valor['afectasalario'] == 0)
                                            {
                                                if($diadetrabajo1[0]['feriado'] == 1){
                                                    $diaferhab = $datAsistenciaModel->GetDiaFeriadoHabilitado($persona['idpersona'], $diadetrabajo1[0]['fecha']);
                                                    if(count($diaferhab)>0)
                                                        $reporte[$ind] = $this->NocturnidadconCausaFeriado($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                                }else{
                                                    if($diadetrabajo1[0]['trabajo'] == 1 && $diadetrabajo1[0]['feriado'] == 0){
                                                        $reporte[$ind] = $this->NocturnidadconCausa($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        $fr1 = explode('/', $valor['fecharegistro']);
                                        if ($habfinmes[0]['habilitado'] == 1 && $valor['otrodia'] == 1 && $fr1[1] <  $fechainicio[1]) {
                                            $reporte[$ind]['01/' .  $fechainicio[1]] = $valor['abreviatura'];
                                            $reporte[$ind]['01/' . $fechainicio[1] . '_color'] = $valor['color'];
                                            $reporte[$ind]['01/' . $fechainicio[1] . '_certificado'] = $valor['certificado'];
                                            $reporte[$ind]['01/' . $fechainicio[1] . '_aprobado'] = $valor['aprobado'];
                                            $reporte[$ind]['01/' . $fechainicio[1] . '_causa'] = $valor['denomcausa'];
                                        }else{
                                            $fecha1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
                                            $fecha2 = $ffin;
                                            while ($fecha1 <= $fecha2) {
                                                $f1 = explode('/', $fecha1->format('d/m/Y'));
                                                $reporte[$ind][$f1[0] . '/' . $f1[1]] = $valor['abreviatura'];
                                                $reporte[$ind][$f1[0] . '/' . $f1[1] . '_color'] = $valor['color'];
                                                $reporte[$ind][$f1[0] . '/' . $f1[1] . '_certificado'] = $valor['certificado'];
                                                $reporte[$ind][$f1[0] . '/' . $f1[1] . '_aprobado'] = $valor['aprobado'];
                                                $reporte[$ind][$f1[0] . '/' . $f1[1] . '_causa'] = $valor['denomcausa'];
                                                //Para saber en la vista si el dia es de trabajo o no
                                                $diadetrabajo = $calendariopersona->getCalendarioPersonaTrabajo($fecha1->format('d/m/Y'), $fecha1->format('d/m/Y'), $valor['idpersona']);
                                                $diadetrabajo1 = $diadetrabajo;
                                                if(!empty($grupopredeterminado) && count($existegrupo) != 0)
                                                    $diadetrabajo = $confCalendario->CalendarioByDateRangeTrabajo($fecha1->format('d/m/Y'), $fecha1->format('d/m/Y'),$grupopredeterminado[0]['idgrupodescanso']);

                                                (!empty($diadetrabajo))?$reporte[$ind][$f1[0] . '/' . $f1[1] . '_trabajo'] = '1':$reporte[$ind][$f1[0] . '/' . $f1[1] . '_trabajo'] = '0';
                                                if (!array_key_exists($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]))
                                                    array_push($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]);
                                                date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                                $fechtemp4 = explode('/', $fecha1->format('d/m/Y'));
                                                $fecha1 = date_create($fechtemp4[2] . '-' . $fechtemp4[1] . '-' . $fechtemp4[0]);

                                                if(!empty($diadetrabajo1) && $valor['afectasalario'] == 0)
                                                {
                                                    if($diadetrabajo1[0]['feriado'] == 1){
                                                        $diaferhab = $datAsistenciaModel->GetDiaFeriadoHabilitado($persona['idpersona'], $diadetrabajo1[0]['fecha']);
                                                        if(count($diaferhab)>0)
                                                            $reporte[$ind] = $this->NocturnidadconCausaFeriado($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                                    }else{
                                                        if($diadetrabajo1[0]['trabajo'] == 1 && $diadetrabajo1[0]['feriado'] == 0){
                                                            $reporte[$ind] = $this->NocturnidadconCausa($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            if (!empty($valor['idcausa'])) {
                                if ($valor['afectasalario'] == 1) {
                                    /*************************HORAS FERIADAS*************************/
                                    if (count($fechdiaferiado) > 0) {
                                        foreach ($fechdiaferiado as $v) {
                                            //$f = null;
                                            $f = explode('/', $v);
                                            $fech = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                                            if ($fech >= $fd && $fech <= $fh) {
                                                array_push($fechincidencia, $v);
                                            }
                                        }
                                    }

                                    /*************************HORAS RECESO LABORAL*************************/
                                    if (count($diasreceso) > 0) {
                                        foreach ($diasreceso as $v) {
                                            //$f = null;
                                            $f = explode('/', $v['fecha']);
                                            $fech = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                                            if ($fech >= $fd && $fech <= $fh) {
                                                array_push($fechincidenciaRecLab, $v);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        /*************************HORAS EXTRAS*************************/
                        $reporte[$ind]['he'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['he'], $valor['horasextras']);

                        /*************************HORAS FERIADAS HABILITADAS*************************/
                        if (count($fechdiasferiadoshab) > 0) {
                            foreach ($fechdiasferiadoshab as $v) {
                                $horasFer = $calendariopersona->getHrsFeriadasPersona($v, $v, $valor['idpersona']);
                                array_push($fechrango, $v);
                                $f = explode('/', $v);
                                $fech = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                                $fr = explode('/', $valor['fecharegistro']);
                                $fechr = date_create($fr[2] . '-' . $fr[1] . '-' . $fr[0]);
                                if (($fech == $fechr)) {
                                    array_push($encontrado, $v);
                                    $ftrl2 = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $hrsferiadastrabajadas);
                                    $reporte[$ind]['hft'] = $ftrl2;
                                }
                                if (!empty($valor['fdesde']) && !empty($valor['fhasta'])) {
                                    $fdesde = explode('/', $valor['fdesde']);
                                    $fhasta = explode('/', $valor['fhasta']);
                                    $fd = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                                    $fh = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);
                                    if ($fech >= $fd && $fech <= $fh) {
                                        if (!empty($valor['idcausa'])) {
                                            if ($valor['afectasalario'] == 0) {
                                                $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $horasFer[0]['sum']);
                                                $reporte[$ind]['diastrab'] += $horasFer[0]['count'];
                                            } else {
                                                $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $horasFer[0]['sum']);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        /*************************HORAS FERIADAS HABILITADAS*************************/
//                        if($hrstrabajadas != '00:00:00' || !empty($valor['idcausa']))
//                            array_push($conasist, $valor['fecharegistro']);
                    }

                    /*************************HORAS FERIADAS*************************/
                    if (!empty($fechincidencia)) {
                        foreach ($fechincidencia as $f) {
                            $val = explode('/', $f);
                            $hrsDiariasFeriadas = $calendariopersona->getHrsFeriadasPersona($f, $f, $persona['idpersona'], $grupoasistecia);
                            $fthf = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $hrsDiariasFeriadas[0]['sum']);
                            $hf1 = explode(':', $fthf);
                            if ($regimen[0]['tipofondotiempo'] != 3) {
                                $reporte[$ind]['ft'] = intval($hf1[0]);
                                $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $hrsDiariasFeriadas[0]['sum']);
                            }
                        }
                    }
                    $feriadoslimpios = array();
                    $feriados = array();
                    $feriadoslimpios = array_diff($diasferiadospuros, $fechincidencia);
                    $feriados = array_diff($feriadoslimpios, $diasfer);
                    if (count($feriados) > 0) {
                        foreach ($feriados as $f) {
                            $val = explode('/', $f);
                            $reporte[$ind][$val[0] . '/' . $val[1]] = 'Feriado';
                            $reporte[$ind][$val[0] . '/' . $val[1] . '_certificado'] = $valor['certificado'];
                            $reporte[$ind][$val[0] . '/' . $val[1] . '_aprobado'] = $valor['aprobado'];
                            $hrsDiariasFeriadas = $calendariopersona->getHrsFeriadasPersona($f, $f, $persona['idpersona']);
                            $reporte[$ind]['hf'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hf'], $hrsDiariasFeriadas[0]['sum']);
                        }
                    }
                    $sinregistro = array();
                    $sinregistro1 = array();
                    $sinregistro = array_diff($fechdiasferiadoshab, $encontrado);
                    if (count($sinregistro1) > 0) {
                        foreach ($sinregistro as $f) {
                            $val = explode('/', $f);
                            array_push($sinregistro1, "CAST('" . $f . "' as date)");
                            $reporte[$ind][$val[0] . '/' . $val[1]] = '00:00';
                        }
                        $sumhorasferiadas = $calendariopersona->GetSumHorasDiasFeriadosHabByDateArrayAndPerson($persona['idpersona'], $sinregistro1);
                        $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $sumhorasferiadas[0]['sum']);
                    }
                    if ($hrsDiariasFeriadas[0]['sum'] != null  && $regimen[0]['tipofondotiempo'] == 3){
                        $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['trt'], $reporte[$ind]['hf']);
                        $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $reporte[$ind]['hf']);
                    }
                    /*************************HORAS FERIADAS*************************/

                    /*************************SIN REGISTRO*************************/
                    $diasrango = array();
                    $sinasist = array();
                    $sinasist1 = array();
                    $diasrango = $calendariopersona->getCalendarioPersonaTrabajo($finicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idpersona']);
                    foreach ($diasrango as $dia) {
                        array_push($fechrango, $dia['fecha']);
                    }
                    $sinasist = array_diff($fechrango, $conasist);
                    if (count($sinasist) > 0) {
                        foreach ($sinasist as $f) {
                            $val = explode('/', $f);
                            array_push($sinasist1, "CAST('" . $f . "' as date)");
                            $reporte[$ind][$val[0] . '/' . $val[1]] = 'Sin registro';
                        }
                        $sumhoras = $calendariopersona->GetSumHorasDiasFeriadosHabByDateArrayAndPerson($persona['idpersona'], $sinasist1);
                        $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $sumhoras[0]['sum']);
                    }

                    /*************************SIN REGISTRO*************************/

                    $reporte[$ind]['diastrabmilit'] = $this->TiempoAPagarOficiales($asistencia[$persona['idpersona']]/*[$persona['idcargo']]*/, $persona['idpersona'], $finicio, $ffin, $cantDiasMes, $sinasist);

                    /*************************TIEMPO DE RECESO LABORAL*************************/
                    if (empty($fechincidenciaRecLab)) {
                        $recesolab = array();
                        foreach ($diasreceso as $r) {
                            array_push($recesolab, $r['fecha']);
                        }
                        if (count($recesolab) > 0) {
                            foreach ($recesolab as $f) {
                                $val = explode('/', $f);
                                $reporte[$ind][$val[0] . '/' . $val[1]] = 'Receso.Laboral';
                                $reporte[$ind][$val[0] . '/' . $val[1] . '_certificado'] = $valor['certificado'];
                                $reporte[$ind][$val[0] . '/' . $val[1] . '_aprobado'] = $valor['aprobado'];
                                $hrsReclab = $calendariopersona->getHrsRecesoLabPersona($f, $f, $persona['idpersona'], $grupoasistecia);
                                $hrl = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hrl'], $hrsReclab[0]['sum']);
                                $hrl1 = explode(':', $hrl);
                                $reporte[$ind]['hrl'] = intval($hrl1[0]);
                            }
                        }
                    } else {
                        $recesolab = array();
                        foreach ($diasreceso as $r) {
                            array_push($recesolab, $r['fecha']);
                        }
                        if (count($recesolab) > 0) {
                            foreach ($recesolab as $f) {
                                $val = explode('/', $f);
                                $hrsReclab = $calendariopersona->getHrsRecesoLabPersona($f, $f, $persona['idpersona'], $grupoasistecia);
                                $ftrl = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $hrsReclab[0]['sum']);
                                $hrl1 = explode(':', $ftrl);
                                if ($regimen[0]['tipofondotiempo'] != 3) {
                                    $reporte[$ind]['ft'] = intval($hrl1[0]);
                                    $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $hrsReclab[0]['sum']);
                                }
                            }
                        }
                    }
                    if (!empty($diasreceso) && $regimen[0]['tipofondotiempo'] == 3){
                        $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['trt'], $reporte[$ind]['hrl']);
                        $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $reporte[$ind]['hrl']);
                    }
                    
                    /*************************FONDO DE TIEMPO FIJO Y ANUAL*************************/
                    if ($regimen[0]['tipofondotiempo'] == 3 || $regimen[0]['tipofondotiempo'] == 2) {
                        if(empty($reporte[$ind]['trt']))
                            $reporte[$ind]['trt'] = '00:00:00';
                        if ($cantidadmeses > 0)
                            $reporte[$ind]['ft'] = $reporte[$ind]['ft'] * $cantidadmeses;
                        $timetotal = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $reporte[$ind]['hp']);
                        $ti = explode(':', $timetotal);
                        if(mktime($ti[0],$ti[1],$ti[2]) > mktime($reporte[$ind]['ft'],0,0)){
//                            $reporte[$ind]['hp'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['trt']);
                            $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['hp']);
                        }
                        if ((mktime($ti[0],$ti[1],$ti[2]) < mktime($reporte[$ind]['ft'],0,0)) && ($reporte[$ind]['trt'] != '00:00:00')) {
                            if (!empty($reporte[$ind]['hp'])){
                                $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['hp']);
                                //$reporte[$ind]['diastrab'] = intval($regimen[0]['diaslaborables'] - ($reporte[$ind]['hp']/$regimen[0]['diaslaborables']));
                               //$reporte[$ind]['diastrab'] = $reporte[$ind]['diastrab'];
                            }else{
                                $reporte[$ind]['trt'] = $reporte[$ind]['ft'];
                                $reporte[$ind]['diastrab'] = $regimen[0]['diaslaborables'];
                            }
                        }
                        if (($reporte[$ind]['trt'] == '00:00:00') && !empty($reporte[$ind]['hp'])) {
                            $reporte[$ind]['hp'] = $reporte[$ind]['ft'];
                            $reporte[$ind]['diastrab'] = 0;
                        }
                        if (($reporte[$ind]['trt'] != '00:00:00') && empty($reporte[$ind]['hp'])) {
                            if (!empty($regimen[0]['diaslaborables']))
                                $reporte[$ind]['diastrab'] = $regimen[0]['diaslaborables'];
                            $reporte[$ind]['trt'] = $reporte[$ind]['ft'];
                        }

                    }
                    /*************************FONDO DE TIEMPO LIMITE*************************/
                    if ($regimen[0]['tipofondotiempo'] == 4) {
                        if ($cantidadmeses > 0)
                            $reporte[$ind]['ft'] = $reporte[$ind]['ft'] * $cantidadmeses;
                        $timetotal = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $reporte[$ind]['hp']);
                        $ti = explode(':', $timetotal);
                        if(mktime($ti[0],$ti[1],$ti[2]) > mktime($reporte[$ind]['ft'],0,0)){
                            //$reporte[$ind]['hp'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['trt']);
                            $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['hp']);
                        }
                        if (mktime($ti[0],$ti[1],$ti[2]) < mktime($reporte[$ind]['ft'],0,0)) {
                            $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['hp']);
                        }
                        $p = explode(':', $reporte[$ind]['hp']);
                        if (mktime($p[0],$p[1],$p[2]) > mktime($reporte[$ind]['ft'],0,0)) {
                            $reporte[$ind]['hp'] = $reporte[$ind]['ft'];
                        }

                    }

                    ////////////////////////////////HORAS EXTRAS//////////////////////////////////
                    $hmensualesmax = (new ConfHorasextras)->getById(2);
                    $temphl = explode(':', $reporte[$ind]['he']);
                    if ($temphl[0] >= $hmensualesmax->limite)
                        $reporte[$ind]['he'] = $hmensualesmax->limite;
                    else
                        $reporte[$ind]['he'] = intval($temphl[0]);
                    ////////////////////////////////HORAS PERDIDAS////////////////////////////////////
                    $thp = explode(':', $reporte[$ind]['hp']);
                    if ($thp[1] > 30)
                        $a = $thp[0] + 1;
                    else
                        $a = $thp[0];
                    $reporte[$ind]['hp'] = $a;//intval($a);
                    ///////////////////////////////TIEMPO REAL TRABAJADO/////////////////////////
                    if (!empty($reporte[$ind]['hft']))
                        if($regimen[0]['tipofondotiempo'] != 3)
                            $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $reporte[$ind]['hft']);
                    if($regimen[0]['tipofondotiempo'] == 3 && !empty($reporte[$ind]['hp']) && $reporte[$ind]['trt'] != '00:00:00'){
                        $ft1 = explode('.', $reporte[$ind]['ft']);
                        $tottrt = explode(':', $reporte[$ind]['trt']);
                        if ($tottrt[1] >= 30)
                            $atrt = $tottrt[0] + 1;
                        else
                            $atrt = $tottrt[0];
                        if($ft1[1]){
                            $reporte[$ind]['trt'] = $atrt.'.'.$ft1[1];
                        }else{
                            $reporte[$ind]['trt'] = $atrt;
                        }
                    }
//                    if($regimen[0]['tipofondotiempo'] == 3 && !empty($reporte[$ind]['hf'])){
//                        $ft1 = explode('.', $reporte[$ind]['trt']);
//                        $trtfer = $ft1[0] - $reporte[$ind]['hf'];
//                        if($ft1[1]){
//                            $reporte[$ind]['trt'] = $trtfer.'.'.$ft1[1];
//                        }else{
//                            $reporte[$ind]['trt'] = $trtfer;
//                        }
//                    }
                    if($regimen[0]['tipofondotiempo'] == 3 && $reporte[$ind]['trt'])
                    {
                        $ft1 = explode('.', $reporte[$ind]['trt']);
                        $diastrab1 = $ft1[0]/8;
                        $dt = explode('.', $diastrab1);
                        if($dt[1]){
                            if ($dt[1] > 30)
                                $dtrab = $dt[0] + 1;
                            else
                                $dtrab = $dt[0];
                        }else
                            $dtrab = $dt[0];

                        $reporte[$ind]['diastrab'] = intval($dtrab);
                    }
                    if (($regimen[0]['tipofondotiempo'] != 3)) {
                        $tottrt = explode(':', $reporte[$ind]['trt']);
                        if ($tottrt[1] >= 30)
                            $atrt = $tottrt[0] + 1;
                        else
                            $atrt = $tottrt[0];
                        $reporte[$ind]['trt'] = $atrt;//intval($atrt);
                    }
                    if($regimen[0]['tipofondotiempo'] == 3){
                        $auxtrt = explode(':',$reporte[$ind]['trt']);
                        $auxhp = explode(':',$reporte[$ind]['hp']);
                        if(mktime($auxtrt[0],$auxtrt[1],$auxtrt[2]) > mktime($reporte[$ind]['ft'],0,0)){
                            $reporte[$ind]['trt'] = $reporte[$ind]['ft'];
                            $reporte[$ind]['hp'] = 0;
                        }
                        if(mktime($auxhp[0],$auxhp[1],$auxhp[2]) > mktime($reporte[$ind]['ft'],0,0)){
                            $reporte[$ind]['hp'] = $reporte[$ind]['ft'];
                            $reporte[$ind]['trt'] = 0;
                        }
                    }

                    ///////////////////////////////HORAS FERIADAS/////////////////////////
                    $hf = explode(':', $reporte[$ind]['hf']);
                    $reporte[$ind]['hf'] = intval($hf[0]);
                    ///////////////////////////////HORAS FERIADAS TRABAJADAS/////////////////////////
                    $hft = explode(':', $reporte[$ind]['hft']);
                    $reporte[$ind]['hft'] = intval($hft[0]);
                    ///////////////////////////////TIEMPO DE TRABAJO EXTRAORDINARIO/////////////////////////
                    $hte = explode(':', $reporte[$ind]['hte']);
                    if ($hte[1] >= 30)
                        $hte1 = $hte[0] + 1;
                    else
                        $hte1 = $hte[0];
                    $reporte[$ind]['hte'] = intval($hte1);

                    if (empty($reporte[$ind]['ft']) || intval($reporte[$ind]['ft']) == 0 || intval($reporte[$ind]['ft']) == 00)
                        $reporte[$ind]['ft'] = "";
                    if (empty($reporte[$ind]['trt']) || intval($reporte[$ind]['trt']) == 0 || intval($reporte[$ind]['trt']) == 00)
                        $reporte[$ind]['trt'] = "";
                    if (empty($reporte[$ind]['hp']) || intval($reporte[$ind]['hp']) == 0 || intval($reporte[$ind]['hp']) == 00)
                        $reporte[$ind]['hp'] = "";
                    if (empty($reporte[$ind]['he']) || intval($reporte[$ind]['he']) == 0 || intval($reporte[$ind]['he']) == 00)
                        $reporte[$ind]['he'] = "";
                    if (empty($reporte[$ind]['hf']) || intval($reporte[$ind]['hf']) == 0 || intval($reporte[$ind]['hf']) == 00)
                        $reporte[$ind]['hf'] = "";
                    if (empty($reporte[$ind]['hft']) || intval($reporte[$ind]['hft']) == 0 || intval($reporte[$ind]['hft']) == 00)
                        $reporte[$ind]['hft'] = "";
                    if (empty($reporte[$ind]['hte']) || intval($reporte[$ind]['hte']) == 0 || intval($reporte[$ind]['hte']) == 00)
                        $reporte[$ind]['hte'] = "";
                    if (empty($reporte[$ind]['hrl']) || intval($reporte[$ind]['hrl']) == 0 || intval($reporte[$ind]['hrl']) == 00)
                        $reporte[$ind]['hrl'] = "";
                    if (empty($reporte[$ind]['dm']) || intval($reporte[$ind]['dm']) == 0 || intval($reporte[$ind]['dm']) == 00)
                        $reporte[$ind]['dm'] = "";
                }
            }
            $temparray = array();
            foreach ($reporte as $r) {
                $temparray[$r['idpersona'] . '_' . $r['idcargo']] = $r;
            }
            $reporte = array_values($temparray);

            $datAsistenciamensual = new DatAsistenciamensual();
            $data = $datAsistenciamensual->getAsistMensualByPeriodoAndIdestruct($idestructura, $fechdesde, $fechhasta);
            if (!empty($data[0])) {
                $result['aprobado'] = 1;
            } else {
                $result['aprobado'] = 0;
            }

        } else {
            $reporte = array();
            $PersonCargo = array();
        }
        //print_r($reporte);die;
        if (count($reporte) > 0) {
            $result['columnas'] = $columnasGrid;
            $result['nocturnidad'] = $confNocturnidad;
            $result['nocturnidadfer'] = $confNocturnidadfer;
            $result['data'] = $reporte;
            $result['cant'] = $cantidad;
            return $result;
        } else {
            $result['columnas'] = $columnasGrid;
            $result['nocturnidad'] = $confNocturnidad;
            $result['nocturnidadfer'] = $confNocturnidadfer;
            $result['data'] = array();
            $result['cant'] = 0;
            $result['cod'] = 3;
            return $result;
        }
    }

    public function CalcularNocturnidad($asistencia, $nocturnidad, $habfinmes, $mes)
    {
        $asisfecharegistro = explode('/', $asistencia['fecharegistro']);
        $asisfechahoraentrada = explode(' ', $asistencia['fechahoraentrada']);
        $asisfechahorasalida = explode(' ', $asistencia['fechahorasalida']);

        if($asistencia['otrodia'] == 1){
            $fechareg = date_create($asisfecharegistro[2] . '-' . $asisfecharegistro[1] . '-' . $asisfecharegistro[0]);
            date_add($fechareg, date_interval_create_from_date_string('1 day'));
            $fechasalida = explode('/', $fechareg->format('d/m/Y'));
        }else{
            $fechasalida = $asisfecharegistro;
        }

        $asisfechaentrada = explode('/', $asisfechahoraentrada[0]);
        $asisfechasalida = explode('/', $asisfechahorasalida[0]);

        $asishoraentradaaux = explode(':', $asisfechahoraentrada[1]);
        $hrinicioturno = explode(':', $asistencia['horainicio']);
        if (mktime($asishoraentradaaux[0], $asishoraentradaaux[1], 0) < mktime($hrinicioturno[0], $hrinicioturno[1], 0)) {
            $asisfechahoraentrada[1] = $asistencia['horainicio'];
        }

        $asishorasalidaaux = explode(':', $asisfechahorasalida[1]);
        $hrfinturno = explode(':', $asistencia['horafin']);

        if (mktime($asishorasalidaaux[0], $asishorasalidaaux[1], 0,$asisfechasalida[1],$asisfechasalida[0],$asisfechasalida[2]) > mktime($hrfinturno[0], $hrfinturno[1], 0,$fechasalida[1],$fechasalida[0],$fechasalida[2])) {
            $asisfechahorasalida[1] = $asistencia['horafin'];
        }

        if(!empty($asistencia['idcausa']) && !empty($asistencia['fdesde']) && !empty($asistencia['fhasta'])){
            $asisfechahoraentrada[1] = $asistencia['horainicio'];
            $asisfechahorasalida[1] = $asistencia['horafin'];
            $asisfechaentrada = $asisfecharegistro;
            $asisfechasalida = $fechasalida;
        }

        $asishorainicio = explode(':', $asisfechahoraentrada[1]);
        $asishorafin = explode(':', $asisfechahorasalida[1]);

        $resultado = array();
        $resultadoaf = array();
        foreach ($nocturnidad as $noct) {
            $horainicio = null;
            $horafin = null;
            $nocthorainicio = explode(':', $noct['horainicio']);
            $nocthorafin = explode(':', $noct['horafin']);

            $diadespues = 27;
            if (mktime($nocthorafin[0], $nocthorafin[1], 0) < mktime($nocthorainicio[0], $nocthorainicio[1], 0)) {
                $diadespues = 28;
            }

            $asisdiadespues = 27;
            if ($asistencia['otrodia'] == 1 && mktime(0, 0, 0, $asisfechaentrada[1], $asisfechaentrada[0], $asisfechaentrada[2]) < mktime(0, 0, 0, $asisfechasalida[1], $asisfechasalida[0], $asisfechasalida[2])) {
                $asisdiadespues = 28;
            }

            /**La hora de entrada es menor a la hora inicio de nocturnidad y la hora de salida es mayor a la hora de nocturnidad
             * o la hora de entrada es menor a la hora de inicio de nocturnidad y es un turno de otro dia y la fecha de salida es mayor a la fecha de entrada
             * se toman las horas de inicio y fin de la nocturnidad para hacer el calculo
             **/
            if ((mktime($asishorainicio[0], $asishorainicio[1], 0) <= mktime($nocthorainicio[0], $nocthorainicio[1], 0) && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) >= mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990))
                /*|| ( mktime($asishorainicio[0], $asishorainicio[1],0,12,27,1990) <= mktime($nocthorainicio[0], $nocthorainicio[1],0,12,27,1990) &&  $asistencia['otrodia'] == 1 && date('d/m/Y',mktime(0,0,0,$asisfechaentrada[1],$asisfechaentrada[0],$asisfechaentrada[2])) <  date('d/m/Y',mktime(0,0,0,$asisfechasalida[1], $asisfechasalida[0], $asisfechasalida[2])))*/
            ) {
                $horainicio = $noct['horainicio'];
                $horafin = $noct['horafin'];
            } /**
             * Las horas de entrada y salida estan dentro del rango de las horas de inicio y fin de la nocturnidad
             */
            else if (mktime($asishorainicio[0], $asishorainicio[1], 0) > mktime($nocthorainicio[0], $nocthorainicio[1], 0) && mktime($asishorainicio[0], $asishorainicio[1], 0, 12, 27, 1990) < mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990)
                && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) < mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990) && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) > mktime($nocthorainicio[0], $nocthorainicio[1], 0, 12, 27, 1990)
            ) {
                $horainicio = $asisfechahoraentrada[1];
                $horafin = $asisfechahorasalida[1];
            } /**
             * La hora de entrada es mayor que la hora inicio de la nocturnidad y la hora de salida es mayor que la hora de fin de nocturnidad
             */
            else if ((mktime($asishorainicio[0], $asishorainicio[1], 0) > mktime($nocthorainicio[0], $nocthorainicio[1], 0) && mktime($asishorainicio[0], $asishorainicio[1], 0, 12, 27, 1990) < mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990) && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) > mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990)) /*||
               (mktime($asishorainicio[0], $asishorainicio[1],0,12,27,1990) > mktime($nocthorainicio[0], $nocthorainicio[1],0,12,27,1990) && mktime($asishorainicio[0], $asishorainicio[1],0,12,27,1990) < mktime($nocthorafin[0], $nocthorafin[1],0,12,$diadespues,1990) &&  $asistencia['otrodia'] == 1 && date('d/m/Y',mktime(0,0,0,$asisfechaentrada[1],$asisfechaentrada[0],$asisfechaentrada[2])) <  date('d/m/Y',mktime(0,0,0,$asisfechasalida[1], $asisfechasalida[0], $asisfechasalida[2])))*/
            ) {
                $horainicio = $asisfechahoraentrada[1];
                $horafin = $noct['horafin'];
            } /**
             * La hora de entrada es menor que la hora de inicio la nocturnidad y la hora de salida es menor que la hora de fin de la nocturnidad
             */
            else if (mktime($asishorainicio[0], $asishorainicio[1], 0) < mktime($nocthorainicio[0], $nocthorainicio[1], 0) && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) < mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990) && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) > mktime($nocthorainicio[0], $nocthorainicio[1], 0, 12, 27, 1990)) {
                $horainicio = $noct['horainicio'];
                $horafin = $asisfechahorasalida[1];
            }

            if (($horainicio != null && $horafin != null) || (!empty($asistencia['idcausa']) && !empty($asistencia['fdesde']) && !empty($asistencia['fhasta']) && empty($asistencia['hrstrabajadas']))) {
                if ($diadespues == 28) {
                    $primeraresta = $this->RestOnlyTime("24:00:00", $horainicio);
                    $resultado['noct_' . $noct['horainicio'] . '_' . $noct['horafin']] = $this->SumOnlyTime($primeraresta, $horafin);
                } else {
                    $resultado['noct_' . $noct['horainicio'] . '_' . $noct['horafin']] = $this->RestOnlyTime($horafin, $horainicio);
                }

                $last = date("t", strtotime($asisfecharegistro[2] . "-" . $asisfecharegistro[1] . "-" . $asisfecharegistro[0]));
                if (($habfinmes == 1 && $asisfecharegistro[1] != $mes) || ($habfinmes == 1 && $asistencia['otrodia'] == 1 && $asisfecharegistro[0] == $last)) {
                    $ahorainicio = explode(':', $horainicio);
                    $ahorainicio = explode(':', $horainicio);
                    $ahorafin = explode(':', $horafin);
                    //Si la horainicio y la horafin estan antes de las 2400h, se queda en before12
                    if (mktime($ahorainicio[0], $ahorainicio[1], 0, 12, 27, 1990) < mktime(24, 0, 0, 12, 27, 1990) && mktime($ahorafin[0], $ahorafin[1], 0, 12, $diadespues, 1990) <= mktime(24, 0, 0, 12, 27, 1990)) {
                        $resultadoaf['noct_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_before12'] = $resultado['noct_' . $noct['horainicio'] . '_' . $noct['horafin']];
                        $resultadoaf['noct_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_after12'] = 0;
                    }
                    //Si la hora inicio esta antes de las 2400h y la horafin esta despues se calcula hasta las 2400h lo que se queda before y el resto se pone en after
                    if (mktime($ahorainicio[0], $ahorainicio[1], 0, 12, 27, 1990) < mktime(24, 0, 0, 12, 27, 1990) && mktime($ahorafin[0], $ahorafin[1], 0, 12, $diadespues, 1990) > mktime(24, 0, 0, 12, 27, 1990)) {
                        $resultadoaf['noct_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_before12'] = $this->RestOnlyTime("24:00:00", $horainicio);
                        $resultadoaf['noct_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_after12'] = $this->RestOnlyTime($horafin, "00:00:00");
                    }
                    //Si la hora de inicio es igual o mayo a las 24h y la hora de fin mayor a las 2400h, se queda en after
                    if (mktime($ahorainicio[0], $ahorainicio[1], 0, 12, 27, 1990) >= mktime(24, 0, 0, 12, 27, 1990) && mktime($ahorafin[0], $ahorafin[1], 0, 12, $diadespues, 1990) > mktime(24, 0, 0, 12, 27, 1990)) {
                        $resultadoaf['noct_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_before12'] = 0;
                        $resultadoaf['noct_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_after12'] = $this->RestOnlyTime($horafin, $horainicio);
                    }

                    if ($asisfecharegistro[1] < $mes || ($mes == 1 && $asisfecharegistro[1] == 12)) {
                        $resultado['noct_' . $noct['horainicio'] . '_' . $noct['horafin']] = $resultadoaf['noct_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_after12'];
                    } else if ($asisfecharegistro[1] > $mes || ($mes = 12 && $asisfecharegistro[1] == 1)) {
                        $resultado['noct_' . $noct['horainicio'] . '_' . $noct['horafin']] = $resultadoaf['noct_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_before12'];
                    }
                }
            }
            if (!empty($asistencia['tiempodescanso']) && $asistencia['tiempodescanso'] != '00:00:00') {
                $Halmuerzo = explode(':', $asistencia['horarioalmuerzo']);
                $sumahoradescansoaux = $this->SumOnlyTime($asistencia['horarioalmuerzo'],$asistencia['tiempodescanso']);
                $sumahoradescanso = explode(':', $sumahoradescansoaux);

                $horaalmuerzo = mktime($sumahoradescanso[0], $sumahoradescanso[1], 0, $asisfecharegistro[1],$asisfecharegistro[0],$asisfecharegistro[2]);
                $horarionoctini = mktime($nocthorainicio[0], $nocthorainicio[1], 0,$asisfecharegistro[1],$asisfecharegistro[0],$asisfecharegistro[2]);
                $horarionoctfin = mktime($nocthorafin[0], $nocthorafin[1], 0,$asisfecharegistro[1],$asisfecharegistro[0],$asisfecharegistro[2]);

//                    if(mktime($nocthorainicio[0], $nocthorainicio[1], $nocthorainicio[2]) == mktime(23, 0, 0)){
//                        $fechareg = date_create($asisfecharegistro[2] . '-' . $asisfecharegistro[1] . '-' . $asisfecharegistro[0]);
//                        date_add($fechareg, date_interval_create_from_date_string('1 day'));
//                        $fechareg1 = explode('/', $fechareg->format('d/m/Y'));
//                        $horarionoctfin = mktime($nocthorafin[0], $nocthorafin[1], 0,$fechareg1[1],$fechareg1[0],$fechareg1[2]);
//                    }
                if(mktime($horaalmuerzo[0], $horaalmuerzo[1], $horaalmuerzo[2]) >= mktime(24, 0, 0)){
                    $horarionoctfin = mktime($nocthorafin[0], $nocthorafin[1], 0,$fechasalida[1],$fechasalida[0],$fechasalida[2]);
                }
                if($horaalmuerzo >= $horarionoctini && $horaalmuerzo < $horarionoctfin && !empty($resultado)){
                    $resultado['noct_' . $noct['horainicio'] . '_' . $noct['horafin']] = $this->RestOnlyTime($resultado['noct_' . $noct['horainicio'] . '_' . $noct['horafin']], $asistencia['tiempodescanso']);
                }
            }
        }
        return $resultado;
    }

    public function CalcularNocturnidadDiaferiado($asistencia, $nocturnidad, $habfinmes, $mes)
    {
        //if ($asistencia['feriado'] == 1) {
        $asisfechahoraentrada = explode(' ', $asistencia['fechahoraentrada']);
        $asisfechahorasalida = explode(' ', $asistencia['fechahorasalida']);
        $asisfecharegistro = explode('/', $asistencia['fecharegistro']);

        if($asistencia['otrodia'] == 1){
            $fechareg = date_create($asisfecharegistro[2] . '-' . $asisfecharegistro[1] . '-' . $asisfecharegistro[0]);
            date_add($fechareg, date_interval_create_from_date_string('1 day'));
            $fechasalida = explode('/', $fechareg->format('d/m/Y'));
        }else{
            $fechasalida = $asisfecharegistro;
        }

        $asisfechaentrada = explode('/', $asisfechahoraentrada[0]);
        $asisfechasalida = explode('/', $asisfechahorasalida[0]);

        $asishoraentradaaux = explode(':', $asisfechahoraentrada[1]);
        $hrinicioturno = explode(':', $asistencia['horainicio']);
        if (mktime($asishoraentradaaux[0], $asishoraentradaaux[1], 0) < mktime($hrinicioturno[0], $hrinicioturno[1], 0)) {
            $asisfechahoraentrada[1] = $asistencia['horainicio'];
        }

        $asishorasalidaaux = explode(':', $asisfechahorasalida[1]);
        $hrfinturno = explode(':', $asistencia['horafin']);
        if (mktime($asishorasalidaaux[0], $asishorasalidaaux[1], 0,$asisfechasalida[1],$asisfechasalida[0],$asisfechasalida[2]) > mktime($hrfinturno[0], $hrfinturno[1], 0,$fechasalida[1],$fechasalida[0],$fechasalida[2])) {
            $asisfechahorasalida[1] = $asistencia['horafin'];
        }

        if(!empty($asistencia['idcausa']) && !empty($asistencia['fdesde']) && !empty($asistencia['fhasta'])){
            $asisfechahoraentrada[1] = $asistencia['horainicio'];
            $asisfechahorasalida[1] = $asistencia['horafin'];
            $asisfechaentrada = $asisfecharegistro;
            $asisfechasalida = $fechasalida;
        }

        $asishorainicio = explode(':', $asisfechahoraentrada[1]);
        $asishorafin = explode(':', $asisfechahorasalida[1]);

        $resultado = array();
        $resultadoaf = array();
        foreach ($nocturnidad as $noct) {
            $horainicio = null;
            $horafin = null;
            $nocthorainicio = explode(':', $noct['horainicio']);
            $nocthorafin = explode(':', $noct['horafin']);

            $diadespues = 27;
            if (mktime($nocthorafin[0], $nocthorafin[1], 0) < mktime($nocthorainicio[0], $nocthorainicio[1], 0)) {
                $diadespues = 28;
            }

            $asisdiadespues = 27;
            if ($asistencia['otrodia'] == 1 && mktime(0, 0, 0, $asisfechaentrada[1], $asisfechaentrada[0], $asisfechaentrada[2]) < mktime(0, 0, 0, $asisfechasalida[1], $asisfechasalida[0], $asisfechasalida[2])) {
                $asisdiadespues = 28;
            }

            /**La hora de entrada es menor a la hora inicio de nocturnidad y la hora de salida es mayor a la hora de nocturnidad
             * o la hora de entrada es menor a la hora de inicio de nocturnidad y es un turno de otro dia y la fecha de salida es mayor a la fecha de entrada
             * se toman las horas de inicio y fin de la nocturnidad para hacer el calculo
             **/
            if ((mktime($asishorainicio[0], $asishorainicio[1], 0) <= mktime($nocthorainicio[0], $nocthorainicio[1], 0) && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) >= mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990))
                /*|| ( mktime($asishorainicio[0], $asishorainicio[1],0,12,27,1990) <= mktime($nocthorainicio[0], $nocthorainicio[1],0,12,27,1990) &&  $asistencia['otrodia'] == 1 && date('d/m/Y',mktime(0,0,0,$asisfechaentrada[1],$asisfechaentrada[0],$asisfechaentrada[2])) <  date('d/m/Y',mktime(0,0,0,$asisfechasalida[1], $asisfechasalida[0], $asisfechasalida[2])))*/
            ) {
                $horainicio = $noct['horainicio'];
                $horafin = $noct['horafin'];
            } /**
             * Las horas de entrada y salida estan dentro del rango de las horas de inicio y fin de la nocturnidad
             */
            else if (mktime($asishorainicio[0], $asishorainicio[1], 0) > mktime($nocthorainicio[0], $nocthorainicio[1], 0) && mktime($asishorainicio[0], $asishorainicio[1], 0, 12, 27, 1990) < mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990)
                && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) < mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990) && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) > mktime($nocthorainicio[0], $nocthorainicio[1], 0, 12, 27, 1990)
            ) {
                $horainicio = $asisfechahoraentrada[1];
                $horafin = $asisfechahorasalida[1];
            } /**
             * La hora de entrada es mayor que la hora inicio de la nocturnidad y la hora de salida es mayor que la hora de fin de nocturnidad
             */
            else if ((mktime($asishorainicio[0], $asishorainicio[1], 0) > mktime($nocthorainicio[0], $nocthorainicio[1], 0) && mktime($asishorainicio[0], $asishorainicio[1], 0, 12, 27, 1990) < mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990) && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) > mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990)) /*||
               (mktime($asishorainicio[0], $asishorainicio[1],0,12,27,1990) > mktime($nocthorainicio[0], $nocthorainicio[1],0,12,27,1990) && mktime($asishorainicio[0], $asishorainicio[1],0,12,27,1990) < mktime($nocthorafin[0], $nocthorafin[1],0,12,$diadespues,1990) &&  $asistencia['otrodia'] == 1 && date('d/m/Y',mktime(0,0,0,$asisfechaentrada[1],$asisfechaentrada[0],$asisfechaentrada[2])) <  date('d/m/Y',mktime(0,0,0,$asisfechasalida[1], $asisfechasalida[0], $asisfechasalida[2])))*/
            ) {
                $horainicio = $asisfechahoraentrada[1];
                $horafin = $noct['horafin'];
            } /**
             * La hora de entrada es menor que la hora de inicio la nocturnidad y la hora de salida es menor que la hora de fin de la nocturnidad
             */
            else if (mktime($asishorainicio[0], $asishorainicio[1], 0) < mktime($nocthorainicio[0], $nocthorainicio[1], 0) && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) < mktime($nocthorafin[0], $nocthorafin[1], 0, 12, $diadespues, 1990) && mktime($asishorafin[0], $asishorafin[1], 0, 12, $asisdiadespues, 1990) > mktime($nocthorainicio[0], $nocthorainicio[1], 0, 12, 27, 1990)) {
                $horainicio = $noct['horainicio'];
                $horafin = $asisfechahorasalida[1];
            }

            if (($horainicio != null && $horafin != null) || (!empty($asistencia['idcausa']) && !empty($asistencia['fdesde']) && !empty($asistencia['fhasta']))) {
                if ($diadespues == 28) {
                    $primeraresta = $this->RestOnlyTime("24:00:00", $horainicio);
                    $resultado['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin']] = $this->SumOnlyTime($primeraresta, $horafin);

                } else {
                    $resultado['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin']] = $this->RestOnlyTime($horafin, $horainicio);
                }

                $ahorainicio = explode(':', $horainicio);
                $ahorafin = explode(':', $horafin);
                //Si la horainicio y la horafin estan antes de las 2400h, se queda en before12
                if (mktime($ahorainicio[0], $ahorainicio[1], 0, 12, 27, 1990) < mktime(24, 0, 0, 12, 27, 1990) && mktime($ahorafin[0], $ahorafin[1], 0, 12, $diadespues, 1990) <= mktime(24, 0, 0, 12, 27, 1990)) {
                    $resultadoaf['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_before12'] = $resultado['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin']];
                    $resultadoaf['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_after12'] = 0;
                }
                //Si la hora inicio esta antes de las 2400h y la horafin esta despues se calcula hasta las 2400h lo que se queda before y el resto se pone en after
                if (mktime($ahorainicio[0], $ahorainicio[1], 0, 12, 27, 1990) < mktime(24, 0, 0, 12, 27, 1990) && mktime($ahorafin[0], $ahorafin[1], 0, 12, $diadespues, 1990) > mktime(24, 0, 0, 12, 27, 1990)) {
                    $resultadoaf['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_before12'] = $this->RestOnlyTime("24:00:00", $horainicio);
                    $resultadoaf['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_after12'] = $this->RestOnlyTime($horafin, "00:00:00");
                }
                //Si la hora de inicio es igual o mayo a las 24h y la hora de fin mayor a las 2400h, se queda en after
                if (mktime($ahorainicio[0], $ahorainicio[1], 0, 12, 27, 1990) >= mktime(24, 0, 0, 12, 27, 1990) && mktime($ahorafin[0], $ahorafin[1], 0, 12, $diadespues, 1990) > mktime(24, 0, 0, 12, 27, 1990)) {
                    $resultadoaf['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_before12'] = 0;
                    $resultadoaf['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_after12'] = $this->RestOnlyTime($horafin, $horainicio);
                }
                $resultado['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin']] = $resultadoaf['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_after12'];
                $resultado['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin']] = $resultadoaf['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'] . '_before12'];
            }
            if (!empty($asistencia['tiempodescanso']) && $asistencia['tiempodescanso'] != '00:00:00') {
                $Halmuerzo = explode(':', $asistencia['horarioalmuerzo']);
                $sumahoradescansoaux = $this->SumOnlyTime($asistencia['horarioalmuerzo'],$asistencia['tiempodescanso']);
                $sumahoradescanso = explode(':', $sumahoradescansoaux);

                $horaalmuerzo = mktime($sumahoradescanso[0], $sumahoradescanso[1], 0, $asisfecharegistro[1],$asisfecharegistro[0],$asisfecharegistro[2]);
                $horarionoctini = mktime($nocthorainicio[0], $nocthorainicio[1], 0,$asisfecharegistro[1],$asisfecharegistro[0],$asisfecharegistro[2]);
                $horarionoctfin = mktime($nocthorafin[0], $nocthorafin[1], 0,$asisfecharegistro[1],$asisfecharegistro[0],$asisfecharegistro[2]);

                if(mktime($horaalmuerzo[0], $horaalmuerzo[1], $horaalmuerzo[2]) >= mktime(24, 0, 0)){
                    $horarionoctfin = mktime($nocthorafin[0], $nocthorafin[1], 0,$fechasalida[1],$fechasalida[0],$fechasalida[2]);
                }
                if($horaalmuerzo >= $horarionoctini && $horaalmuerzo < $horarionoctfin && !empty($resultado)){
                    $resultado['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin']] = $this->RestOnlyTime($resultado['noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin']], $asistencia['tiempodescanso']);
                }
            }
        }
        //}
        return $resultado;
    }

    public function NocturnidadconCausa($valor, $confNocturnidad, $habfinmes, $mes3, $ind,$reporte){

        $nocturnidad = $this->CalcularNocturnidad($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3);

        if ($nocturnidad != null) {
            foreach ($nocturnidad as $noctkey => $noctvalue) {
                if (!isset($reporte[$ind][$noctkey])) {
                    $reporte[$ind][$noctkey] = $noctvalue;
                } else {
                    $reporte[$ind][$noctkey] = $this->SumOnlyTime($noctvalue, $reporte[$ind][$noctkey]);
                }
                $noct = explode(':', $reporte[$ind][$noctkey]);
                $reporte[$ind][$noctkey] = $noct[0] . ':' . $noct[1];
            }
        }
        return $reporte[$ind];
    }

    public function NocturnidadconCausaFeriado($valor, $confNocturnidad, $habfinmes, $mes3, $ind,$reporte){
        $nocturnidadferiados = $this->CalcularNocturnidadDiaferiado($valor, $confNocturnidad, $habfinmes, $mes3);
        if ($nocturnidadferiados != null) {
            foreach ($nocturnidadferiados as $noctkeyf => $noctvaluef) {
                if (!isset($reporte[$ind][$noctkeyf])) {
                    $reporte[$ind][$noctkeyf] = $noctvaluef;
                } else {
                    $reporte[$ind][$noctkeyf] = $this->SumOnlyTime($noctvaluef, $reporte[$ind][$noctkeyf]);
                }
                $noct = explode(':', $reporte[$ind][$noctkeyf]);
                $reporte[$ind][$noctkeyf] = $noct[0] . ':' . $noct[1];
            }
        }
        return $reporte[$ind];
    }

    public function TiempoAPagarOficiales($asistencia, $idpersona, $finicio, $ffin, $cantDiasMes, $sinasist)
    {
        $objcausas = new ConfCategoriacausas();
        $idcategoria = $objcausas->getcategoriasbypersona($idpersona)['datos'][0]['idcategoriapersona'];
        if (!empty($idcategoria)) {
            $causas = $objcausas->IdsCausasByCateg($idcategoria);
            $iscausas = array();
            foreach ($causas as $causa) {
                array_push($iscausas, $causa['idcausa']);
            }
            if (!empty($iscausas)) {
                $objFT = new ConfFondodetiempo($idcategoria);
                $time = $objFT->existeFT($idcategoria)[0]['fondodetiempo'];
                $ft = explode('.', $time);
                $fondotiempo = $ft[0];
                $diasadescontar = 0;
                $calendariopersona = new ConfCalendariopersona();
                if (!empty($asistencia)) {
                    foreach ($asistencia as $key => $val) {
                        if (!empty($val['idcausa'])) {
                            if (in_array($val['idcausa'], $iscausas)) {
                                if (!empty($val['fdesde']) && !empty($val['fhasta'])) {
                                    $fdesde = explode('/', $val['fdesde']);
                                    $fhasta = explode('/', $val['fhasta']);
                                    $fd = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                                    $fh = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);
                                    $temphasta = $fh > $ffin ? $ffin : $fh;
                                    $tempinicio = $fd < $finicio ? $finicio : $fd;
                                    $dias = $calendariopersona->getDiasCalendarioPersonaOficiales($tempinicio->format('d/m/y'), $temphasta->format('d/m/y'), $val['idpersona']);
                                    $diasadescontar += $dias[0]['count'];
                                } else if (empty($val['fdesde']) && empty($val['fhasta']) && empty($val['fechahoraentrada']) && empty($val['fechahorasalida']) && $val['trabajo'] == 1) {
                                    $diasadescontar += 1;
                                }
                            }
                        } else if (empty($val['fdesde']) && empty($val['fhasta']) && empty($val['fechahoraentrada']) && empty($val['fechahorasalida']) && $val['trabajo'] == 1) {
                            $diasadescontar += 1;
                        }
                    }
                }
                $diasadescontar += count($sinasist);
                if ($diasadescontar > $fondotiempo)
                    $diasadescontar = $fondotiempo;
                if (!empty($fondotiempo))
                    $result = $fondotiempo - $diasadescontar;
                return $result;
            }
        }
    }

    public function RestOnlyTime($tiempo1, $tiempo2)
    {
        list($h1, $m1, $s1) = explode(':', $tiempo1);
        list($h2, $m2, $s2) = explode(':', $tiempo2);

        $seg = (int)$s1 - (int)$s2;
        $min = (int)$m1 - (int)$m2;
        $hrs = (int)$h1 - (int)$h2;

        $segF = 0;
        $minF = 0;
        $hrsF = 0;

        $sumMin = 0;
        $sumHrs = 0;

        if ($seg < 0) {
            $segF = 60 + $seg;
            $sumMin--;
        } else {
            $segF = $seg;
        }

        if ($sumMin < 0)
            $min = $min + $sumMin;

        if ($min < 0) {
            $minF = 60 + $min;
            $sumHrs--;
        } else {
            $minF = $min;
        }

        $hrsF = $hrs;
        if ($sumHrs < 0)
            $hrsF = $hrsF + $sumHrs;
        $hora = ($hrsF < 10) ? ('0' . $hrsF) : ($hrsF);
        $minutos = ($minF < 10) ? ('0' . $minF) : $minF;
        $segundos = ($segF < 10) ? ('0' . $segF) : $segF;
        return $hora . ':' . $minutos . ':' . $segundos;
    }

    public function SumOnlyTime($tiempo1, $tiempo2)
    {
        list($h1, $m1, $s1) = explode(':', $tiempo1);
        list($h2, $m2, $s2) = explode(':', $tiempo2);

        $seg = (int)$s1 + (int)$s2;
        $min = (int)$m1 + (int)$m2;
        $hrs = (int)$h1 + (int)$h2;

        $segF = 0;
        $minF = 0;
        $hrsF = 0;

        $sumMin = 0;
        $sumHrs = 0;

        if ($seg >= 60) {
            $segF = $seg - 60;
            $sumMin++;
        } else {
            $segF = $seg;
        }

        if ($sumMin > 0)
            $min = $min + $sumMin;

        if ($min >= 60) {
            $minF = $min - 60;
            $sumHrs++;
        } else {
            $minF = $min;
        }

        $hrsF = $hrs;
        if ($sumHrs > 0)
            $hrsF = $hrsF + $sumHrs;
        $hora = ($hrsF < 10) ? ('0' . $hrsF) : ($hrsF);
        $minutos = ($minF < 10) ? ('0' . $minF) : $minF;
        $segundos = ($segF < 10) ? ('0' . $segF) : $segF;
        return $hora . ':' . $minutos . ':' . $segundos;
    }

    public
    function GetReporteWithSesions($idestructura, $mes, $year, $limit, $start, $filtro,
                                   $quincena = 0, $tiporeporte = 0, $analisis, $fdesde, $fhasta, $certificacion)
    {
        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        $datAsistenciaModel = new DatAsistenciaModel();
        $datAsistencia = new DatAsistencia();
        $calendario = new ConfCalendario();
        $diaferiadohabilitado = new DatDiaferiadohabilitado();

        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $reporte = $datAsistencia->GetDatosPersonaReporteAsistMensual($cargosPeople, $filtro, $limit, $start);
        $cantidad = count($datAsistencia->GetDatosPersonaReporteAsistMensual($cargosPeople, $filtro, null, 0));

        foreach ($reporte as $k => $per) {
            $idsPeople[$k] = $per['idpersona'];
        }
        $hmensualesmax = (new ConfHorasextras)->getById(2);
        if (count($idsPeople) > 0) {
            if ($analisis == 1) {
                $confFechas = new DatPeriodomes();
                $rangoFechas = $confFechas->getPeriodoMes($mes, $year);
                $confFechasQuincena = new DatPeriodoquincena();
                $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

                if ($rangoFechas != null) {
                    $fechdesde = $rangoFechas[0]['fdesde'];
                    $fechhasta = $rangoFechas[0]['fhasta'];
                } elseif ($rangoFechasQuincena != null) {
                    if ($quincena == 1) {
                        $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                        $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                    } elseif ($quincena == 2) {
                        $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                        $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                    } elseif ($quincena == 3) {
                        $fechdesde = '01/' . $mes . '/' . $year;
                        $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
                    }
                } else {
                    $fechdesde = '01/' . $mes . '/' . $year;
                    $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
                }
            } else {
                $fechdesde = $fdesde;
                $fechhasta = $fhasta;
            }

            $asistencia = $datAsistencia->GetAllByRangoAndPersonas($fechdesde, $fechhasta, $idsPeople, $certificacion, 1);

            //filtrando las personas por certificacion
            if ($certificacion != null) {
                $tempids = array();
                $temprep = array();
                foreach ($asistencia as $keya => $as) {
                    $tempids[] = $keya;
                }
                $tempids = array_unique($tempids);
                foreach ($reporte as $re) {
                    if (in_array($re['idpersona'], $tempids)) {
                        $temprep[] = $re;
                    }
                }
                $reporte = $temprep;
            }
            //$canttotal = count($reporte);

//            if (count($reporte) > 0) {
////                $personasordenadas = $datAsistencia->OrderPersonasByCargo($reporte, $limit, $start);
////                $reporte = $personasordenadas;
//                $cargosPeople = array_unique($cargosPeople);
//                $reporte = $datAsistenciaModel->ordenarInfoByCargo($cargosPeople, $reporte);
//            }

            $fechainicio = explode('/', $fechdesde);
            $fechafin = explode('/', $fechhasta);
            $finicio = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
            $finicio1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
            $ffin = date_create($fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0]);
            $columnasGrid = array();
            $conregistro = array();
            while ($finicio1 <= $ffin) {
                $fi = explode('/', $finicio1->format('d/m/Y'));
                array_push($columnasGrid, $fi[0] . '/' . $fi[1]);
                date_add($finicio1, date_interval_create_from_date_string('1 day'));
                $fechtemp3 = explode('/', $finicio1->format('d/m/Y'));
                $finicio1 = date_create($fechtemp3[2] . '-' . $fechtemp3[1] . '-' . $fechtemp3[0]);
            }

//            $denEntAreas = $datAsistenciaModel->GetDenomEntAreas($reporte);
//            $denomarea = array();
//            foreach ($reporte as $p => $dat) {
//                if (!in_array($dat['idarea'], $denomarea)) {
//                    $denomarea[$dat['idarea']] = $dat['idarea'];
//                }
//            }
//            foreach ($denomarea as $i => $e) {
//                $denomestructura = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($e), false);
//                $partes = explode('/', $denomestructura[0]['rutaDenominacion']);
//                if ($partes[2] || $partes[3]) {
//                    if ($partes[3])
//                        $area = $partes[2] . '->' . $partes[3];
//                    else
//                        $area = $partes[2];
//                } else {
//                    $area = $partes[1];
//                }
//                $denomarea[$e] = $area;
//            }

            foreach ($reporte as $ind => $persona) {
//                $reporte[$ind]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
//                $reporte[$ind]['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin cargo';
                $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($persona['identidad']);
                $reporte[$ind]['denomentidad'] = $entidad[0]->denominacion;
                $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($persona['idarea']);
                if (!empty($persona['ueb'])) {
                    $ueb = ZendExt_IoC::getInstance()->metadatos->DameEstructura($persona['ueb']);
                    $reporte[$ind]['denomarea'] = $entidad[0]->denominacion . '->' . $ueb[0]->denominacion . '->' .
                        $area[0]->denominacion;
                } else {
                    $reporte[$ind]['denomarea'] = $entidad[0]->denominacion . '->' . $area[0]->denominacion;
                }
                $reporte[$ind]['certificado'] = '1';

                if (empty($persona['idgrupodescanso'])) {
                    $reporte[$ind]['ft'] = 0;
                    $reporte[$ind]['trt'] = 0;
                    $reporte[$ind]['hp'] = 0;
                    $reporte[$ind]['he'] = 0;
                    $reporte[$ind]['hf'] = 0;
                    $reporte[$ind]['hft'] = 0;
                } else {
                    /*************************FONDO DE TIEMPO*************************/
                    $regimen = NomRegimentrabajo::getDenomRegimenById($persona['idregimentrabajo']);
                    if ($regimen[0]['tipofondotiempo'] == 3) {
                        $reporte[$ind]['ft'] = $regimen[0]['fondotiempo'];
                        if ($rangoFechasQuincena != null) {
                            if ($quincena == 1 || $quincena == 2) {
                                $reporte[$ind]['ft'] = round($reporte[$ind]['ft'] / 2, 2);
                            }
                        }
                    } else if ($regimen[0]['tipofondotiempo'] == 1) {
                        $hrsTrabajoMes = $calendario->HrsByDateRange($finicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idgrupodescanso']);
                        $auxhrsTrabajoMes = explode(':', $hrsTrabajoMes[0]['sum']);
                        $reporte[$ind]['ft'] += ($hrsTrabajoMes[0]['sum'] > '00:00:00') ? $auxhrsTrabajoMes[0] : 0;
                    } elseif ($regimen[0]['tipofondotiempo'] == 2) {
                        $cont = 0;
                        $configuracion1 = $calendario->getCalendarioByGrupoandYear($persona['idgrupodescanso'], $year);
                        foreach ($configuracion1 AS $k => $v) {
                            $cont += $v['horas'];
                        }
                        $reporte[$ind]['ft'] = round($cont / 12, 2);
                        if ($rangoFechasQuincena != null) {
                            if ($quincena == 1 || $quincena == 2) {
                                $reporte[$ind]['ft'] = round($reporte[$ind]['ft'] / 2, 2);
                            }
                        }
                    }
                    /*************************HORAS FERIADAS*************************/
                    $fechdiaferiado = array();
                    $diasferiados = $calendario->getDiasFeriadosBygrupo(
                        $finicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idgrupodescanso']);
                    foreach ($diasferiados as $v) {
                        array_push($fechdiaferiado, $v['fecha']);
                    }
                    $fechdiasferiadoshab = array();
                    $fechdiasfer = array();
                    $diasferiadoshabilitados = $diaferiadohabilitado->GetDiasFeriadosHabByDateRange($persona['idpersona'],
                        $finicio->format('d/m/Y'), $ffin->format('d/m/Y'));

                    foreach ($diasferiadoshabilitados as $v) {
                        array_push($fechdiasferiadoshab, $v['fecha']);
                        array_push($fechdiasfer, "CAST('" . $v['fecha'] . "' as date)");
                    }
//                    if (count($fechdiasfer) > 0) {
//                        $sumhorasferiadas = $calendario->GetSumHorasDiasFeriadosHabByDateArrayAndGroup($persona['idgrupodescanso'], $fechdiasfer);
//                        $reporte[$ind]['ft'] += $sumhorasferiadas[0]['sum'];
//                    }
                    $diasferiadospuros = array();
                    $diasferiadospuros = array_diff($fechdiaferiado, $fechdiasferiadoshab);
                    $fechincidencia = array();
                    $encontrado = array();
                    $conasist = array();
                    $fechrango = array();
                    foreach ($asistencia[$persona['idpersona']] as $key => $valor) {
                        array_push($conasist, $valor['fecharegistro']);
                        $fech1 = explode('/', $valor['fecharegistro']);

                        $horas = $calendario->HrsByDateRange($valor['fecharegistro'], $valor['fecharegistro'], $persona['idgrupodescanso']);
                        $diaferiadohab = $datAsistenciaModel->GetDiaFeriadoHabilitado($persona['idpersona'], $valor['fecharegistro']);

                        $hrsDiariasFeriadas = $calendario->HrsFeriadasByDateRange($valor['fecharegistro'], $valor['fecharegistro'], $persona['idgrupodescanso']);

                        if ($valor['feriado'] == 1) {
                            $hrstrabajadasps = $datAsistenciaModel->RestOnlyTime($hrsDiariasFeriadas[0]['sum'], $valor['hrsdescontadasps']);
                            $hrstrabajadasss = $datAsistenciaModel->RestOnlyTime($hrsDiariasFeriadas[0]['sum'], $valor['hrsdescontadasss']);
                            $hrstrabajadas = $datAsistenciaModel->SumOnlyTime($hrstrabajadasps, $hrstrabajadasss);
                        } else {
                            $hrstrabajadasps = $datAsistenciaModel->RestOnlyTime($horas[0]['sum'], $valor['hrsdescontadasps']);
                            $hrstrabajadasss = $datAsistenciaModel->RestOnlyTime($horas[0]['sum'], $valor['hrsdescontadasss']);
                            $hrstrabajadas = $datAsistenciaModel->SumOnlyTime($hrstrabajadasps, $hrstrabajadasss);
                        }

                        $hrstrab = explode(':', $hrstrabajadas);

                        if (empty($valor['fdesde']) && empty($valor['fhasta'])) {
                            $hrsPerdidasBD = '';
                            $hrsPerdidasBDps = '';
                            $hrsPerdidasBDss = '';
                            $cantDatSesiones = 0;

                            $hrsPS = $datAsistenciaModel->RestTime($valor['horasalidaps'], $valor['horaentradaps'], $valor['fecharegistro']);
                            $horasPS = $datAsistenciaModel->FormatTime($hrsPS);

                            $hrsSS = $datAsistenciaModel->RestTime($valor['horasalidass'], $valor['horaentradass'], $valor['fecharegistro']);
                            $horasSS = $datAsistenciaModel->FormatTime($hrsSS);

                            if (!empty($valor['hrsdescontadasps'])) {
                                $hrsPerdidasBDps = $valor['hrsdescontadasps'];
                                $ttps = $datAsistenciaModel->RestTime($horasPS, $hrsPerdidasBDps, $valor['fecharegistro']);
                                $tiempops = $datAsistenciaModel->FormatTime($ttps);
                                $cantDatSesiones++;
                            }

                            if (!empty($valor['hrsdescontadasss'])) {
                                $hrsPerdidasBDss = $valor['hrsdescontadasss'];
                                $ttss = $datAsistenciaModel->RestTime($horasSS, $hrsPerdidasBDss, $valor['fecharegistro']);
                                $tiemposs = $datAsistenciaModel->FormatTime($ttss);
                                $cantDatSesiones++;
                            }

                            if (!empty($hrsPerdidasBDps) && !empty($hrsPerdidasBDss)) {
                                $hrsPerdidasBD = $datAsistenciaModel->SumTime($valor['hrsdescontadasps'], $valor['hrsdescontadasss'], $valor['fecharegistro']);
                                $trt = $datAsistenciaModel->SumTime($tiempops, $tiemposs, $valor['fecharegistro']);
                                $tiempoRT = $trt;
                            } else {
                                if (!empty($hrsPerdidasBDps)) {
                                    $hrsPerdidasBD = $hrsPerdidasBDps;
                                    $tiempoRT = $tiempops;
                                }
                                if (!empty($hrsPerdidasBDss)) {
                                    $hrsPerdidasBD = $hrsPerdidasBDss;
                                    $tiempoRT = $tiemposs;
                                }
                            }

                            if (!empty($reporte[$ind]['hp'])) {
                                if (!empty($hrsPerdidasBD))
                                    $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($hrsPerdidasBD, $reporte[$ind]['hp']);
                            } else {
                                if (!empty($hrsPerdidasBD))
                                    $reporte[$ind]['hp'] = $hrsPerdidasBD;
                            }

                            $reporte[$ind]['lineas'] = 4;

                            if ($tiporeporte == 1) {
                                if ($cantDatSesiones == 1) {
                                    if (!empty($hrsPerdidasBDps)) {
                                        if (!empty($valor['fechahoraentradass']) && !empty($valor['fechahorasalidass'])) {
                                            $SS = " - " . $horasSS;
                                        } else {
                                            $SS = "";
                                        }
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $tiempops . " (" . $valor['abreviaturaps'] . ")" . $SS;
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_color'] = $valor['colorps'];

                                    } else {
                                        if (!empty($hrsPerdidasBDss)) {
                                            if (!empty($valor['fechahoraentradaps']) && !empty($valor['fechahorasalidaps'])) {
                                                $PS = $horasPS . " - ";
                                            } else {
                                                $PS = "";
                                            }
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $PS . $tiemposs . " (" . $valor['abreviaturass'] . ")";
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_color'] = $valor['colorss'];
                                        }
                                    }
                                } else {
                                    if (!empty($hrsPerdidasBDps) && !empty($hrsPerdidasBDss)) {
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $tiempops . " (" . $valor['abreviaturaps'] . ")-" . $tiemposs . " (" . $valor['abreviaturass'] . ")";
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_color'] = $valor['colorps'] . '-' . $valor['colorss'];
                                    } else {
                                        if (!empty($valor['fechahoraentradaps']) && !empty($valor['fechahoraentradass']) &&
                                            !empty($valor['fechahorasalidaps']) && !empty($valor['fechahorasalidass'])
                                        ) {
                                            $reporte[$ind]['lineas'] = 2;
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $horasPS . " - " . $horasSS;
                                        }
                                    }
                                }
                            } else {
                                if ($cantDatSesiones == 1) {
                                    if (!empty($hrsPerdidasBDps)) {
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $hrsPerdidasBDps . " (" . $valor['abreviaturaps'] . ")";
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_color'] = $valor['colorps'];
                                    } else {
                                        if (!empty($hrsPerdidasBDss)) {
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $hrsPerdidasBDss . " (" . $valor['abreviaturass'] . ")";
                                            $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_color'] = $valor['colorss'];
                                        }
                                    }
                                } else {
                                    if (!empty($hrsPerdidasBDps) && !empty($hrsPerdidasBDss)) {
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = $hrsPerdidasBDps . " (" . $valor['abreviaturaps'] . ")-" . $hrsPerdidasBDss . " (" . $valor['abreviaturass'] . ")";
                                        $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_color'] = $valor['colorps'] . '-' . $valor['colorss'];
                                    }
                                }
                            }

                            $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_certificado'] = (empty($valor['certificado'])) ? 0 : $valor['certificado'];

                            if ($valor['feriado'] == 1 && $valor['fhabilitado'] == 1) {
                                if (empty($reporte[$ind]['hft'])) {
                                    if (!empty($tiempoRT))
                                        $reporte[$ind]['hft'] = $tiempoRT;
                                } else {
                                    if (!empty($tiempoRT)) {
                                        $horasft = $datAsistenciaModel->SumOnlyTime($tiempoRT, $reporte[$ind]['hft']);
                                        $reporte[$ind]['hft'] = $horasft;
                                    }
                                }
                            }

                            if (empty($reporte[$ind]['trt'])) {
                                if (!empty($tiempoRT))
                                    $reporte[$ind]['trt'] = $tiempoRT;
                            } else {
                                if (!empty($tiempoRT)) {
                                    $horasft = $datAsistenciaModel->SumOnlyTime($tiempoRT, $reporte[$ind]['trt'], $valor['fecharegistro']);
                                    $reporte[$ind]['trt'] = $horasft;
                                }
                            }

                            if (!empty($valor['fechahoraentradaps']) && empty($valor['fechahorasalidaps']) && !empty($valor['fechahoraentradass']) && empty($valor['fechahorasalidass'])
                                && empty($valor['fdesde']) && empty($valor['fhasta'])// && empty($valor['idcausaps']) && empty($valor['idcausass']) && ($valor['certificado'] == '0' || $valor['certificado'] == null)
                            ) {
                                $reporte[$ind][$fech1[0] . '/' . $fech1[1] . '_certificado'] = $valor['certificado'] == null ? '0' : $valor['certificado'];
                                $reporte[$ind][$fech1[0] . '/' . $fech1[1]] = 'Sin Salida';
                                //$reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($horas[0]['sum'],$reporte[$ind]['hp']);
                            }
                        } else {
                            $fdesde = explode('/', $valor['fdesde']);
                            $fhasta = explode('/', $valor['fhasta']);
                            $fd = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                            $fh = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);

                            $temphasta = $fh > $ffin ? $ffin : $fh;
                            $tempinicio = $fd < $finicio ? $finicio : $fd;

                            $horasperdidasbd = $calendario->HrsByDateRange($tempinicio->format('d/m/y'), $temphasta->format('d/m/y'), $persona['idgrupodescanso']);

                            if ($valor['afectasalario'] == 0) {
//                                $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'],$horasperdidasbd[0]['sum']);
//                            else
                                $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $horasperdidasbd[0]['sum']);
                            }
                            if (($fd >= $finicio && $fd <= $ffin) && ($fh >= $finicio && $fh <= $ffin)) {
                                $fecha1 = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                                $fecha2 = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);
                                while ($fecha1->format('d/m/Y') <= $fecha2->format('d/m/Y')) {
                                    $f1 = explode('/', $fecha1->format('d/m/Y'));
                                    $reporte[$ind][$f1[0] . '/' . $f1[1]] = $valor['abreviatura'];
                                    $reporte[$ind][$f1[0] . '/' . $f1[1] . '_color'] = $valor['color'];
                                    $reporte[$ind][$f1[0] . '/' . $f1[1] . '_certificado'] = $valor['certificado'];
                                    if (!array_key_exists($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]))
                                        array_push($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]);
                                    date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                    $fechtemp3 = explode('/', $fecha1->format('d/m/Y'));
                                    $fecha1 = date_create($fechtemp3[2] . '-' . $fechtemp3[1] . '-' . $fechtemp3[0]);
                                }
                            } else {
                                if (($fd < $finicio) && ($fh >= $finicio && $fh <= $ffin)) {
                                    $fecha1 = new DateTime($finicio->format("Y-m-d"));
                                    $fecha2 = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);
                                    while ($fecha1->format('d/m/Y') <= $fecha2->format('d/m/Y')) {
                                        $f1 = explode('/', $fecha1->format('d/m/Y'));
                                        $reporte[$ind][$f1[0] . '/' . $f1[1]] = $valor['abreviatura'];
                                        $reporte[$ind][$f1[0] . '/' . $f1[1] . '_color'] = $valor['abreviatura'];
                                        $reporte[$ind][$f1[0] . '/' . $f1[1] . '_certificado'] = $valor['certificado'];
                                        if (!array_key_exists($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]))
                                            array_push($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]);
                                        date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                        $fechtemp3 = explode('/', $fecha1->format('d/m/Y'));
                                        $fecha1 = date_create($fechtemp3[2] . '-' . $fechtemp3[1] . '-' . $fechtemp3[0]);
                                    }
                                } else {
                                    if (($fd >= $finicio && $fd <= $ffin) && ($fh > $ffin)) {
                                        $fecha1 = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                                        $fecha2 = $ffin;
                                        while ($fecha1->format('d/m/Y') <= $fecha2->format('d/m/Y')) {
                                            $f1 = explode('/', $fecha1->format('d/m/Y'));
                                            $reporte[$ind][$f1[0] . '/' . $f1[1]] = $valor['abreviatura'];
                                            $reporte[$ind][$f1[0] . '/' . $f1[1] . '_color'] = $valor['color'];
                                            $reporte[$ind][$f1[0] . '/' . $f1[1] . '_certificado'] = $valor['certificado'];
                                            if (!array_key_exists($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]))
                                                array_push($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]);
                                            date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                            $fechtemp3 = explode('/', $fecha1->format('d/m/Y'));
                                            $fecha1 = date_create($fechtemp3[2] . '-' . $fechtemp3[1] . '-' . $fechtemp3[0]);
                                        }
                                    } else {
                                        $fecha1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
                                        $fecha2 = $ffin;
                                        while ($fecha1->format('d/m/Y') <= $fecha2->format('d/m/Y')) {
                                            $f1 = explode('/', $fecha1->format('d/m/Y'));
                                            $reporte[$ind][$f1[0] . '/' . $f1[1]] = $valor['abreviatura'];
                                            $reporte[$ind][$f1[0] . '/' . $f1[1] . '_color'] = $valor['color'];
                                            $reporte[$ind][$f1[0] . '/' . $f1[1] . '_certificado'] = $valor['certificado'];
                                            if (!array_key_exists($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]))
                                                array_push($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]);
                                            date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                            $fechtemp3 = explode('/', $fecha1->format('d/m/Y'));
                                            $fecha1 = date_create($fechtemp3[2] . '-' . $fechtemp3[1] . '-' . $fechtemp3[0]);
                                        }
                                    }
                                }
                            }
                            if (count($fechdiaferiado) > 0) {
                                foreach ($fechdiaferiado as $v) {
                                    $f = explode('/', $v);
                                    $fech = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                                    if ($fech >= $fd && $fech <= $fh) {
                                        array_push($fechincidencia, $v);
                                    }
                                }
                            }
                        }

                        //Horas extras//
                        if (!empty($valor['horasextrasps']) && !empty($valor['horasextrasss'])) {
                            $horasextrasbd = $datAsistenciaModel->SumTime($valor['horasextrasps'], $valor['horasextrasss'], date('d/m/Y'));
                        } else {
                            if (!empty($valor['horasextrasps'])) {
                                $horasextrasbd = $valor['horasextrasps'];

                            }
                            if (!empty($valor['horasextrasss'])) {
                                $horasextrasbd = $valor['horasextrasss'];
                            }
                        }

                        if (!empty($horasextrasbd)) {
                            if (empty($reporte[$ind]['he'])) {
                                $reporte[$ind]['he'] = $horasextrasbd;
                            } else {
                                $reporte[$ind]['he'] = $datAsistenciaModel->SumTime($reporte[$ind]['he'], $horasextrasbd, $valor['fecharegistro']);
                            }
                        }
                        //Horas extras//

                        if (count($fechdiasferiadoshab) > 0) {
                            foreach ($fechdiasferiadoshab as $v) {
                                array_push($fechrango, $v);
                                $f = explode('/', $v);
                                $fech = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                                $fr = explode('/', $valor['fecharegistro']);
                                $fechr = date_create($fr[2] . '-' . $fr[1] . '-' . $fr[0]);
                                if (($fech == $fechr)) {
                                    array_push($encontrado, $v);
                                    $reporte[$ind]['hft'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $hrstrabajadas);
                                }
                                if ($fech >= $fd && $fech <= $fh) {
                                    $hrsDiariasFeriadas = $calendario->HrsFeriadasByDateRange($v, $v, $persona['idgrupodescanso']);
                                    if ($valor['afectasalario'] == 0) {
//                                        $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'],$hrsDiariasFeriadas[0]['sum']);
//                                    else
                                        $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $hrsDiariasFeriadas[0]['sum']);
                                    }
                                }
                            }
                        }
                    }
                    $feriadoslimpios = array();
                    $feriadoslimpios = array_diff($diasferiadospuros, $fechincidencia);
                    if (count($feriadoslimpios) > 0) {
                        foreach ($feriadoslimpios as $f) {
                            $val = explode('/', $f);
                            $reporte[$ind][$val[0] . '/' . $val[1]] = 'Feriado';
                            $hrsDiariasFeriadas = $calendario->HrsFeriadasByDateRange($f, $f, $persona['idgrupodescanso']);
                            $reporte[$ind]['hf'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hf'], $hrsDiariasFeriadas[0]['sum']);
                        }
                    }

                    $sinregistro = array();
                    $sinregistro1 = array();
                    $sinregistro = array_diff($fechdiasferiadoshab, $encontrado);
                    if (count($sinregistro1) > 0) {
                        foreach ($sinregistro as $f) {
                            $val = explode('/', $f);
                            array_push($sinregistro1, "CAST('" . $f . "' as date)");
                            $reporte[$ind][$val[0] . '/' . $val[1]] = '00:00';
                        }
//                        $sumhorasferiadas = $calendario->GetSumHorasDiasFeriadosHabByDateArrayAndGroup($persona['idgrupodescanso'], $sinregistro1);
//                        $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $sumhorasferiadas[0]['sum']);
                    }

                    $diasrango = array();
                    $sinasist = array();
                    $sinasist1 = array();
                    $diasrango = $calendario->CalendarioByDateRangeTrabajo($finicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idgrupodescanso']);
                    foreach ($diasrango as $dia) {
                        array_push($fechrango, $dia['fecha']);
                    }

                    $sinasist = array_diff($fechrango, $conasist);
                    if (count($sinasist) > 0) {
                        foreach ($sinasist as $f) {
                            $val = explode('/', $f);
                            array_push($sinasist1, "CAST('" . $f . "' as date)");
                            $reporte[$ind][$val[0] . '/' . $val[1]] = 'Sin registro';
                        }
//                        $sumhoras = $calendario->GetSumHorasDiasFeriadosHabByDateArrayAndGroup($persona['idgrupodescanso'], $sinasist1);
//                        $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $sumhoras[0]['sum']);
                    }

                    $reporte[$ind]['hp'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['trt']);

                    ////////////////////////////////HORAS EXTRAS//////////////////////////////////
                    //
                    $temphl = explode(':', $reporte[$ind]['he']);

                    if ($temphl[0] >= $hmensualesmax->limite)
                        $reporte[$ind]['he'] = $hmensualesmax->limite;
                    else
                        $reporte[$ind]['he'] = intval($temphl[0]);

                    ////////////////////////////////HORAS PERDIDAS////////////////////////////////////
                    $thp = explode(':', $reporte[$ind]['hp']);
                    if ($thp[1] > 30)
                        $a = $thp[0] + 1;
                    else
                        $a = $thp[0];
                    $reporte[$ind]['hp'] = intval($a);

                    ///////////////////////////////TIEMPO REAL TRABAJADO/////////////////////////
                    $tottrt = explode(':', $reporte[$ind]['trt']);
                    if ($tottrt[1] >= 30)
                        $atrt = $tottrt[0] + 1;
                    else
                        $atrt = $tottrt[0];
                    $reporte[$ind]['trt'] = intval($atrt);

                    ///////////////////////////////HORAS FERIADAS/////////////////////////
                    $hf = explode(':', $reporte[$ind]['hf']);
                    $reporte[$ind]['hf'] = intval($hf[0]);

                    ///////////////////////////////HORAS FERIADAS TRABAJADAS/////////////////////////
                    $hft = explode(':', $reporte[$ind]['hft']);
                    $reporte[$ind]['hft'] = intval($hft[0]);

                    if (empty($reporte[$ind]['ft']) || intval($reporte[$ind]['ft']) == 0 || intval($reporte[$ind]['ft']) == 00)
                        $reporte[$ind]['ft'] = "";
                    if (empty($reporte[$ind]['trt']) || intval($reporte[$ind]['trt']) == 0 || intval($reporte[$ind]['trt']) == 00)
                        $reporte[$ind]['trt'] = "";
                    if (empty($reporte[$ind]['hp']) || intval($reporte[$ind]['hp']) == 0 || intval($reporte[$ind]['hp']) == 00)
                        $reporte[$ind]['hp'] = "";
                    if (empty($reporte[$ind]['he']) || intval($reporte[$ind]['he']) == 0 || intval($reporte[$ind]['he']) == 00)
                        $reporte[$ind]['he'] = "";
                    if (empty($reporte[$ind]['hf']) || intval($reporte[$ind]['hf']) == 0 || intval($reporte[$ind]['hf']) == 00)
                        $reporte[$ind]['hf'] = "";
                    if (empty($reporte[$ind]['hft']) || intval($reporte[$ind]['hft']) == 0 || intval($reporte[$ind]['hft']) == 00)
                        $reporte[$ind]['hft'] = "";

                }
            }
        } else {
            $reporte = array();
            $PersonCargo = array();
        }

        if (count($reporte) > 0) {
            $result['columnas'] = $columnasGrid;
            $result['data'] = $reporte;
            $result['cant'] = $cantidad;
            return $result;
        } else {
            $result['columnas'] = $columnasGrid;
            $result['data'] = array();
            $result['cant'] = 0;
            $result['cod'] = 3;
            return $result;
        }
    }

    public
    function SumarHora($h1, $h2)
    {
        $horai = explode(':', $h1);
        $horaf = explode(':', $h2);
        $horaFinal = $horai[0] + $horaf[0];
        $Sminutos = $horai[1] + $horaf[1];
        $hrsSumar = $Sminutos / 60;
        $minutosFinal = $Sminutos % 60;

        $horaFinal = $horaFinal + intval($hrsSumar);

        $result = array();
        if ($horaFinal < 10) {
            $result[0] = '0' . $horaFinal;
        } else {
            $result[0] = $horaFinal;
        }

        if ($minutosFinal < 10) {
            $result[1] = '0' . $minutosFinal;
        } else {
            $result[1] = $minutosFinal;
        }
        return $result;
    }

    public
    function GetApa($idestructura, $fdesde, $fhasta, $limit, $start,
                    $filtro)
    {
        $datAsistenciaModel = new DatAsistenciaModel();
        $datAsistencia = new DatAsistencia();
        $data = array();
        $causasfinal = array();
        $arraycausas = array();
        $idspersona = array();
        $idspersonap = array();
        $grupos = array();
        $nocturnidad = array();
        $nocturnidadfer = array();

        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        if (!empty($cargosPeople)) {
            $objDatos = $datAsistencia->GetDatosPersonaReporteAsistMensual($cargosPeople, $filtro, $limit, $start, $fdesde, $fhasta);
            $allPeople = $datAsistencia->GetDatosPersonaReporteAsistMensual($cargosPeople, $filtro, null, 0, $fdesde, $fhasta);
            $cantidad = count($allPeople);
        }

//        if (count($objDatos) > 0) {
//            $cargosPeople = array_unique($cargosPeople);
//            $objDatos = $datAsistenciaModel->ordenarInfoByCargo($cargosPeople, $objDatos);
//        }
        $reporte = $objDatos;
        if (count($objDatos) > 0) {
            $denEntAreas = $datAsistenciaModel->GetDenomEntAreas($reporte);
            $denomarea = array();
            foreach ($reporte as $p => $dat) {
                $idspersonap[$p]['idpersona'] = $dat['idpersona'];
                $idspersonap[$p]['idcargo'] = $dat['idcargo'];
                if (!empty($dat['idgrupodescanso'])) {
                    array_push($idspersona, $dat['idpersona']);
                    array_push($grupos, $dat['idgrupodescanso']);
                }
            }

            $tipodia = new NomTipodia();
            $dialaborable = $tipodia->DiaLaborable();
            $diaferiado = $tipodia->DiaFeriado();

            $causa = new NomCausa();
            $causas = $causa->GetCausas();
            $idcausas = array();
            foreach ($causas as $causa) {
                array_push($idcausas, $causa['idcausa']);
            }

            $idsper = array();
            if(!empty($allPeople))
                foreach ($allPeople as $i => $per) {
                    array_push($idsper, $per['idpersona']);
                }
            if (!empty($idsper))
                $asist = $datAsistencia->GetAllByDates($fdesde, $fhasta, $idsper);

            $idsasistencia = array();
            foreach ($asist as $k => $asis) {
                array_push($idsasistencia, $asis['idasistencia']);
                if (!empty($asis['idcausa']))
                    array_push($arraycausas, $asis['idcausa']);
            }

            /*MULTIPLES CAUSAS*/
            $habmultiplescausas = (new ConfHabilitarmultiplescausas())->gethabilitarvariascausas();
            if(!empty($habmultiplescausas) && $habmultiplescausas[0]['habilitadomc'] == 1){
                if(!empty($idsasistencia)){
                    $multiplescausas = (new DatAsistenciamultiplescausas())->getAsistenciasMultiplesCausasByIdsAsist($idsasistencia);
                    $idscausasm = array_column($multiplescausas,'idcausa');
                    $arraycausas = array_merge($arraycausas,$idscausasm);
                }                
            }
            /*MULTIPLES CAUSAS*/

            $headerlimpios = array_unique($arraycausas);
            $j = 0;
            foreach ($headerlimpios as $valor) {
                $nomcausa = new NomCausa();
                $abreviaturacausa = $nomcausa->GetCausasById($valor);
                $data['causas'][$j]['dataindex'] = $valor;
                $data['causas'][$j]['denom'] = $abreviaturacausa[0]['abreviatura'];
                $data['causas'][$j]['afectasalario'] = $abreviaturacausa[0]['afectasalario'];
                $data['causas'][$j]['denominacion'] = $abreviaturacausa[0]['denominacion'];
                $data['tienecategoria'] = 0;
                $j++;
            }
            $objnoct = new ConfHabhorarionocturnidad();
            $nocturnidad = $objnoct->getHabilitarhorarionocturnidad();
            $nocturnidadfer = $nocturnidad;
            foreach ($nocturnidad as $k => $noct) {
                $nocturnidad[$k]['idnocturnidad'] = 'noct_' . $noct['horainicio'] . '_' . $noct['horafin'];
                $nocturnidadfer[$k]['idnocturnidad'] = 'noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'];
            }
            if (count($idcausas) > 0 && count($idspersona) > 0 && count($grupos) > 0 && $fdesde && $fhasta && $dialaborable[0]['idtipodedia'])
                $asistenciaAPA = $datAsistencia->getAsistenciabyCausa($idcausas, $idspersona, $grupos, $fdesde, $fhasta, array(3, 1, 13, 8));

            $asistencia = $datAsistencia->GetAllByRangoAndPersonas($fdesde, $fhasta, $idspersonap, 0);
            
            $reporte = $this->getDataAPA($reporte, 'apa', $denEntAreas, $fdesde, $fhasta, $asistenciaAPA, $asistencia);

        } else {
            $objDatos = array();
            $reporte = array();
            $cod = 3;
        }
        $result['apa'] = $reporte;
        $result['cant'] = $cantidad;
        $result['nocturnidad'] = $nocturnidad;
        $result['nocturnidadfer'] = $nocturnidadfer;
        $result['cod'] = $cod;
        $result['headerlimpios'] = $data;
        return $result;
    }

    public function obtenerDiasSinAsistenciaFiltrados($diasrango, $conasist, $diasferiados, $diasreceso) {
        // Helper para convertir cualquier formato a d/m/Y
        $formatearFecha = function($fecha) {
            $date = DateTime::createFromFormat('Y-m-d', str_replace('/', '-', $fecha));
            if (!$date) {
                $date = DateTime::createFromFormat('d/m/Y', $fecha);
            }
            return $date ? $date->format('d/m/Y') : $fecha;
        };
    
        // Convertir todas las fechas al mismo formato
        $fechasFeriado = array_map(function($f) use ($formatearFecha) {
            return $formatearFecha($f['fecha']);
        }, $diasferiados);
        
        $fechasReceso = array_map(function($r) use ($formatearFecha) {
            return $formatearFecha($r['fecha']);
        }, $diasreceso);
        
        $fechrango = array_map(function($d) use ($formatearFecha) {
            return $formatearFecha($d['fecha']);
        }, $diasrango);
        
        $conasistFormateado = array_map($formatearFecha, $conasist);
    
        // Filtrar solo los días laborables (no feriados ni recesos)
        $diasLaborables = array_filter($fechrango, function($fecha) use ($fechasFeriado, $fechasReceso) {
            return !in_array($fecha, $fechasFeriado) && !in_array($fecha, $fechasReceso);
        });
    
        // Obtener los días laborables en los que NO hubo asistencia
        $sinasist = array_filter($diasLaborables, function($fecha) use ($conasistFormateado) {
            return !in_array($fecha, $conasistFormateado);
        });
    
        return array_values($sinasist);
    }
    

    public function getDataAPA($reporte, $tipo, $denEntAreas = array(), $fdesde, $fhasta, $asistenciaAPA, $asistencia)
    {
        $calendariopersona = new ConfCalendariopersona();
        $diaferiadohabilitado = new DatDiaferiadohabilitado();
        $datAsistenciaModel = new DatAsistenciaModel();
        $datAsistencia = new DatAsistencia();

        $fechainicio = explode('/', $fdesde);
        $fechafin = explode('/', $fhasta);
        $finicio = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
        $ffin = date_create($fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0]);
        $diferencia = $finicio->diff($ffin);
        $cantidadmeses = ($diferencia->y * 12) + $diferencia->m + 1;
        $cantDiasMes = date('t', mktime(0, 0, 0, $fechainicio[1], 1, $fechainicio[2]));

        $fechai = explode('/', $fdesde);
        $fechaf = explode('/', $fhasta);
        $fechai[0] = 1;
        $fi = new DateTime($fechai[2] . '-' . $fechai[1] . '-' . $fechai[0]);
        $mesnext = date_add($fi, date_interval_create_from_date_string('1 month'));
        $mes = $mesnext->format('m');
        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $fechai[2]));
        /*$fechinimesnext = $fechai[0] . '/' . $mes . '/' . $fechai[2];
        $fechfinmesnext = $cantDiasMes . '/' . $mes . '/' . $fechaf[2];
        //$vacAdel = $datAsistencia->getVacacionesadelantadas($fechinimesnext, $fechfinmesnext);*/

        $confHorarioNoct = new ConfHabhorarionocturnidad();
        $confNocturnidad = $confHorarioNoct->getHabilitarhorarionocturnidad();

        $idscert = array();
        $domaincert = new ConfHabcertificados();
        $certificados = $domaincert->getHabilitarcausacertificados();
        foreach ($certificados as $c) {
            array_push($idscert, $c['idcausa']);
        }
        $cacheData = array(
            'regimen' => array(),
            'existeGrupo' => array(),
            'horasPerdidas' => array(),
        );
        $hmensualesmax = (new ConfHorasextras)->getById(2);
        $grupopredeterminado = (new NomGrupodescanso())->getGrupoPredeterminado();

        $habfinmes = array();
        try {
            $Confhabfinmes = new ConfHabilitarfinmesModel();
            $habfinmes = $Confhabfinmes->getHabilitarfinmes();
        } catch (Exception $e) {
            $habfinmes[0]['habilitado'] = 0;
        }

        $confCalendario = new ConfCalendario();
        $nGrupoPredet = new ConfHabgrupospredeterminados();
        $nRegimenT = new NomRegimentrabajo();

        foreach ($reporte as $ind => $persona) {
            $diasfer = array();
            if ($tipo != 'nomina'){
                $reporte[$ind]['denomarea'] = (is_numeric($persona['idarea'])) ? $denEntAreas[$persona['idarea']]['denominacion'] : 'Sin Cargo';
            }
            if (!empty($persona['idgrupodescanso'])) {
                //*************************FONDO DE TIEMPO*************************
                
                if(!array_key_exists($persona['idregimentrabajo'],$cacheData['regimen'])){
                    $cacheData['regimen'][$persona['idregimentrabajo']] = $nRegimenT->getDenomRegimenById($persona['idregimentrabajo']);
                }
                $regimen =  $cacheData['regimen'][$persona['idregimentrabajo']];
                
                if ($regimen[0]['tipofondotiempo'] == 3) {
                    $reporte[$ind]['ft'] = $regimen[0]['fondotiempo'];
                } elseif ($regimen[0]['tipofondotiempo'] == 1) {
                    $reporte[$ind]['ft'] = $persona['ft'];
                } elseif ($regimen[0]['tipofondotiempo'] == 2) {
                    //$cont = 0;
                    $configuracion1 = $calendariopersona->getCalendarioByPersonaandYear($persona['idpersona'], $fechainicio[2]);
                    $reporte[$ind]['ft'] = round($configuracion1[0]['thoras'] / 12, 2);
                }
                //*************************HORAS FERIADAS*************************
                $fechdiaferiado = array();
                $fechdiasferiadoshab = array();
                $diasferiadospuros = array();

                
                if ($regimen[0]['tipofondotiempo'] == 3 && !empty($regimen[0]['diaslaborables'])) {
                    $reporte[$ind]['diaslab'] = $regimen[0]['diaslaborables'];
                }else{
                    $calendario = $calendariopersona->getCalendarioPersonaTrabajo($finicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idpersona']);
                    $reporte[$ind]['diaslab'] = count($calendario);
                }

                $diasreceso = $calendariopersona->getRecesoLab($finicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idpersona']);

                $fechincidenciaRecLab = array();
                //$diasferiadospuros = array_diff($fechdiaferiado, $fechdiasferiadoshab);
                $fechincidencia = array();
                $encontrado = array();
                $conasist = array();
                $totalcausa = 0;
                $horas1 = 0;
                $cantcausas = 0;
                if (!array_key_exists($persona['idgrupodescanso'], $cacheData['existeGrupo'])) {
                    $cacheData['existeGrupo'][$persona['idgrupodescanso']] = (new ConfHabgrupospredeterminados())->existe($persona['idgrupodescanso']);
                }
                $existegrupo = $cacheData['existeGrupo'][$persona['idgrupodescanso']];

                
                if (count($asistenciaAPA) > 0) {
                    $cant = array();
                    $cant = array_column($asistenciaAPA[$persona['idpersona']], 'idcausa');
                    foreach ($asistenciaAPA[$persona['idpersona']] as  $valor) {//asmarca
                        if ($valor['tiempo'] != '00:00:00') {
                            if($regimen[0]['tipofondotiempo'] == 3){
                                $cantcausas++;
                                if(!empty($grupopredeterminado) && count($existegrupo) != 0 && !empty($valor['fdesde']) && !empty($valor['fhasta'])){
                                    $fdesdep = explode('/', $valor['fdesde']);
                                    $fhastap = explode('/', $valor['fhasta']);
                                    $fd = date_create($fdesdep[2] . '-' . $fdesdep[1] . '-' . $fdesdep[0]);
                                    $fh = date_create($fhastap[2] . '-' . $fhastap[1] . '-' . $fhastap[0]);
                                    $temphasta = $fh > $ffin ? $ffin : $fh;
                                    $tempinicio = $fd < $finicio ? $finicio : $fd;
                                    $semilla = $tempinicio->format('dmY')."".$temphasta->format('dmY')."".$grupopredeterminado[0]['idgrupodescanso'];
                                    if(!array_key_exists($semilla, $cacheData['horasPerdidas'])){
                                        $cacheData['horasPerdidas'][$semilla] = $confCalendario->getHrsCalendario($tempinicio->format('d/m/Y'), $temphasta->format('d/m/Y'), $grupopredeterminado[0]['idgrupodescanso']);
                                    }
                                    $horasperdidasbd = $cacheData['horasPerdidas'][$semilla];
                                    $valor['tiempo'] = $horasperdidasbd[0]['sum'];
                                    $valor['contdias'] = $horasperdidasbd[0]['count'];
                                }
                            }
                            $horasdesc = explode(':', $valor['tiempo']);
                            if ($valor['tiempo'] == '00:00:00')
                                $horas1 = '';
                            else {
                                $horas1 = Self::horaADecimal($valor['tiempo']);
                            }
                            //$reporte[$ind][$valor['idcausa']] = $horas1;
                            $reporte[$ind][$valor['idcausa'] . '_horas'] += $horas1;
                            $reporte[$ind][$valor['idcausa'] . '_dias'] += $valor['contdias'];

                            if (!is_array($reporte[$ind][$valor['idcausa']]))
                                $reporte[$ind][$valor['idcausa']] = array();
                            $reporte[$ind][$valor['idcausa']]['horas'] += (!empty($horas1)) ? $horas1 : 0;
                            $reporte[$ind][$valor['idcausa']]['dias'] += (!empty($valor['contdias'])) ? $valor['contdias'] : 0;
                            if(!empty($valor['mesanteriorcertificado']))
                                $reporte[$ind][$valor['idcausa']]['mesanteriorcertificado'] = $valor['mesanteriorcertificado'];
                            $totalcausa = $datAsistenciaModel->SumOnlyTime($totalcausa, $valor['tiempo']);
                            $sumtotal = explode(':', $totalcausa);
                            if ($sumtotal == '00:00:00')
                                $hrstotal = '';
                            else {
                                if ($sumtotal[1] >= 30)
                                    $timecausaT = $sumtotal[0] + 1;
                                else
                                    $timecausaT = $sumtotal[0];
                                $hrstotal = intval($timecausaT);
                            }
                            $reporte[$ind]['total'] = $hrstotal;
                        }
                    }
                }//asmarca

                if ($habfinmes[0]['habilitado'] == 1) {
                    if ($fechainicio[1] == 1) {
                        $mesant = 12;
                        $annoant = $fechainicio[2] - 1;
                    } else {
                        $mesant = $fechainicio[1] - 1;
                        $annoant = $fechainicio[2];
                    }

                    list($dd, $mm, $yy) = explode("/", $fdesde);
                    if ($dd == 1) {
                        $cantDiasMesanterior = date(' t', mktime(0, 0, 0, $mesant, 1, $annoant));
                        $ultDiaMes = $cantDiasMesanterior . '/' . ($mesant) . '/' . $annoant;
                    } else {
                        //Ver si el dia anterior del rango es trabajo de 24 horas
                        $ultDiaMes = (intval($dd) - 1) . "/" . $mm . "/" . $yy;
                    }
                    $personacargo = array(0 => array('idpersona' => $persona['idpersona'], 'idcargo' => $persona['idcargo']));
                    $asistenciapersona = $datAsistencia->GetAllByRangoAndPersonas($ultDiaMes, $ultDiaMes, $personacargo, 0, null);
                    if (count($asistenciapersona) > 0 && $asistenciapersona[$persona['idpersona']][0]['otrodia'] == 1) {
                        if (!isset($asistencia[$persona['idpersona']]))
                            $asistencia[$persona['idpersona']] = array();
                        array_push($asistencia[$persona['idpersona']], $asistenciapersona[$persona['idpersona']][0]);
                    }
                }

                $tempfinicio = new DateTime($finicio->format("Y-m-d"));
                //Si la asistencia del dia anterior es de 24 horas
                if (count($asistenciapersona) > 0 && $asistenciapersona[$persona['idpersona']][0]['otrodia'] == 1) {
                    $finiciomesant = date_add($tempfinicio, date_interval_create_from_date_string('-1 day'));
                    $fechtemp4 = explode('/', $tempfinicio->format('d/m/Y'));
                    $tempfinicio = date_create($fechtemp4[2] . '-' . $fechtemp4[1] . '-' . $fechtemp4[0]);
                }
                $diasferiados = $calendariopersona->getDiasFeriadosBypersona(
                    $tempfinicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idpersona']);

                foreach ($diasferiados as $v) {
                    array_push($fechdiaferiado, $v['fecha']);
                }

                $diasferiadoshabilitados = $diaferiadohabilitado->GetDiasFeriadosHabByDateRange($persona['idpersona'],
                    $tempfinicio->format('d/m/Y'), $ffin->format('d/m/Y'));

                foreach ($diasferiadoshabilitados as $v) {
                    if (!in_array($v['fecha'], $fechdiasferiadoshab))
                        array_push($fechdiasferiadoshab, $v['fecha']);
                }
                $diasferiadospuros = array_diff($fechdiaferiado, $fechdiasferiadoshab);

                $idsasistencia = array();
                foreach ($asistencia[$persona['idpersona']] as $valor) {//edmarca                    
                    $fech1 = explode('/', $valor['fecharegistro']);
                    if ($fechainicio[1] == $fechafin[1])
                        $mes3 = $fechainicio[1];
                    else
                        $mes3 = $fech1[1];
                    $ferper = null;

                    array_push($conasist, $valor['fecharegistro']);
                    array_push($idsasistencia, $valor['idasistencia']);

                    $horas = $calendariopersona->getHrsCalendarioPersona($valor['fecharegistro'], $valor['fecharegistro'], $valor['idpersona'], $valor['idcargo']);
                    $diaferiadohab = array();
                    $isFeriadoHabilitado = in_array($valor['fecharegistro'],$fechdiasferiadoshab);

                    if ($valor['fechahoraentrada'] != null && $valor['fechahorasalida'] != null) {
                        $diaferhab = $datAsistenciaModel->GetDiaFeriadoHabilitado($persona['idpersona'], $valor['fecharegistro']);
                        if(count($diaferhab)>0){
                            $reporte[$ind] = $this->NocturnidadconCausaFeriado($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                        }else{
                            if($valor['trabajo'] == 1 && $valor['feriado'] == 0){
                                $reporte[$ind] = $this->NocturnidadconCausa($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                            }
                        }
                    }
                    $hrstrabajadas = '00:00:00';
                    $hrsferiadastrabajadas = '00:00:00';                    
                    //Cuando el dia es feriado
                    if ($valor['feriado'] == 1) {
                        $hrsDiariasFeriadas = $calendariopersona->getHrsFeriadasPersona($valor['fecharegistro'], $valor['fecharegistro'], $valor['idpersona']);
                        if ($fech1[1] == $mes3) {
                            if (!empty($valor['fechahoraentrada'])) {
                                if (!empty($valor['fechahorasalida'])) {
                                    $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($hrsDiariasFeriadas[0]['sum'], $valor['hrsdescontadas']);
                                    $hrsferiadastrabajadas = $hrstrabajadas;
                                }
                            }
                        } else {
                            if (!empty($valor['fechahoraentrada'])) {
                                if (!empty($valor['fechahorasalida'])) {
                                    $hrsttmp = $datAsistenciaModel->RestOnlyTime($hrsDiariasFeriadas[0]['sum'], $valor['hrsdescontadas']);
                                    $hrsferiadastrabajadas = $hrsttmp;
                                }
                            }
                        }
                        //Cuando el dia es feriado y es de 24 horas
                        if ($valor['otrodia'] == 1 && count($fechdiasferiadoshab) > 0) {
                            array_push($diasfer, $valor['fecharegistro']);
                            $HSal = explode(' ', $valor['fechahorasalida']);
                            $fech1 = explode('/', $valor['fecharegistro']);
                            $f2 = date_create($fech1[2] . '-' . $fech1[1] . '-' . $fech1[0]);
                            $fech2 = date_add($f2, date_interval_create_from_date_string('1 day'));
                            $fech22 = explode('/', $f2->format('d/m/Y'));
                            $f2 = date_create($fech22[2] . '-' . $fech22[1] . '-' . $fech22[0]);

                            $otrodiafer = $calendariopersona->getFeriadoPersonaByFecha($valor['idpersona'], $fech2->format('d/m/Y'));

                            $hfttemp = $datAsistenciaModel->RestOnlyTime($hrsferiadastrabajadas, $HSal[1]);
                            $ht = $datAsistenciaModel->RestOnlyTime($hrsferiadastrabajadas, $hfttemp);
                            $hfttemp1 = explode(':', $hfttemp);

                            $hiarray = explode(':', $valor['horainicio']);
                            $hfarray = explode(':', $valor['horafin']);

                            //Si el otro dia es feriado tambien.
                            if (!empty($otrodiafer)) {
                                if ($fech22[1] > $mes3 || ($fech22[1] == 1 && $mes3 == 12)) {
                                    if ($habfinmes[0]['habilitado'] == 1) {
                                        $hrsferiadastrabajadas = $hfttemp;
                                        $ft1 = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $ht);
                                        $hft1 = explode(':', $ft1);
                                        $reporte[$ind]['ft'] = intval($hft1[0]);
                                    } else {
                                        $hrsferiadastrabajadas = $hrstrabajadas;
                                    }
                                } else {
                                    //Analizando el dia antes del rango, el ultimo dia del mes anterior
                                    if ($fech1[1] < $mes3 || ($fech1[1] == 12 && $mes3 == 1)) {
                                        if ($habfinmes[0]['habilitado'] == 1) {
                                            $hrsferiadastrabajadas = $ht;
                                            if (empty($reporte[$ind]['ft'])) {
                                                $hft1 = explode(':', $ht);
                                                $reporte[$ind]['ft'] = intval($hft1[0]);
                                            } else {
                                                $ft1 = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $ht);
                                                $hft1 = explode(':', $ft1);
                                                $reporte[$ind]['ft'] = intval($hft1[0]);
                                            }
                                        }
                                    } else
                                        $hrsferiadastrabajadas = $hrstrabajadas;
                                }
                                array_push($diasfer, $fech2->format('d/m/Y'));
                            } else {
                                if ($fech22[1] > $mes3 || ($fech22[1] == 1 && $mes3 == 12)) {
                                    if ($habfinmes[0]['habilitado'] == 1) {
                                        $hrsferiadastrabajadas = $hfttemp;
                                        $hrstrabajadas = null;
                                        $ft1 = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $ht);
                                        $hft1 = explode(':', $ft1);
                                        $reporte[$ind]['ft'] = intval($hft1[0]);
                                    } else {
                                        $hrsferiadastrabajadas = $hfttemp;
                                        $hrstrabajadas = $ht;
                                        $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $ht);
                                    }
                                } else {
                                    if ($fech1[1] < $mes3 || ($fech1[1] == 12 && $mes3 == 1)) {
                                        if ($habfinmes[0]['habilitado'] == 1) {
                                            $hrstrabajadas = $ht;
                                            if (!empty($reporte[$ind]['ft']))
                                                $ft1 = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $ht);
                                            else
                                                $ft1 = $ht;
                                            $hft1 = explode(':', $ft1);
                                            $reporte[$ind]['ft'] = intval($hft1[0]);
                                            $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $ht);
                                            $hrsferiadastrabajadas = null;
                                        } else {
                                            $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $ht);
                                            $hrsferiadastrabajadas = $hfttemp;
                                            $hrstrabajadas = $ht;
                                        }
                                    } else {
                                        $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $ht);
                                        $hrsferiadastrabajadas = $hfttemp;
                                        $hrstrabajadas = $ht;
                                    }
                                }
                            }
                        }
                    } else if ($valor['idtipodedia'] == 12) {//Trabajo extraordinario
                        if (!empty($valor['fechahoraentrada'])) {
                            if (!empty($valor['fechahorasalida'])) {
                                $HS = explode(' ', $valor['fechahorasalida']);
                                $HE = explode(' ', $valor['fechahoraentrada']);
                                $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($HS[1], $HE[1]);
                            }
                        }
                    } else if ($valor['idtipodedia'] == 8) {//Dia irregular
                        if (!empty($valor['fechahoraentrada'])) {
                            if (!empty($valor['fechahorasalida'])) {
                                $HS = explode(' ', $valor['fechahorasalida']);
                                $HE = explode(' ', $valor['fechahoraentrada']);
                                $HA = $datAsistencia->getHorarioByPersona($valor['idpersona'], $valor['fecharegistro']);
                                $hrstrab = $datAsistenciaModel->RestOnlyTime($HS[1], $HE[1]);
                                $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($hrstrab, $HA['tdescanso']);
                            }
                        }
                    } else {
                        //Un dia que no es feriado
                        $fech1 = explode('/', $valor['fecharegistro']);
                        //Cuando la fecha de registro de la asistencia actual esta dentro del mes analizado
                        if ($fech1[1] == $mes3) {
                            if (!empty($valor['fechahoraentrada'])) {
                                if (!empty($valor['fechahorasalida'])) {
                                    $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($horas[0]['sum'], $valor['hrsdescontadas']);
                                }
                            }
                        }

                        //Cuando el dia no es feriado pero es de 24 horas
                        if ($valor['otrodia'] == 1) {
                            $fech1 = explode('/', $valor['fecharegistro']);
                            $f2 = date_create($fech1[2] . '-' . $fech1[1] . '-' . $fech1[0]);
                            $fech2 = date_add($f2, date_interval_create_from_date_string('1 day'));
                            $fech222 = explode('/', $f2->format('d/m/Y'));
                            $f2 = date_create($fech222[2] . '-' . $fech222[1] . '-' . $fech222[0]);
                            $ferper = $calendariopersona->getFeriadoPersonaByFecha($valor['idpersona'], $fech2->format('d/m/Y'));
                            //Cuando el dia no es feriado, es de 24 horas, pero el proximo dia es feriado
                            if (!empty($ferper)) {
                                array_push($diasfer, $fech2->format('d/m/Y'));
                                $HSal = explode(' ', $valor['fechahorasalida']);
                                if ($hrstrabajadas == "00:00:00") {
                                    $hfttemp = $HSal[1];
                                    $hfttemp1 = explode(':', $hfttemp);
                                } else {
                                    $ht = $datAsistenciaModel->RestOnlyTime($hrstrabajadas, $HSal[1]);
                                    $hfttemp = $datAsistenciaModel->RestOnlyTime($hrstrabajadas, $ht);
                                    $hfttemp1 = explode(':', $hfttemp);
                                    $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($hrstrabajadas, $hfttemp);
                                }

                                $fech22 = explode('/', $fech2->format('d/m/Y'));

                                if (($habfinmes[0]['habilitado'] == 1 && $fech22[1] == $mes3) || ($habfinmes[0]['habilitado'] == 0 && ($fech22[1] > $mes3) || ($mes3 == 12 && $fech22[1] == 1)))
                                    $reporte[$ind]['hft'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $hfttemp);
                                else
                                    if (($habfinmes[0]['habilitado'] == 1 && ($fech22[1] < $mes3) || ($mes3 == 1 && $fech22[1] == 12)))
                                        $reporte[$ind]['hft'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $hfttemp);
                                    else if ($habfinmes[0]['habilitado'] == 0 && $fech1[1] == $mes3)
                                        $reporte[$ind]['hft'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $hfttemp);
                                    else if (($habfinmes[0]['habilitado'] == 1 && ($fech1[1] < $mes3) || ($mes3 == 1 && $fech1[1] == 12)))
                                        $reporte[$ind]['hft'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $ht);

                                if ($habfinmes[0]['habilitado'] == 1) {
                                    if (($fech1[1] < $mes3 || ($mes3 == 1 && $fech1[1] == 12))) {
                                        $ft1a = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $valor['horafin']);
                                        $hft1a = explode(':', $ft1a);
                                        $reporte[$ind]['ft'] = intval($hft1a[0]);
                                    } else if ($fech1[1] == $mes3) {
                                        if (isset($reporte[$ind]['trt'])) {
                                            if ($fech22[1] < $mes3 || ($fech22[1] == 12 && $mes3 == 1))
                                                $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['trt'], $hfttemp);
                                        }

                                        if ($fech22[1] > $mes3 || ($fech22[1] == 12 && $mes3 == 1)) {
                                            $ft1 = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $hfttemp);
                                            $hft1 = explode(':', $ft1);
                                            $reporte[$ind]['ft'] = intval($hft1[0]);
                                        }
                                    }
                                }
                            } else { //Cuando el dia no es feriado, es de 24 horas, y el proximo dia no es feriado
                                if (intval($fech2->format('d')) == 1) {//Si es fin de mes
                                    if ($habfinmes[0]['habilitado'] == 1) {
                                        $HSal = explode(' ', $valor['fechahorasalida']);
                                        $temptotalhorastrab = $datAsistenciaModel->RestOnlyTime($horas[0]['sum'], $valor['hrsdescontadas']);
                                        if ($hrstrabajadas == "00:00:00") {
                                            $ht = $datAsistenciaModel->RestOnlyTime($temptotalhorastrab, $HSal[1]);
                                            $hfttemp = $datAsistenciaModel->RestOnlyTime($temptotalhorastrab, $ht);
                                            $hrstrabajadas = $hfttemp;
                                        } else {
                                            $ht = $datAsistenciaModel->RestOnlyTime($hrstrabajadas, $HSal[1]);
                                            $hfttemp = $datAsistenciaModel->RestOnlyTime($hrstrabajadas, $ht);
                                            $hrstrabajadas = $hfttemp;
                                        }
                                        if ($fech1[1] == $mes3) {
                                            $ft1 = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $hfttemp);
                                            $hft1 = explode(':', $ft1);
                                            $reporte[$ind]['ft'] = intval($hft1[0]);
                                            $hrstrabajadas = $ht;
                                        } else {
                                            $ft1 = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $hfttemp);
                                            $hft1 = explode(':', $ft1);
                                            $reporte[$ind]['ft'] = intval($hft1[0]);
                                            $hrstrabajadas = $hfttemp;
                                        }
                                    }
                                }
                            }
                        }
                    }


                    //*************************TIEMPO DE TRABAJO EXTRAORDINARIO*************************
                    if ($valor['idtipodedia'] == 12
                    ) {
                        if (!empty($hrstrabajadas))
                            $reporte[$ind]['hte'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hte'], $hrstrabajadas);
                    }

                    if (empty($valor['fdesde']) && empty($valor['fhasta'])) {
                        if($valor['idcausa'] == -1){
                            $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $valor['hrsdescontadas']);
                            $hrstrabajadas = $datAsistenciaModel->RestOnlyTime($horas[0]['sum'], $valor['hrsdescontadas']);
                        }
                        //*************************HORAS PERDIDAS*************************
                        if (($valor['trabajo'] == 1 || /*count($diaferiadohab) > 0*/ $isFeriadoHabilitado) && ($valor['afectasalario'] == 1 || empty($valor['idcausa']))) {
                            if (!empty($valor['hrsdescontadas']))
                                $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $valor['hrsdescontadas']);
                            else {
                                if (empty($valor['hrsdescontadas']) && ((empty($valor['fdesde']) && empty($valor['fhasta'])) && (empty($valor['fechahoraentrada']) && empty($valor['fechahorasalida'])))) {
                                    $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $horas[0]['sum']);
                                }
                            }
                        }
                        if (!empty($valor['fechahoraentrada']) && empty($valor['fechahorasalida']) && empty($valor['fdesde']) &&
                            empty($valor['fhasta'])
                        ) {
                            $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $horas[0]['sum']);
                        }
                        //*************************TIEMPO REAL TRABAJADO*************************
                        if (($valor['trabajo'] == 1 || /*count($diaferiadohab) > 0*/$isFeriadoHabilitado) && ($valor['idtipodedia'] != 12) && ((!empty($valor['fechahoraentrada']) && !empty($valor['fechahorasalida']))
                                || (!empty($valor['fechahoraentrada']) && !empty($valor['fechahorasalida']) && !empty($valor['idcausa']))
                                || (empty($valor['fechahoraentrada']) && empty($valor['fechahorasalida']) && !empty($valor['idcausa'])))
                        ) {
                            if (!empty($hrstrabajadas) && $valor['feriado'] == 0) {
                                $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $hrstrabajadas);
                            }
                        }
                        if (
                            !empty($hrstrabajadas) && $hrstrabajadas > '00:00:00'
                        ) {
                            $reporte[$ind]['diastrab'] = $reporte[$ind]['diastrab'] + 1;
                        }
                        if ($valor['otrodia'] == 1) {
                            $f2 = date_create($fech1[2] . '-' . $fech1[1] . '-' . $fech1[0]);
                            $fech2 = date_add($f2, date_interval_create_from_date_string('1 day'));
                            $fech5 = explode('/', $f2->format('d/m/Y'));
                            $f2 = date_create($fech5[2] . '-' . $fech5[1] . '-' . $fech5[0]);
                        }
                    } else {
                        $fdesdep = explode('/', $valor['fdesde']);
                        $fhastap = explode('/', $valor['fhasta']);
                        $fd = date_create($fdesdep[2] . '-' . $fdesdep[1] . '-' . $fdesdep[0]);
                        $fh = date_create($fhastap[2] . '-' . $fhastap[1] . '-' . $fhastap[0]);

                        $temphasta = $fh > $ffin ? $ffin : $fh;
                        $tempinicio = $fd < $finicio ? $finicio : $fd;

                        if(!empty($grupopredeterminado) && count($existegrupo) != 0){
                            $horasperdidasbd = $confCalendario->getHrsCalendario($tempinicio->format('d/m/y'), $temphasta->format('d/m/y'), $grupopredeterminado[0]['idgrupodescanso']);
                        }else{
                            $horasperdidasbd = $calendariopersona->getHrsCalendarioPersona($tempinicio->format('d/m/y'), $temphasta->format('d/m/y'), $valor['idpersona'], $persona['idcargo']);
                        }

                        if (!empty($valor['idcausa'])) {
                            if ($valor['afectasalario'] == 0) {
                                $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $horasperdidasbd[0]['sum']);
                                $reporte[$ind]['diastrab'] += $horasperdidasbd[0]['count'];
                            } else
                                $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $horasperdidasbd[0]['sum']);
                        }

                        if (($fd >= $finicio && $fd <= $ffin) && ($fh >= $finicio && $fh <= $ffin)) {
                            $fecha1 = date_create($fdesdep[2] . '-' . $fdesdep[1] . '-' . $fdesdep[0]);
                            $fecha2 = date_create($fhastap[2] . '-' . $fhastap[1] . '-' . $fhastap[0]);
                            $conasist = array_merge($conasist,(new DatAsistencia)->generarFechas($fecha1->format("d/m/Y"), $fecha2->format("d/m/Y")));
                        } else {
                            if (($fd < $finicio) && ($fh >= $finicio && $fh <= $ffin)) {
                                $fecha1 = new DateTime($finicio->format("Y-m-d"));
                                $fecha2 = date_create($fhastap[2] . '-' . $fhastap[1] . '-' . $fhastap[0]);
                                $conasist = array_merge($conasist,(new DatAsistencia)->generarFechas($fecha1->format("d/m/Y"), $fecha2->format("d/m/Y")));
                            } else {
                                if (($fd >= $finicio && $fd <= $ffin) && ($fh > $ffin)) {
                                    $fecha1 = date_create($fdesdep[2] . '-' . $fdesdep[1] . '-' . $fdesdep[0]);
                                    $fecha2 = $ffin;
                                    $conasist = array_merge($conasist,(new DatAsistencia)->generarFechas($fecha1->format("d/m/Y"), $fecha2->format("d/m/Y")));
                                } else {
                                    $fecha1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
                                    $fecha2 = $ffin;
                                    $conasist = array_merge($conasist,(new DatAsistencia)->generarFechas($fecha1->format("d/m/Y"), $fecha2->format("d/m/Y")));
                                }
                            }
                        }
                        while ($fecha1 <= $fecha2) {
                            $diadetrabajo1 = $calendariopersona->getCalendarioPersonaTrabajo($fecha1->format('d/m/Y'), $fecha1->format('d/m/Y'), $valor['idpersona']);
                            date_add($fecha1, date_interval_create_from_date_string('1 days'));
                            if(!empty($diadetrabajo1) && $valor['afectasalario'] == 0)
                            {
                                if($diadetrabajo1[0]['feriado'] == 1){
                                    $diaferhab = $datAsistenciaModel->GetDiaFeriadoHabilitado($persona['idpersona'], $diadetrabajo1[0]['fecha']);
                                    if(count($diaferhab)>0)
                                        $reporte[$ind] = $this->NocturnidadconCausaFeriado($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                }else{
                                    if($diadetrabajo1[0]['trabajo'] == 1 && $diadetrabajo1[0]['feriado'] == 0)
                                        $reporte[$ind] = $this->NocturnidadconCausa($valor, $confNocturnidad, $habfinmes[0]['habilitado'], $mes3, $ind,$reporte);
                                }
                            }
                        }
                        if (!empty($valor['idcausa'])) {
                            if ($valor['afectasalario'] == 1) {
                                //*************************HORAS FERIADAS*************************
                                if (count($fechdiaferiado) > 0) {
                                    foreach ($fechdiaferiado as $v) {
                                        $f = explode('/', $v);
                                        $fech = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                                        if ($fech >= $fd && $fech <= $fh) {
                                            array_push($fechincidencia, $v);
                                        }
                                    }
                                }

                                //*************************HORAS RECESO LABORAL*************************
                                $recesolab = array();                   
                                if (count($diasreceso) > 0) {
                                    foreach ($diasreceso as $v) {
                                        $f = explode('/', $v['fecha']);
                                        array_push($recesolab, $v['fecha']);
                                        $fech = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                                        if ($fech >= $fd && $fech <= $fh) {
                                            array_push($fechincidenciaRecLab, $v);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (count($fechdiasferiadoshab) > 0) {
                        if(in_array($valor['fecharegistro'],$fechdiasferiadoshab)){
                            array_push($encontrado, $valor['fecharegistro']);
                            $ftrl2 = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $hrsferiadastrabajadas);
                            $reporte[$ind]['hft'] = $ftrl2;
                        }
                    }
                    //*************************HORAS EXTRAS*************************
                    $reporte[$ind]['he'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['he'], $valor['horasextras']);                    
                }//edmarca

                /*MULTIPLES CAUSAS*/
                $habmultiplescausas = (new ConfHabilitarmultiplescausas())->gethabilitarvariascausas();
                if(!empty($habmultiplescausas) && $habmultiplescausas[0]['habilitadomc'] == 1){
                    if(!empty($idsasistencia)){
                        $multiplescausas = (new DatAsistenciamultiplescausas())->getAsistenciasMultiplesCausasByIdsAsist($idsasistencia);

                    foreach ($multiplescausas as $mc){
                        $horasdescaux = explode(':', $mc['horas']);
                        if ($mc['horas'] == '00:00')
                            $horas1aux = '';
                        else {
                            if ($horasdescaux[1] >= 30)
                                $timecausaaux = $horasdescaux[0] + 1;
                            else
                                $timecausaaux = $horasdescaux[0];
                            $horas1aux = intval($timecausaaux);
                        }
                        $reporte[$ind][$mc['idcausa'] . '_horas'] += $horas1aux;
                        $reporte[$ind][$mc['idcausa'] . '_dias'] += 0;
                        $reporte[$ind][$mc['idcausa']]['horas'] += (!empty($horas1aux)) ? $horas1aux : 0;
                        $reporte[$ind][$mc['idcausa']]['dias'] += 0;
                        $totalcausa = $datAsistenciaModel->SumOnlyTime($totalcausa, $horas1aux);
                        $sumtotalaux = explode(':', $totalcausa);
                        if ($sumtotalaux == '00:00')
                            $hrstotalaux = '';
                        else {
                            if ($sumtotalaux[1] >= 30)
                                $timecausaTaux = $sumtotalaux[0] + 1;
                            else
                                $timecausaTaux = $sumtotalaux[0];
                            $hrstotalaux = intval($timecausaTaux);
                        }
                        $reporte[$ind]['total'] = $hrstotalaux;
                    }
                    }                        
                }
                /*MULTIPLES CAUSAS*/
                
                /*if (count($fechdiasferiadoshab) > 0) {
                    foreach ($fechdiasferiadoshab as $v) {
                        $horasFer = $calendariopersona->getHrsFeriadasPersona($v, $v, $valor['idpersona']);
                        array_push($fechrango, $v);
                        $f = explode('/', $v);
                        $fech = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                        $fr = explode('/', $valor['fecharegistro']);
                        $fechr = date_create($fr[2] . '-' . $fr[1] . '-' . $fr[0]);
                        if (($fech == $fechr)) {
                            array_push($encontrado, $v);
                            $ftrl2 = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hft'], $hrsferiadastrabajadas);
                            $reporte[$ind]['hft'] = $ftrl2;
                        }
                        if (!empty($valor['fdesde']) && !empty($valor['fhasta'])) {
                            $fdesde2 = explode('/', $valor['fdesde']);
                            $fhasta2 = explode('/', $valor['fhasta']);
                            $fd = date_create($fdesde2[2] . '-' . $fdesde2[1] . '-' . $fdesde2[0]);
                            $fh = date_create($fhasta2[2] . '-' . $fhasta2[1] . '-' . $fhasta2[0]);
                            if ($fech >= $fd && $fech <= $fh) {
                                if (!empty($valor['idcausa'])) {
                                    if ($valor['afectasalario'] == 0) {
                                        $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $horasFer[0]['sum']);
                                        $reporte[$ind]['diastrab'] += $horasFer[0]['count'];
                                    } else
                                        $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $horasFer[0]['sum']);
                                }
                            }
                        }
                    }
                }*/
                $incidenciasFeriadas = $datAsistenciaModel->getAsistenciaRegistradaFeriado($persona['idpersona'],$fdesde, $fhasta);
                foreach( $incidenciasFeriadas as $horasFer){
                    if($horasFer['afectasalario'] == 0 ){
                        $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $horasFer['horas']);
                        $reporte[$ind]['diastrab'] += $horasFer['registros'];
                    }else{
                        $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $horasFer['horas']);
                    }
                }
                //*************************HORAS FERIADAS*************************
                if (!empty($fechincidencia)) {
                    foreach ($fechincidencia as $f) {
                        $val = explode('/', $f);
                        $hrsDiariasFeriadas = $calendariopersona->getHrsFeriadasPersona($f, $f, $persona['idpersona'], $valor['idgrupodescanso']);
                        $fthf = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $hrsDiariasFeriadas[0]['sum']);
                        $hf1 = explode(':', $fthf);
                        if ($regimen[0]['tipofondotiempo'] != 3) {
                            $reporte[$ind]['ft'] = intval($hf1[0]);
                            $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $hrsDiariasFeriadas[0]['sum']);
                        }
                    }
                }
                $feriadoslimpios = array();
                $feriados = array();
                $feriadoslimpios = array_diff($diasferiadospuros, $fechincidencia);
                $feriados = array_diff($feriadoslimpios, $diasfer);
                if (count($feriados) > 0) {
                    foreach ($feriados as $f) {
                        $hrsDiariasFeriadas = $calendariopersona->getHrsFeriadasPersona($f, $f, $persona['idpersona']);
                        $reporte[$ind]['hf'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hf'], $hrsDiariasFeriadas[0]['sum']);
                    }
                }

                $sinregistro = array();
                $sinregistro1 = array();
                $sinregistro = array_diff($fechdiasferiadoshab, $encontrado);
                if (count($sinregistro1) > 0) {
                    foreach ($sinregistro as $f) {
                        array_push($sinregistro1, "CAST('" . $f . "' as date)");
                    }
                    $sumhorasferiadas = $calendariopersona->GetSumHorasDiasFeriadosHabByDateArrayAndPerson($persona['idpersona'], $sinregistro1);
                    $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $sumhorasferiadas[0]['sum']);
                }
                if ($hrsDiariasFeriadas[0]['sum'] != null  && $regimen[0]['tipofondotiempo'] == 3){
                    $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['trt'], $reporte[$ind]['hf']);
                    $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $reporte[$ind]['hf']);
                    $totalcausa = $datAsistenciaModel->SumOnlyTime($totalcausa, $reporte[$ind]['hf']);
                }
                /*************************HORAS FERIADAS*************************/

                $diasrango = array();
                $fechrango = array();
                $sinasist = array();
                $sinasist1 = array();
//                if(!empty($grupopredeterminado) && count($existegrupo) != 0){
//                    $diasrango = $confCalendario->CalendarioByDateRangeTrabajo($finicio->format('d/m/Y'), $ffin->format('d/m/Y'), $grupopredeterminado[0]['idgrupodescanso']);
//                }else{
                    $diasrango = $calendariopersona->getCalendarioPersonaTrabajo($finicio->format('d/m/Y'), $ffin->format('d/m/Y'), $persona['idpersona']);
              /// }

                foreach ($diasrango as $dia) {
                    array_push($fechrango, $dia['fecha']);
                }
               // print_r($conasist); die;

                $sinasist = $this-> obtenerDiasSinAsistenciaFiltrados($diasrango, $conasist, $diasferiados, $diasreceso);
                
                if (count($sinasist) > 0) {
                    foreach ($sinasist as $f) {
                        array_push($sinasist1, "CAST('" . $f . "' as date)");
                    }
                    $sumhoras = $calendariopersona->GetSumHorasDiasFeriadosHabByDateArrayAndPerson($persona['idpersona'], $sinasist1);
                    $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $sumhoras[0]['sum']);
                    //$reporte[$ind]['sc'] = count($sinasist) * 8;

                    //print_r($diasrango);die;
                }
                $reporte[$ind]['diastrabmilit'] = $this->TiempoAPagarOficiales($asistencia[$persona['idpersona']], $persona['idpersona'], $finicio, $ffin, $cantDiasMes, $sinasist);
                //$reporte[$ind]['diastrabmilit'] = 0;

                //*************************TIEMPO DE RECESO LABORAL*************************
                if (empty($fechincidenciaRecLab)) {
                    $recesolab = array();
                    foreach ($diasreceso as $r) {
                        array_push($recesolab, $r['fecha']);
                    }
                    if (count($recesolab) > 0) {
                        foreach ($recesolab as $f) {
                            $val = explode('/', $f);
                            $reporte[$ind][$val[0] . '/' . $val[1]] = 'Receso.Laboral';
                            $hrsReclab = $calendariopersona->getHrsRecesoLabPersona($f, $f, $persona['idpersona'], $valor['idgrupodescanso']);
                            $hrl = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hrl'], $hrsReclab[0]['sum']);
                            $hrl1 = explode(':', $hrl);
                            $reporte[$ind]['hrl'] = intval($hrl1[0]);
                        }
                    }

                } else {
                    $recesolab = array();
                    foreach ($diasreceso as $r) {
                        array_push($recesolab, $r['fecha']);
                    }
                    if (count($recesolab) > 0) {
                        foreach ($recesolab as $f) {
                            $val = explode('/', $f);
                            $hrsReclab = $calendariopersona->getHrsRecesoLabPersona($f, $f, $persona['idpersona'], $valor['idgrupodescanso']);
                            $ftrl = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['ft'], $hrsReclab[0]['sum']);
                            $hrl1 = explode(':', $ftrl);
                            if ($regimen[0]['tipofondotiempo'] != 3) {
                                $reporte[$ind]['ft'] = intval($hrl1[0]);
                                $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $hrsReclab[0]['sum']);
                            }
                        }
                    }
                }
                if (!empty($diasreceso) && $regimen[0]['tipofondotiempo'] == 3){
                    $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['trt'], $reporte[$ind]['hrl']);
                    $reporte[$ind]['hp'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['hp'], $reporte[$ind]['hrl']);
                    $totalcausa = $datAsistenciaModel->SumOnlyTime($totalcausa, $reporte[$ind]['hrl']);
                }
                //*************************TIEMPO DE RECESO LABORAL*************************

                //*************************FONDO DE TIEMPO FIJO Y ANUAL*************************
                if ($regimen[0]['tipofondotiempo'] == 3 || $regimen[0]['tipofondotiempo'] == 2) {
                    if(empty($reporte[$ind]['trt']))
                        $reporte[$ind]['trt'] = '00:00:00';
                    if ($cantidadmeses > 0)
                        $reporte[$ind]['ft'] = $reporte[$ind]['ft'] * $cantidadmeses;
                    $timetotal = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $reporte[$ind]['hp']);
                    $ti = explode(':', $timetotal);
                    if(mktime($ti[0],$ti[1],$ti[2]) > mktime($reporte[$ind]['ft'],0,0)){
                        $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['hp']);
                    }
                    if ((mktime($ti[0],$ti[1],$ti[2]) < mktime($reporte[$ind]['ft'],0,0)) && ($reporte[$ind]['trt'] != '00:00:00')) {
                        if (!empty($reporte[$ind]['hp'])){
                            $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['hp']);
                            //$reporte[$ind]['diastrab'] = intval($regimen[0]['diaslaborables'] - ($reporte[$ind]['hp']/$regimen[0]['diaslaborables']));
                        }else{
                            $reporte[$ind]['trt'] = $reporte[$ind]['ft'];
                            if(count(array_unique($cant)) > 0){
                                $reporte[$ind]['total'] = $reporte[$ind]['ft'];
                                $totalcausa = $reporte[$ind]['ft'];
                            }
                            $reporte[$ind]['diastrab'] = $regimen[0]['diaslaborables'];
                        }
                    }
                    if (($reporte[$ind]['trt'] == '00:00:00') && !empty($reporte[$ind]['hp'])) {
                        $reporte[$ind]['hp'] = $reporte[$ind]['ft'];
                        $reporte[$ind]['diastrab'] = 0;
                    }
                    if (($reporte[$ind]['trt'] != '00:00:00') && (empty($reporte[$ind]['hp']) || $reporte[$ind]['hp'] == '00:00:00')) {
                        if (!empty($regimen[0]['diaslaborables']))
                            $reporte[$ind]['diastrab'] = $regimen[0]['diaslaborables'];
                        $reporte[$ind]['trt'] = $reporte[$ind]['ft'];
                    }
                }

                //*************************FONDO DE TIEMPO LIMITE*************************
                if ($regimen[0]['tipofondotiempo'] == 4) {
                    if ($cantidadmeses > 0)
                        $reporte[$ind]['ft'] = $reporte[$ind]['ft'] * $cantidadmeses;
                    $timetotal = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $reporte[$ind]['hp']);
                    $ti = explode(':', $timetotal);
                    if(mktime($ti[0],$ti[1],$ti[2]) > mktime($reporte[$ind]['ft'],0,0)){
                        $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['hp']);
                    }
                    if (mktime($ti[0],$ti[1],$ti[2]) < mktime($reporte[$ind]['ft'],0,0)) {
                        $reporte[$ind]['trt'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['ft'], $reporte[$ind]['hp']);
                    }
                    $p = explode(':', $reporte[$ind]['hp']);
                    if (mktime($p[0],$p[1],$p[2]) > mktime($reporte[$ind]['ft'],0,0)) {
                        $reporte[$ind]['hp'] = $reporte[$ind]['ft'];
                    }
                }
                ////////////////////////////////HORAS EXTRAS//////////////////////////////////
                $temphl = explode(':', $reporte[$ind]['he']);

                if ($temphl[0] >= $hmensualesmax->limite)
                    $reporte[$ind]['he'] = $hmensualesmax->limite;
                else
                    $reporte[$ind]['he'] = intval($temphl[0]);

                //**Horas perdidas *
                $thp = explode(':', $reporte[$ind]['hp']);
                if ($thp[1] > 30)
                    $a = $thp[0] + 1;
                else
                    $a = $thp[0];
                $reporte[$ind]['hp'] = $a;

                //**TIEMPO REAL TRABAJADO**

                if (!empty($reporte[$ind]['hft']))
                    if($regimen[0]['tipofondotiempo'] != 3)
                        $reporte[$ind]['trt'] = $datAsistenciaModel->SumOnlyTime($reporte[$ind]['trt'], $reporte[$ind]['hft']);
                if($regimen[0]['tipofondotiempo'] == 3 && !empty($reporte[$ind]['hp']) && $reporte[$ind]['trt'] != '00:00:00' && $reporte[$ind]['trt'] != $reporte[$ind]['ft']){
                    $ft1 = explode('.', $reporte[$ind]['ft']);
                    $tottrt = explode(':', $reporte[$ind]['trt']);
                    if ($tottrt[1] >= 30)
                        $atrt = $tottrt[0] + 1;
                    else
                        $atrt = $tottrt[0];
                    if($ft1[1]){
                        $reporte[$ind]['trt'] = $atrt.'.'.$ft1[1];
                    }else{
                        $reporte[$ind]['trt'] = $atrt;
                    }
                }
                if (($regimen[0]['tipofondotiempo'] != 3)) {
                    $tottrt = explode(':', $reporte[$ind]['trt']);
                    if ($tottrt[1] >= 30)
                        $atrt = $tottrt[0] + 1;
                    else
                        $atrt = $tottrt[0];
                    $reporte[$ind]['trt'] = $atrt;//intval($atrt);
                }
                if($regimen[0]['tipofondotiempo'] == 3){
                    $auxtrt = explode(':',$reporte[$ind]['trt']);
                    $auxhp = explode(':',$reporte[$ind]['hp']);
                    if(mktime($auxtrt[0],$auxtrt[1],$auxtrt[2]) > mktime($reporte[$ind]['ft'],0,0)){
                        $reporte[$ind]['trt'] = $reporte[$ind]['ft'];
                        $reporte[$ind]['hp'] = 0;
                        $reporte[$ind]['sc'] = 0;
                    }
                    if(mktime($auxhp[0],$auxhp[1],$auxhp[2]) > mktime($reporte[$ind]['ft'],0,0)){
                        $reporte[$ind]['hp'] = $reporte[$ind]['ft'];
                        $reporte[$ind]['trt'] = 0;
                        //$reporte[$ind]['sc'] = $reporte[$ind]['ft'];
                    }

//                    $f = explode('/',$this->_request->getPost('fecha'));
//                    $cantDiasMes = date('t', mktime(0, 0, 0, $f[1], 1, $f[2]));
                    if(!empty($grupopredeterminado) && count($existegrupo) != 0){
                        $calendariotrabajo = ConfCalendario::getHrsCalendario($fdesde, $fhasta, $grupopredeterminado[0]['idgrupodescanso']);
                    }else{
                        $calendariotrabajo = ConfCalendarioPersona::getHrsCalendarioPersona($fdesde, $fhasta, $persona['idpersona'], $persona['idcargo']);
                    }

                    if(($reporte[$ind]['ft'] == $reporte[$ind]['hp'] || $reporte[$ind]['ft'] == $reporte[$ind]['trt']) && count(array_unique($cant)) == 1 && $calendariotrabajo[0]['sum'] == $reporte[$ind]['total'].':00:00'){
                        $reporte[$ind][$valor['idcausa'] . '_horas'] = $reporte[$ind]['ft'];
                        $reporte[$ind][$valor['idcausa'] . 'horas'] = $reporte[$ind]['ft'];
                        $reporte[$ind]['total'] = $reporte[$ind]['ft'];
                        $totalcausa = $reporte[$ind]['ft'];
                    }else if(($reporte[$ind]['ft'] == $reporte[$ind]['hp'] || $reporte[$ind]['ft'] == $reporte[$ind]['trt']) && count(array_unique($cant)) > 1  && $calendariotrabajo[0]['sum'] == $reporte[$ind]['total'].':00:00'){
                        $reporte[$ind]['total'] = $reporte[$ind]['ft'];
                        $totalcausa = $reporte[$ind]['ft'];
                    }
                    if($reporte[$ind][$valor['idcausa'] . '_horas'] > $reporte[$ind]['ft']){
                        $reporte[$ind][$valor['idcausa'] . '_horas'] = $reporte[$ind]['ft'];
                        $reporte[$ind][$valor['idcausa'] . 'horas'] = $reporte[$ind]['ft'];
                        $reporte[$ind]['total'] = $reporte[$ind]['ft'];
                        $totalcausa = $reporte[$ind]['ft'];
                    }
                }
//                if($regimen[0]['tipofondotiempo'] == 3 && !empty($reporte[$ind]['hf'])){
//                    $ft1 = explode('.', $reporte[$ind]['trt']);
//                    $trtfer = $ft1[0] - $reporte[$ind]['hf'];
//                    if($ft1[1]){
//                        $reporte[$ind]['trt'] = $trtfer.'.'.$ft1[1];
//                    }else{
//                        $reporte[$ind]['trt'] = $trtfer;
//                    }
//                }
                if($regimen[0]['tipofondotiempo'] == 3 && $reporte[$ind]['trt'])
                {
                    $ft1 = explode('.', $reporte[$ind]['trt']);
                    $diastrab1 = $ft1[0]/8;
                    $dt = explode('.', $diastrab1);
                    if($dt[1]){
                        if ($dt[1] > 30)
                            $dtrab = $dt[0] + 1;
                        else
                            $dtrab = $dt[0];
                    }else
                        $dtrab = $dt[0];

                    $reporte[$ind]['diastrab'] = intval($dtrab);
                }

                $reporte[$ind]['sc'] = $datAsistenciaModel->RestOnlyTime($reporte[$ind]['hp'], $totalcausa);

                ///////////////////////////////HORAS FERIADAS/////////////////////////
                $hf = explode(':', $reporte[$ind]['hf']);
                $reporte[$ind]['hf'] = intval($hf[0]);

                ///////////////////////////////HORAS FERIADAS TRABAJADAS/////////////////////////
                $hft = explode(':', $reporte[$ind]['hft']);
                $reporte[$ind]['hft'] = intval($hft[0]);

                ///////////////////////////////SIN CAUSA/////////////////////////
                if (($regimen[0]['tipofondotiempo'] != 3)) {
                $sc = explode(':', $reporte[$ind]['sc']);
                if ($sc[1] > 30)
                    $tsc = $sc[0] + 1;
                else
                    $tsc = $sc[0];
                $reporte[$ind]['sc'] = intval($tsc); 
                }else{
                    $sc = explode(':', $reporte[$ind]['sc']);
                    $ft1 = explode('.', $reporte[$ind]['ft']);
                    //if ($sc[0] == $ft1[0])
                    if(!empty($ft1[1]))
                        $reporte[$ind]['sc'] = $sc[0].'.'.$ft1[1];
                    else{
                        if ($sc[1] > 30)
                            $tsc = $sc[0] + 1;
                        else
                            $tsc = $sc[0];
                        $reporte[$ind]['sc'] = intval($tsc);
                    }
                }
                ///////////////////////////////TIEMPO DE TRABAJO EXTRAORDINARIO/////////////////////////
                $hte = explode(':', $reporte[$ind]['hte']);
                if ($hte[1] >= 30)
                    $hte1 = $hte[0] + 1;
                else
                    $hte1 = $hte[0];
                $reporte[$ind]['hte'] = intval($hte1);


                if (empty($reporte[$ind]['ft']) || intval($reporte[$ind]['ft']) == 0 || intval($reporte[$ind]['ft']) == 00)
                    $reporte[$ind]['ft'] = "";
                if (empty($reporte[$ind]['trt']) || intval($reporte[$ind]['trt']) == 0 || intval($reporte[$ind]['trt']) == 00)
                    $reporte[$ind]['trt'] = "";
                if (empty($reporte[$ind]['hp']) || intval($reporte[$ind]['hp']) == 0 || intval($reporte[$ind]['hp']) == 00)
                    $reporte[$ind]['hp'] = "";
                if (empty($reporte[$ind]['he']) || intval($reporte[$ind]['he']) == 0 || intval($reporte[$ind]['he']) == 00)
                    $reporte[$ind]['he'] = "";
                if (empty($reporte[$ind]['hf']) || intval($reporte[$ind]['hf']) == 0 || intval($reporte[$ind]['hf']) == 00)
                    $reporte[$ind]['hf'] = "";
                if (empty($reporte[$ind]['hft']) || intval($reporte[$ind]['hft']) == 0 || intval($reporte[$ind]['hft']) == 00)
                    $reporte[$ind]['hft'] = "";
                if (empty($reporte[$ind]['sc']) || intval($reporte[$ind]['sc']) == 0 || intval($reporte[$ind]['sc']) == 00)
                    $reporte[$ind]['sc'] = "";
                if (empty($reporte[$ind]['hft']) || intval($reporte[$ind]['hft']) == 0 || intval($reporte[$ind]['hft']) == 00)
                    $reporte[$ind]['hft'] = "";
                if (empty($reporte[$ind]['hte']) || intval($reporte[$ind]['hte']) == 0 || intval($reporte[$ind]['hte']) == 00)
                    $reporte[$ind]['hte'] = "";
                if (empty($reporte[$ind]['hrl']) || intval($reporte[$ind]['hrl']) == 0 || intval($reporte[$ind]['hrl']) == 00)
                    $reporte[$ind]['hrl'] = "";

            }
        }
        $temparray = array();
        foreach ($reporte as $r) {
            $temparray[$r['idpersona'] . '_' . $r['idcargo']] = $r;
        }
       return array_values($temparray);
    }

    public
    function GetApaWithSesions($idestructura, $finicio, $ffin, $limit, $start,
                               $filtro, $tienecausas, $idconcepto, $quincena = 0)
    {
        $datAsistencia = new DatAsistencia();
        $DAM = new DatAsistenciaModel();
        $calendario = new ConfCalendario();

        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $objDatos = $datAsistencia->GetDatosPersonaFoto($cargosPeople, $filtro);

        if (count($objDatos) > 0) {
            $personasordenadas = $datAsistencia->OrderPersonasByCargo($objDatos, $limit, $start);
            $objDatos = $personasordenadas;
        }
        if (count($objDatos) > 0) {
            $APA = $objDatos;
            foreach ($APA as $ind => $pers) {
                $idpers[$ind] = $pers['idpersona'];
            }
            if (count($idpers) > 0)
                $asistencia = $datAsistencia->GetAllByDatesWithSesions($finicio, $ffin, $idpers);

            $modelcausa = new NomCausaModel();
            $array = null;
            $tieneDatos = false;


            $denEntAreas = $DAM->GetDenomEntAreas($APA);

            $denomarea = array();
            foreach ($APA as $p => $dat) {
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

            foreach ($APA as $ind => $persona) {
                $APA[$ind]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                $APA[$ind]['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';

                if (empty($APA[$ind]['idcargo'])) {
                    $existInAsistencia = $datAsistencia->getMovimiento($persona['idpersona']);
                } else {
                    $existInAsistencia = $datAsistencia->getControlado($APA[$ind]['idcargo']);

                    if (count($existInAsistencia) == 0)
                        $existInAsistencia = $datAsistencia->getControlador($APA[$ind]['idcargo']);
                }
                if (count($existInAsistencia) > 0) {
                    $tieneDatos = false;

                    $person = array();
                    $person[0] = $persona['idpersona'];
                    $personasGrupo =
                        ZendExt_IoC_Inter::getInstance()->persona->getRegimenByPerson($person,
                            null, null, null);
                    if (!is_numeric($personasGrupo[0]['idgrupodescanso'])) {
                        $APA[$ind]['realpagar'] = 0;
                        $APA[$ind]['work'] = 'Sin régimen';
                        //  $APA[$ind]['total'] = 0;
                        $APA[$ind]['realw'] = 0;
                    } else {
                        $idgrupodescanso = $datAsistencia->getHorarioByPersona($persona['idpersona']);
                        $APA[$ind]['realpagar'] = 0;

                        foreach ($asistencia as $key => $valor) {

                            if ($persona['idpersona'] == $valor['idpersona']) {
                                $tieneDatos = true;
                                $dia = $calendario->getCalendarioByFecha(
                                    $valor['fecharegistro'], $idgrupodescanso['idgrupodescanso']
                                );
                                $hrsDiarias = $calendario->HrsByDateRange(
                                    $valor['fecharegistro'], $valor['fecharegistro'], $idgrupodescanso['idgrupodescanso']
                                );
                                $hrsDiariasFeriadas = $calendario->HrsFeriadasByDateRange(
                                    $valor['fecharegistro'], $valor['fecharegistro'], $idgrupodescanso['idgrupodescanso']
                                );


                                if (!empty($valor['idcausa']) && !empty($valor['hrsdescontadas'])) {
                                    $hrsDescontar = '';
                                    $fi = date_create_from_format('d/m/Y', $finicio);
                                    $ff = date_create_from_format('d/m/Y', $ffin);
                                    $fd = date_create_from_format('d/m/Y', $valor['fdesde']);
                                    $fh = date_create_from_format('d/m/Y', $valor['fhasta']);
                                    if ($fd < $fi && $fh > $ff) {
                                        $planif = $calendario->HrsByDateRange(
                                            $finicio, $ffin, $idgrupodescanso['idgrupodescanso']
                                        );
                                        $hrsDescontar = $planif[0]['sum'] . ':00:00';
                                    } else {
                                        if ($fd < $fi && $fh > $fi && $fh < $ff) {
                                            $planif = $calendario->HrsByDateRange(
                                                $finicio, $valor['fhasta'], $idgrupodescanso['idgrupodescanso']
                                            );
                                            $hrsDescontar = $planif[0]['sum'] . ':00:00';
                                        } else {
                                            if ($fh > $ff && $fd > $fi && $fd < $ff) {
                                                $planif = $calendario->HrsByDateRange(
                                                    $valor['fdesde'], $ffin, $idgrupodescanso['idgrupodescanso']
                                                );
                                                $hrsDescontar = $planif[0]['sum'] . ':00:00';
                                            } else {
                                                if (!empty($valor['fdesde']) && !empty($valor['fhasta'])) {
                                                    $planif = $calendario->HrsByDateRange(
                                                        $valor['fdesde'], $valor['fhasta'], $idgrupodescanso['idgrupodescanso']
                                                    );
                                                    $hrsDescontar = $planif[0]['sum'] . ':00:00';
                                                }
                                            }
                                        }
                                    }
                                    if ($valor['afectasalario']) {
                                        if (isset($APA[$ind][$valor['idcausa']])) {
                                            if (empty($APA[$ind][$valor['idcausa']])) {
                                                $APA[$ind][$valor['idcausa']] = $hrsDescontar;
                                            } else {
                                                $suma = $DAM->SumOnlyTime($hrsDescontar, $APA[$ind][$valor['idcausa']]);
                                                $APA[$ind][$valor['idcausa']] = $suma;
                                            }
                                        } else {
                                            $APA[$ind][$valor['idcausa']] = $hrsDescontar;
                                        }

                                        if (isset($APA[$ind]['total'])) {
                                            if (empty($APA[$ind]['total'])) {
                                                $APA[$ind]['total'] = $hrsDescontar;
                                            } else {
                                                $suma = $DAM->SumOnlyTime($hrsDescontar, $APA[$ind]['total']);
                                                $APA[$ind]['total'] = $suma;
                                            }
                                        } else {
                                            $APA[$ind]['total'] = $hrsDescontar;
                                        }
                                    }
                                } else {
                                    if (!empty($valor['idcausaps']) && !empty($valor['hrsdescontadasps'])) {
                                        if ($valor['afectasalariops']) {
                                            if (isset($APA[$ind][$valor['idcausaps']])) {
                                                if (empty($APA[$ind][$valor['idcausaps']])) {
                                                    $APA[$ind][$valor['idcausaps']] = $valor['hrsdescontadasps'];
                                                } else {
                                                    $suma = $DAM->SumOnlyTime($valor['hrsdescontadasps'], $APA[$ind][$valor['idcausaps']]);
                                                    $APA[$ind][$valor['idcausaps']] = $suma;
                                                }
                                            } else {
                                                $APA[$ind][$valor['idcausaps']] = $valor['hrsdescontadasps'];
                                            }

                                            if (isset($APA[$ind]['total'])) {
                                                if (empty($APA[$ind]['total'])) {
                                                    $APA[$ind]['total'] = $valor['hrsdescontadasps'];
                                                } else {
                                                    $suma = $DAM->SumOnlyTime($valor['hrsdescontadasps'], $APA[$ind]['total']);
                                                    $APA[$ind]['total'] = $suma;
                                                }
                                            } else {
                                                $APA[$ind]['total'] = $valor['hrsdescontadasps'];
                                            }
                                        }
                                    }

                                    if (!empty($valor['idcausass']) && !empty($valor['hrsdescontadasss'])) {
                                        if ($valor['afectasalarioss']) {
                                            if (isset($APA[$ind][$valor['idcausass']])) {
                                                if (empty($APA[$ind][$valor['idcausass']])) {
                                                    $APA[$ind][$valor['idcausass']] = $valor['hrsdescontadasss'];
                                                } else {
                                                    $suma = $DAM->SumOnlyTime($valor['hrsdescontadasss'], $APA[$ind][$valor['idcausass']]);
                                                    $APA[$ind][$valor['idcausass']] = $suma;
                                                }
                                            } else {
                                                $APA[$ind][$valor['idcausass']] = $valor['hrsdescontadasss'];
                                            }

                                            if (isset($APA[$ind]['total'])) {
                                                if (empty($APA[$ind]['total'])) {
                                                    $APA[$ind]['total'] = $valor['hrsdescontadasss'];
                                                } else {
                                                    $suma = $DAM->SumOnlyTime($valor['hrsdescontadasss'], $APA[$ind]['total']);
                                                    $APA[$ind]['total'] = $suma;
                                                }
                                            } else {
                                                $APA[$ind]['total'] = $valor['hrsdescontadasss'];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (!empty($APA[$ind]['denomentidad'])) {
                            $APA[$ind]['entidad'] = $APA[$ind]['denomentidad'] . '/' .
                                $APA[$ind]['denomarea'];
                        } else {
                            $APA[$ind]['entidad'] = 'Sin Cargo';
                        }
                        if (empty($APA[$ind]['total'])) {
                        }

                        if (!$tieneDatos) {
                            $APA[$ind]['realw'] = "";
                            $APA[$ind]['realpagar'] = "";
                        } else {

                        }
                    }
                } else {
                    $APA[$ind]['entidad'] = 'PERSONAL AL QUE NO SE LE ESTÁ CONTROLANDO LA ASISTENCIA';
                }

            }

        } else {
            $objDatos = array();
            $APA = array();
            $cod = 3;
        }

        $result['apa'] = $APA;
        $result['cant'] = count($objDatos);
        $result['cod'] = $cod;
        return $result;
    }

    public
    function GetApaNomina($arrayidpersonas, $fdesde, $fhasta, $configuracion, $identidad)
    {

        $datAsistencia = new DatAsistencia();
        $datAsistenciamensual = new DatAsistenciamensual();
        $idspersona = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($identidad, $iddominio, false);
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $objDatos = $datAsistencia->GetDatosPersonaReporte($cargosPeople, null, null, 0, $fdesde, $fhasta);
        foreach ($arrayidpersonas as $i => $idper) {
            foreach ($objDatos as $j => $data) {
                    if($idper == $data['idpersona']){
                        array_push($idspersona,$idper);
                    }
            }
        }
        $datos = $datAsistencia->getdatospersona(array_unique($idspersona), $fdesde, $fhasta);
        $idspersonacargo = array();
        foreach ($datos as $p => $dat) {
            $idspersonacargo[$p]['idpersona'] = $dat['idpersona'];
            $idspersonacargo[$p]['idcargo'] = $dat['idcargo'];
        }
        $data = $datAsistenciamensual->getAsistMensualByPeriodoAndIdestruct($_SESSION['Zeolides']['entidad']->idestructura, $fdesde, $fhasta);
        
        if (!empty($data)) {
            $arreglo = json_decode($data[0]['apa'], true);
            foreach ($idspersonacargo as $p => $dat) {
                $reporte[] = $arreglo[$dat['idpersona'] . '-' . $dat['idcargo']];
            }
        } else {
            $reporte = $datos;
            $grupos = array();
            $idpersona = array();
            $idspersonacargo = array();
            foreach ($reporte as $p => $dat) {
                if (!empty($dat['idgrupodescanso'])) {
                    array_push($idpersona, $dat['idpersona']);
                    array_push($grupos, $dat['idgrupodescanso']);
                    $idspersonacargo[$p]['idpersona'] = $dat['idpersona'];
                    $idspersonacargo[$p]['idcargo'] = $dat['idcargo'];
                }
            }

            $tipodia = new NomTipodia();
            $dialaborable = $tipodia->DiaLaborable();
            $diaferiado = $tipodia->DiaFeriado();

            $idcausas = array();
            foreach ($configuracion as $causa) {
                if (is_numeric($causa))
                    array_push($idcausas, $causa);
            }

            if (count($idspersona) > 0) {
                $asistenciaAPA = array();
                $asistencia = $datAsistencia->GetAllByRangoAndPersonas($fdesde, $fhasta, $idspersonacargo, 0, null);
                if (count($idcausas) > 0 && count($idpersona) > 0 && count($grupos) > 0 && $fdesde && $fhasta && $dialaborable[0]['idtipodedia']){
                    $asistenciaAPA = $datAsistencia->getAsistenciabyCausa($idcausas, $idpersona, $grupos, $fdesde, $fhasta, array(3, 1, 13, 8));
                }
                    
                $reporte = $this->getDataAPA($reporte, 'nomina', array(), $fdesde, $fhasta, $asistenciaAPA, $asistencia);
            }
        }
        $ConfHorasdias = new ConfHorasdias();
        $horasdias = $ConfHorasdias->getHorasDias();

        $direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
            "pvd/comun/models/bussines/ConfiguracionCH.php";
        include($direccionComun);
        $objConf = new ConfiguracionCH();
        $obj = $objConf->indicadores_tiempo_rtd;
        foreach ($reporte as $key1 => $person) {
            foreach ($configuracion as $k => $val) {
                $noct = explode('_', $val);
                if (is_numeric($val) && !empty($person[$val])) {
                    $result[$key1]['idpersona'] = $person['idpersona'];
                    if(!empty($person[$val]['horas']) && $horasdias[1]['id'] == 2 && $horasdias[1]['horasdias'] == 1){
                        $person[$val]['dias'] = $person[$val]['horas']/8;
                        $person[$val]['horas'] = $person[$val]['horas'];
                    }
                    if(!empty($person['ft']) && !empty($person[$val.'_horas']) && $person['ft'] == $person[$val.'_horas']){
                        $person[$val]['horas'] = $person[$val.'_horas'];
                        $person[$val]['dias'] = $person['diaslab'];
                    }
                    if(!empty($person[$val])){
                        $result[$key1][$val] = $person[$val];
                    }
                } else if ($noct[0] == 'noct' && !empty($person[$val])) {
                    $result[$key1]['idpersona'] = $person['idpersona'];
                    $result[$key1][$val] = $person[$val];
                } else {
                    $result[$key1]['idpersona'] = $person['idpersona'];
                    if ($obj['RTD-THA']['id'] == $val)
                        $result[$key1][$obj['RTD-THA']['id']] = ($person['hp'] > 0) ? $person['hp'] : 0;
                    else if ($obj['RTD-TRT']['id'] == $val)
                        $result[$key1][$obj['RTD-TRT']['id']] = ($person['trt'] > 0) ? $person['trt'] : 0;
                    else if ($obj['RTD-HE']['id'] == $val)
                        $result[$key1][$obj['RTD-HE']['id']] = ($person['he'] > 0) ? $person['he'] : 0;
                    else if ($obj['RTD-HTDF']['id'] == $val)
                        $result[$key1][$obj['RTD-HTDF']['id']] = ($person['hft'] > 0) ?$person['hft'] : 0;
                    else if ($obj['RTD-FTP']['id'] == $val)
                        $result[$key1][$obj['RTD-FTP']['id']] = ($person['ft'] > 0) ? $person['ft'] : 0;
                    else if ($obj['RTD-HF']['id'] == $val)
                        $result[$key1][$obj['RTD-HF']['id']] = ($person['hf'] > 0) ? $person['hf'] : 0;
                    else if ($obj['RTD-SC']['id'] == $val)
                        $result[$key1][$obj['RTD-SC']['id']] = ($person['sc'] > 0) ? $person['sc'] : 0;
                    else if ($obj['RTD-HTE']['id'] == $val)
                        $result[$key1][$obj['RTD-HTE']['id']] = ($person['hte'] > 0) ? $person['hte'] : 0;
                    else if ($obj['RTD-HRL']['id'] == $val)
                        $result[$key1][$obj['RTD-HRL']['id']] = ($person['hrl'] > 0) ? $person['hrl'] : 0;
                    else if ($obj['RTD-DIASTRAB']['id'] == $val)
                        $result[$key1][$obj['RTD-DIASTRAB']['id']] = ($person['diastrab'] > 0) ? $person['diastrab'] : 0;
                    else if ($obj['RTD-DIASLAB']['id'] == $val)
                        $result[$key1][$obj['RTD-DIASLAB']['id']] = ($person['diaslab'] > 0) ? $person['diaslab'] : 0;
                    else if ($obj['RTD-DIASTRABMILIT']['id'] == $val)
                        $result[$key1][$obj['RTD-DIASTRABMILIT']['id']] = ($person['diastrabmilit'] > 0) ? $person['diastrabmilit'] : 0;
                }
            }
        }
        //////////Vacaciones Adelantadas////////////////////////////////
        $fechai = explode('/', $fdesde);
        $fechaf = explode('/', $fhasta);
        $fi = new DateTime($fechai[2] . '-' . $fechai[1] . '-' . $fechai[0]);
        $ff = new DateTime($fechaf[2] . '-' . $fechaf[1] . '-' . $fechaf[0]);
        $fechinicio = date_add($ff, date_interval_create_from_date_string('1 day'));
        $FI = explode('/', $fechinicio->format('d/m/Y'));
        $fechinicio = date_create($FI[2] . '-' . $FI[1] . '-' . $FI[0]);
        $fini = $fechinicio->format('d/m/Y');
        $mes1 = $fechinicio->format('m');
        $fi1 = $fechinicio;
        $mesnext = date_add($fi1, date_interval_create_from_date_string('1 month'));
        $MN = explode('/', $mesnext->format('d/m/Y'));
        $mesnext = date_create($MN[2] . '-' . $MN[1] . '-' . $MN[0]);
        $mes = $mesnext->format('m');
        if ($mes != $mes1) {
            $fechfin = date_add($mesnext, date_interval_create_from_date_string('-1 day'));
            $FF = explode('/', $fechfin->format('d/m/Y'));
            $fechfin = date_create($FF[2] . '-' . $FF[1] . '-' . $FF[0]);
        } else {
            $fechfin = $mesnext;
        }
        $ffin = $fechfin->format('d/m/Y');
        $vacAdel = $datAsistencia->getVacacionesadelantadas($fini, $ffin);
        $result['RTD-VA'] = $vacAdel;
        //print_r($result);die;
        //////////Vacaciones Adelantadas////////////////////////////////
        return $result;
    }

    public
    function PrepareDataNomina($valor)
    {
        if (!empty($valor) && $valor != 0) {
            $time = explode(':', $valor);
            if (count($time) > 0) {
                if ($time[1] > 30) {
                    $tiempo = intval($time[0]) + 1;
                } else {
                    $tiempo = intval($time[0]);
                }
            } else {
                $tiempo = 0;
            }
        } else
            $tiempo = 0;
        return $tiempo;
    }

    public
    function getIndicadoresValores($idestructura, $idreporte, $mes,
                                   $year, $limit, $start)
    {
        $array1 = array();
        $ids = array();
        $idsF = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura =
            ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura,
                $iddominio, false);
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $objDatos =
            ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(null,
                null, $limit, $start, null, $cargosPeople, null);
        if ($objDatos->quantity == 0) {
            return -1;
        }
        $APA = $objDatos->data;
        foreach ($APA as $ind => $pers) {
            $idpers[$ind] = $pers['idpersona'];
        }
        $datAsistencia = new DatAsistencia();
        $finicio = '2016-04-01';
        $ffin = '2016-05-30';
        $asistencia = $datAsistencia->GetAllByDates($finicio, $ffin, $idpers);
        $modelcausa = new NomCausaModel();
        $tienecausas = 1;
        $totalhoras = array();
        $tieneDatos = false;
        $calendario = new ConfCalendario();
        foreach ($asistencia as $key => $valor) {
            $person = array();
            $person[0] = $valor['idpersona'];
            $personasGrupo =
                ZendExt_IoC_Inter::getInstance()->persona->getRegimenByPerson($person,
                    null, null, null);
            $tieneDatos = true;
            if (!empty($valor['idcausa']) && !empty($valor['hrsdescontadas'])) {
                if ($valor['idcausa']) {
                    $index = $valor['idcausa'];

                    $fi = new DateTime($finicio);
                    $ff = new DateTime($ffin);
                    if (!empty($valor['fdesde']) && !empty($valor['fhasta'])) {
                        $fdes = explode('/', $valor['fdesde']);
                        $fdesde = new DateTime($fdes[2] . '-' . $fdes[1] . '-' .
                            $fdes[0]);
                        $fhas = explode('/', $valor['fhasta']);
                        $fhasta = new DateTime($fhas[2] . '-' . $fhas[1] . '-' .
                            $fhas[0]);
                    }
                    if ((empty($valor['fdesde']) && empty($valor['fhasta'])) ||
                        (($fi <= $fdesde && $fdesde <= $ff) &&
                            ($fi <= $fhasta && $fhasta <= $ff))
                    ) {
                        if (empty($totalhoras[$index])) {
                            $horas = explode(':', $valor['hrsdescontadas']);
                            $minutos = ($horas[0] * 60) + ($horas[1]);
                            $totalhoras[$index] = $minutos;
                        } else {
                            $horas = explode(':', $valor['hrsdescontadas']);
                            $minutos = $totalhoras[$index] + ($horas[0] * 60) +
                                ($horas[1]);
                            $totalhoras[$index] = $minutos;
                        }
                    } else {
                        if (count($personasGrupo) > 0) {
                            if ($fdesde < $fi && $fi <= $fhasta &&
                                $fhasta <= $ff
                            ) {
                                $hrs = $calendario->HrsByDateRange($finicio,
                                    $valor['fhasta'],
                                    $personasGrupo[0]['idgrupodescanso']);

                                if (empty($totalhoras[$index])) {
                                    $horas =
                                        explode(':', $hrs[0]['sum'] . ':00');
                                    $minutos = ($horas[0] * 60) + ($horas[1]);
                                    $totalhoras[$index] = $minutos;
                                } else {
                                    $horas =
                                        explode(':', $hrs[0]['sum'] . ':00');
                                    $minutos =
                                        $totalhoras[$index] + ($horas[0] * 60) +
                                        ($horas[1]);
                                    $totalhoras[$index] = $minutos;
                                }

                            } else {
                                if ($fi <= $fdesde && $fdesde <= $ff &&
                                    $fhasta > $ff
                                ) {
                                    $hrs =
                                        $calendario->HrsByDateRange($valor['fdesde'],
                                            $ffin,
                                            $personasGrupo[0]['idgrupodescanso']);
                                    if (empty($totalhoras[$index])) {
                                        $horas = explode(':',
                                            $hrs[0]['sum'] . ':00');
                                        $minutos =
                                            ($horas[0] * 60) + ($horas[1]);
                                        $totalhoras[$index] = $minutos;
                                    } else {
                                        $horas = explode(':',
                                            $hrs[0]['sum'] . ':00');
                                        $minutos = $totalhoras[$index] +
                                            ($horas[0] * 60) + ($horas[1]);
                                        $totalhoras[$index] = $minutos;
                                    }

                                } else {
                                    $hrs = $calendario->HrsByDateRange($finicio,
                                        $ffin,
                                        $personasGrupo[0]['idgrupodescanso']);

                                    if (empty($totalhoras[$index])) {
                                        $horas = explode(':',
                                            $hrs[0]['sum'] . ':00');
                                        $minutos =
                                            ($horas[0] * 60) + ($horas[1]);
                                        $totalhoras[$index] = $minutos;
                                    } else {
                                        $horas = explode(':',
                                            $hrs[0]['sum'] . ':00');
                                        $minutos = $totalhoras[$index] +
                                            ($horas[0] * 60) + ($horas[1]);
                                        $totalhoras[$index] = $minutos;
                                    }
                                }
                            }
                        }
                    }
                    $APA[$ind]['idcausa'] = $valor['idcausa'];
                }
            }
        }
        $total = array();
        foreach ($totalhoras as $key => $value) {
            $implode[0] = (int)($value / 60);
            $implode[1] = $value % 60;
            if ($implode[1] > 30) {
                $implode[0] = $implode[0] + 1;
            }
            $total[$key] = $implode[0];
        }
        $rep = new DatIndicadorModel();
        $indicadores = $rep->getIndicadoresReporte($idreporte)->data;
        foreach ($indicadores as $value) {
            $arrindicadores = array();
            if ($value['formula'] == 1) {
                if ($value['idexpresionmatematica']) {
                    $arrindicadores =
                        ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($value['idexpresionmatematica']);
                }
                array_push($idsF, ['idindicador' => $value['idindicador'],
                    'denominacion' => $value['denominacion'],
                    'ids' => $arrindicadores,
                    'orden' => $value['orden'],
                    'unidadmedida' => $value['unidadmedida'],
                    'idexpresionmatematica' => $value['idexpresionmatematica']]);
            } else if ($value['formula'] == 2) {
                array_push($ids, ['idindicador' => $value['idindicador'],
                    'denominacion' => $value['denominacion'],
                    'orden' => $value['orden']]);
            }
        }


        foreach ($total as $key => $valueA) {
            foreach ($ids as $value) {
                if ($key == $value['idindicador']) {
                    $array1[$value['orden']] =
                        ['idindicador' => $value['idindicador'],
                            'denominacion' => $value['denominacion'],
                            'valor' => $valueA];
                } else {
                    if (empty($array1[$value['orden']])) {
                        $array1[$value['orden']] =
                            ['idindicador' => $value['idindicador'],
                                'denominacion' => $value['denominacion'],
                                'valor' => 0];
                    }
                }
            }
        }
        foreach ($idsF as $value) {
            $array2 = array();
            $array3 = array();
            if (count($value['ids']) > 0) {
                foreach ($total as $k => $valueB) {
                    foreach ($value['ids'] as $key => $val) {
                        if ($k == $val) {
                            if ($array2[$key]) {
                                $horas = explode(':', $valueB);
                                $minutos = $array2[$key]['valor'] + $valueB;
                                $array2[$key] = ['idindicador' => $val,
                                    'valor' => $minutos];

                            } else {
                                $horas = explode(':', $valueB);
                                $minutos = $valueB;
                                $array2[$key] = ['idindicador' => $val,
                                    'valor' => $minutos];
                            }
                        } else {
                            if ($val == 'F3') {

                                $array2[$key] = ['idindicador' => $val,
                                    'valor' => count($APA)];
                            } else if ($val == 'F4') {
                                $hrsTrabajoMes =
                                    $calendario->HrsByDateRange($finicio, $ffin,
                                        3);
                                $minutos = ($hrsTrabajoMes[0]['sum']);
                                $array2[$key] = ['idindicador' => $val,
                                    'valor' => $minutos];
                            } else {
                                $horas = explode(':', '00:00');
                                $minutos =
                                    $array2[$key]['valor'] + ($horas[0] * 60) +
                                    ($horas[1]);
                                $array2[$key] = ['idindicador' => $val,
                                    'valor' => $minutos];
                            }
                        }
                    }
                }
                $a = ksort($array2);
                array_push($array3, ['unidadmedida' => $value['unidadmedida'],
                    'idexpresionmatematica' => $value['idexpresionmatematica'],
                    'denominacion' => $value['denominacion'],
                    'idsformula' => $array2]);
                $array1[$value['orden']] = $array3;
            } else {
                if ($value['idindicador'] == 3) {
                    $array1[$value['orden']] =
                        ['idindicador' => $value['idindicador'],
                            'unidadmedida' => $value['unidadmedida'],
                            'denominacion' => $value['denominacion'],
                            'valor' => count($APA)];
                } else if ($value['idindicador'] == 4) {
                    $hrsTrabajoMes =
                        $calendario->HrsByDateRange($finicio, $ffin, 3);
                    $array1[$value['orden']] =
                        ['idindicador' => $value['idindicador'],
                            'unidadmedida' => $value['unidadmedida'],
                            'denominacion' => $value['denominacion'],
                            'valor' => $hrsTrabajoMes[0]['sum']];
                }
            }
        }
        $resultado = array();
        foreach ($array1 as $key => $value) {
            if (!(is_array($value[0]))) {
                $resultado[$key]['orden'] = $key;
                $resultado[$key]['datos'] = $value['valor'];
                $resultado[$key]['unidadmedida'] = $value['unidadmedida'];
                $resultado[$key]['denominacion'] = $value['denominacion'];
            } else {
                foreach ($value as $key1 => $val) {
                    if ($val['idsformula']) {
                        $formulaeval =
                            ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($val['idexpresionmatematica'],
                                $val['idsformula']);
                        $resultado[$key]['orden'] = $key;
                        $resultado[$key]['datos'] =
                            round($formulaeval->valor, 2);
                        $resultado[$key]['unidadmedida'] = $val['unidadmedida'];
                        $resultado[$key]['denominacion'] = $val['denominacion'];
                    }
                }
            }
        }
        return $resultado;
    }

    public
    function GetReporteEstadistico($idestructura, $idtipoestructura, $mes, $year, $limit, $start,
                                   $filtro, $idconcepto, $quincena, $analisis, $fdesde, $fhasta)
    {
        $personas = $this->GetReporte($idestructura, null, $mes, $year, null, null,
            $filtro, $idconcepto, $quincena, $analisis, $fdesde, $fhasta);
        $hijosEstructura = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructura);
        foreach ($hijosEstructura as $j => $estructura) {
            $Person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null,
                null, null, null, $estructura->id);
            $hijosEstructura[$j]->idestructura = $estructura->id;
            $hijosEstructura[$j]->entidad = $estructura->denominacion;
            $hijosEstructura[$j]->ft = 0;
            $hijosEstructura[$j]->trt = 0;
            $hijosEstructura[$j]->hp = 0;
            $hijosEstructura[$j]->he = 0;
            $hijosEstructura[$j]->hf = 0;
            $hijosEstructura[$j]->hft = 0;
            foreach ($Person->data as $i => $person) {
                foreach ($personas['data'] as $v => $per) {
                    if ($person['idpersona'] == $per['idpersona']) {
                        $hijosEstructura[$j]->ft += ($per['ft'] > 0) ? $per['ft'] : 0;
                        $hijosEstructura[$j]->trt += ($per['trt'] > 0) ? $per['trt'] : 0;
                        $hijosEstructura[$j]->hp += ($per['hp'] > 0) ? $per['hp'] : 0;
                        $hijosEstructura[$j]->he += ($per['he'] > 0) ? $per['he'] : 0;
                        $hijosEstructura[$j]->hf += ($per['hf'] > 0) ? $per['hf'] : 0;
                        $hijosEstructura[$j]->hft += ($per['hft'] > 0) ? $per['hft'] : 0;
                        break;
                    }
                }
            }
        }
        return $hijosEstructura;
    }

    function GetResumenAusentismo($idestructura, $finicio, $ffin)
    {
        $calendario = new ConfCalendariopersona();
        $datAsistencia = new DatAsistencia();
        $hijosEstructura = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructura);

        $fini = explode('/', $finicio);
        $mes = $fini[1];
        $year = $fini[0];

        $reporte = array();
        $totales = array();
        $promhombresdianotrab = array();
        $porccausalesxcanthrsnotrab = array();
        $tmponolabmes = 0;
        $canthrslabmes = 0;
        $totales['ttotaltrabajadores'] = 0;
        $totales['tfondotiempocalendario'] = 0;
        $totales['ttiemponolaborable'] = 0;
        $totales['tvacaciones'] = 0;
        $totales['ttiemponotrabporalta'] = 0;
        $totales['ttiemponotrabporbaja'] = 0;
        $totales['ttiemponotrabporbaja'] = 0;
        $totales['tlicenciamaternidad'] = 0;
        $totales['tprestacionsocial'] = 0;
        $totales['tlicsinsueldxleymatern'] = 0;
        $totales['tautorizlegalesvigentes'] = 0;
        $totales['tinterrupcionesdiascomletos'] = 0;
        $totales['taccidentetrabajo'] = 0;
        $totales['taccidentetrayecto'] = 0;
        $totales['tenfermedad'] = 0;
        $totales['tautorizadministrativas'] = 0;
        $totales['tausenciajustif'] = 0;
        $totales['taccidentetrabytray'] = 0;
        $totales['tfdotiempomaxutilizable'] = 0;
        $totales['tfdotiemponoutilizado'] = 0;
        $totales['tlicenciaamparoleymatern'] = 0;
        $totales['tfondotiempoutilizado'] = 0;
        $totales['tIndiceutilizfdotpo'] = 0;
        $totales['tindiceausencia'] = 0;
        $totales['tindiceausentismo'] = 0;
        $totales['thombresxdiastrabajado'] = 0;
        $totales['tporcientoausentismototal'] = 0;
        $grupopredeterminado = NomGrupodescanso::getGrupoPredeterminado();
        if(!empty($grupopredeterminado))
            $cal = ConfCalendario::CalendarioByDateRangeandGrupo($finicio,$ffin,$grupopredeterminado[0]['idgrupodescanso']);
        foreach ($cal as $j => $c) {
            if($c['trabajo'] == 1){
                $canthrslabmes += $c['horas'];
            }else if($c['trabajo'] == 0){
                $tmponolabmes += 8;
            }
        }
        $i = 0;
        foreach ($hijosEstructura as $key => $value) {
            $reporte[$i]['organo'] = $value->text;
            $datetime1 = date_create($finicio);
            $datetime2 = date_create($ffin);
            $intervalo = date_diff($datetime1, $datetime2);
            $cantDiasMes = $intervalo->days + 1;

            // Dias naturales del mes
            $reporte[$i]['diasnaturales'] = $cantDiasMes;
            $totales['tdiasnaturales'] = $cantDiasMes;
            $idscargos = array();
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($value->id, $iddominio, true);
           if(!empty($cargos)){
               foreach ($cargos as $p => $c) {
                   array_push($idscargos, $c['id']);
               }
               $idspersona = array();
               $grupos = array();
               $objDatos = $datAsistencia->GetDatosPersonaReporte($idscargos, null, null, 0, $finicio, $ffin);
               foreach ($objDatos as $p => $dat) {
                   if (!empty($dat['idgrupodescanso'])) {
                       array_push($idspersona, $dat['idpersona']);
                       array_push($grupos, $dat['idgrupodescanso']);
                   }
                   $horas = $calendario->getHrsCalendarioPersona($finicio, $ffin, $dat['idpersona'], $dat['idcargo']);
                   $reporte[$i]['fondotiempocalendario'] += $horas[0]['sum'];
                   $horasnolab = $calendario->getHorasNoLabCalendarioPersona($finicio, $ffin, $dat['idpersona']);
                   $reporte[$i]['tiemponolaborable'] += $horasnolab;
               }

               //Total de trabajadores
               $totaltrab = DatAsistenciamensual::GetTotalTrabajadoresByPeriodo($idscargos, $finicio, $ffin);
               $reporte[$i]['totaltrabajadores'] = $totaltrab[0]['cantidad'];
               $totales['ttotaltrabajadores'] += $reporte[$i]['totaltrabajadores'];

               $idscausa = array();
               $causasbyconcept = array();
               $horasdiascausas = array();
               $causas = ConfResumenausentismocausas::getCausasByConcepto(array(1,2,3,4,5,6,7,8,9,10,11,12,13));
               foreach ($causas as $causa){
                   array_push($idscausa,$causa['idcausa']);
                   $causasbyconcept[$causa['idconcepto']][] = $causa['idcausa'];
               }
               $cantdiashorascausas = $this->getdata($objDatos,$idscausa, $idspersona, $grupos, $finicio, $ffin);

               foreach ($causasbyconcept as $j => $causas){
                   foreach ($causas as $c){
                       $horasdiascausas[(int)$j]['dias'] += $cantdiashorascausas[$c]['dias'];
                       $horasdiascausas[(int)$j]['horas'] += $cantdiashorascausas[$c]['horas'];
                   }
               }
               /*Vacaciones idconcepto = 1*/
               $reporte[$i]['vacaciones'] = $horasdiascausas[1]['horas'];
               $totales['tvacaciones'] = $horasdiascausas[1]['horas'];

               //Tiempo no trabajado por alta idconcepto = 2
               $reporte[$i]['tiemponotrabporalta'] = $horasdiascausas[2]['horas'];
               $totales['ttiemponotrabporalta'] = $horasdiascausas[2]['horas'];


               //Tiempo no trabajado por baja idconcepto = 3
               $reporte[$i]['tiemponotrabporbaja'] = $horasdiascausas[3]['horas'];
               $totales['ttiemponotrabporbaja'] = $horasdiascausas[3]['horas'];


               //Licencia de maternidad idconcepto = 4
               $reporte[$i]['licenciamaternidad'] = $horasdiascausas[4]['horas'];
               $totales['tlicenciamaternidad'] = $horasdiascausas[4]['horas'];


               //Prestacion social idconcepto = 5
               $reporte[$i]['prestacionsocial'] = $horasdiascausas[5]['horas'];
               $totales['tprestacionsocial'] = $horasdiascausas[5]['horas'];


               //Licencia sin sueldo por ley maternidad idconcepto = 6
               $reporte[$i]['licsinsueldxleymatern'] = $horasdiascausas[6]['horas'];
               $totales['tlicsinsueldxleymatern'] = $horasdiascausas[6]['horas'];

               //Autorizaciones legales vigentes idconcepto = 7
               $reporte[$i]['autorizlegalesvigentes'] = $horasdiascausas[7]['horas'];
               $totales['tautorizlegalesvigentes'] = $horasdiascausas[7]['horas'];

               //Interrupciones de dias completos idconcepto = 8
               $reporte[$i]['interrupcionesdiascomletos'] = $horasdiascausas[8]['horas'];
               $totales['tinterrupcionesdiascomletos'] = $horasdiascausas[8]['horas'];

               //Accidente de trabajo idconcepto = 9
               $reporte[$i]['accidentetrabajo'] = $horasdiascausas[9]['horas'];
               $totales['taccidentetrabajo'] = $horasdiascausas[9]['horas'];

               //Accidente de trayecto idconcepto = 10
               $reporte[$i]['accidentetrayecto'] = $horasdiascausas[10]['horas'];
               $totales['taccidentetrayecto'] = $horasdiascausas[10]['horas'];

               //Enfermedad(Certificado medico) idconcepto = 11
               $reporte[$i]['enfermedad'] = $horasdiascausas[11]['horas'];
               $totales['tenfermedad'] = $horasdiascausas[11]['horas'];

               //Autorizacones administrativas idconcepto = 12
               $reporte[$i]['autorizadministrativas'] = $horasdiascausas[12]['horas'];
               $totales['tautorizadministrativas'] = $horasdiascausas[12]['horas'];

               //Ausencias justificadas idconcepto = 13
               $reporte[$i]['ausenciajustif'] = $horasdiascausas[13]['horas'];
               $totales['tausenciajustif'] = $horasdiascausas[13]['horas'];



               $totales['tfondotiempocalendario'] += $reporte[$i]['fondotiempocalendario'];
               $totales['ttiemponolaborable'] += $reporte[$i]['tiemponolaborable'];

               $reporte[$i]['accidentetrabytray'] = $reporte[$i]['accidentetrabajo'] + $reporte[$i]['accidentetrayecto'];
               $totales['taccidentetrabytray'] += $reporte[$i]['accidentetrabytray'];

               $reporte[$i]['fdotiempomaxutilizable'] = $reporte[$i]['fondotiempocalendario'] - $reporte[$i]['tiemponolaborable'] - $reporte[$i]['vacaciones'] - $reporte[$i]['tiemponotrabporalta'] - $reporte[$i]['tiemponotrabporbaja'];
               $totales['tfdotiempomaxutilizable'] += $reporte[$i]['fdotiempomaxutilizable'];

               $reporte[$i]['fdotiemponoutilizado'] = $reporte[$i]['autorizlegalesvigentes'] + $reporte[$i]['interrupcionesdiascomletos'] + $reporte[$i]['accidentetrabytray'] + $reporte[$i]['enfermedad'] + $reporte[$i]['autorizadministrativas'] + $reporte[$i]['ausenciajustif'];
               $totales['tfdotiemponoutilizado'] += $reporte[$i]['fdotiemponoutilizado'];

               $reporte[$i]['licenciaamparoleymatern'] = $reporte[$i]['licenciamaternidad'] + $reporte[$i]['prestacionsocial'] + $reporte[$i]['licsinsueldxleymatern'];
               $totales['tlicenciaamparoleymatern'] += $reporte[$i]['licenciaamparoleymatern'];

               $reporte[$i]['fondotiempoutilizado'] = $reporte[$i]['fdotiempomaxutilizable'] - $reporte[$i]['fdotiemponoutilizado'];
               $totales['tfondotiempoutilizado'] += $reporte[$i]['fondotiempoutilizado'];

               $reporte[$i]['Indiceutilizfdotpo'] = round($reporte[$i]['fondotiempoutilizado'] / $reporte[$i]['fdotiempomaxutilizable'] * 100, 1);
               $totales['tIndiceutilizfdotpo'] += $reporte[$i]['Indiceutilizfdotpo'];

               $reporte[$i]['indiceausencia'] = round($reporte[$i]['fdotiemponoutilizado'] / $reporte[$i]['fdotiempomaxutilizable'] * 100, 1);
               $totales['tindiceausencia'] += $reporte[$i]['indiceausencia'];

               $reporte[$i]['indiceausentismo'] = round(((($reporte[$i]['enfermedad'] + $reporte[$i]['autorizadministrativas'] + $reporte[$i]['ausenciajustif']) / $reporte[$i]['fdotiempomaxutilizable']) * 100), 2);;
               $totales['tindiceausentismo'] += $reporte[$i]['indiceausentismo'];

               $reporte[$i]['hombresxdiastrabajado'] = round($reporte[$i]['fondotiempoutilizado'] / 192, 0);
               $totales['thombresxdiastrabajado'] += $reporte[$i]['hombresxdiastrabajado'];

               $reporte[$i]['porcientoausentismototal'] = round((($reporte[$i]['fdotiemponoutilizado'] - $reporte[$i]['interrupcionesdiascomletos']) * 100) / $reporte[$i]['fdotiempomaxutilizable'], 1);
               $totales['tporcientoausentismototal'] += $reporte[$i]['porcientoausentismototal'];
           }


            $i++;
        }

        $promhombresdianotrab[0] = round(($totales['tfdotiemponoutilizado'] / $canthrslabmes), 0);
        $promhombresdianotrab[1] = round(($totales['tlicenciaamparoleymatern'] / $canthrslabmes), 0);
        $promhombresdianotrab[2] = round(($totales['tlicenciamaternidad'] / $canthrslabmes), 0);
        $promhombresdianotrab[3] = round(($totales['tprestacionsocial'] / $canthrslabmes), 0);
        $promhombresdianotrab[4] = round(($totales['tlicsinsueldxleymatern'] / $canthrslabmes), 0);
        $promhombresdianotrab[5] = round(($totales['tautorizlegalesvigentes'] / $canthrslabmes), 0);
        $promhombresdianotrab[6] = round(($totales['tinterrupcionesdiascomletos'] / $canthrslabmes), 0);
        $promhombresdianotrab[7] = round(($totales['taccidentetrabytray'] / $canthrslabmes), 0);
        $promhombresdianotrab[8] = round(($totales['taccidentetrabajo'] / $canthrslabmes), 0);
        $promhombresdianotrab[9] = round(($totales['taccidentetrayecto'] / $canthrslabmes), 0);
        $promhombresdianotrab[10] = round(($totales['tenfermedad'] / $canthrslabmes), 0);
        $promhombresdianotrab[11] = round(($totales['tautorizadministrativas'] / $canthrslabmes), 0);
        $promhombresdianotrab[12] = round(($totales['tausenciajustif'] / $canthrslabmes), 0);

        $porccausalesxcanthrsnotrab[0] = round(($totales['tlicenciaamparoleymatern'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[1] = round(($totales['tlicenciamaternidad'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[2] = round(($totales['tprestacionsocial'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[3] = round(($totales['tlicsinsueldxleymatern'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[4] = round(($totales['tautorizlegalesvigentes'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[5] = round(($totales['tinterrupcionesdiascomletos'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[6] = round(($totales['taccidentetrabytray'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[7] = round(($totales['taccidentetrabajo'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[8] = round(($totales['taccidentetrayecto'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[9] = round(($totales['tenfermedad'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[10] = round(($totales['tautorizadministrativas'] * 100) / $totales['tfdotiemponoutilizado'], 1);
        $porccausalesxcanthrsnotrab[11] = round(($totales['tausenciajustif'] * 100) / $totales['tfdotiemponoutilizado'], 1);

        $result['reporte'] = $reporte;
        $result['totales'] = $totales;
        $result['promhombresdianotrab'] = $promhombresdianotrab;
        $result['porccausalesxcanthrsnotrab'] = $porccausalesxcanthrsnotrab;
        $result['tmponolabmes'] = $tmponolabmes;
        $result['canthrslabmes'] = $canthrslabmes;
        $result['mes'] = $mes;
        $result['year'] = $year;
        //print_r('<pre>');print_r($result);die;
        return $result;
    }

    function getdata($reporte,$idscausa, $idspersona, $grupos, $fdesde, $fhasta){
        $result = array();
        if (count($idscausa) > 0 && count($idspersona) > 0 && count($grupos) > 0 && $fdesde && $fhasta)
            $asistenciaAPA = DatAsistencia::getAsistenciabyCausa($idscausa, $idspersona, $grupos, $fdesde, $fhasta, array(3, 1, 13, 8));
        foreach ($reporte as $ind => $persona) {
            foreach ($asistenciaAPA[$persona['idpersona']] as $key => $valor) {
                if ($valor['tiempo'] != '00:00:00') {
                    $horasdesc = explode(':', $valor['tiempo']);
                    if ($valor['tiempo'] == '00:00:00')
                        $horas1 = '';
                    else {
                        if ($horasdesc[1] >= 30)
                            $timecausa = $horasdesc[0] + 1;
                        else
                            $timecausa = $horasdesc[0];
                        $horas1 = intval($timecausa);
                    }
                    $result[$valor['idcausa']]['horas'] += (!empty($horas1)) ? $horas1 : 0;
                    $result[$valor['idcausa']]['dias'] += (!empty($valor['contdias'])) ? $valor['contdias'] : 0;
                }
            }
        }
        return $result;
    }

    function GetDatosExportarExcel($asistencia, $trtMilitares)
    {
        $objPHPExcel = new PHPExcel();

        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Resumen de asistencia');

        $objPHPExcel->getActiveSheet()->getColumnDimension("A")->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension("B")->setWidth(35);
        $objPHPExcel->getActiveSheet()->getColumnDimension("C")->setWidth(40);

        $objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

        $rcampos = array('CI', 'Nombre y apellidos', 'Cargo');
        $columnas = $asistencia['columnas'];
        foreach ($columnas as $key => $col) {
            $rcampos[] = $col;
        }
        $rcampos = array_merge($rcampos, array(
            'FT',
            'TRT',
            'HP',
            'HE',
            'DIASLAB',
            'DIASTRAB',
            'HF',
            'HFT',
            'HTE',
            'HRL'));
//        $rcampos = array_merge($rcampos, array(
//            'Fondo de tiempo',
//            'Tiempo real trabajado',
//            'Horas perdidas',
//            'Horas extras',
//            'Días laborales',
//            'Días trabajados',
//            'Horas feriadas',
//            'Horas feriadas trabajadas',
//            'Horas de trabajo extraordinario',
//            'Horas de receso laboral'));

        //nuevo
        if ($trtMilitares) {
            array_push($rcampos, 'DTM');
        }
        //fin nuevo

        $letraactual = '';
        foreach ($rcampos as $ind => $campo) {
            $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual . '1', $campo);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
        }
        //Pintar fondo de encabezado
        $this->fnPintarFondo($objPHPExcel, 'A1:' . $letraactual . '1', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');

        foreach ($asistencia['data'] as $key => $value) {
            $rdatos = array();
            if (!empty($value['ft'])) {
                list($h, $m) = explode(':', $value['ft']);
            } else {
                $h = 0;
            }
            if (!empty($value['trt'])) {
                list($h1, $m1) = explode(':', $value['trt']);
            } else {
                $h1 = 0;
            }
            if (!empty($value['hp'])) {
                list($h2, $m2) = explode(':', $value['hp']);
            } else {
                $h2 = 0;
            }
            if (!empty($value['he'])) {
                list($h3, $m3) = explode(':', $value['he']);
            } else {
                $h3 = 0;
            }
            if (!empty($value['diaslab'])) {
                list($h8, $m8) = explode(':', $value['diaslab']);
            } else {
                $h8 = 0;
            }
            if (!empty($value['diastrab'])) {
                list($h9, $m9) = explode(':', $value['diastrab']);
            } else {
                $h9 = 0;
            }
            if (!empty($value['hf'])) {
                list($h4, $m4) = explode(':', $value['hf']);
            } else {
                $h4 = 0;
            }
            if (!empty($value['hft'])) {
                list($h5, $m5) = explode(':', $value['hft']);
            } else {
                $h5 = 0;
            }
            if (!empty($value['hte'])) {
                list($h6, $m6) = explode(':', $value['hte']);
            } else {
                $h6 = 0;
            }
            if (!empty($value['hrl'])) {
                list($h7, $m7) = explode(':', $value['hrl']);
            } else {
                $h7 = 0;
            }
//            if (!empty($value['diastrabmilit'])) {
//                list($h10, $m10) = explode(':', $value['diastrabmilit']);
//            } else {
//                $h10 = 0;
//            }
            //Arreglo de datos de la persona en cuestion
            $rdatos = array($value['numid'], $value['nombreapellidos'], $value['denomcargo']);
            foreach ($columnas as $ind => $col) {
                $rdatos[] = ($value[$col]) ? $value[$col] : '';
            }
            $rdatos = array_merge($rdatos, array($h, $h1, $h2, $h3, $h8, $h9, $h4, $h5, $h6, $h7/*, $h10*/));

            //nuevo
            if ($trtMilitares) {
                $diasmilitares = 0;
                if (!empty($value['diastrabmilit'])) {
                    $diasmilitares = $value['diastrabmilit'];
                }
                array_push($rdatos, $diasmilitares);
            }
            //fin nuevo

            foreach ($rdatos as $ind => $datospersona) {
                $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
                $objPHPExcel->getActiveSheet()->setCellValue($letraactual . intval($key + 2), $datospersona);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($objPHPExcel, $letraactual . intval($key + 2) . '', 'left', 'center', 0);
            }
        }

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Resumen de asistencia.xls" ');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        ini_restore("max_execution_time");
        ini_restore("max_input_time");
        ini_restore("memory_limit");
    }

    function GetDatosExportarExcelAPA($idestructura, $fdesde, $fhasta, $limit, $start, $filtro, $trtMilitares)
    {
        $objPHPExcel = new PHPExcel();
        $asistencia = $this->GetAPA($idestructura, $fdesde, $fhasta, null, 0, $filtro);

        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Resumen por Causa');

        $objPHPExcel->getActiveSheet()->getColumnDimension("A")->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension("B")->setWidth(35);
        $objPHPExcel->getActiveSheet()->getColumnDimension("C")->setWidth(40);

        $objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

        $rcampos = array('CI', 'Nombre y apellidos', 'Cargo');
        $causas = $asistencia['headerlimpios']['causas'];
        foreach ($causas as $key => $causa) {
            $rcampos[] = $causa['denom'];
        }
        $rcampos = array_merge($rcampos, array(
            'TOTAL',
            'SIN CAUSA',
            'FT',
            'TRT',
            'HP',
            'HE',
            'DIASLAB',
            'DIASTRAB',
            'HF',
            'HFT',
            'HTE',
            'HRL'));
//        $rcampos = array_merge($rcampos, array(
//            'Sin Causa',
//            'Fondo de tiempo',
//            'Tiempo real trabajado',
//            'Horas perdidas',
//            'Horas extras',
//            'Días laborales',
//            'Días trabajados',
//            'Horas feriadas',
//            'Horas feriadas trabajadas',
//            'Horas de trabajo extraordinario',
//            'Horas de receso laboral'));
        //nuevo
        if ($trtMilitares) {
            array_push($rcampos, 'HPM');
        }
        //fin nuevo

        $letraactual = '';
        foreach ($rcampos as $ind => $campo) {
            $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual . '1', $campo);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
        }
        //Pintar fondo de encabezado
        $this->fnPintarFondo($objPHPExcel, 'A1:' . $letraactual . '1', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');

        foreach ($asistencia['apa'] as $key => $value) {
            $rdatos = array();
            if (!empty($value['total'])) {
                list($h12, $m12) = explode(':', $value['total']);
            } else {
                $h12 = 0;
            }
            if (!empty($value['sc'])) {
                list($h11, $m11) = explode(':', $value['sc']);
            } else {
                $h11 = 0;
            }
            if (!empty($value['ft'])) {
                list($h, $m) = explode(':', $value['ft']);
            } else {
                $h = 0;
            }
            if (!empty($value['trt'])) {
                list($h1, $m1) = explode(':', $value['trt']);
            } else {
                $h1 = 0;
            }
            if (!empty($value['hp'])) {
                list($h2, $m2) = explode(':', $value['hp']);
            } else {
                $h2 = 0;
            }
            if (!empty($value['he'])) {
                list($h3, $m3) = explode(':', $value['he']);
            } else {
                $h3 = 0;
            }
            if (!empty($value['diaslab'])) {
                list($h8, $m8) = explode(':', $value['diaslab']);
            } else {
                $h8 = 0;
            }
            if (!empty($value['diastrab'])) {
                list($h9, $m9) = explode(':', $value['diastrab']);
            } else {
                $h9 = 0;
            }
            if (!empty($value['hf'])) {
                list($h4, $m4) = explode(':', $value['hf']);
            } else {
                $h4 = 0;
            }
            if (!empty($value['hft'])) {
                list($h5, $m5) = explode(':', $value['hft']);
            } else {
                $h5 = 0;
            }
            if (!empty($value['hte'])) {
                list($h6, $m6) = explode(':', $value['hte']);
            } else {
                $h6 = 0;
            }
            if (!empty($value['hrl'])) {
                list($h7, $m7) = explode(':', $value['hrl']);
            } else {
                $h7 = 0;
            }
//            if (!empty($value['diastrabmilit'])) {
//                list($h10, $m10) = explode(':', $value['diastrabmilit']);
//            } else {
//                $h10 = 0;
//            }

            //Arreglo de datos de la persona en cuestion
            $rdatos = array($value['numid'], $value['nombreapellidos'], $value['denomcargo']);
            foreach ($causas as $ind => $causa) {
                $rdatos[] = ($value[$causa['dataindex'] . '_horas']) ? $value[$causa['dataindex'] . '_horas'] : '';
            }
            $rdatos = array_merge($rdatos, array($h12, $h11, $h, $h1, $h2, $h3, $h8, $h9, $h4, $h5, $h6, $h7/*, $h10*/));

            //nuevo
            if ($trtMilitares) {
                $diasmilitares = 0;
                if (!empty($value['diastrabmilit'])) {
                    $diasmilitares = $value['diastrabmilit'];
                }
                array_push($rdatos, $diasmilitares);
            }
            //fin nuevo

            foreach ($rdatos as $ind => $datospersona) {
                $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
                $objPHPExcel->getActiveSheet()->setCellValue($letraactual . intval($key + 2), $datospersona);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($objPHPExcel, $letraactual . intval($key + 2) . '', 'left', 'center', 0);
            }
        }

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Historico.xls" ');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        ini_restore("max_execution_time");
        ini_restore("max_input_time");
        ini_restore("memory_limit");
    }

    public
    function fnPintarFondo(&$objPHPExcel, $celda, $tipofondo, $color)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFill()->applyFromArray(array(
            'type' => $tipofondo,
            'startcolor' => array(
                'rgb' => $color
            )
        ));
    }

    public
    function fnPintarBordes(&$objPHPExcel, $celda, $lado, $tipoborde)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()->applyFromArray(
            array(
                $lado => array(
                    'style' => $tipoborde,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
    }

    /** Funcionalidad para alinear los textos de las celdas
     */
    public
    function fnAlinearTexto(&$objPHPExcel, $celda, $hor, $ver, $rot)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getAlignment()->applyFromArray(
            array(
                'horizontal' => $hor,
                'vertical' => $ver,
                'rotation' => $rot, //0 ó 90
                'wrap' => TRUE
            )
        );
    }

    /** Funcionalidad para dar la fuente a los textos
     */
    public
    function fnFuenteTexto(&$objPHPExcel, $celda, $name, $size)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()->applyFromArray(
            array(
                'name' => $name,
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => $size,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
    }

    /** Funcionalidad para el formato numérico
     */
    public
    function fnFormatoNumeros(&$objPHPExcel, $celda)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getNumberFormat()->applyFromArray(
            array(
                'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
            )
        );
    }

    public
    function fnFechaHora()
    {
        //Cambiando la zona horaria
        date_default_timezone_set('America/Havana');
        //Capturando la fecha y hora
        $fecha = date('d/m/Y');
        $hora = date('h:i:s A');
        $arraydate['fecha'] = $fecha;
        $arraydate['hora'] = $hora;
        return $arraydate;
    }

    public function getlistadoCausas($idconcepto)
    {
        $result = NomCausa::GetLeafs();
        $causasbyconcepto = ConfConceptocausasFT::existe(null, $idconcepto);
        if (!empty($causasbyconcepto)) {
            foreach ($result as $key => $causa) {
                foreach ($causasbyconcepto as $k => $causabyconc) {
                    if ($causa['idcausa'] == $causabyconc['idcausa'] && $idconcepto != -1) {
                        $result[$key]['check'] = 1;
                        break;
                    } else
                        $result[$key]['check'] = 0;
                }
            }
        }
        return $result;
    }

    public function addConceptocausas($idscausas,$idconcepto)
    {
        ConfConceptocausasFT::DelConceptoCausa($idconcepto);
        foreach ($idscausas as $v) {
            $obj = new ConfConceptocausasFT();
            $obj->idcausa = $v;
            $obj->idconcepto = $idconcepto;
            $obj->save();
        }
        return true;
    }

    public function existecausa($idcausa, $causas)
    {
        foreach ($causas as $k => $per) {
            if ($per['idcausa'] == $idcausa)
                return $per;
        }

    }

    function horaADecimal($horaString) {
        $partes = explode(':', $horaString);

        if (count($partes) !== 3) {
            return 0; // O lanzar una excepción según tu necesidad
        }
        
        list($horas, $minutos, $segundos) = array_map('intval', $partes);
        
        $decimal = $horas + ($minutos / 60) + ($segundos / 3600);
        
        return $decimal;
    }
}
