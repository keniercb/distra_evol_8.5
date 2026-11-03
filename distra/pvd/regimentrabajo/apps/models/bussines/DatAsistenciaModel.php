<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPMailer_v5.1/class.phpmailer.php');
include_once($dir_www . '/pvd/comun/recursos/PHPMailer_v5.1/class.smtp.php');

include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class DatAsistenciaModel extends ZendExt_Model
{
    protected $DatAsistencia;
    protected $ConfCalendario;

    function __construct()
    {
        $this->DatAsistencia = new DatAsistencia();
        $this->ConfCalendario = new ConfCalendario();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
        $this->DatAsistencia = new DatAsistencia();
    }

    public function existeAsistenciaPeriodo($idasistencia, $idpersonas, $fdesde, $fhasta)
    {
        $DatAsistencia = new DatAsistencia();
        $personassindiascausa = array();
        $asistencia = Doctrine::getTable('DatAsistencia')->findByDql('idasistencia in (' . implode(',',
                $idasistencia) . ')');
        foreach ($idasistencia as $ind => $idasistence) {
            if (!empty($fdesde[$ind]) && !empty($fhasta[$ind])) {
                $asistenciarango = $DatAsistencia->SelectIncidenciasPeriodo($idpersonas[$ind], $fdesde[$ind], $fhasta[$ind]);
            }
        }
        foreach ($asistenciarango as $k => $value) {
            if (!empty($value['causa']) && !empty($value['fdesde']) && !empty($value['fhasta'])) {
                array_push(
                    $personassindiascausa, '<li>' . $value['nombreapellidos'] . ' => ' . $value['causa'] . ' => ' . $value['fdesde'] . ' - ' . $value['fhasta'] . '</li>'
                );
            }
        }
        return $personassindiascausa;
    }

    public function Insertar($idasistencia, $idpersonas, $fechahoraentrada, $fechahorasalida, $hrsdescontadas, $idcausa, $fdesde, $fhasta, $fecharegistro, $observacion, $useIdpersonas, $fechaentrada, $fechasalida, $istempus = false, $certificadocontinuado = 0)
    {
        $personasConRegistros = array();
        $fecha = explode('/', $fecharegistro);
        $controlHrsDescontadas = false;

        $configRegimen = new ConfCalendarioModel();
        $asistencia = Doctrine::getTable('DatAsistencia')->findByDql('idasistencia in (' . implode(',',
                $idasistencia) . ')');
        $model = new DatEstructuraasistenciaModel();
        if ($useIdpersonas) {
            $personas = $idpersonas;
        } else {
            $personas = ZendExt_IoC_Inter::getInstance()->maestro->getControledByDominioEstructuraPersonaPluriempleo(
                2, $_SESSION['Zeolides']['entidad']->idestructura, $_SESSION['Zeolides']['perfil']['idpersona']
            );
        }
        $asist = $model->getPersonasByCargoPadre($fecharegistro, $personas,
            $_SESSION['Zeolides']['perfil']['idpersona'], 0);
        $arrPersonas = $asist['data'];

        //buscando si cada persona tiene incidencias de asistencia en el periodo en que se ponen las nuevas para eliminarlas.
        $datasistencia = new DatAsistencia();
        $confCalendarioPersona = new ConfCalendariopersona();
        $confCalendario = new ConfCalendario();
        $nomGrupodescanso = new NomGrupodescanso();
        foreach ($idasistencia as $ind => $idasistence) {
            if (!empty($fdesde[$ind]) && !empty($fhasta[$ind])) {
                $datasistencia->DeleteIncidenciasPeriodo($idpersonas[$ind], $fdesde[$ind], $fhasta[$ind]);
            }
            foreach ($asistencia as $key => $asis) {
                if ($idasistence == $asis->idasistencia) {
                    foreach ($arrPersonas as $k => $value) {
                        if ($value['idpersona'] == $asis->idpersona) {
                            //$turno = $this->DatAsistencia->getHorarioByPersona($asis->idpersona, $fecharegistro);
                            //En caso de que los dias de vacaciones solicitados sean mayores que los de nomina, recuperar el estado anterior de la asistencia
                            $tmphorasdescontadas = $asistencia[$key]->hrsdescontadas;
                            $tmphorastrabajadas = $asistencia[$key]->hrstrabajadas;
                            $tmphorasextras = $asistencia[$key]->horasextras;
                            $tmpfechahoraentrada = $asistencia[$key]->fechahoraentrada;
                            $tmpfechahorasalida = $asistencia[$key]->fechahorasalida;
                            $tmpfdesde = $asistencia[$key]->fdesde;
                            $tmpfhasta = $asistencia[$key]->fhasta;
                            $tmpidpersonacontrola = $asistencia[$key]->idpersonacontrola;
                            $tmpidpersonamodifica = $asistencia[$key]->idpersonamodifica;
                            $tmpobservacion = $asistencia[$key]->observacion;
                            $isvaccanset = true;
                            $tienediascausa = true;
                            $horasalidareal = null;
                            $horaentradareal = null;

                            $horasdesc = $asistencia[$key]->hrsdescontadas;
                            $horastrab = $asistencia[$key]->hrstrabajadas;

                            $horas = $confCalendarioPersona->getHorasCalendarioPersona($fecharegistro, $fecharegistro, $value['idpersona']);

                            $auxhoras = explode(':', $horas[0]['sum']);
                            $hrsDiariasFeriadas = $confCalendarioPersona->getHrsFeriadasPersona($fecharegistro, $fecharegistro, $value['idpersona']);
                            $auxhrsDiariasFeriadas = explode(':', $hrsDiariasFeriadas[0]['sum']);
                            $diaferiadohab = $this->GetDiaFeriadoHabilitado($value['idpersona'], $fecharegistro);
                            $dia = $confCalendarioPersona->getCalendarioPersona($fecharegistro, $fecharegistro, $value['idpersona']);
                            $nomCausa = new NomCausa();
                            $calendario = new ConfCalendario();
                            if (!empty($fdesde[$ind]) && !empty($fhasta[$ind])) {
                                $diasrango = $confCalendarioPersona->getCalendarioPersona($fdesde[$ind], $fhasta[$ind], $value['idpersona']);
                            }
                            if (!empty($idcausa[$ind])) {
                                $causa = $nomCausa->GetCausasById($idcausa[$ind]);
                            }

                            $horaentradareal = null;
                            if (!empty($fechahoraentrada[$ind])) {
                                $fechahora = explode(' ', $fechahoraentrada[$ind]);
                                if (count($fechahora) > 1)
                                    $horaentrada = explode(':', $fechahora[1]);
                                else
                                    $horaentrada = explode(':', $fechahoraentrada[$ind]);


                                if (!empty($fechaentrada[$ind]))
                                    $fentrada = explode('/', $fechaentrada[$ind]);
                                else
                                    $fentrada = $fecha;
                                $horaentradareal = new DateTime(date('Y-m-d H:i:s', mktime($horaentrada[0], $horaentrada[1], 0, $fentrada[1], $fentrada[0], $fentrada[2]))); //Construccion del DateTime de la hora inicial
                                $asistencia[$key]->fechahoraentrada = date('d/m/Y H:i:s', mktime($horaentrada[0], $horaentrada[1], 0, $fentrada[1], $fentrada[0], $fentrada[2]));
                            } else
                                $asistencia[$key]->fechahoraentrada = null;

                           
                            $f1 = explode('/', $fecharegistro);
                            $f2 = date_create($f1[2] . '-' . $f1[1] . '-' . $f1[0]);
                            $fregistroarr = $f1;

                            $fecharegistroOriginal['fecha'] = $fecharegistro;
                            $fecharegistroOriginal['cambio'] = false;

                            if (($dia[0]['trabajo'] == 1 || count($diaferiadohab) > 0) && $dia[0]['otrodia'] == 0) {
                                $fI = $fentrada;
                                $fF = $fentrada;
                            } else {
                                if (($dia[0]['trabajo'] == 1 || count($diaferiadohab) > 0) && $dia[0]['otrodia'] == 1) {
                                    $fechsalturno = date_add($f2, date_interval_create_from_date_string('1 day'));
                                    $FIT = explode('/', $f2->format('d/m/Y'));
                                    $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                                    $fechfinturno = $fechsalturno->format('d-m-Y');
                                    $fI = $f1;
                                    $fF = explode('-', $fechfinturno);
                                    $fregistroarr = $f1;
                                } else {
                                    $fechiniturno = date_add($f2, date_interval_create_from_date_string('-1 days'));
                                    $FIT = explode('/', $f2->format('d/m/Y'));
                                    $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                                    $dia1 = $confCalendarioPersona->getCalendarioPersona($fechiniturno->format('Y-m-d'), $fechiniturno->format('Y-m-d'), $value['idpersona']);
                                    if (($dia1[0]['trabajo'] == 1 || count($diaferiadohab) > 0) && $dia1[0]['otrodia'] == 1) {
                                        $fechinicioturno = $fechiniturno->format('d-m-Y');
                                        $fI = explode('-', $fechinicioturno);
                                        $fF = $f1;
                                        $fecharegistro = $fechiniturno->format('d/m/Y');
                                        $dia = $dia1;
                                        $fregistroarr = $fI;
                                        $fecharegistroOriginal['cambio'] = true;
                                    }
                                    // }

                                }
                            }

                            if (!$istempus) {
                                if ($asistencia[$key]->idpersonacontrola != NULL)
                                    $asistencia[$key]->idpersonamodifica = $_SESSION['Zeolides']['perfil']['idpersona'];
                                else
                                    $asistencia[$key]->idpersonacontrola = $_SESSION['Zeolides']['perfil']['idpersona'];
                            } else {
                                $asistencia[$key]->idpersonacontrola = $asis->idpersona;
                            }


                            $horatt = $this->DatAsistencia->getHorarioByPersona($asis->idpersona, $fecharegistro);
                            if (!empty($horatt)/* || $value['idtipodedia'] == 8*/) {
                                $hitt = explode(':', $horatt['horainicio']);
                                $hftt = explode(':', $horatt['horafin']);
                                $hdiftt = explode(':', $horatt['hlab']);
                                $TDesc = explode(':', $horatt['tdescanso']);

                                $horainitt = new DateTime(date('Y-m-d H:i:s', mktime($hitt[0], $hitt[1], 0, $fI[1], $fI[0], $fI[2]))); //Construccion del DateTime de la hora inicial
                                $horafintt = new DateTime(date('Y-m-d H:i:s', mktime($hftt[0], $hftt[1], 0, $fF[1], $fF[0], $fF[2]))); //Construccion del DateTime de la hora final

                                $horadiftt = new DateTime(date('H:i', mktime($hdiftt[0], $hdiftt[1], 0, 1, 1, 2000)));
                                $horasdifftt = date_diff($horafintt, $horainitt);
                                if ($horasdifftt->d > 0)
                                    $horastrabajot = $horasdifftt->d * 24 + $horasdifftt->h;
                                else
                                    $horastrabajot = $horasdifftt->h;

                                $te = explode(':', $horatt['toleranciaentrada']);
                                $horainittT = new DateTime(date('Y-m-d H:i', mktime($hitt[0], $hitt[1], 0, $fI[1], $fI[0], $fI[2])));
                                if (!empty($te[0])) {
                                    $HITEMP = $horainittT->add(new DateInterval("PT" . $te[0] . "H" . $te[1] . "M" . $te[2] . "S"));
                                }

                                if (!empty($horatt['toleranciaentrada']) && $horaentradareal >= $horainitt &&
                                    $horaentradareal <= $HITEMP
                                ) {
                                    $horaentradareal = $horainitt;
                                    $asistencia[$key]->fechahoraentrada = date('d/m/Y H:i:s', mktime($hitt[0], $hitt[1], 0, $fI[1], $fI[0], $fI[2]));
                                }

                                if (!empty($fechahorasalida[$ind])) {

                                    $fechahora = explode(' ', $fechahorasalida[$ind]);

                                    if (count($fechahora) > 1)
                                        $horasalida = explode(':', $fechahora[1]);
                                    else
                                        $horasalida = explode(':', $fechahorasalida[$ind]);

                                    if (!empty($fechasalida[$ind]))
                                        $fsalida = explode('/', $fechasalida[$ind]);
                                    else
                                        $fsalida = $fecha;

                                    $asistencia[$key]->fechahorasalida = date('d/m/Y H:i:s', mktime($horasalida[0], $horasalida[1], 0, $fsalida[1], $fsalida[0], $fsalida[2]));
                                    //$horasalidareal = date('d/m/Y H:i:s', mktime($horasalida[0], $horasalida[1], 0, $fsalida[1], $fsalida[0], $fsalida[2]));
                                    $horasalidareal = new DateTime(date('Y-m-d H:i:s', mktime($horasalida[0], $horasalida[1], 0, $fsalida[1], $fsalida[0], $fsalida[2]))); //Construccion del DateTime de la hora inicial
                                    $ts = explode(':', $horatt['toleranciasalida']);
                                    $horafinttT = new DateTime(date('Y-m-d H:i:s', mktime($hftt[0], $hftt[1], 0, $fF[1], $fF[0], $fF[2])));
                                    if (!empty($ts[0]))
                                        $HFTEMP = $horafinttT->sub(new DateInterval("PT" . $ts[0] . "H" . $ts[1] . "M" . $ts[2] . "S"));
                                    if (!empty($horatt['toleranciasalida']) && $horasalidareal >= $HFTEMP
                                        && $horasalidareal <= $horafintt
                                    ) {
                                        $horasalidareal = $horafintt;
                                        $asistencia[$key]->fechahorasalida = date('d/m/Y H:i:s', mktime($hftt[0], $hftt[1], 0, $fF[1], $fF[0], $fF[2]));
                                    }

                                    $fechahoracalc = explode(' ', $fechahoraentrada[$ind]);

                                    if (count($fechahoracalc) > 1)
                                        $timeentrada = explode(':', $fechahoracalc[1]);
                                    else
                                        $timeentrada = explode(':', $fechahoraentrada[$ind]);

                                    //////////////////////////////////////////////////////////////////////////////////////////////
                                    $horadesc = new DateTime(date('Y-m-d H:i', mktime($TDesc[0], $TDesc[1], $TDesc[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
                                    //$horaentradareal = new DateTime(date('Y-m-d H:i:s', mktime($horaentrada[0], $horaentrada[1], 0, $fentrada[1], $fentrada[0], $fentrada[2]))); //Construccion del DateTime de la hora inicial
                                    //$horasalidareal = new DateTime(date('Y-m-d H:i:s', mktime($horasalida[0], $horasalida[1], 0, $fsalida[1], $fsalida[0], $fsalida[2]))); //Construccion del DateTime de la hora final
                                    $diferenciainicial = date_diff($horainitt, $horaentradareal); //Funcion de Date para la diferencia de fechas y horas
                                    if ($horasalidareal >= $horainitt)
                                        $diferenciafinal = date_diff($horasalidareal, $horafintt); //Funcion de Date para la diferencia de fechas y horas
                                    else
                                        $diferenciafinal = date_diff($horainitt, $horafintt);


                                    if (!empty($horatt['tdescanso']) && $horatt['tdescanso'] != '00:00:00') {
                                        $Halmuerzo = explode(':', $horatt['horarioalmuerzo']);
                                        $horaalmuerzo = new DateTime(date('Y-m-d H:i', mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
                                        $horaalmuerzoplustdesc = new DateTime(date('Y-m-d H:i', mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));

                                        if ($horasalidareal <= $horaalmuerzo) {
                                            $diferenciafinal = date_diff(new DateTime(date('Y-m-d H:i', mktime($diferenciafinal->h, $diferenciafinal->i, $diferenciafinal->s, $fregistroarr[1], $fregistroarr[0], $fregistroarr[2]))), $horadesc);
                                        }

                                        $horaalmuerzoplustdesc = $horaalmuerzoplustdesc->add(new DateInterval("PT" . $TDesc[0] . "H" . $TDesc[1] . "M" . $TDesc[2] . "S"));

                                        if ($horaentradareal >= $horaalmuerzoplustdesc) {
                                            $diferenciainicial = date_diff(new DateTime(date('Y-m-d H:i', mktime($diferenciainicial->h, $diferenciainicial->i, $diferenciainicial->s, $fregistroarr[1], $fregistroarr[0], $fregistroarr[2]))), $horadesc);
                                        }
                                        if ($horaentradareal > $horaalmuerzo && $horaentradareal < $horaalmuerzoplustdesc) {
                                            $diferencia = date_diff($horaentradareal, $horaalmuerzo);
                                            $diferenciainicial = date_diff(new DateTime($diferenciainicial->h . ':' . $diferenciainicial->i . ':' . $diferenciainicial->s), new DateTime($diferencia->h . ':' . $diferencia->i . ':' . $diferencia->s));
                                        }
                                        if ($horasalidareal > $horaalmuerzo && $horasalidareal < $horaalmuerzoplustdesc) {
                                            $diferencia = date_diff($horasalidareal, $horaalmuerzoplustdesc);
                                            $diferenciafinal = date_diff(new DateTime($diferenciafinal->h . ':' . $diferenciafinal->i . ':' . $diferenciafinal->s), new DateTime($diferencia->h . ':' . $diferencia->i . ':' . $diferencia->s));
                                        }
                                    }

                                    if ($horainitt > $horaentradareal  /*$hitt[0] > $horaentrada[0] || ($hitt[0] == $horaentrada[0] && $hitt[1] > $horaentrada[1])*/) { //horario extra inicial
                                        $he = $diferenciainicial->h;
                                        $me = $diferenciainicial->i;
                                        $hp = 0;
                                        $mp = 0;
                                    } else {
                                        $he = 0;
                                        $me = 0;
                                        $hp = $diferenciainicial->h;
                                        if ($diferenciainicial->d > 0) {
                                            $hp = $hp + $diferenciainicial->d * 24;
                                        }
                                        $mp = $diferenciainicial->i;
                                    }
                                    if ($horafintt < $horasalidareal) { //horario extra final
                                        $he += $diferenciafinal->h;
                                        $me += $diferenciafinal->i;
                                        $he = ($me > 59) ? $he + 1 : $he;
                                        $me = ($me > 59) ? $me - 60 : $me;
                                    } else {
                                        $hp += $diferenciafinal->h;
                                        if ($diferenciafinal->d > 0) {
                                            $hp = $hp + $diferenciafinal->d * 24;
                                        }
                                        $mp += $diferenciafinal->i;
                                        $hp = ($mp > 59) ? $hp + 1 : $hp;
                                        $mp = ($mp > 59) ? $mp - 60 : $mp;
                                    }
                                    $hdriariasmax = ConfHorasextras::getById(1);

                                    if ($he >= $hdriariasmax->limite) {
                                        $he = $hdriariasmax->limite;
                                        $me = '0';
                                    }

                                    if (intval($hp) > intval($horastrabajot) || (intval($hp) == intval($horastrabajot) && intval($mp) > 0)) {
                                        $hp = $horastrabajot;
                                        $mp = 0;
                                    }

                                    $hp = ($hp > 9) ? $hp : '0' . $hp;
                                    $mp = ($mp > 9) ? $mp : '0' . $mp;
                                    $he = ($he > 9) ? $he : '0' . $he;
                                    $me = ($me > 9) ? $me : '0' . $me;


                                    $horaFinalperdidas = $hp . ':' . $mp;
                                    $horaFinalextras = $he . ':' . $me;


                                    $horasTurno = explode(':', $horatt['horas']);
                                    
                                    if ((int)$horasTurno[0] < (int)$hp || ((int)$horasTurno[0] == (int)$hp && (int)$horasTurno[1] < (int)$mp)) {
                                        $horaFinalperdidas = $horasTurno[0] . ':' . $horasTurno[1];
                                    }
                                    if((empty($asistencia[$key]->fechahoraentrada) && !empty($asistencia[$key]->fechahorasalida))){
                                        $horaFinalperdidas = $horasTurno[0] . ':' . $horasTurno[1];
                                    }
                                    
                                    if ($dia[0]['feriado'] == 1) {
                                        if (!empty($hrsDiariasFeriadas[0]['sum']))
                                            $hrstrab = $this->RestOnlyTime($hrsDiariasFeriadas[0]['sum'], $horaFinalperdidas);
                                        else
                                            $hrstrab = '00:00:00';
                                    } else {
                                        /*if ($dia[0]['idtipodedia'] == 12 || $dia[0]['idtipodedia'] == 8) {
                                            if (!empty($horasalidareal) && !empty($horaentradareal)) {
                                                $interval = date_diff($horasalidareal, $horaentradareal);
                                                $hrstrab = "'" . $interval->h . ":" . $interval->i . "'";
                                            } else
                                                $hrstrab = '00:00:00';
                                            if (empty($idcausa[$ind]))
                                                $horaFinalperdidas = null;
                                            $horaFinalextras = null;
                                        } else {
                                            if (!empty($horatt['horas']))
                                                $hrstrab = $this->RestOnlyTime($horatt['horas'], $horaFinalperdidas);
                                            else
                                                $hrstrab = '00:00:00';
                                        }*/
                                        if ($dia[0]['idtipodedia'] == 12) {//Trabajo extraordinario
                                            if (!empty($horaentradareal) && !empty($horasalidareal)) {
                                                $hrstrab = $this->RestOnlyTime($fechahorasalida[$ind], $fechahoraentrada[$ind]);
                                            }
                                        } else if ($dia[0]['idtipodedia'] == 8) {//Dia irregular
                                            if (!empty($horaentradareal) && !empty($horasalidareal)) {
                                                $ht = $this->RestOnlyTime($fechahorasalida[$ind], $fechahoraentrada[$ind]);
                                                $hrstrab = $this->RestOnlyTime($ht, $horatt['tdescanso']);
                                            }
                                        } else {
                                            if (!empty($horatt['horas']))
                                                $hrstrab = $this->RestOnlyTime($horatt['horas'], $horaFinalperdidas);
                                            else
                                                $hrstrab = '00:00:00';
                                        }
                                    }

                                    /////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (($dia[0]['trabajo'] == 1 || count($diaferiadohab) > 0) && ($causa[0]['afectasalario'] == 1 || empty($idcausa[$ind]))) {
                                        $asistencia[$key]->hrsdescontadas = ($horaFinalperdidas) ? $horaFinalperdidas : null; //sustituir el 8 por la cantidad de horas que se trabaja ese dia en el regimen de la persona*********
                                        $asistencia[$key]->hrstrabajadas = ($hrstrab) ? $hrstrab : '00:00:00';
                                        
                                    } else {
                                        $asistencia[$key]->hrsdescontadas = null;
                                        $asistencia[$key]->hrstrabajadas = '00:00:00';
                                    }
                                    $asistencia[$key]->horasextras = ($he != 0 || $me != 0) ? $horaFinalextras : null;

                                } else {
                                    $asistencia[$key]->fechahorasalida = null;
                                    if(empty($idcausa[$ind])){
                                        $horasTurno = explode(':', $horatt['horas']);
                                        $asistencia[$key]->hrsdescontadas = $horasTurno[0] . ':' . $horasTurno[1];
                                    }
                                    $asistencia[$key]->hrstrabajadas = '00:00:00';
                                    $asistencia[$key]->horasextras = null;
                                }
                                $habcausas = new ConfHabCausaModel();
                                $causasdefecto = $habcausas->getHabilitarcausa();
                                $ausencia = false;
                                $tarde = false;
                                $salidaantes = false;
                                $tardesalidaantes = false;

                                if ($causasdefecto[0]['habilitado'] == 1) {
                                    $ausencia = true;
                                }
                                if ($causasdefecto[1]['habilitado'] == 1) {
                                    $tarde = true;
                                }
                                if ($causasdefecto[2]['habilitado'] == 1) {
                                    $salidaantes = true;
                                }
                                if ($causasdefecto[3]['habilitado'] == 1) {
                                    $tardesalidaantes = true;
                                }
                                $isvaccanset = true;
                                $habsubvac = new ConfHabilitarsubvacModel();
                                $subvacaciones = $habsubvac->getHabilitarSubVac();
                                $vacaciones = false;
                                if ($subvacaciones[0]['habilitado'] == 1) {
                                    $vacaciones = true;
                                }
                                ////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                if ($causa[0]['cantincidencias'] != null && $causa[0]['cantincidencias'] != 0) {
                                    $tienediascausa = true;
                                    $personassindiascausa = array();

                                    $fregistro = explode('/', $fecharegistro);
                                    $mes = $fregistro[1];
                                    $year = $fregistro[2];
                                    $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
                                    if ($mes < 10)
                                        $mes1 = '0' . $mes;
                                    else
                                        $mes1 = $mes;
                                    $fechdesde = '01/' . $mes . '/' . $year;
                                    $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;

                                    if (!empty($fdesde[$ind]) && !empty($fhasta[$ind]) && $value['idgrupodescanso']) {
                                        $fcd = explode('/', $fdesde[$ind]);
                                        if ($fcd[1] < $mes || $fcd[2] < $year)
                                            $pfdesde = $fechdesde;
                                        else
                                            $pfdesde = $fdesde[$ind];


                                        $fch = explode('/', $fhasta[$ind]);
                                        if ($fch[1] > $mes || $fch[2] > $year)
                                            $pfhasta = $fechhasta;
                                        else
                                            $pfhasta = $fhasta[$ind];

                                        $denomcausa = $causa[0]['denominacion'];
                                        //$diasrango1 = $calendario->CalendarioByDateRange($pfdesde, $pfhasta, $value['idgrupodescanso'], true);
                                        $diasrango1 = $confCalendarioPersona->getCalendarioPersona($pfdesde, $pfhasta, $value['idpersona']);
                                        $cantdiaslabcausa = $this->DatAsistencia->cantDiasLaborablesCausa($value['idpersona'], $idcausa[$ind], $fechdesde, $fechhasta);

                                        if ($asistencia[$key]->fdesde != null && $asistencia[$key]->fhasta != null && $asistencia[$key]->idcausa == $idcausa[$ind]) {
                                            //Se esta editando una asistencia con causa
                                            $cantdiaseditcausa = $this->DatAsistencia->cantDiasLaborablesCausa($value['idpersona'], $idcausa[$ind], $asistencia[$key]->fdesde, $asistencia[$key]->fhasta);
                                            $cantdiaslabcausa[0]['sum'] = $cantdiaslabcausa[0]['sum'] - $cantdiaseditcausa[0]['sum'];
                                        }

                                        if (count($diasrango1) + $cantdiaslabcausa[0]['sum'] > $causa[0]['cantincidencias']) {
                                            $tienediascausa = true;
                                            $asistencia[$key]->hrsdescontadas = $tmphorasdescontadas;
                                            $asistencia[$key]->hrstrabajadas = $tmphorastrabajadas;
                                            $asistencia[$key]->horasextras = $tmphorasextras;
                                            $asistencia[$key]->fechahoraentrada = $tmpfechahoraentrada;
                                            $asistencia[$key]->fechahorasalida = $tmpfechahorasalida;
                                            $asistencia[$key]->fdesde = $tmpfdesde;
                                            $asistencia[$key]->fhasta = $tmpfhasta;
                                            $asistencia[$key]->idpersonacontrola = $tmpidpersonacontrola;
                                            $asistencia[$key]->idpersonamodifica = $tmpidpersonamodifica;
                                            $asistencia[$key]->observacion = $tmpobservacion;
                                            $cod = 2;
                                            array_push(
                                                $personassindiascausa, $value['nombreapellidos']
                                            );
                                        }
                                    }
                                }
                                ////////////////////////////////////////////////////////////////////////////////////////////////////
                                if ((is_numeric($idcausa[$ind])) && ($horas[0]['sum'] != '00:00:00' || $hrsDiariasFeriadas[0]['sum'] > 0)/* || $value['idtipodedia'] == 8*/) {

                                    if (($idcausa[$ind] == 4) && $vacaciones) {
                                        $personassinacumvac = array();
                                        //////////////////////////////Servicio de nomina///////////////////////
                                        $servicionomina = ZendExt_IoC::getInstance()->pvd->getDiasImpAcumuladosVacPersEntidad($value['idpersona'], $value['identidad']);
                                        $diasrangotrabajo = $confCalendarioPersona->getCalendarioPersonaTrabajo($fdesde[$ind], $fhasta[$ind], $value['idpersona']);
                                        if (count($diasrangotrabajo) > $servicionomina->dias) {
                                            $isvaccanset = false;
                                            $asistencia[$key]->hrsdescontadas = $tmphorasdescontadas;
                                            $asistencia[$key]->horasextras = $tmphorasextras;
                                            $asistencia[$key]->fechahoraentrada = $tmpfechahoraentrada;
                                            $asistencia[$key]->fechahorasalida = $tmpfechahorasalida;
                                            $asistencia[$key]->fdesde = $tmpfdesde;
                                            $asistencia[$key]->fhasta = $tmpfhasta;
                                            $asistencia[$key]->idpersonacontrola = $tmpidpersonacontrola;
                                            $asistencia[$key]->idpersonamodifica = $tmpidpersonamodifica;
                                            $asistencia[$key]->observacion = $tmpobservacion;
                                            $cod = 1;
                                            array_push(
                                                $personassinacumvac, '<li>' . $value['nombreapellidos'] . ' [' . round($servicionomina->dias, 2) . ' días]' . '</li>'
                                            );
                                        }
                                    }

                                    if ($isvaccanset && $tienediascausa)
                                        $asistencia[$key]->idcausa = $idcausa[$ind];

                                    if ($dia[0]['idtipodedia'] != 12 && $dia[0]['idtipodedia'] != 8) {
                                        if ($idcausa[$ind] == 3 || $idcausa[$ind] == 5 || $idcausa[$ind] == 6) {
                                            if ($horaentradareal != null && $horaentradareal > $horainitt && $horasalidareal != null && $horasalidareal < $horafintt && $tardesalidaantes/* && empty($asistencia[$key]->idcausa)*/)
                                                $asistencia[$key]->idcausa = 6;
                                            else
                                                if ($horasalidareal != null && $horasalidareal < $horafintt && $salidaantes/* && empty($asistencia[$key]->idcausa)*/)
                                                    $asistencia[$key]->idcausa = 5;
                                                else
                                                    if ($horaentradareal != null && $horaentradareal > $horainitt && $tarde/* && empty($asistencia[$key]->idcausa)*/)
                                                        $asistencia[$key]->idcausa = 3;
                                                    else {
                                                        if ($tarde || $salidaantes || $tardesalidaantes)
                                                            $asistencia[$key]->idcausa = null;
                                                        else
                                                            $asistencia[$key]->idcausa = $idcausa[$ind];
                                                    }
                                        }
                                    } else {
                                        if (empty($idcausa[$ind]))
                                            $asistencia[$key]->idcausa = null;
                                    }
                                } else {
                                    if ($dia[0]['idtipodedia'] != 12 && $dia[0]['idtipodedia'] != 8) {
                                        if ($horaentradareal != null && $horaentradareal > $horainitt && $horasalidareal != null && $horasalidareal < $horafintt && $tardesalidaantes)
                                            $asistencia[$key]->idcausa = 6;
                                        else
                                            if ($horasalidareal != null && $horasalidareal < $horafintt && $salidaantes)
                                                $asistencia[$key]->idcausa = 5;
                                            else
                                                if ($horaentradareal != null && $horaentradareal > $horainitt && $tarde)
                                                    $asistencia[$key]->idcausa = 3;
                                                else
                                                    $asistencia[$key]->idcausa = null;
                                    } else {
                                        if (empty($idcausa[$ind]))
                                            $asistencia[$key]->idcausa = null;
                                    }
                                }

                                if (!empty($fdesde[$ind]) && $isvaccanset && $tienediascausa) {
                                    /*Esta condicion es para si se pone la causa el dia despues del que se trabaja,
                                    para que se cambie el fdesde al dia que inicia el turno.*/
                                    if ($dia[0]['trabajo'] == 1 && $dia[0]['otrodia'] == 1)
                                        $asistencia[$key]->fdesde = $fecharegistro;
                                    else
                                        $asistencia[$key]->fdesde = $fdesde[$ind];
                                } else
                                    if (!$tienediascausa)
                                        $asistencia[$key]->fdesde = $tmpfdesde;
                                    else
                                        $asistencia[$key]->fdesde = null;

                                if (!empty($fhasta[$ind]) && $isvaccanset && $tienediascausa)
                                    $asistencia[$key]->fhasta = $fhasta[$ind];
                                else
                                    if (!$tienediascausa)
                                        $asistencia[$key]->fhasta = $tmpfhasta;
                                    else
                                        $asistencia[$key]->fhasta = null;

                                if ($horaentradareal != null && $horasalidareal != null)
                                    if (($horaentradareal < $horainitt && $horasalidareal < $horainitt) || ($horaentradareal > $horafintt && $horasalidareal > $horafintt)) {
                                        $asistencia[$key]->hrsdescontadas = ((int)$horas[0]['sum'] > '00:00:00') ? $auxhoras[0] . ':' . $auxhoras[1] : null;
                                    }

                                if (!empty($fdesde[$ind]) && !empty($fhasta[$ind])/* && $causa[0]['afectasalario'] == 1 */ && $isvaccanset && $tienediascausa) {
                                    $fechas = array();
                                    $confHabgrupospredeterminados = new ConfHabgrupospredeterminados();
                                    $existegrupo = $confHabgrupospredeterminados->existe($value['idgrupodescanso']);
                                    $grupopredeterminado = $nomGrupodescanso->getGrupoPredeterminado();
                                    if (!empty($grupopredeterminado) && count($existegrupo) != 0) {
                                        $h = $confCalendario->getHrsCalendario($fdesde[$ind], $fhasta[$ind], $grupopredeterminado[0]['idgrupodescanso']);
                                    } else {
                                        $h = $confCalendarioPersona->getHrsCalendarioPersona($fdesde[$ind], $fhasta[$ind], $value['idpersona'], $value['idcargo']);
                                    }
                                    $auxh = explode(':', $h[0]['sum']);
                                    if ($causa[0]['afectasalario'] == 1){
                                        $asistencia[$key]->hrsdescontadas = ((int)$h[0]['sum'] > '00:00:00') ? $auxh[0] . ':' . $auxh[1] : null;
                                        $asistencia[$key]->hrstrabajadas = null;
                                    }else{
                                        $asistencia[$key]->hrstrabajadas = ((int)$h[0]['sum'] > '00:00:00') ? $auxh[0] . ':' . $auxh[1] : null;
                                        $asistencia[$key]->hrsdescontadas = null;
                                    }
                                    /*$asistencia[$key]->hrsdescontadas = ((int)$h[0]['sum'] > '00:00:00') ? $auxh[0] . ':' . $auxh[1] : null;
                                    $datDiaferiadohabilitado = new DatDiaferiadohabilitado();
                                    $diasferiadoshab = $datDiaferiadohabilitado->GetDiasFeriadosHabByDateRange($value['idpersona'], $fdesde[$ind], $fhasta[$ind]);
                                    foreach ($diasferiadoshab as $i => $val) {
                                        array_push($fechas, "'" . $val['fecha'] . "'");
                                    }
                                    if (count($diasferiadoshab) > 0) {
                                        //$suma = $this->ConfCalendario->GetSumHorasDiasFeriadosHabByDateArrayAndGroup($value['idgrupodescanso'], $fechas);
                                        $suma = $confCalendarioPersona->GetSumHorasDiasFeriadosHabByDateArrayAndPerson($value['idpersona'], $fechas);
                                        $auxsuma = explode(':', $suma[0]['sum']);
                                        $asistencia[$key]->hrsdescontadas += ((int)$suma[0]['sum'] > '00:00:00') ? $auxsuma[0] . ':' . $auxsuma[1] : null;
                                        $asistencia[$key]->hrsdescontadas = $asistencia[$key]->hrsdescontadas;
                                    }*/
                                } else {
                                    if (empty($asistencia[$key]->fechahorasalida) && empty($asistencia[$key]->hrsdescontadas))
                                        $asistencia[$key]->hrsdescontadas = null;
                                }
                                if (!empty($asistencia[$key]->idcausa) && empty($asistencia[$key]->fechahorasalida) && empty($asistencia[$key]->fechahoraentrada)
                                    && empty($asistencia[$key]->fdesde) && empty($asistencia[$key]->fhasta) && $isvaccanset && $tienediascausa
                                ) {
                                    if ($causa[0]['afectasalario'] == 1) {
                                        if ($dia[0]['feriado'] == 1 && count($diaferiadohab) > 0) {
                                            $asistencia[$key]->hrsdescontadas = $auxhrsDiariasFeriadas[0] . ':' . $auxhrsDiariasFeriadas[1];
                                        } else {
                                            $asistencia[$key]->hrsdescontadas = ((int)$horas[0]['sum'] > '00:00:00') ? $auxhoras[0] . ':' . $auxhoras[1] : null;
                                        }
                                    } else {
                                        if ($dia[0]['feriado'] == 1 && count($diaferiadohab) > 0) {
                                            $asistencia[$key]->hrstrabajadas = $auxhrsDiariasFeriadas[0] . ':' . $auxhrsDiariasFeriadas[1];
                                        } else {
                                            $asistencia[$key]->hrstrabajadas = ((int)$horas[0]['sum'] > '00:00:00') ? $auxhoras[0] . ':' . $auxhoras[1] : null;
                                        }
                                    }
                                }

                                if (empty($fdesde[$ind]) && empty($fhasta[$ind]))
                                    $asistencia[$key]->fecharegistro = $fecharegistro;

                                if (!empty($observacion[$ind]))
                                    $asistencia[$key]->observacion = $observacion[$ind];
                                else
                                    if ($isvaccanset && $tienediascausa)
                                        $asistencia[$key]->observacion = null;

                                if (count($diaferiadohab) > 0) {
                                    $asistencia[$key]->fhabilitado = 1;
                                    if (!empty($asistencia[$key]->idcausa) && !empty($asistencia[$key]->fdesde) && !empty($asistencia[$key]->fhasta) &&
                                        $asistencia[$key]->fdesde <= $asistencia[$key]->fecharegistro && $asistencia[$key]->fhasta >= $asistencia[$key]->fecharegistro && $isvaccanset && $tienediascausa
                                    ) {
                                        $asistencia[$key]->hferiadas = null;
                                    } else {
                                        $htf = 0;
                                        $parts = explode(':', $asistencia[$key]->hrsdescontadas);
                                        $temphora = intval($auxhrsDiariasFeriadas[0]) - intval($parts[0]);

                                        $tempmin = 0;
                                        if ($parts[1] > 0) {
                                            $temphora = $temphora - 1;
                                            $tempmin = 60 - $parts[1];
                                        } else
                                            $tempmin = intval($parts[1]) - intval('00');

                                        if ($tempmin > 59) {
                                            $tempmin = $tempmin - 60;
                                            $temphora++;
                                        }
                                        if ($temphora < 10)
                                            $temphora = '0' . $temphora;
                                        if ($tempmin < 10)
                                            $tempmin = '0' . $tempmin;
                                        $htf = $temphora . ':' . $tempmin;
                                        $asistencia[$key]->hferiadas = $htf;
                                    }
                                }

                                if (isset($certificadocontinuado[$ind]))
                                    $asistencia[$key]->certificadocontinuado = (int)$certificadocontinuado[$ind];
                                else
                                    $asistencia[$key]->certificadocontinuado = null;

                            } else {
                                if (!empty($fechahorasalida[$ind])) {
                                    $fechahora = explode(' ', $fechahorasalida[$ind]);
                                    if (count($fechahora) > 1)
                                        $horasalida = explode(':', $fechahora[1]);
                                    else
                                        $horasalida = explode(':', $fechahorasalida[$ind]);
                                    if (!empty($fechasalida[$ind]))
                                        $fsalida = explode('/', $fechasalida[$ind]);
                                    else
                                        $fsalida = $fecha;
                                    $asistencia[$key]->fechahorasalida = date('d/m/Y H:i:s', mktime($horasalida[0], $horasalida[1], 0, $fsalida[1], $fsalida[0], $fsalida[2]));
                                } else
                                    $asistencia[$key]->fechahorasalida = null;

                                if (!empty($fechahorasalida[$ind]) && !empty($fechahoraentrada[$ind])) {
                                    $hrstrabajadas = $this->RestOnlyTime($fechahorasalida[$ind], $fechahoraentrada[$ind]);
                                    $asistencia[$key]->hrstrabajadas = $hrstrabajadas;
                                } else {
                                    $asistencia[$key]->hrstrabajadas = '00:00:00';
                                }
                                if (!empty($observacion[$ind]))
                                    $asistencia[$key]->observacion = $observacion[$ind];
                                else
                                    $asistencia[$key]->observacion = null;

                                if (isset($certificadocontinuado[$ind]))
                                    $asistencia[$key]->certificadocontinuado = (int)$certificadocontinuado[$ind];
                                else
                                    $asistencia[$key]->certificadocontinuado = null;
                            }

                            if ($fecharegistroOriginal['cambio'] == true) {
                                $fecharegistro = $fecharegistroOriginal['fecha'];
                            }
                            if($asistencia[$key]->hrstrabajadas == '00:00')
                                $asistencia[$key]->hrstrabajadas = null;
                            if($asistencia[$key]->hrsdescontadas == '00:00')
                                $asistencia[$key]->hrsdescontadas = null;

                            if($asistencia[$key]->idcausa == -1){

                                DatAsistenciamultiplescausas::deleteAsistenciaByPerson([$asistencia[$key]->idasistencia]);
                                $asistencia[$key]->idcausa = null;
                            }
                        }
                    }
                }
            }
        }
//        print('<pre>');
//        print_r($asistencia->toArray());die;
        $asistencia->save();
        if ($isvaccanset && $tienediascausa) {
            $r['succes'] = true;
        } else {
            $r['msg'] = $cod;
            $r['personas'] = $personassinacumvac;
            $r['personassindiascausa'] = $personassindiascausa;
            $r['causainc'] = $denomcausa;
        }
        return $r;
    }

    public function RestTime($horainicioTurno, $horaentradaPersona, $date)
    {
        $HIT = explode(':', $horainicioTurno);
        $HEP = explode(':', $horaentradaPersona);
        $fecha = explode('/', $date);

        $TTime = new DateTime(date('H:i:s', mktime($HIT[0], $HIT[1], $HIT[2], $fecha[1], $fecha[0], $fecha[2])));
        $PTime = new DateTime(date('H:i:s', mktime($HEP[0], $HEP[1], $HEP[2], $fecha[1], $fecha[0], $fecha[2])));

        $diference = $PTime->diff($TTime);
        return $diference;
    }

    public function SumTime($initialTime, $finalTime, $date)
    {
        $HIT = explode(':', $initialTime);
        $HEP = explode(':', $finalTime);
        $fecha = explode('/', $date);

        if (count($HIT) == 3)
            $interval = new DateInterval("PT" . $HIT[0] . "H" . $HIT[1] . "M" . $HIT[2] . "S");
        else
            $interval = new DateInterval("PT" . $HIT[0] . "H" . $HIT[1] . "M");
        $PTime = new DateTime(date('H:i:s', mktime($HEP[0], $HEP[1], $HEP[2], $fecha[1], $fecha[0], $fecha[2])));

        $suma = $PTime->add($interval);
        return $suma->format('H:i:s');
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

    public function InsertarWithSesions($idasistencia, $idpersonas, $hrsdescontadas, $idcausa, $fdesde, $fhasta, $fecharegistro, $observacion,
                                        $fechahoraentradass, $fechahorasalidass, $fechahoraentradaps, $fechahorasalidaps, $idcausaps, $idcausass, $useIdpersonas)
    {
        $personasConRegistros = array();
        $fecha = explode('/', $fecharegistro);
        $controlHrsDescontadas = false;
        $calendariopersona = new ConfCalendariopersona();

        $configRegimen = new ConfCalendarioModel();
        $asistencia = $this->DatAsistencia->getAsistByArrIdasistFechaWithSesion(implode(',', $idasistencia), $fecharegistro);

        $model = new DatEstructuraasistenciaModel();

        if ($useIdpersonas) {
            $personas = $idpersonas;
        } else {
            $personas = ZendExt_IoC_Inter::getInstance()->maestro->getControledByDominioEstructuraPersonaPluriempleo(
                2, $_SESSION['Zeolides']['entidad']->idestructura, $_SESSION['Zeolides']['perfil']['idpersona']
            );
        }
        $asist = $model->getPersonasByCargoPadre($fecharegistro, $personas,
            $_SESSION['Zeolides']['perfil']['idpersona'], 1);
        $arrPersonas = $asist['data'];

        //buscando si cada persona tiene incidencias de asistencia en el periodo en que se ponen las nuevas para eliminarlas.
        $datasistencia = new DatAsistencia();
        foreach ($idasistencia as $ind => $idasistence) {
            if (!empty($fdesde[$ind]) && !empty($fhasta[$ind])) {
                $datasistencia->DeleteIncidenciasPeriodo($idpersonas[$ind], $fdesde[$ind], $fhasta[$ind]);
            }
            foreach ($asistencia as $key => $asis) {
                if ($idasistence == $asis->idasistencia) {
                    foreach ($arrPersonas as $k => $value) {
                        if ($value['idpersona'] == $asis->idpersona) {
                            if ($asistencia[$key]->idpersonacontrola != NULL)
                                $asistencia[$key]->idpersonamodifica = $_SESSION['Zeolides']['perfil']['idpersona'];
                            else
                                $asistencia[$key]->idpersonacontrola = $_SESSION['Zeolides']['perfil']['idpersona'];

                            //$horas = $configRegimen->GetHrsByDateRange($fecharegistro, $fecharegistro, $value['idgrupodescanso']);
                            $horas = $calendariopersona->getHorasCalendarioPersona($fecharegistro, $fecharegistro, $value['idpersona']);
                            $auxhoras = explode(':', $horas[0]['sum']);
                            $horatt = $this->DatAsistencia->getHorarioByPersona($asis->idpersona);
                            //$hrsDiariasFeriadas = $this->ConfCalendario->HrsFeriadasByDateRange($fecharegistro, $fecharegistro, $value['idgrupodescanso']);
                            $hrsDiariasFeriadas = $calendariopersona->getHrsFeriadasPersona($fecharegistro, $fecharegistro, $value['idpersona']);
                            $auxhrsDiariasFeriadas = explode(':', $hrsDiariasFeriadas[0]['sum']);
                            $diaferiadohab = $this->GetDiaFeriadoHabilitado($value['idpersona'], $fecharegistro);
                            //$dia = $this->ConfCalendario->getCalendarioByFecha($fecharegistro, $value['idgrupodescanso']);
                            $dia = $calendariopersona->getCalendarioPersona($fecharegistro, $fecharegistro, $value['idpersona']);

                            $descontadasps = '';
                            $extrasps = '';
                            $descontadasss = '';
                            $extrasss = '';

                            $HSTPS = explode(':', $horatt['horasalidaps']);
                            $horaSalidaTurnops = new DateTime(date('H:i:s', mktime($HSTPS[0], $HSTPS[1], $HSTPS[2], $fecha[1], $fecha[0], $fecha[2])));
                            $HSTSS = explode(':', $horatt['horasalidass']);
                            $horaSalidaTurnoss = new DateTime(date('H:i:s', mktime($HSTSS[0], $HSTSS[1], $HSTSS[2], $fecha[1], $fecha[0], $fecha[2])));
                            $HETPS = explode(':', $horatt['horaentradaps']);
                            $horaEntradaTurnops = new DateTime(date('H:i:s', mktime($HETPS[0], $HETPS[1], $HETPS[2], $fecha[1], $fecha[0], $fecha[2])));
                            $HETSS = explode(':', $horatt['horaentradass']);
                            $horaEntradaTurnoss = new DateTime(date('H:i:s', mktime($HETSS[0], $HETSS[1], $HETSS[2], $fecha[1], $fecha[0], $fecha[2])));

                            $horaEntPersonaps = '';
                            $horaEntPersonass = '';
                            $horaSalPersonaps = '';
                            $horaSalPersonass = '';

                            $habcausas = new ConfHabCausaModel();
                            $causasdefecto = $habcausas->getHabilitarcausa();
                            $ausencia = false;
                            $tarde = false;
                            $salidaantes = false;
                            $tardesalidaantes = false;
                            if ($causasdefecto[0]['habilitado'] == 1) {
                                $ausencia = true;
                            }
                            if ($causasdefecto[1]['habilitado'] == 1) {
                                $tarde = true;
                            }
                            if ($causasdefecto[2]['habilitado'] == 1) {
                                $salidaantes = true;
                            }
                            if ($causasdefecto[3]['habilitado'] == 1) {
                                $tardesalidaantes = true;
                            }

                            $asistencia[$key]->DatAsistenciasesion[0]->idcausa = $idcausaps[$ind];
                            $asistencia[$key]->DatAsistenciasesion[1]->idcausa = $idcausass[$ind];

                            //para la hora entrada de la primera sesion
                            if (!empty($fechahoraentradaps[$ind])) {
                                $fechahora = explode(' ', $fechahoraentradaps[$ind]);
                                if (count($fechahora) > 1)
                                    $horaentrada = explode(':', $fechahora[1]);
                                else
                                    $horaentrada = explode(':', $fechahoraentradaps[$ind]);
                                $horaEntPersonaps = new DateTime(date('H:i:s', mktime($horaentrada[0], $horaentrada[1], $horaentrada[2], $fecha[1], $fecha[0], $fecha[2])));

                                if ($horaEntPersonaps > $horaSalidaTurnops) {
                                    $diference = $this->RestTime($horatt['horasalidaps'], $horatt['horaentradaps'], $fecharegistro);
                                    if (empty($descontadasps)) {
                                        $descontadasps = $this->FormatTime($diference);
                                    } else {
                                        $sum = $this->SumTime($descontadasps, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                        $descontadasps = $sum;
                                    }
                                    if ($ausencia)
                                        $asistencia[$key]->DatAsistenciasesion[0]->idcausa = 2;
                                    $horaEntSS = date('d/m/Y H:i:s', mktime($horaentrada[0], $horaentrada[1], 0, $fecha[1], $fecha[0], $fecha[2]));
                                    $asistencia[$key]->DatAsistenciasesion[1]->fechahoraentrada = $horaEntSS;
                                    $hora = explode(' ', $horaEntSS);

                                    if ($horaEntPersonaps > $horaSalidaTurnoss) {
                                        $diference = $this->RestTime($horatt['horasalidass'], $horatt['horaentradass'], $fecharegistro);
                                        if (empty($descontadasss)) {
                                            $descontadasss = $this->FormatTime($diference);
                                        } else {
                                            $sum = $this->SumTime($descontadasss, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                            $descontadasss = $sum;
                                        }
                                        if ($ausencia)
                                            $asistencia[$key]->DatAsistenciasesion[1]->idcausa = 2;
                                    } else {
                                        $fechahoraentradass[$ind] = $hora[1];
                                    }
                                } else {
                                    $asistencia[$key]->DatAsistenciasesion[0]->fechahoraentrada = date('d/m/Y H:i:s', mktime($horaentrada[0], $horaentrada[1], 0, $fecha[1], $fecha[0], $fecha[2]));

                                    $diference = $this->RestTime($horatt['horaentradaps'], implode(':', $horaentrada), $fecharegistro);

                                    if ($diference->invert) {
                                        //va para descuento
                                        if (empty($descontadasps)) {
                                            $descontadasps = $this->FormatTime($diference);
                                        } else {
                                            $sum = $this->SumTime($descontadasps, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                            $descontadasps = $sum;
                                        }
                                    } else {   //va para extras
                                        if (empty($extrasps)) {
                                            $extrasps = $this->FormatTime($diference);
                                        } else {
                                            $sum = $this->SumTime($extrasps, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                            $extrasps = $sum;
                                        }
                                    }
                                }
                            } else
                                $asistencia[$key]->DatAsistenciasesion[0]->fechahoraentrada = null;

                            //Para la hora de entrada de la segunda sesion
                            if (!empty($fechahoraentradass[$ind])) {
                                $fechahora = explode(' ', $fechahoraentradass[$ind]);
                                if (count($fechahora) > 1)
                                    $horaentrada = explode(':', $fechahora[1]);
                                else
                                    $horaentrada = explode(':', $fechahoraentradass[$ind]);

                                $horaEntPersonass = new DateTime(date('H:i:s', mktime($horaentrada[0], $horaentrada[1], $horaentrada[2], $fecha[1], $fecha[0], $fecha[2])));
                                if ($horaEntPersonass > $horaSalidaTurnoss) {
                                    $diference = $this->RestTime($horatt['horasalidass'], $horatt['horaentradass'], $fecharegistro);
                                    if (empty($descontadasss)) {
                                        $descontadasss = $this->FormatTime($diference);
                                    } else {
                                        $sum = $this->SumTime($descontadasss, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                        $descontadasss = $sum;
                                    }
                                    if ($ausencia)
                                        $asistencia[$key]->DatAsistenciasesion[1]->idcausa = 2;
                                } else {
                                    $asistencia[$key]->DatAsistenciasesion[1]->fechahoraentrada = date('d/m/Y H:i:s', mktime($horaentrada[0], $horaentrada[1], $horaentrada[2], $fecha[1], $fecha[0], $fecha[2]));

                                    $diference = $this->RestTime($horatt['horaentradass'], implode(':', $horaentrada), $fecharegistro);

                                    if ($diference->invert) {  //va para descuento
                                        if (empty($descontadasss)) {
                                            $descontadasss = $this->FormatTime($diference);
                                        } else {
                                            $sum = $this->SumTime($descontadasss, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                            $descontadasss = $sum;
                                        }
                                    } else {  //va para extras
                                        if (empty($extrasss)) {
                                            $extrasss = $this->FormatTime($diference);
                                        } else {
                                            $sum = $this->SumTime($extrasss, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                            $extrasss = $sum;
                                        }
                                    }
                                }
                            } else
                                $asistencia[$key]->DatAsistenciasesion[1]->fechahoraentrada = null;

                            //hora de salida de la primera sesion
                            if (!empty($fechahorasalidaps[$ind])) {

                                $fechahora = explode(' ', $fechahorasalidaps[$ind]);

                                if (count($fechahora) > 1)
                                    $horasalida = explode(':', $fechahora[1]);
                                else
                                    $horasalida = explode(':', $fechahorasalidaps[$ind]);

                                $horaSalPersonaps = new DateTime(date('H:i:s', mktime($horasalida[0], $horasalida[1], $horasalida[2], $fecha[1], $fecha[0], $fecha[2])));

                                if ($horaSalPersonaps < $horaEntradaTurnops) {
                                    $diference = $this->RestTime($horatt['horasalidaps'], $horatt['horaentradaps'], $fecharegistro);
                                    if (empty($descontadasps)) {
                                        $descontadasps = $this->FormatTime($diference);
                                    } else {
                                        $sum = $this->SumTime($descontadasps, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                        $descontadasps = $sum;
                                    }
                                    if ($ausencia)
                                        $asistencia[$key]->DatAsistenciasesion[0]->idcausa = 2;
                                    $asistencia[$key]->DatAsistenciasesion[0]->fechahoraentrada = Doctrine::NULL_TO_STRING;
                                    $extrasps = "00:00";
                                } else {
                                    $asistencia[$key]->DatAsistenciasesion[0]->fechahorasalida = date('d/m/Y H:i:s', mktime($horasalida[0], $horasalida[1], 0, $fecha[1], $fecha[0], $fecha[2]));

                                    $diference = $this->RestTime($horatt['horasalidaps'], implode(':', $horasalida), $fecharegistro);

                                    if ($diference->invert) { //va para extras
                                        if (empty($extrasps)) {
                                            $extrasps = $this->FormatTime($diference);
                                        } else {
                                            $sum = $this->SumTime($extrasps, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                            $extrasps = $sum;
                                        }
                                    } else { //va para descuento
                                        if (empty($descontadasps)) {
                                            $descontadasps = $this->FormatTime($diference);
                                        } else {
                                            $sum = $this->SumTime($descontadasps, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                            $descontadasps = $sum;
                                        }
                                    }
                                }
                            } else
                                $asistencia[$key]->DatAsistenciasesion[0]->fechahorasalida = null;

                            //hora de salida de la segunda sesion
                            if (!empty($fechahorasalidass[$ind])) {

                                $fechahora = explode(' ', $fechahorasalidass[$ind]);

                                if (count($fechahora) > 1)
                                    $horasalida = explode(':', $fechahora[1]);
                                else
                                    $horasalida = explode(':', $fechahorasalidass[$ind]);

                                $horaSalPersonass = new DateTime(date('H:i:s', mktime($horasalida[0], $horasalida[1], $horasalida[2], $fecha[1], $fecha[0], $fecha[2])));


                                if ($horaSalPersonass < $horaEntradaTurnoss) {
                                    $diference = $this->RestTime($horatt['horasalidass'], $horatt['horaentradass'], $fecharegistro);
                                    if (empty($descontadasss)) {
                                        $descontadasss = $this->FormatTime($diference);
                                    } else {
                                        $sum = $this->SumTime($descontadasss, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                        $descontadasss = $sum;
                                    }
                                    if ($ausencia)
                                        $asistencia[$key]->DatAsistenciasesion[1]->idcausa = 2;
                                    $asistencia[$key]->DatAsistenciasesion[1]->fechahoraentrada = Doctrine::NULL_TO_STRING;
                                    $extrasss = "00:00";
                                } else {
                                    $asistencia[$key]->DatAsistenciasesion[1]->fechahorasalida = date('d/m/Y H:i:s', mktime($horasalida[0], $horasalida[1], 0, $fecha[1], $fecha[0], $fecha[2]));

                                    $diference = $this->RestTime($horatt['horasalidass'], implode(':', $horasalida), $fecharegistro);

                                    if ($diference->invert) { //va para extras
                                        if (empty($extrasss)) {
                                            $extrasss = $this->FormatTime($diference);
                                        } else {
                                            $sum = $this->SumTime($extrasss, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                            $extrasss = $sum;
                                        }
                                    } else { //va para descuento
                                        if (empty($descontadasss)) {
                                            $descontadasss = $this->FormatTime($diference);
                                        } else {
                                            $sum = $this->SumTime($descontadasss, $diference->h . ":" . $diference->i . ":" . $diference->s, $fecharegistro);
                                            $descontadasss = $sum;
                                        }
                                    }
                                }
                            } else
                                $asistencia[$key]->DatAsistenciasesion[1]->fechahorasalida = null;

                            if (!empty($fechahoraentradaps[$ind]) && empty($fechahorasalidaps[$ind]) && empty($fechahoraentradass[$ind]) && !empty($fechahorasalidass[$ind])) {
                                $horasalida = explode(':', $horatt['horasalidaps']);
                                $asistencia[$key]->DatAsistenciasesion[0]->fechahorasalida = date('d/m/Y H:i:s', mktime($horasalida[0], $horasalida[1], 0, $fecha[1], $fecha[0], $fecha[2]));
                                $horaentrada = explode(':', $horatt['horaentradass']);
                                $asistencia[$key]->DatAsistenciasesion[1]->fechahoraentrada = date('d/m/Y H:i:s', mktime($horaentrada[0], $horaentrada[1], 0, $fecha[1], $fecha[0], $fecha[2]));
                            }
                            if (empty($fechahoraentradaps[$ind]) && empty($fechahorasalidaps[$ind]) && empty($idcausa[$ind])) {
                                $difPS = $this->RestTime($horatt['horasalidaps'], $horatt['horaentradaps'], $fecharegistro);
                                $descontadasps = $this->FormatTime($difPS);
                                if (!is_numeric($idcausaps[$ind]) && $ausencia) {
                                    $asistencia[$key]->DatAsistenciasesion[0]->idcausa = 2;
                                }
                            }
                            $auxdescontadasps = explode(':', $descontadasps);
                            $auxdextrasps = explode(':', $extrasps);
                            $auxdescontadasss = explode(':', $descontadasss);
                            $auxextrasss = explode(':', $extrasss);
                            $asistencia[$key]->DatAsistenciasesion[0]->hrsdescontadas = ($descontadasps == "00:00" || $descontadasps == "00:00:00" || empty($descontadasps)) ? "" : $auxdescontadasps[0] . ':' . $auxdescontadasps[1];
                            $asistencia[$key]->DatAsistenciasesion[0]->horasextras = ($extrasps == "00:00" || $extrasps == "00:00:00" || empty($extrasps)) ? "" : $auxdextrasps[0] . ':' . $auxdextrasps[1];
                            $asistencia[$key]->DatAsistenciasesion[1]->hrsdescontadas = ($descontadasss == "00:00" || $descontadasss == "00:00:00" || empty($descontadasss)) ? "" : $auxdescontadasss[0] . ':' . $auxdescontadasss[1];
                            $asistencia[$key]->DatAsistenciasesion[1]->horasextras = ($extrasss == "00:00" || $extrasss == "00:00:00" || empty($extrasss)) ? "" : $auxextrasss[0] . ':' . $auxextrasss[1];

                            if (($horas[0]['sum'] > '00:00:00' || $hrsDiariasFeriadas[0]['sum'] > '00:00:00') && (!empty($fechahoraentradaps[$ind]) || !empty($fechahorasalidaps[$ind]))) {

                                if (!empty($fechahoraentradaps[$ind]) && !empty($fechahorasalidaps[$ind])) {
                                    if ($horaEntPersonaps > $horaEntradaTurnops && $horaEntPersonaps < $horaSalidaTurnops &&
                                        $horaSalPersonaps > $horaEntradaTurnops && $horaSalPersonaps < $horaSalidaTurnops
                                    ) {

                                        if (is_numeric($idcausaps[$ind]) && ($idcausaps[$ind] != 6 && $idcausaps[$ind] != 3 && $idcausaps[$ind] != 5 && $idcausaps[$ind] != 2))
                                            $asistencia[$key]->DatAsistenciasesion[0]->idcausa = $idcausaps[$ind];
                                        else {
                                            if ($tardesalidaantes) {
                                                $asistencia[$key]->DatAsistenciasesion[0]->idcausa = 6;
                                            }
                                        }
                                    } else {
                                        if (!empty($fechahoraentradaps[$ind]) &&
                                            $horaEntPersonaps > $horaEntradaTurnops && $horaEntPersonaps < $horaSalidaTurnops
                                        ) {
                                            if (!empty($idcausaps[$ind]) && ($idcausaps[$ind] != 6 && $idcausaps[$ind] != 3 && $idcausaps[$ind] != 5 && $idcausaps[$ind] != 2))
                                                $asistencia[$key]->DatAsistenciasesion[0]->idcausa = $idcausaps[$ind];
                                            else if ($tarde)
                                                $asistencia[$key]->DatAsistenciasesion[0]->idcausa = 3;
                                        } else {
                                            if (!empty($fechahorasalidaps[$ind]) &&
                                                $horaSalPersonaps > $horaEntradaTurnops && $horaSalPersonaps < $horaSalidaTurnops
                                            ) {
                                                if (!empty($idcausaps[$ind]) && ($idcausaps[$ind] != 6 && $idcausaps[$ind] != 3 && $idcausaps[$ind] != 5 && $idcausaps[$ind] != 2))
                                                    $asistencia[$key]->DatAsistenciasesion[0]->idcausa = $idcausaps[$ind];
                                                else if ($salidaantes)
                                                    $asistencia[$key]->DatAsistenciasesion[0]->idcausa = 5;
                                            } else {
                                                if (!empty($idcausaps[$ind]) && ($idcausaps[$ind] != 6 && $idcausaps[$ind] != 3 && $idcausaps[$ind] != 5 && $idcausaps[$ind] != 2))
                                                    $asistencia[$key]->DatAsistenciasesion[0]->idcausa = $idcausaps[$ind];
                                                else
                                                    $asistencia[$key]->DatAsistenciasesion[0]->idcausa = null;
                                            }
                                        }
                                    }
                                } else {
                                    if (!empty($fechahoraentradaps[$ind]) &&
                                        $horaEntPersonaps > $horaEntradaTurnops && $horaEntPersonaps < $horaSalidaTurnops
                                    ) {
                                        if (!empty($idcausaps[$ind]) && ($idcausaps[$ind] != 6 && $idcausaps[$ind] != 3 && $idcausaps[$ind] != 5 && $idcausaps[$ind] != 2))
                                            $asistencia[$key]->DatAsistenciasesion[0]->idcausa = $idcausaps[$ind];
                                        else if ($tarde)
                                            $asistencia[$key]->DatAsistenciasesion[0]->idcausa = 3;
                                    } else {
                                        if (!empty($fechahorasalidaps[$ind]) &&
                                            $horaSalPersonaps > $horaEntradaTurnops && $horaSalPersonaps < $horaSalidaTurnops
                                        ) {
                                            if (!empty($idcausaps[$ind]) && ($idcausaps[$ind] != 6 && $idcausaps[$ind] != 3 && $idcausaps[$ind] != 5 && $idcausaps[$ind] != 2))
                                                $asistencia[$key]->DatAsistenciasesion[0]->idcausa = $idcausaps[$ind];
                                            else if ($salidaantes)
                                                $asistencia[$key]->DatAsistenciasesion[0]->idcausa = 5;
                                        } else {
                                            if (!empty($idcausaps[$ind]) && ($idcausaps[$ind] != 6 && $idcausaps[$ind] != 3 && $idcausaps[$ind] != 5 && $idcausaps[$ind] != 2))
                                                $asistencia[$key]->DatAsistenciasesion[0]->idcausa = $idcausaps[$ind];
                                            else
                                                $asistencia[$key]->DatAsistenciasesion[0]->idcausa = null;
                                        }
                                    }
                                }
                            }
                            if (($horas[0]['sum'] > '00:00:00' || $hrsDiariasFeriadas[0]['sum'] > '00:00:00') && (!empty($fechahoraentradass[$ind]) || !empty($fechahorasalidass[$ind]))) {
                                if (!empty($fechahoraentradass[$ind]) && !empty($fechahorasalidass[$ind])) {
                                    if ($horaEntPersonass > $horaEntradaTurnoss && $horaEntPersonass < $horaSalidaTurnoss &&
                                        $horaSalPersonass > $horaEntradaTurnoss && $horaSalPersonass < $horaSalidaTurnoss
                                    ) {
                                        if (!empty($idcausass[$ind]) && ($idcausass[$ind] != 6 && $idcausass[$ind] != 3 && $idcausass[$ind] != 5 && $idcausaps[$ind] != 2))
                                            $asistencia[$key]->DatAsistenciasesion[1]->idcausa = $idcausass[$ind];
                                        else if ($tardesalidaantes)
                                            $asistencia[$key]->DatAsistenciasesion[1]->idcausa = 6;
                                    } else {
                                        if (!empty($fechahoraentradass[$ind]) &&
                                            $horaEntPersonass > $horaEntradaTurnoss && $horaEntPersonass < $horaSalidaTurnoss
                                        ) {
                                            if (!empty($idcausass[$ind]) && ($idcausass[$ind] != 6 && $idcausass[$ind] != 3 && $idcausass[$ind] != 5 && $idcausaps[$ind] != 2))
                                                $asistencia[$key]->DatAsistenciasesion[1]->idcausa = $idcausass[$ind];
                                            else if ($tarde)
                                                $asistencia[$key]->DatAsistenciasesion[1]->idcausa = 3;
                                        } else {
                                            if (!empty($fechahorasalidass[$ind]) &&
                                                $horaSalPersonass > $horaEntradaTurnoss && $horaSalPersonass < $horaSalidaTurnoss
                                            ) {
                                                if (!empty($idcausass[$ind]) && ($idcausass[$ind] != 6 && $idcausass[$ind] != 3 && $idcausass[$ind] != 5 && $idcausaps[$ind] != 2))
                                                    $asistencia[$key]->DatAsistenciasesion[1]->idcausa = $idcausass[$ind];
                                                else if ($salidaantes)
                                                    $asistencia[$key]->DatAsistenciasesion[1]->idcausa = 5;
                                            } else {
                                                if (!empty($idcausass[$ind]) && ($idcausass[$ind] != 6 && $idcausass[$ind] != 3 && $idcausass[$ind] != 5 && $idcausaps[$ind] != 2))
                                                    $asistencia[$key]->DatAsistenciasesion[1]->idcausa = $idcausass[$ind];
                                                else
                                                    $asistencia[$key]->DatAsistenciasesion[1]->idcausa = null;
                                            }
                                        }
                                    }
                                } else {
                                    if (!empty($fechahoraentradass[$ind]) &&
                                        $horaEntPersonass > $horaEntradaTurnoss && $horaEntPersonass < $horaSalidaTurnoss
                                    ) {
                                        if (!empty($idcausass[$ind]) && ($idcausass[$ind] != 6 && $idcausass[$ind] != 3 && $idcausass[$ind] != 5 && $idcausaps[$ind] != 2))
                                            $asistencia[$key]->DatAsistenciasesion[1]->idcausa = $idcausass[$ind];
                                        else if ($tarde)
                                            $asistencia[$key]->DatAsistenciasesion[1]->idcausa = 3;
                                    } else {
                                        if (!empty($fechahorasalidass[$ind]) &&
                                            $horaSalPersonass > $horaEntradaTurnoss && $horaSalPersonass < $horaSalidaTurnoss
                                        ) {
                                            if (!empty($idcausass[$ind]) && ($idcausass[$ind] != 6 && $idcausass[$ind] != 3 && $idcausass[$ind] != 5 && $idcausaps[$ind] != 2))
                                                $asistencia[$key]->DatAsistenciasesion[1]->idcausa = $idcausass[$ind];
                                            else if ($salidaantes)
                                                $asistencia[$key]->DatAsistenciasesion[1]->idcausa = 5;
                                        } else {
                                            if (!empty($idcausass[$ind]) && ($idcausass[$ind] != 6 && $idcausass[$ind] != 3 && $idcausass[$ind] != 5 && $idcausaps[$ind] != 2))
                                                $asistencia[$key]->DatAsistenciasesion[1]->idcausa = $idcausass[$ind];
                                            else
                                                $asistencia[$key]->DatAsistenciasesion[1]->idcausa = null;
                                        }
                                    }
                                }
                            }
                            if (!empty($fdesde[$ind]))
                                $asistencia[$key]->fdesde = $fdesde[$ind];
                            else
                                $asistencia[$key]->fdesde = null;

                            if (!empty($fhasta[$ind]))
                                $asistencia[$key]->fhasta = $fhasta[$ind];
                            else
                                $asistencia[$key]->fhasta = null;

                            if (!empty($fdesde[$ind]) && !empty($fhasta[$ind])) {
                                $asistencia[$key]->idcausa = $idcausa[$ind];
                                $fechas = array();
                                //$h = $configRegimen->GetHrsByDateRange($fdesde[$ind], $fhasta[$ind], $value['idgrupodescanso']);
                                $h = $calendariopersona->getHorasCalendarioPersona($fdesde[$ind], $fhasta[$ind], $value['idpersona']);
                                $auxh = explode(':', $h[0]['sum']);
                                $asistencia[$key]->hrsdescontadas = $auxh[0] . ':' . $auxh[1];
                                $diasferiadoshab = DatDiaferiadohabilitado::GetDiasFeriadosHabByDateRange($value['idpersona'], $fdesde[$ind], $fhasta[$ind]);
                                foreach ($diasferiadoshab as $i => $val) {
                                    array_push($fechas, "'" . $val['fecha'] . "'");
                                }
                                if (count($diasferiadoshab) > 0) {
                                    //$suma = $this->ConfCalendario->GetSumHorasDiasFeriadosHabByDateArrayAndGroup($value['idgrupodescanso'], $fechas);
                                    $suma = $calendariopersona->GetSumHorasDiasFeriadosHabByDateArrayAndPerson($value['idpersona'], $fechas);
                                    $auxsuma = explode(':', $suma[0]['sum']);
                                    $asistencia[$key]->hrsdescontadas += $auxsuma[0] . ':' . $auxsuma[1];
                                    $asistencia[$key]->hrsdescontadas = $asistencia[$key]->hrsdescontadas;
                                }
                                $asistencia[$key]->DatAsistenciasesion[0]->idcausa = null;
                                $asistencia[$key]->DatAsistenciasesion[1]->idcausa = null;
                            } else {
                            }

                            if ((!empty($fechahoraentradaps[$ind]) || !empty($fechahorasalidaps[$ind]) || !empty($fechahoraentradass[$ind]) || !empty($fechahorasalidass[$ind])) && empty($idcausa[$ind])) {
                                $asistencia[$key]->idcausa = null;
                                $asistencia[$key]->hrsdescontadas = null;
                            }

                            if (!empty($asistencia[$key]->idcausa) && empty($asistencia[$key]->fechahorasalida) && empty($asistencia[$key]->fechahoraentrada)
                                && empty($asistencia[$key]->fdesde) && empty($asistencia[$key]->fhasta)
                            ) {
                                if (count($diaferiadohab) > 0) {
                                    $asistencia[$key]->hrsdescontadas = $auxhrsDiariasFeriadas[0] . ':' . $auxhrsDiariasFeriadas[1];
                                } else {
                                    $asistencia[$key]->hrsdescontadas = $auxhoras[0] . ':' . $auxhoras[0];
                                }
                            }
                            $asistencia[$key]->fecharegistro = $fecharegistro;
                            $asistencia[$key]->observacion = $observacion[$ind];

                            if (count($diaferiadohab) > 0) {
                                $asistencia[$key]->fhabilitado = 1;
                                if (!empty($asistencia[$key]->idcausa) && !empty($asistencia[$key]->fdesde) && !empty($asistencia[$key]->fhasta) &&
                                    $asistencia[$key]->fdesde <= $asistencia[$key]->fecharegistro && $asistencia[$key]->fhasta >= $asistencia[$key]->fecharegistro
                                ) {
                                    $asistencia[$key]->hferiadas = null;
                                } else {
                                    $htf = 0;
                                    $parts = explode(':', $asistencia[$key]->hrsdescontadas);
                                    $temphora = intval('0' . $auxhrsDiariasFeriadas[0]) - intval($parts[0]);

                                    $tempmin = 0;
                                    if ($parts[1] > 0) {
                                        $temphora = $temphora - 1;
                                        $tempmin = 60 - $parts[1];
                                    } else
                                        $tempmin = intval($parts[1]) - intval('00');

                                    if ($tempmin > 59) {
                                        $tempmin = $tempmin - 60;
                                        $temphora++;
                                    }
                                    if ($temphora < 10)
                                        $temphora = '0' . $temphora;
                                    if ($tempmin < 10)
                                        $tempmin = '0' . $tempmin;
                                    $htf = $temphora . ':' . $tempmin;
                                    $asistencia[$key]->hferiadas = $htf;
                                }
                            }
                        }
                    }
                }
            }
        }//print_r($asistencia);die;
        $asistencia->save();
        return array('succes' => true);
    }

    function upddatos($fecha, $idspersonas,$datos)
    {
        $idpersonas = array();
        $idpers = array();
        $controlacceso = array();
        $accesos = array();
        $model = new DatEstructuraasistenciaModel();
        $person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
            array($_SESSION['Zeolides']['perfil']['idpersona']), null, null, null, null, null, null, 'false', 'true', 'false', 'true'
        );
        if (is_numeric($person->data[0]['idcargo'])) {
            $personas = ZendExt_IoC_Inter::getInstance()->maestro->getControladosByDominioEstructuraPersona(
                2, $_SESSION['Zeolides']['entidad']->idestructura, $_SESSION['Zeolides']['perfil']['idpersona']
            );

            $ipersonacontrolador = $_SESSION['Zeolides']['perfil']['idpersona'];
            $p = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                array($ipersonacontrolador), null, null, null, null, null, null, 'false', 'true', 'false', 'true'
            );

            array_push($personas, $p->data[0]);

            $habcontrolaccesomodel = new ConfHabcontrolaccesoModel();
            $accesos = $habcontrolaccesomodel->getHabilitarcontrolacceso();
            $errorWSDL = false;
            foreach ($accesos as $k => $ca) {
                if ($ca['idca'] == 1)
                    $controlacceso[0] = $ca;
                else if ($ca['idca'] == 2)
                    $controlacceso[1] = $ca;
                else if ($ca['idca'] == 3)
                    $controlacceso[2] = $ca;
            }

            $cantCertificados = 0;
            foreach ($personas as $per => $peop) {
                if ($peop['idpersona'] != null && $peop['idcausa'] == null) {
                    $idpers[$per] = $peop['idpersona'];
                }
                $cantCertificados++;
            }
            //array_push($idpers, $ipersonacontrolador);
            if (!empty($idspersonas)) {
                $idpersonas = $idspersonas;
            } else {
                $idpersonas = $idpers;
            }

            /*Este codigo es para las personas que marcan con control de acceso pero no tiene en cuenta esa marcacion sino la de su truno de trabajo*/
            $habcargosnofirman = ConfHabcargosnofirman::getHabilitarcargosnofirman();
            if($habcargosnofirman[0]['habilitado'] == 1){
                $cargos = array();
                $idspers = array();
                $confCargosnofirman = new ConfCargosnofirman();
                $cargosnofirman = $confCargosnofirman->getCargosnofirman();

                $cargos = array_column($cargosnofirman, 'idcargo');

                if(!empty($cargos))
                    $pers = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array(), null, null, 0,null, $cargos, null);

                $idspers = array_column($pers->data, 'idpersona');

                foreach ($idpersonas as $p => $pe) {
                    if($this->existeidpersona($pe, $idspers))
                        unset($idpersonas[$p]);
                }
            }
            /*Este codigo es para las personas que marcan con control de acceso pero no tiene en cuenta esa marcacion sino la de su truno de trabajo*/

            $bandera = 0;
            // if ($controlacceso[0]['habilitadoca'] == 1) {
            if ($controlacceso[0]['habilitadosw'] == 1) {
                if (!empty($controlacceso[0]['dirautenticacion']) && !empty($controlacceso[0]['dirdatos'])) {
                    $bandera = 2;
                    $dirautenticacion = $controlacceso[0]['dirautenticacion'];
                    $dirdatos = $controlacceso[0]['dirdatos'];
                    //$errorWSDL = false;
                    try {
//                    $objectClientSeguridad =
//                        new soapClient("http://10.12.162.25:5802/seguridad/webservices/server.wsdl.php");
                        $objectClientSeguridad = new soapClient($dirautenticacion);
                        $certificado = $objectClientSeguridad->__call(
                            'authenticateUserApi', array('user' => 'administrador', 'password' => 'admin')
                        );
                        if (!empty($certificado) || $certificado != "") {
                            $clientControlacceso = new SoapClient(
//                            "http://10.12.162.25:5802/pvd/control_acceso/controlacceso/webservices/server.wsdl.php"
                                $dirdatos
                                , array(
                                    'trace' => 1,
                                    'exceptions' => false
                                )
                            );

                            $params = new stdClass();
                            $params->certificado = $certificado;
                            $params->metodo = 'getAccesosByIdpersonaFecha';
                            $params->parametros = array('idpersonas' => $idpersonas, 'fecha' => $fecha);
                            $params->usuario = 'administrador';
                            $accesos = array();
                            $accesos = $clientControlacceso->__call('GetDatosControlAcceso', array('params' => $params));
                        }
                    } catch (Exception $e) {
                        $result['success'] = false;
                        $result['msg'] = 4;
                        return $result;
                        $errorWSDL = true;
                    }
                }
            } elseif ($controlacceso[0]['habilitadoabd'] == 1) {
                $bandera = 2;
                $ConfPuntosacceso = new ConfPuntosacceso();
                $puntosacceso = $ConfPuntosacceso->getPuntosAcceso();
                $puntos = array();
                foreach ($puntosacceso as $pa){
                    array_push($puntos,$pa['idpuntoacceso']);
                }
                if(count($puntos)>0){
                    $accesos = $this->getControlAccesoData(array($fecha), $idpersonas,$puntos);
                }else{
                    $accesos = $this->getControlAccesoData(array($fecha), $idpersonas);
                }
            } //  }
            else if (count($controlacceso[1]['direstructura']) > 0) {
                $estruct = $this->existeestruct($_SESSION['Zeolides']['entidad']->idestructura, $controlacceso[1]['direstructura']);
                if (!empty($estruct)) {
                    $bandera = 1;
                    $accesos = array();
                    try {
                        //Verifica si existe el directorio, si no lo crea
                        if (!file_exists(substr(__FILE__, 0, strrpos(__FILE__, 'apps')) . 'apps/pvd/regimentrabajo/models/bussines/' . $estruct['idestructura']))
                            mkdir(substr(__FILE__, 0, strrpos(__FILE__, 'apps')) . 'apps/pvd/regimentrabajo/models/bussines/' . $estruct['idestructura']);

                        $config_file = substr(__FILE__, 0, strrpos(__FILE__, 'apps')) . 'apps/pvd/regimentrabajo/models/bussines/' . $estruct['idestructura'] . '/BTARJET.DBF';

                        $f = copy($estruct['dirapp'], $config_file);

                        if ($f) {
                            $accesos = $this->getTempusData($fecha, $config_file);
                        } else {
                            $result['success'] = false;
                            $result['msg'] = 5;
                            return $result;
                        }
                    } catch (Exception $e) {
                        print_r($e->getMessage());
                        die;
                    }
                }
            } else if (count($controlacceso[2]['direstructura']) > 0) {
                $fech = explode('/', $fecha);
                $date = $fech[2] . '-' . $fech[1] . '-' . $fech[0];
                $estruct = $this->existeestruct($_SESSION['Zeolides']['entidad']->idestructura, $controlacceso[2]['direstructura']);
                if (!empty($estruct)) {
                    $bandera = 3;
                    if (PHP_OS == 'WINNT') {
                        $accesos = $this->getANVIZDataSQLSRV($date, $estruct);
                    } else {
                        $accesos = $this->getANVIZDataMSSQL($date, $estruct);
                    }
                }
            }

            if (!empty($accesos)) {
                $confCalendarioPersona = new ConfCalendariopersona();
                $datAis = new DatAsistencia();
                $fechahoraentrada = array();
                $fechahorasalida = array();
                $idasistencia = array();
                $idspersonas = array();
                $fechahoraentradaayer = array();
                $fechahorasalidaayer = array();
                $idasistenciaayer = array();
                $idpersonasayer = array();
                $fechaentradaayer = array();
                $fechasalidaayer = array();
                $observacion = array();
                $f2 = null;
                if ($bandera == 1) {
                    foreach ($idpersonas as $key => $ipersona) {
                        if($this->existepers($ipersona, $accesos)){
                            $asis = array();
                            $ayer = false;
                            $updatedfromtempus = false;
                            $calendario = $confCalendarioPersona->getCalendarioPersona($fecha, $fecha, $ipersona);
                            if (count($calendario) == 0 || $calendario[0]['trabajo'] == 0) {
                                $f = explode('/', $fecha);
                                $f1 = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                                $f2 = date_add($f1, date_interval_create_from_date_string('-1 day'));
                                $FIT1 = explode('/', $f1->format('d/m/Y'));
                                $f1 = date_create($FIT1[2] . '-' . $FIT1[1] . '-' . $FIT1[0]);
                                $calendario2 = $confCalendarioPersona->getCalendarioPersona($f2->format('d/m/Y'), $f2->format('d/m/Y'), $ipersona);
                                if (count($calendario2) > 0 && $calendario2[0]['trabajo'] == 1 && $calendario2[0]['otrodia'] == 1) {
                                    $asis = $datAis->getAsistenciaByPersona($ipersona, $f2->format('d/m/Y'));
                                    $ayer = true;
                                    $accesos = $this->getTempusData($f2->format('d/m/Y'), $config_file);
                                }
                            } else {
                                $asis = $datAis->getAsistenciaByPersona($ipersona, $fecha);
                            }

                            if (count($asis) > 0 && $asis[0]['certificado'] == 0) {
                                if ($accesos[$asis[0]['numid']] && (trim($accesos[$asis[0]['numid']]['MENT']) != ':' || trim($accesos[$asis[0]['numid']]['MSAL']) != ':')) {
                                    if ($asis[0]['fechahoraentrada'] == null) {
                                        if (trim($accesos[$asis[0]['numid']]['MENT']) != ':') {
                                            if ($ayer) {
                                                $fechahoraentradaayer[] = $f2->format('d/m/Y') . ' ' . $accesos[$asis[0]['numid']]['MENT'];
                                                $fechaentradaayer[] = $f2->format('d/m/Y');
                                            } else {
                                                $fechahoraentrada[] = $fecha . ' ' . $accesos[$asis[0]['numid']]['MENT'];
                                                $fechaentrada[] = $fecha;
                                            }
                                            $updatedfromtempus = true;
                                        } else {
                                            if ($ayer) {
                                                $fechahoraentradaayer[] = null;
                                                $fechaentradaayer[] = $f2->format('d/m/Y');
                                            } else {
                                                $fechahoraentrada[] = null;
                                                $fechaentrada[] = $fecha;
                                            }
                                        }
                                    } else {
                                        if ($ayer) {
                                            $fechahoraentradaayer[] = $asis[0]['fechahoraentrada'];
                                            $fechaentradaayer[] = $f2->format('d/m/Y');
                                        } else {
                                            $fechahoraentrada[] = $asis[0]['fechahoraentrada'];
                                            $fechaarray = explode(' ', $asis[0]['fechahoraentrada']);
                                            $fechaentrada[] = $fechaarray[0];
                                        }
                                    }
                                    if ($asis[0]['fechahorasalida'] == null) {
                                        if (trim($accesos[$asis[0]['numid']]['MSAL']) != ':') {
                                            if ($ayer) {
                                                $fechahorasalidaayer[] = $fecha . ' ' . $accesos[$asis[0]['numid']]['MSAL'];
                                                $fechasalidaayer[] = $fecha;
                                            } else {
                                                if ($calendario[0]['otrodia'] == 1 && $accesos[$asis[0]['numid']]['DSAL'] == 1) {
                                                    $fsal = explode('/', $fecha);
                                                    $fsal1 = date_create($fsal[2] . '-' . $fsal[1] . '-' . $fsal[0]);
                                                    $fsal2 = date_add($fsal1, date_interval_create_from_date_string('1 day'));
                                                    $FIT2 = explode('/', $fsal1->format('d/m/Y'));
                                                    $fsal1 = date_create($FIT2[2] . '-' . $FIT2[1] . '-' . $FIT2[0]);
                                                    $fechahorasalida[] = $fsal2->format('d/m/Y') . ' ' . $accesos[$asis[0]['numid']]['MSAL'];
                                                    $fechasalida[] = $fsal2->format('d/m/Y');
                                                } else {
                                                    $fechahorasalida[] = $fecha . ' ' . $accesos[$asis[0]['numid']]['MSAL'];
                                                    $fechasalida[] = $fecha;
                                                }
                                            }
                                            $updatedfromtempus = true;
                                        } else {
                                            if ($ayer) {
                                                $fechahorasalidaayer[] = null;
                                                $fechasalidaayer[] = $fecha;
                                            } else {
                                                $fechahorasalida[] = null;
                                                $fsal = explode('/', $fecha);
                                                $fsal1 = date_create($fsal[2] . '-' . $fsal[1] . '-' . $fsal[0]);
                                                $fsal2 = date_add($fsal1, date_interval_create_from_date_string('1 day'));
                                                $FIT3 = explode('/', $fsal1->format('d/m/Y'));
                                                $fsal1 = date_create($FIT3[2] . '-' . $FIT3[1] . '-' . $FIT3[0]);
                                                $fechasalida[] = $fsal2->format('d/m/Y');
                                            }
                                        }
                                    } else {
                                        if ($ayer) {
                                            $fechahorasalidaayer[] = $asis[0]['fechahorasalida'];
                                            $fechasalidaayer[] = $fecha;
                                        } else {
                                            $fechahorasalida[] = $asis[0]['fechahorasalida'];
                                            $fechaarray = explode(' ', $asis[0]['fechahorasalida']);
                                            $fechasalida[] = $fechaarray[0];
                                        }
                                    }
                                    if ($ayer) {
                                        array_push($idasistenciaayer, $asis[0]['idasistencia']);
                                        array_push($idpersonasayer, $asis[0]['idpersona']);
                                    } else {
                                        array_push($idasistencia, $asis[0]['idasistencia']);
                                        array_push($idspersonas, $asis[0]['idpersona']);
                                    }
                                    if ($updatedfromtempus)
                                        array_push($observacion, 'Actualizado desde Tempus');
                                    else {
                                        array_push($observacion, $asis[0]['observacion']);
                                    }
                                }
                            }
                        }
                    }
                } else if ($bandera == 2) {
                    foreach ($datos as $person){
                        if($this->existepers($person->idpersona,$accesos)){
                            $nomCausa= new NomCausa();
                            $causa = $nomCausa->GetCausasById($person->idcausa);
                            if (($person->certificado == 0) && ((empty($person->idcausa)) || (!empty($person->idcausa) && $causa[0]['modifica'] == 1) || ($person->idcausa == -1))) {
                                if($person->idcausa == -1){
                                    $causas[] = -1;
                                }else
                                    $causas[] = null;
                                if($person->otrodia == 0){
                                    $fechahoraentra = $this->menorEntrada($accesos, $person->idpersona);
                                    if ($fechahoraentra != null) {
                                        $fechahoraentrada[] = $fechahoraentra;
                                        $fechaentrada[] = $fecha;
                                    }else{
                                        $fechahoraentrada[] = null;
                                        $fechaentrada[] = $fecha;
                                    }
                                    $fechahorasal = $this->mayorSalida($accesos, $person->idpersona);
                                    if ($fechahorasal != null) {
                                        $fechahorasalida[] = $fechahorasal;
                                        $fechasalida[] = $fecha;
                                    }else{
                                        $fechahorasalida[] = null;
                                        $fechasalida[] = $fecha;
                                    }
                                    if (!empty($person->idasistencia))
                                        $idasistencia[] = $person->idasistencia;
                                    if (!empty($person->idpersona))
                                        $idspersonas[] = $person->idpersona;
                                    if (!empty($person->observacion))
                                        $observacion[] = $person->observacion;
                                }else{
                                    $f = explode('/', $fecha);
                                    $f1 = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                                    if($person->finturno == $fecha){
                                        $f3 = date_add($f1, date_interval_create_from_date_string('-1 day'));
                                        $accesosayer = $this->getControlAccesoData(array($f3->format('d/m/Y'),$fecha), array($person->idpersona));
                                        $fechahoraentra = $this->menorEntrada($accesosayer, $person->idpersona);
                                        if ($fechahoraentra != null){
                                            $fechahoraentrada[] = $fechahoraentra;
                                            $fe = explode(' ', $fechahoraentra);
                                            $fechaentrada[] = $fe[0];
                                        }else{
                                            $fechahoraentrada[] = null;
                                            $fechaentrada[] = $f3->format('d/m/Y');
                                        }
                                        $fechahorasal = $this->mayorSalida($accesos, $person->idpersona);
                                        if ($fechahorasal != null)
                                            $fechahorasalida[] = $fechahorasal;
                                        else
                                            $fechahorasalida[] = null;
                                        $fechasalida[] = $fecha;
                                        if (!empty($person->idasistencia))
                                            $idasistencia[] = $person->idasistencia;
                                        if (!empty($person->idpersona))
                                            $idspersonas[] = $person->idpersona;
                                        if (!empty($person->observacion))
                                            $observacion[] = $person->observacion;
                                    }else if($person->finiturno == $fecha){
                                        $fechahoraentra = $this->menorEntrada($accesos, $person->idpersona);
                                        if ($fechahoraentra != null) {
                                            $fechahoraentrada[] = $fechahoraentra;
                                        }else{
                                            $fechahoraentrada[] = null;
                                        }
                                        $fechaentrada[] = $fecha;
                                        $f2 = date_add($f1, date_interval_create_from_date_string('+1 day'));
                                        $accesosmannana = $this->getControlAccesoData(array($fecha,$f2->format('d/m/Y')), array($person->idpersona));
                                        $fechahorasal = $this->mayorSalida($accesosmannana, $person->idpersona);
                                        if ($fechahorasal != null){
                                            $fechahorasalida[] = $fechahorasal;
                                            $fs = explode(' ', $fechahorasal);
                                            $fechasalida[] = $fs[0];
                                        }else{
                                            $fechahorasalida[] = null;
                                            $fechasalida[] = $f2->format('d/m/Y');
                                        }
                                        if (!empty($person->idasistencia))
                                            $idasistencia[] = $person->idasistencia;
                                        if (!empty($person->idpersona))
                                            $idspersonas[] = $person->idpersona;
                                        if (!empty($person->observacion))
                                            $observacion[] = $person->observacion;
                                    }

                                }
                            }
                        }
                    }
                } else if ($bandera == 3) {
                    foreach ($idpersonas as $key => $ipersona) {
                        if($this->existepers($ipersona,$accesos)){
                            $updatedfromanviz = false;
                            $asis = $datAis->getAsistenciaByPersona($ipersona, $fecha);
                            if (count($asis) > 0 && $asis[0]['certificado'] == 0) {
                                if ($accesos[$asis[0]['numid']] && (!empty($accesos[$asis[0]['numid']]['fechahoraentrada']) || !empty($accesos[$asis[0]['numid']]['fechahorasalida']))) {
                                    $updatedfromanviz = true;
                                    $fechahoraentrada[] = $accesos[$asis[0]['numid']]['fechahoraentrada'];
                                    $fechahorasalida[] = $accesos[$asis[0]['numid']]['fechahorasalida'];
                                    array_push($idasistencia, $asis[0]['idasistencia']);
                                    array_push($idspersonas, $asis[0]['idpersona']);
                                    $fechentrada = explode(' ', $accesos[$asis[0]['numid']]['fechahoraentrada']);
                                    $fechaentrada[] = $fechentrada;
                                    $fechsalida = explode(' ', $accesos[$asis[0]['numid']]['fechahorasalida']);
                                    $fechasalida[] = $fechsalida;
                                    if ($updatedfromanviz)
                                        array_push($observacion, 'Actualizado desde ANVIZ');
                                    else
                                        array_push($observacion, $asis[0]['observacion']);
                                }
                            }
                        }
                    }
                }

                $success = false;
                if (count($fechahoraentradaayer) > 0 && count($idasistenciaayer) > 0) {
                    $this->Insertar($idasistenciaayer, $idpersonasayer, $fechahoraentradaayer, $fechahorasalidaayer, null, array(), array(), array(), $f2->format('d/m/Y'), $observacion, true, $fechaentradaayer, $fechasalidaayer, true);
                    $result['success'] = true;
                    $success = true;
                }

                if (count($fechahoraentrada) > 0 && count($idasistencia) > 0) {
                    $this->Insertar($idasistencia, $idspersonas, $fechahoraentrada, $fechahorasalida, null, $causas, array(), array(), $fecha, $observacion, true, $fechaentrada, $fechasalida, true);
                    $result['success'] = true;
                } else {
                    if (!$success) {
                        $result['success'] = false;
                        $result['msg'] = 2;
                    }
                }
            } else {
                $result['success'] = false;
                $result['msg'] = 2;
            }
        } else {
            $result['success'] = false;
            $result['msg'] = 3;
        }
        return $result;
    }

    private function getControlAccesoData($dates, $idspersonas,$puntosacceso = array())
    {
        if(count($puntosacceso)>0){
            $puntacc = " and ca.idarbolestructura in (" . implode(',', $puntosacceso) . ")";
        }else
            $puntacc = "";
        $fechas = array();
        foreach ($dates as $key => $fecha) {
            $fechas[$key] = "CAST('" . $fecha . "' as date)";
        }
        $accesos = array();
        $sql = "select ca.*, ae.denom, p.idpersona, case when p.snombre is not null THEN
                        p.nombre||' '||p.snombre||' '||p.papel||' '||p.sapel
                        else
                        p.nombre||' '||p.papel||' '||p.sapel end as nombreapellidos
                    from  mod_controlacceso.dat_controlaccesopersona ca
                    LEFT JOIN mod_controlacceso.nom_arbolestructura ae ON(ca.idarbolestructura = ae.idarbolestructura)
                    INNER JOIN mod_persona.dat_persona p on(ca.idpersona = p.idpersona)			
                    where cast(ca.fechahoraacceso as date) IN (" . implode(',', $fechas) . ") 
                    and cast(p.idpersona as numeric) in (" . implode(',', $idspersonas) . ") $puntacc
                    order by nombreapellidos ASC, ca.fechahoraacceso DESC";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $accesos = $conn->fetchAll($sql);

        return $accesos;
    }

    private function getTempusData($fecha, $config_file)
    {
        try {
            $accesos = array();
            $db = dbase_open($config_file, 2);
            if ($db) {
                $fech = explode('/', $fecha);
                $fecharegistro = $fech[2] . $fech[1] . $fech[0];
                $numero_registros = dbase_numrecords($db);
                for ($i = 1; $i <= $numero_registros; $i++) {
                    $fila = dbase_get_record_with_names($db, $i);
                    if ($fila['FECHA'] == $fecharegistro) {
                        $accesos[$fila['ID']] = $fila;
                    }
                }
                dbase_close($db);
            }
        } catch (Exception $e) {
            log_message('error', $e->getMessage());
            throw $e;
        }
        return $accesos;
    }

    private function getANVIZDataSQLSRV($date, $estruct)
    {
        try {
            $server_name = $estruct['dirserver'];
            $connectionInfo = array("Database" => $estruct['nombredb'], "UID" => $estruct['usuario'], "PWD" => $estruct['contrasena']);
            $conn = sqlsrv_connect($server_name, $connectionInfo);

            if ($conn === false) {
                die(print_r(sqlsrv_errors(), true));
            }
            $params = array();
            $options = array("Scrollable" => SQLSRV_CURSOR_KEYSET);
//            $sql = "SELECT DISTINCT R.Uid as numid, R.Uname as nombreapellidos,
//                    (select MIN(R1.Checktime) FROM dbo.Z_MemRecord R1 where R1.Utype = 0 and R1.Uid = R.Uid and convert(varchar, R1.Checktime, 23) = cast('$date' as date)) as fechahoraentrada,
//                    (select MAX(R2.Checktime) FROM dbo.Z_MemRecord R2 where R2.Utype = 1 and R2.Uid = R.Uid and convert(varchar, R2.Checktime, 23) = cast('$date' as date)) as fechahorasalida
//                    FROM dbo.Z_MemRecord R
//                    where convert(varchar, R.Checktime, 23) = cast('$date' as date)";
//            $sql = "SELECT DISTINCT R.Uid as numid, R.Uname as nombreapellidos,
//                    (select MIN(R1.Checktime) FROM dbo.Z_MemRecord R1 where R1.Utype = 0 and R1.Uid = R.Uid and convert(varchar, R1.Checktime, 23) = cast('$date' as date) and R1.Disposeplan <> 'Eliminar') as fechahoraentrada,
//                    (select MAX(R2.Checktime) FROM dbo.Z_MemRecord R2 where R2.Utype = 1 and R2.Uid = R.Uid and convert(varchar, R2.Checktime, 23) = cast('$date' as date) and R2.Disposeplan <> 'Eliminar') as fechahorasalida
//                    FROM dbo.Z_MemRecord R
//                    where convert(varchar, R.Checktime, 23) = cast('$date' as date) and R.Disposeplan <> 'Eliminar'";
            $sql = "SELECT DISTINCT c.Userid as Userid, u.[Name],
                    (select MIN(ch1.CheckTime) FROM dbo.Checkinout ch1 where ch1.CheckType = 0 and ch1.Userid = c.Userid and convert(varchar, ch1.CheckTime, 23) = cast('$date' as date)) as fechahoraentrada,
                    (select MAX(ch2.CheckTime) FROM dbo.Checkinout ch2 where ch2.CheckType = 1 and ch2.Userid = c.Userid and convert(varchar, ch2.CheckTime, 23) = cast('$date' as date)) as fechahorasalida
                    FROM dbo.Checkinout c
                    INNER JOIN dbo.Userinfo u on c.Userid = u.Userid
                    WHERE convert(varchar, c.Checktime, 23) = cast('$date' as date)";

            $entradas = sqlsrv_query($conn, $sql, $params, $options);

            $accesos = array();
            for ($i = 0; $i < sqlsrv_num_rows($entradas); ++$i) {
                $fila = sqlsrv_fetch_array($entradas, SQLSRV_FETCH_ASSOC);
                $accesos[$fila["numid"]] = $fila;
            }

            sqlsrv_free_stmt($accesos);
            sqlsrv_close($conn); // close connection

        } catch (Exception $e) {
            log_message('error', $e->getMessage());
            throw $e;
        }
        return $accesos;
    }

    private function getANVIZDataMSSQL($date, $estruct)
    {
        try {
            /*******MSSQL*******/
            $server_name = $estruct['dirserver'];
            $database_name = $estruct['nombredb'];
            $username = $estruct['usuario'];
            $password = $estruct['contrasena'];

            $conn = mssql_connect($server_name, $username, $password);
            mssql_select_db($database_name, $conn);
//            $entradas = mssql_query("SELECT DISTINCT R.Uid as numid, R.Uname as nombreapellidos,
//                    (select MIN(R1.Checktime) FROM dbo.Z_MemRecord R1 where R1.Utype = 0 and R1.Uid = R.Uid and convert(varchar, R1.Checktime, 23) = cast('$date' as date)) as fechahoraentrada,
//                    (select MAX(R2.Checktime) FROM dbo.Z_MemRecord R2 where R2.Utype = 1 and R2.Uid = R.Uid and convert(varchar, R2.Checktime, 23) = cast('$date' as date)) as fechahorasalida
//                    FROM dbo.Z_MemRecord R
//                    where convert(varchar, R.Checktime, 23) = cast('$date' as date)", $conn);
//            $entradas = mssql_query("SELECT Z.Uid as numid, Z.Uname as nombreapellidos, Z.BeginTime as fechahoraentrada, EndTime as fechahorasalida
//                    FROM dbo.Z_MemAbnor Z
//                    where convert(varchar, Z.BeginTime, 23) = cast('$date' as date)", $conn);
            $entradas = mssql_query("SELECT DISTINCT c.Userid as Userid, u.[Name],
                    (select MIN(ch1.CheckTime) FROM dbo.Checkinout ch1 where ch1.CheckType = 0 and ch1.Userid = c.Userid and convert(varchar, ch1.CheckTime, 23) = cast('$date' as date)) as fechahoraentrada,
                    (select MAX(ch2.CheckTime) FROM dbo.Checkinout ch2 where ch2.CheckType = 1 and ch2.Userid = c.Userid and convert(varchar, ch2.CheckTime, 23) = cast('$date' as date)) as fechahorasalida
                    FROM dbo.Checkinout c
                    INNER JOIN dbo.Userinfo u on c.Userid = u.Userid
                    WHERE convert(varchar, c.Checktime, 23) = cast('$date' as date)", $conn);
            $accesos = array();
            for ($i = 0; $i < mssql_num_rows($entradas); ++$i) {
                $fila = mssql_fetch_assoc($entradas);
                $accesos[$fila["numid"]] = $fila;
            }

            mssql_free_result($accesos);
            mssql_close($conn); // close connection

        } catch (Exception $e) {
            log_message('error', $e->getMessage());
            throw $e;
        }
        return $accesos;
    }

    function cantAccesosByPersonANVIZ($accesos, $carnet)
    {
        $arreglo = array();
        foreach ($accesos as $index => $obj) {
            if ($index == $carnet) {
                array_push($arreglo, $carnet);
            }
        }
        return $arreglo;
    }

    function existeestruct($idestructura, $arregloestructuras)
    {
        $result = array();
        foreach ($arregloestructuras as $index => $obj) {
            if ($obj['idestructura'] == $idestructura) {
                $result = $obj;
            }
        }
        return $result;
    }

    public function existepers($idpersona, $personas)
    {
        $flag = false;
        foreach ($personas as $k => $per) {
            if ($per['idpersona'] == $idpersona)
                $flag = true;
        }
        return $flag;
    }

    public function existeidpersona($idpersona, $personas)
    {
        $flag = false;
        foreach ($personas as $k => $per) {
            if ($per == $idpersona)
                $flag = true;
        }
        return $flag;
    }

    function menorEntrada($accesos, $idpersona)
    {
        $aux = null;
        for ($i = 0; $i < count($accesos); $i++) {
            if ($accesos[$i]['acceso'] == 0) {
                if ($accesos[$i]['idpersona'] == $idpersona && $aux == null)
                    $aux = $accesos[$i]['fechahoraacceso'];
                if ($accesos[$i]['idpersona'] == $idpersona && $accesos[$i]['fechahoraacceso'] < $aux)
                    $aux = $accesos[$i]['fechahoraacceso'];
            }
        }
        return $aux;
    }

    function mayorSalida($accesos, $idpersona)
    {
        $aux = null;
        for ($i = 0; $i < count($accesos); $i++) {
            if ($accesos[$i]['acceso'] == 1) {
                if ($accesos[$i]['idpersona'] == $idpersona && $aux == null)
                    $aux = $accesos[$i]['fechahoraacceso'];
                if ($accesos[$i]['idpersona'] == $idpersona && $accesos[$i]['fechahoraacceso'] > $aux)
                    $aux = $accesos[$i]['fechahoraacceso'];
            }
        }
        return $aux;
    }

    function menorEntradaTempus($accesos, $ci)
    {
        $aux = null;
        for ($i = 0; $i < count($accesos); $i++) {
            if ($accesos[$i]['ID'] == $ci && $aux == null)
                $aux = $accesos[$i]['HORA'];
            if ($accesos[$i]['ID'] == $ci && $accesos[$i]['HORA'] < $aux)
                $aux = $accesos[$i]['HORA'];
        }
        return $aux;
    }

    function mayorSalidaTempus($accesos, $ci)
    {
        $aux = null;
        for ($i = 0; $i < count($accesos); $i++) {
            if ($accesos[$i]['ID'] == $ci && $aux == null)
                $aux = $accesos[$i]['HORA'];
            if ($accesos[$i]['ID'] == $ci && $accesos[$i]['HORA'] > $aux)
                $aux = $accesos[$i]['HORA'];
        }
        return $aux;
    }

    function cantAccesosByPersonTempus($accesos, $idpersona)
    {
        $arreglo = array();
        foreach ($accesos as $index => $obj) {
            if ($obj['ID'] == $idpersona) {
                array_push($arreglo, $idpersona);
            }
        }
        return $arreglo;
    }

    public function Eliminar($arrfechas, $idgrupodescanso)
    {
        try {
            $dates = array();
            foreach ($arrfechas as $key => $fecha) {
                $dates[$key] = "'" . $fecha . "'";
            }
            $this->DatAsistencia->DelAsistenciaOnDatesByGrupoDescanso($dates, $idgrupodescanso);

            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function EliminarAsistPersona($arrfechas, $idpersonascargos)
    {
        try {
            $dates = array();
            foreach ($arrfechas as $key => $fecha) {
                $dates[$key] = "'" . $fecha . "'";
            }
            $this->DatAsistencia->DelAsistenciaOnDatesByPersona($dates, $idpersonascargos);

            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getResumen($idestructura, $idtipoestructura, $fecha, $people, $start, $limit)
    {
        $idpersonas = array();
        if (count($people) == 0) {
            $personas = ZendExt_IoC_Inter::getInstance()->maestro->getControladosByDominioEstructuraPersona(
                2, $_SESSION['Zeolides']['entidad']->idestructura, $_SESSION['Zeolides']['perfil']['idpersona']
            );

            foreach ($personas as $person) {
                array_push($idpersonas, $person['idpersona']);
            }
        } else {
            $idpersonas = $people;
        }
        $resumenGrafico = array();
        $grafica = array();

        if (count($idpersonas) > 0) {
            $asistencia = new DatAsistencia();
            $datos = $asistencia->GetReporte($idpersonas, $fecha, $start, $limit);
            if (count($datos) != 0) {
                $canttotal = $asistencia->GetCantReporte($idpersonas, $fecha);
                $denEntAreas = $this->GetDenomEntAreas($datos);
                foreach ($datos as $key => $persona) {
                    $datos[$key]['denomentidad'] = $denEntAreas[$datos[$key]['identidad']]['denominacion'];
                    $datos[$key]['denomarea'] = (is_numeric($datos[$key]['idarea'])) ? $denEntAreas[$datos[$key]['idarea']]['denominacion'] : 'Sin Cargo';

                    if (empty($persona['idcausa'])) {
                        $datos[$key]['causa'] = 'Presente';
                    } else {
                        $datos[$key]['causa'] = $persona['denominacion'] . '[' . $persona['abreviaturacausa'] . ']';
                    }
                    $datos[$key]['idcategoria'] = $persona['idpadrecategoria'];
                    if ($persona['idgrado']) {
                        $denomgrado = ZendExt_IoC::getInstance()->metadatos->dameGrado($persona['idgrado']);
                        $datos[$key]['gradocategoriallamado'] = $denomgrado[0]['denominacion'];
                    } else {
                        $datos[$key]['gradocategoriallamado'] = $persona['denomcategoriapersona'];
                    }

                    if (!empty($persona['identidad']) && (empty($persona['idcargo']) && empty($persona['idarea']))) {
                        $datos[$key]['denomarea'] = 'Sin Cargo';
                        $datos[$key]['denomcargo'] = 'Sin Cargo';
                    }
                }
                $datosgrafica = $asistencia->GetReporte($idpersonas, $fecha, null, null);
                foreach ($datosgrafica as $key => $per) {
                    if (empty($per['idcausa'])) {
                        $resumenGrafico['Presente'] += 1;
                    } else {
                        $resumenGrafico[$per['denominacion']] += 1;
                    }
                }
                $llaves = array_keys($resumenGrafico);
                $cont = 0;
                foreach ($resumenGrafico as $key => $valor) {
                    $grafica[$cont] = array(0 => $llaves[$cont], 1 => $valor);
                    $cont++;
                }
            } else {
                $datos = array();
                $canttotal = 0;
            }
        }
        $grafic['name'] = $llaves;
        $grafic['data'] = $grafica;
        $result['resumen'] = $grafic;
        $result['datos'] = $datos;
        $result['cantidad'] = $canttotal;
        return $result;
    }

    public function GetReporteAsist($idestructura, $idcausa, $idturnotrabajo, $fecha, $inicio, $limite, $filtro, $agrupador = null)
    {
        $arraycausa = $idcausa;
        $idpersonas = array();
        $arreglodatos = array();
        $datosNoRegistro = array();
        $asissincausa = array();
        $datos = array();
        $resumenGrafico = array();
        $grafica = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $asistencia = new DatAsistencia();
        if (!empty($cargosPeople))
            $PersonCargo = $asistencia->GetDatosPersonaReporte($cargosPeople, $filtro, null, 0, $fecha, $fecha);

        /*if (count($PersonCargo) > 0 && $agrupador == 2) {
            $cargosPeople = array_unique($cargosPeople);
            $PersonCargo = $this->ordenarInfoByCargo($cargosPeople, $PersonCargo);
        }*/

        $personas = array();
        foreach ($PersonCargo as $person) {
            array_push($idpersonas, $person['idpersona']);
            $personas[$person['idpersona']] = $person;
        }
        $denEntAreas = $this->GetDenomEntAreas($personas);
        if (count($idpersonas) > 0) {
            $datos = $asistencia->GetReporteAsist($idpersonas, $idcausa, $idturnotrabajo, $fecha, 0, null);

            //SIN REGISTRO DE ASISTENCIA
            if (is_numeric(array_search(-2, $idcausa)))
                unset($idcausa[array_search(-2, $idcausa)]);
            if (is_numeric(array_search(-1, $idcausa)))
                unset($idcausa[array_search(-1, $idcausa)]);
            $arreglodatos = $asistencia->GetReporteAsist($idpersonas, null, $idturnotrabajo, $fecha, 0, null);

            $idpersonasDatos = array();
            foreach ($arreglodatos as $person) {
                array_push($idpersonasDatos, $person['idpersona']);
            }
            $posDatos = count($idpersonasDatos);
            if ((empty($arraycausa) || is_numeric(array_search(-1, $arraycausa))) && empty($idturnotrabajo)) {
                $diff = array_diff($idpersonas, $idpersonasDatos);
                $datosNoRegistro = array();
                foreach ($diff as $i => $p) {
                    $noregistro = array();
                    $noregistro['nombreapellidos'] = $personas[$p]['nombreapellidos'];
                    $noregistro['numid'] = $personas[$p]['numid'];
                    $noregistro['denomcargo'] = $personas[$p]['denomcargo'];
                    $noregistro['idarea'] = $personas[$p]['idarea'];
                    $noregistro['denomarea'] = $denEntAreas[$personas[$p]['idarea']]['denominacion'];
                    $noregistro['idcausa'] = -1;
                    $noregistro['causa'] = 'Sin registro de asistencia';
                    $noregistro['denomentidad'] = $denEntAreas[$personas[$p]['identidad']]['denominacion'];
                    $noregistro['idpersona'] = $personas[$p]['idpersona'];
                    $datosNoRegistro[$posDatos++] = $noregistro;
                }
            }

            //SIN CAUSA
            if (is_numeric(array_search(-2, $arraycausa))) {
                $asissincausa = $asistencia->GetReporteAsistSincausa($idpersonas, $idturnotrabajo, $fecha);
                foreach ($asissincausa as $k => $v) {
                    array_push($datos, $v);
                }
            }

            foreach ($datos as $key => $persona) {
                $datos[$key]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                $datos[$key]['idarea'] = $persona['idarea'];
                $datos[$key]['denomarea'] = (is_numeric($persona['idarea'])) ? $denEntAreas[$persona['idarea']]['denominacion'] : 'Sin Cargo';

                if (!empty($persona['fechahoraentrada']) && empty($persona['idcausa'])) {
                    $datos[$key]['idcausa'] = -2;
                    $datos[$key]['causa'] = 'Sin Causa';
                } else if (!empty($persona['idcausa'])) {
                    $datos[$key]['causa'] = $persona['causa'] . ' [' . $persona['abreviaturacausa'] . ']';
                }
                if (empty($persona['idcausa']) && empty($persona['fechahoraentrada']) && empty($persona['fechahorasalida'])) {
                    $datos[$key]['idcausa'] = -1;
                    $datos[$key]['causa'] = 'Sin registro de asistencia';
                }
                if (!empty($persona['fechahoraentrada'])) {
                    $v = explode(' ', $persona['fechahoraentrada']);
                    $k = explode(':', $v[1]);
                    $datos[$key]['fechahoraentrada'] = (!empty($v[1])) ? $k[0] . ':' . $k[1] : null;
                    if (empty($v[0]))
                        $datos[$key]['fechaentrada'] = $fecha;
                    else
                        $datos[$key]['fechaentrada'] = $v[0];

                    $a = explode(' ', $persona['fechahorasalida']);
                    $j = explode(':', $a[1]);
                    $datos[$key]['fechahorasalida'] = (!empty($a[1])) ? $j[0] . ':' . $j[1] : null;
                    $datos[$key]['fechasalida'] = $a[0];
                }
            }

            if ((empty($arraycausa) || is_numeric(array_search(-1, $arraycausa))) && empty($idturnotrabajo)) {
                foreach ($datosNoRegistro as $k => $v) {
                    array_push($datos, $v);
                }
            }

            foreach ($datos as $key => $per) {
                if ($per['idcausa'] == -1) {
                    $resumenGrafico['Sin registro'] += 1;
                } else {
                    if (!empty($per['fechahoraentrada']) || (!empty($per['idcausa']) && $per['afectasalario'] == 0)) {
                        $resumenGrafico['Presente'] += 1;
                    } else if (!empty($per['idcausa']) && $per['idcausa'] != -2 && $per['idcausa'] != -1) {
                        $resumenGrafico[$per['causa']] += 1;
                    }
                }
                if (!empty($agrupador)) {
                    if ($agrupador == 1) {
                        $datos[$key]['agrupador'] = $per['causa'];
                    } else if ($agrupador == 2) {
                        $datos[$key]['agrupador'] = $per['denomarea'];
                    }
                }
            }

            $llaves = array_keys($resumenGrafico);
            $cont = 0;
            foreach ($resumenGrafico as $key => $valor) {
                $grafica[$cont] = array(0 => $llaves[$cont], 1 => $valor);
                $cont++;
            }
        }
        $grafic['name'] = $llaves;
        $grafic['data'] = $grafica;
        $result['resumen'] = $grafic;
        $result['datos'] = $datos;
        $result['cantidad'] = count($idpersonas);
        return $result;
    }

    public function GetDatosAsistencia($idestructura, $idcausa, $idturnotrabajo, $fecha)
    {
        $asistencia = new DatAsistencia();
        $idpersonas = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $PersonCargo = $asistencia->GetDatosPersonaReporte($cargosPeople, null, null, 0, null, null);
        $personas = array();

        foreach ($PersonCargo as $person) {
            array_push($idpersonas, $person['idpersona']);
            $personas[$person['idpersona']] = $person;
        }
        $denEntAreas = $this->GetDenomEntAreas($personas);
        if (count($idpersonas) > 0) {
            $datos = $asistencia->GetReporteAsist($idpersonas, $idcausa, $idturnotrabajo, $fecha, null, null, null);

            foreach ($datos as $key => $persona) {
                $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($persona['identidad']);
                $datos[$key]['denomentidad'] = $entidad[0]->denominacion . ' (' . $entidad[0]->codigo . ')';
                $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($persona['idarea']);
                if (empty($area))
                    $datos[$key]['denomarea'] = 'Sin Cargo';
                else
                    $datos[$key]['denomarea'] = $area[0]->denominacion;

                if (empty($persona['idcausa'])) {
                    $datos[$key]['causa'] = 'Presente';
                } else {
                    $datos[$key]['causa'] = $persona['causa'] . ' [' . $persona['abreviaturacausa'] . ']';
                }
                $datos[$key]['bandera'] = 0;
            }

            $idpersonasDatos = array();
            foreach ($datos as $person) {
                array_push($idpersonasDatos, $person['idpersona']);
            }
            $posDatos = count($idpersonasDatos);

            $diff = array_diff($idpersonas, $idpersonasDatos);

            $datosNoRegistro = array();
            foreach ($diff as $p) {
                $noregistro = array();
                $noregistro['nombreapellidos'] = $personas[$p]['nombreapellidos'];
                $noregistro['numid'] = $personas[$p]['numid'];
                $noregistro['denomcargo'] = $personas[$p]['denomcargo'];
                $noregistro['denomarea'] = $denEntAreas[$personas[$p]['idarea']]['denominacion'];
                $noregistro['denomentidad'] = $denEntAreas[$personas[$p]['identidad']]['denominacion'];
                $noregistro['idpersona'] = $personas[$p]['idpersona'];
                $noregistro['causa'] = 'Sin registro de asistencia';
                $noregistro['idarea'] = $personas[$p]['idarea'];
                $noregistro['bandera'] = 1;
                array_push($datos, $noregistro);
            }
        }
        $result['datos'] = $datos;
        $result['cantidad'] = count($idpersonas);
        return $result;
    }

    public function GetReporteEstadistico($idsestructura, $idstipoestructura, $denomestructuras, $tienecategorias,
                                          $fecha)
    {
        $result = array();
        foreach ($idsestructura as $a => $idestructura) {
            $arrResumen = $this->getResumen($idestructura, $idstipoestructura[$a], $fecha, array(), null, null);
            $est = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura,
                $_SESSION['Zeolides']['perfil']['iddominio'], true);

            $idcargos = array();
            foreach ($est as $key => $idcargo) {
                array_push($idcargos, $idcargo['idestructura']);
            }
            $datos = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($idcargos);
            $cantidad = 0;
            $cantidadreal = 0;

            foreach ($datos as $key => $val) {
                $cantidad += $val['cantidad'];
                $cantidadreal += $val['cantidadreal'];
            }

            $totalfuera = 0;
            $result[$a]['presente'] = 0;
            foreach ($arrResumen['datos'] as $key => $val) {
                if (empty($val['idcausa'])) {
                    $result[$a]['presente'] += 1;

                } else {
                    $totalfuera += 1;
                    if ($tienecategorias == 'true') {
                        $result[$a][$val['idcausa'] . '/' . $val['idcategoria']] += 1;
                        $result[$a]['subtotal/' . $val['idcategoria']] += 1;
                    } else {
                        $result[$a][$val['idcausa']] += 1;
                    }
                }
            }
            $domain = new DatAsistencia();
            $fueraplantilla = $domain->GetPersonalFueraPlantilla($idestructura);

            $result[$a]['idestructura'] = $idestructura;
            $result[$a]['porplantilla'] = $cantidad;
            $result[$a]['cubierto'] = $cantidadreal;
            $result[$a]['fueraplantilla'] = count($fueraplantilla);
            $result[$a]['totalpersonas'] = $result[$a]['cubierto'] + $result[$a]['fueraplantilla'];
            $result[$a]['totalfuera'] = $totalfuera;
            $result[$a]['denomentidad'] = $denomestructuras[$a];
            $result[$a]['resumen'] = $arrResumen['resumen'];
        }
        $r['datos'] = $result;
        $r['resumen'] = $arrResumen['resumen'];
        $r['cantidad'] = count($result);
        return $r;
    }

    public function Insert($arrDatos)
    {
        $domain = new DatAsistencia();
        $var = $domain->Insert($arrDatos);
        return $var;
    }

    public function Insertferiados($arrDatos)
    {
        $domain = new DatAsistencia();
        $var = $domain->InsertFeriados($arrDatos);
        return $var;
    }

    public function InsertSesiones($arrDatos)
    {
        $domain = new DatAsistencia();
        $var = $domain->InsertSesiones($arrDatos);
        return $var;
    }

    public function GetDenomEntAreas($datos)
    {
        foreach ($datos as $rep) {
            if (!empty($rep['idarea'])) {
                $idareas[] = $rep['idarea'];
            }
            if (!empty($rep['identidad'])) {
                $identidades[] = $rep['identidad'];
            }
        }
        $entarea = array_merge($idareas, $identidades);
        $entarealimpios = array_unique($entarea);
        if (count($entarealimpios) > 0) {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "SELECT nfe.idfila AS id,
                    (CASE WHEN de.idestructura IS NOT NULL THEN de.denominacion
                          WHEN deop.idestructuraop IS NOT NULL THEN deop.denominacion
                          WHEN dc.idcargo IS NOT NULL THEN nc.denominacion ELSE 'NO CONOCIDO' END
                    ) AS denominacion,
                    nfe.idconcepto

                    FROM mod_estructuracomp.nom_filaestruc nfe
                    LEFT JOIN mod_estructuracomp.dat_estructura de ON (de.idestructura = nfe.idfila)
                    LEFT JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = nfe.idfila)
                    LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = nfe.idfila)
                    LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
                    WHERE nfe.idfila IN (" . implode(',', $entarealimpios) . ")";
            $entAreas = $conn->fetchAll($sql);
            $denEntAreas = array();
            foreach ($entAreas as $entareas) {
                $denEntAreas[$entareas['id']] = $entareas;
            }
            return $denEntAreas;
        } else {
            return array();
        }
    }

    public function GetDiaFeriadoHabilitado($idpersona, $fecha)
    {
        return DatDiaferiadohabilitado:: GetDiaFeriadoHabilitado($idpersona, $fecha);
    }

    public function GetReporteAsistencia($fecha, $idpersonas)
    {
        $asist = $this->DatAsistencia->GetAsistencia($idpersonas, $fecha, $fecha);
        $asistencia = array();
        foreach ($asist as $k => $v) {
            $asistencia[$v['idpersona']] = $v;
        }
        return $asistencia;
    }

    function getMes()
    {
        $meses = array();
        $meses[0]['idmes'] = '01';
        $meses[0]['mes'] = 'Enero';
        $meses[1]['idmes'] = '02';
        $meses[1]['mes'] = 'Febrero';
        $meses[2]['idmes'] = '03';
        $meses[2]['mes'] = 'Marzo';
        $meses[3]['idmes'] = '04';
        $meses[3]['mes'] = 'Abril';
        $meses[4]['idmes'] = '05';
        $meses[4]['mes'] = 'Mayo';
        $meses[5]['idmes'] = '06';
        $meses[5]['mes'] = 'Junio';
        $meses[6]['idmes'] = '07';
        $meses[6]['mes'] = 'Julio';
        $meses[7]['idmes'] = '08';
        $meses[7]['mes'] = 'Agosto';
        $meses[8]['idmes'] = '09';
        $meses[8]['mes'] = 'Septiembre';
        $meses[9]['idmes'] = '10';
        $meses[9]['mes'] = 'Octubre';
        $meses[10]['idmes'] = '11';
        $meses[10]['mes'] = 'Noviembre';
        $meses[11]['idmes'] = '12';
        $meses[11]['mes'] = 'Diciembre';
        return $meses;
    }

    function guardarAsistencia($fecha, $hora, $flag, $idpersona, $estado)
    {
        $calendariopersona = new ConfCalendariopersona();
        $model = new DatEstructuraasistenciaModel();
        $person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
            array($idpersona), null, null, null, null, null, null, 'false', 'true', 'false', 'true'
        );

        $datAis = new DatAsistencia();
        $asistencia = $datAis->getAsistenciaByPersona($idpersona, $fecha);

        $UPDHE = '';
        $UPDHS = '';
        $UPDD = '';
        $UPDT = '';
        $UPDHEX = '';
        $CAUSA = '';
        $entrada = "";
        $salida = "";
        $UPDestado = "";
        $arrayIdPersonas = array();
        $ActSoloSalida = false;

        $fech = explode('-', $fecha);

        //buscando la cantidad de horas que trabaja la persona en el dia
        $configRegimen = new ConfCalendarioModel();
        $regimen = Array();
        foreach ($person->data[0]['DatRegimentrabajo'] as $regimentrab) {
            if ($regimentrab['actual'] == 1)
                $regimen = $regimentrab;
        }
//        $horas = $configRegimen->GetHrsByDateRange($fecha, $fecha, $regimen['idgrupodescanso']);
        $horas = $calendariopersona->getHorasCalendarioPersona($fecha, $fecha, $idpersona);
        $auxhoras = explode(':', $horas[0]['sum']);
        //Buscando el turno de trabajo de la persona para saber horario de almuerzo y Hinicio y Hfin
        $horatt = $this->DatAsistencia->getHorarioByPersona($idpersona, $fecha);
        $dia = $calendariopersona->getCalendarioPersona($fecha, $fecha, $idpersona);
        //$hrsDiariasFeriadas = $this->ConfCalendario->HrsFeriadasByDateRange($fecha, $fecha, $regimen['idgrupodescanso']);
        $hrsDiariasFeriadas = $calendariopersona->getHrsFeriadasPersona($fecha, $fecha, $idpersona);
        $auxhrsDiariasFeriadas = explode(':', $hrsDiariasFeriadas[0]['sum']);
        $diaferiadohab = $this->GetDiaFeriadoHabilitado($idpersona, $fecha);

        if ($dia[0]['idtipodedia'] != 12 && $dia[0]['idtipodedia'] != 8) {
            if ($flag == 1) {
                $salida = explode(':', $horatt['horafin']);
                $entrada = explode(':', $hora);
            } else {
                $salida = explode(':', $hora);
                $tmph = explode(' ', $asistencia[0]['fechahoraentrada']);
                $entrada = explode(':', $tmph[1]);
            }
        } else {
            if ($flag == 1) {
                $entrada = explode(':', $hora);
            } else {
                $salida = explode(':', $hora);
                $horafin = new DateTime(
                    date(
                        'H:i',
                        mktime($salida[0], $salida[1], $salida[2], 1, 1, 2000)
                    )
                ); //Construccion del DateTime de la hora final
                $tmph = explode(' ', $asistencia[0]['fechahoraentrada']);
                $entrada = explode(':', $tmph[1]);
            }
        }
        $horaini = new DateTime(
            date('H:i', mktime($entrada[0], $entrada[1], $entrada[2], 1, 1, 2000))
        ); //Construccion del DateTime de la hora inicial
        $causa = 'null::int';
        $idturno = 'null::int';
        $hrstrabajadas = 'null';
        $horaFinalextras = 'null';
        $horaFinalperdidas = 'null';
        if ($dia[0]['idtipodedia'] != 12 && $dia[0]['idtipodedia'] != 8) {
            $horafin = new DateTime(
                date(
                    'H:i',
                    mktime($salida[0], $salida[1], $salida[2], 1, 1, 2000)
                )
            ); //Construccion del DateTime de la hora final

            $Halmuerzo = explode(':', $horatt['horarioalmuerzo']);
            $horaalmuerzo = new DateTime(
                date(
                    'H:i',
                    mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], 1, 1, 2000)
                )
            );
            $idturno = $horatt['idturnotrabajo'];
            $hitt = explode(':', $horatt['horainicio']);
            $hftt = explode(':', $horatt['horafin']);
            $hdiftt = explode(':', $horatt['hlab']);
            $TDesc = explode(':', $horatt['tdescanso']);
            $te = explode(':', $horatt['toleranciaentrada']);
            $ts = explode(':', $horatt['toleranciasalida']);

            $horainitt = new DateTime(date('H:i', mktime($hitt[0], $hitt[1], 0, 1, 1, 2000))); //Construccion del DateTime de la hora inicial
            $horafintt = new DateTime(date('H:i', mktime($hftt[0], $hftt[1], 0, 1, 1, 2000))); //Construccion del DateTime de la hora final
            $horadiftt = new DateTime(date('H:i', mktime($hdiftt[0], $hdiftt[1], 0, 1, 1, 2000)));

            $horainittT = new DateTime(date('H:i', mktime($hitt[0], $hitt[1], 0, 1, 1, 2000)));
            if (!empty($te[0])) {
                $HITEMP = $horainittT->add(new DateInterval("PT" . $te[0] . "H" . $te[1] . "M" . $te[2] . "S"));
            }
            if (!empty($horatt['toleranciaentrada']) && $horaini >= $horainitt &&
                $horaini <= $HITEMP
            ) {
                $horaini = $horainitt;
            }

            if ($flag != 1) {
                $horafinttT = new DateTime(date('H:i', mktime($hftt[0], $hftt[1], 0, 1, 1, 2000)));
                if (!empty($ts[0]))
                    $HFTEMP = $horafinttT->sub(new DateInterval("PT" . $ts[0] . "H" . $ts[1] . "M" . $ts[2] . "S"));
                if (!empty($horatt['toleranciasalida']) && $horafin >= $HFTEMP
                    && $horafin <= $horafintt
                ) {
                    $horafin = $horafintt;
                }
            }

            $habcausas = new ConfHabCausaModel();
            $causasdefecto = $habcausas->getHabilitarcausa();
            $ausencia = false;
            $tarde = false;
            $salidaantes = false;
            $tardesalidaantes = false;
            if ($causasdefecto[0]['habilitado'] == 1) {
                $ausencia = true;
            }
            if ($causasdefecto[1]['habilitado'] == 1) {
                $tarde = true;
            }
            if ($causasdefecto[2]['habilitado'] == 1) {
                $salidaantes = true;
            }
            if ($causasdefecto[3]['habilitado'] == 1) {
                $tardesalidaantes = true;
            }

            if ($flag == 1) {
                if ($horaini > $horainitt && $horaini < $horafintt && $tarde) {
                    $causa = 3;
                }
            } else {
                if ($horaini > $horainitt && $horaini < $horafintt &&
                    $horafin > $horainitt && $horafin < $horafintt && $tardesalidaantes
                ) {
                    $causa = 6;
                } else {
                    if ($horaini > $horainitt && $horaini < $horafintt && $tarde) {
                        $causa = 3;
                    } else {
                        if ($horafin > $horainitt && $horafin < $horafintt && $salidaantes) {
                            $causa = 5;
                        }
                    }
                }
            }
            if ($horatt['tdescanso']) {
                $horadesc = new DateTime(date('H:i', mktime($TDesc[0], $TDesc[1], $TDesc[2], 1, 1, 2000)));
                $diflabmenosdescanso = date_diff($horadiftt, $horadesc);
                if ($dia[0]['trabajo'] == 1) {
                    $horasdia = $auxhoras[0];
                } elseif (count($diaferiadohab) > 0) {
                    $horasdia = $auxhrsDiariasFeriadas[0];
                } else {
                    $horasdia = 0;
                }
                if ($diflabmenosdescanso->i == 0 && $diflabmenosdescanso->h != $horasdia) {
                    $horafintt = new DateTime(date('H:i', mktime($hitt[0] + $auxhoras[0], $hitt[1], 0, 1, 1, 2000)));
                    $hftt[0] = $hitt[0] + $auxhoras[0];
                    $hftt[1] = $hitt[1];
                }
            } else {
                if ($hdiftt[1] == 00 && $hdiftt[0] != $auxhoras[0]) {
                    $horafintt = new DateTime(date('H:i', mktime($hitt[0] + $auxhoras[0], $hitt[1], 0, 1, 1, 2000)));
                    $hftt[0] = $hitt[0] + $auxhoras[0];
                    $hftt[1] = $hitt[1];
                }
            }
            $horaentradareal = $horaini; //Construccion del DateTime de la hora inicial
            $horasalidareal = $horafin; //Construccion del DateTime de la hora final
            $diferenciainicial = date_diff($horainitt, $horaentradareal); //Funcion de Date para la diferencia de fechas y horas
            $diferenciafinal = date_diff($horasalidareal, $horafintt); //Funcion de Date para la diferencia de fechas y horas

            if (!empty($horatt['horarioalmuerzo'])) {
                $horaalmuerzoplustdesc = new DateTime(date('H:i', mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], 1, 1, 2000)));
                if ($horasalidareal <= $horaalmuerzo) {//salida anticipada
                    $diferenciafinal = date_diff(new DateTime($diferenciafinal->h . ':' . $diferenciafinal->i . ':' . $diferenciafinal->s), $horadesc);
                }
                $horaalmuerzoplustdesc = $horaalmuerzoplustdesc->add(new DateInterval("PT" . $TDesc[0] . "H" . $TDesc[1] . "M" . $TDesc[2] . "S"));
                if ($horaentradareal >= $horaalmuerzoplustdesc) {//llegada tarde
                    $diferenciainicial = date_diff(new DateTime($diferenciainicial->h . ':' . $diferenciainicial->i . ':' . $diferenciainicial->s), $horadesc);
                }
                if ($horaentradareal > $horaalmuerzo && $horaentradareal < $horaalmuerzoplustdesc) {
                    $diferencia = date_diff($horaentradareal, $horaalmuerzo);
                    $diferenciainicial = date_diff(new DateTime($diferenciainicial->h . ':' . $diferenciainicial->i . ':' . $diferenciainicial->s), new DateTime($diferencia->h . ':' . $diferencia->i . ':' . $diferencia->s));
                }
                if ($horasalidareal > $horaalmuerzo && $horasalidareal < $horaalmuerzoplustdesc) {
                    $diferencia = date_diff($horasalidareal, $horaalmuerzoplustdesc);
                    $diferenciafinal = date_diff(new DateTime($diferenciafinal->h . ':' . $diferenciafinal->i . ':' . $diferenciafinal->s), new DateTime($diferencia->h . ':' . $diferencia->i . ':' . $diferencia->s));
                }
            }

            if ($hitt[0] > $entrada[0] || ($hitt[0] == $entrada[0] && $hitt[1] > $entrada[1])) { //horario extra inicial
                $he = $diferenciainicial->h;
                $me = $diferenciainicial->i;
                $hp = 0;
                $mp = 0;
            } else {
                $he = 0;
                $me = 0;
                $hp = $diferenciainicial->h;
                $mp = $diferenciainicial->i;
            }
            if ($hftt[0] < $salida[0] || ($hftt[0] == $salida[0] && $hftt[1] < $salida[1])) { //horario extra final
                $he += $diferenciafinal->h;
                $me += $diferenciafinal->i;
                $he = ($me > 59) ? $he + 1 : $he;
                $me = ($me > 59) ? $me - 60 : $me;
            } else {
                $hp += $diferenciafinal->h;
                $mp += $diferenciafinal->i;
                $hp = ($mp > 59) ? $hp + 1 : $hp;
                $mp = ($mp > 59) ? $mp - 60 : $mp;
            }

            $hdriariasmax = ConfHorasextras::getById(1);

            if ($he >= $hdriariasmax->limite) {
                $he = $hdriariasmax->limite;
                $me = '0';
            }
            $hp = ($hp > 9) ? $hp : '0' . $hp;
            $mp = ($mp > 9) ? $mp : '0' . $mp;
            $he = ($he > 9) ? $he : '0' . $he;
            $me = ($me > 9) ? $me : '0' . $me;
            if ($horaentradareal != null && $horasalidareal != null) {
                if (($horaentradareal < $horainitt && $horasalidareal < $horainitt) || ($horaentradareal > $horafintt && $horasalidareal > $horafintt) || ($horaentradareal > $horasalidareal)) {
                    $horaFinalperdidas = $auxhoras[0] . ':' . $auxhoras[1];
                } else {
                    $horaFinalperdidas = $hp . ':' . $mp;
                }
            }
            $horaFinalextras = $he . ':' . $me;
            $horaFinalextras = ($he != 0 || $me != 0) ? $horaFinalextras : null;
            $hrstrabajadas = $this->RestOnlyTime($horatt['horas'], $horaFinalperdidas);
        } else {
            if (!empty($horafin) && !empty($horaini)) {
                $interval = date_diff($horafin, $horaini);
                $hrstrabajadas = $interval->h . ":" . $interval->i;
            }
        }
        if($estado == null){
            $estado = 1;
        }       
        $datReg = new DatRegistro();
        if (count($asistencia) > 0) {
            $idpersonacontrola = "";
            $idpersonamodifica = "";
            if ($flag == 1) {
                $idpersonacontrola = "WHEN " . $idpersona . " THEN " . $idpersona . " ";
                $idpersonamodifica = "WHEN " . $idpersona . " THEN NULL::int ";
                $UPDHE .= "WHEN " . $idpersona . " THEN cast('" . $horaini->format('Y-m-d H:i:s') .
                    "' as timestamp) ";
                $UPDHS .= "WHEN " . $idpersona . " THEN NULL::timestamp ";
                $CAUSA .= "WHEN " . $idpersona . " THEN " . $causa . " ";
            } else {
                if ($asistencia[0]['idpersonacontrola'] != $idpersona) {
                    $idpersonamodifica = "WHEN " . $idpersona . " THEN " . $idpersona . " ";
                } else {
                    $idpersonamodifica = "WHEN " . $idpersona . " THEN NULL::int ";
                }
                $controla = (empty($asistencia[0]['idpersonacontrola'])) ? $idpersona : $asistencia[0]['idpersonacontrola'];
                $idpersonacontrola = "WHEN " . $idpersona . " THEN " . $controla . " ";
                $UPDHE .= "WHEN " . $idpersona . " THEN cast('" . $horaini->format('Y-m-d H:i:s') .
                    "' as timestamp) ";
                $UPDHS .= "WHEN " . $idpersona . " THEN cast('" . $horafin->format('Y-m-d H:i:s') .
                    "' as timestamp) ";
                $CAUSA .= "WHEN " . $idpersona . " THEN " . $causa . " ";
            }
            $UPDD .= "WHEN " . $idpersona . " THEN '" . $horaFinalperdidas . "' ";
            $UPDT .= "WHEN " . $idpersona . " THEN cast('" . $hrstrabajadas . "' as time) ";
            $UPDestado .= "WHEN " . $idpersona . " THEN " . $estado . " ";
            if ($horaFinalextras != null)
                $UPDHEX .= "WHEN " . $idpersona . " THEN '" . $horaFinalextras . "' ";
            else
                $UPDHEX .= "WHEN " . $idpersona . " THEN NULL::timestamp ";
            $datAis->UpdateAsistencia($UPDHE, $UPDHS, $CAUSA, $UPDD, $UPDT, $idpersona, $fecha, $UPDHEX, $idpersonacontrola, $idpersonamodifica,$UPDestado);
            $datReg->UpdateRegistro($UPDHE, $UPDHS, $idpersona, $person->data[0]['idcargo'], $fecha);
        } else {
            $records = Array();
            $recordsregistro = Array();
            $fila = "";
            $filaregistro = "";
            if ($flag == 1) {
                $fila = "(" . $idpersona . "," . $person->data[0]['idcargo'] . ",cast('" . $horaini->format('Y-m-d H:i:s') . "' as timestamp),NULL::timestamp,cast('" . $fecha . "' as date),
                        " . $idpersona . ",'" . $horaFinalextras . "'," . $causa . ",'" . $horaFinalperdidas . "', " . $regimen['idgrupodescanso'] . ",
                        " . $idturno . ",cast('" . $hrstrabajadas . "' as time),".$estado.")";
                $filaregistro = "(" . $idpersona . "," . $person->data[0]['idcargo'] . ",cast('" . $horaini->format('Y-m-d H:i:s') . "' as timestamp),NULL::timestamp,cast('" . $fecha . "' as date))";
            } else {
                $horafinttT = new DateTime(date('H:i', mktime($hftt[0], $hftt[1], 0, 1, 1, 2000)));
                if (!empty($ts[0]))
                    $HFTEMP = $horafinttT->sub(new DateInterval("PT" . $ts[0] . "H" . $ts[1] . "M" . $ts[2] . "S"));
                if (!empty($horatt['toleranciasalida']) && $horafin >= $HFTEMP
                    && $horafin <= $horafintt
                ) {
                    $horafin = $horafintt;
                }
                $fila = "(" . $idpersona . "," . $person->data[0]['idcargo'] . ",cast('" . $horaini->format('Y-m-d H:i:s') . "' as timestamp),cast('" . $horafin->format('Y-m-d H:i:s') .
                    "' as timestamp),cast('" . $fecha . "' as date)," . $idpersona . ",'" . $horaFinalextras . "'," . $causa . ",'" . $horaFinalperdidas . "',
                     " . $regimen['idgrupodescanso'] . "," . $idturno . ",cast('" . $hrstrabajadas . "' as time),".$estado.")";
                $filaregistro = "(" . $idpersona . "," . $person->data[0]['idcargo'] . ",cast('" . $horaini->format('Y-m-d H:i:s') . "' as timestamp),cast('" . $horafin->format('Y-m-d H:i:s') .
                    "' as timestamp),cast('" . $fecha . "' as date))";
            }
            array_push($records, $fila);
            array_push($recordsregistro, $filaregistro);
            $datAis->InsertAsistencia($records);
            $datReg->InsertRegistro($recordsregistro);
        }
        $result['success'] = true;
        return $result;
    }

    function guardarAsistenciaOtrodia($fecha, $hora, $flag, $idpersona)
    {
        $confCalendarioPersona = new ConfCalendariopersona();
        $model = new DatEstructuraasistenciaModel();
        $person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
            array($idpersona), null, null, null, null, null, null, 'false', 'true', 'false', 'true'
        );
        //buscando la cantidad de horas que trabaja la persona en el dia
        $configRegimen = new ConfCalendarioModel();
        $regimen = Array();
        foreach ($person->data[0]['DatRegimentrabajo'] as $regimentrab) {
            if ($regimentrab['actual'] == 1)
                $regimen = $regimentrab;
        }

        //$dia2 = $this->ConfCalendario->getCalendarioByFecha($fecha, $regimen['idgrupodescanso']);
        $dia2 = $confCalendarioPersona->getCalendarioPersona($fecha, $fecha, $idpersona);
        if ($dia2[0]['trabajo'] == 1) {
            $fechinicioturno = $fecha;
            $f1 = explode('-', $fecha);
            $f2 = date_create($f1[2] . '-' . $f1[1] . '-' . $f1[0]);
            $fechsalturno = date_add($f2, date_interval_create_from_date_string('1 day'));
            $FIT3 = explode('/', $f2->format('d/m/Y'));
            $f2 = date_create($FIT3[2] . '-' . $FIT3[1] . '-' . $FIT3[0]);
            $fechfinturno = $fechsalturno->format('Y-m-d');
            $fI = explode('-', $fechinicioturno);
            $fF = explode('-', $fechfinturno);
        } else {
            $f1 = explode('-', $fecha);
            $f2 = date_create($f1[2] . '-' . $f1[1] . '-' . $f1[0]);
            $fechiniturno = date_add($f2, date_interval_create_from_date_string('-1 days'));
            $FIT3 = explode('/', $f2->format('d/m/Y'));
            $f2 = date_create($FIT3[2] . '-' . $FIT3[1] . '-' . $FIT3[0]);
            //$dia1 = $this->ConfCalendario->getCalendarioByFecha($fechiniturno->format('Y-m-d'), $regimen['idgrupodescanso']);
            $dia1 = $confCalendarioPersona->getCalendarioPersona($fechiniturno->format('Y-m-d'), $fechiniturno->format('Y-m-d'), $idpersona);
            if ($dia1[0]['trabajo'] == 1)
                $fechinicioturno = $fechiniturno->format('Y-m-d');
            $fechfinturno = $fecha;
            $fI = explode('-', $fechinicioturno);
            $fF = explode('-', $fechfinturno);
        }

        $datAis = new DatAsistencia();
        $asistencia = $datAis->getAsistenciaByPersona($idpersona, $fechinicioturno);

        if (count($asistencia) > 0) {
            $fechahoraentrada = $asistencia[0]['fechahoraentrada'];
            $fechhora = explode(' ', $fechahoraentrada);
            $date = explode('/', $fechhora[0]);
            $h = explode(':', $fechhora[1]);
            $a = array();
            $a[0] = $date[2];
            $a[1] = $date[1];
            $a[2] = $date[0];
            $fechafin = $a[2] . '-' . $a[1] . '-' . $a[0];
        } else {
            $fechafin = $fecha;
        }

        $UPDHE = '';
        $UPDHS = '';
        $UPDD = '';
        $UPDT = '';
        $UPDHEX = '';
        $CAUSA = '';
        $entrada = "";
        $salida = "";
        $arrayIdPersonas = array();
        $ActSoloSalida = false;
        //$dia = $this->ConfCalendario->getCalendarioByFecha($fechinicioturno, $regimen['idgrupodescanso']);
        $dia = $confCalendarioPersona->getCalendarioPersona($fechinicioturno, $fechinicioturno, $idpersona);
        //$hrsDiariasFeriadas = $this->ConfCalendario->HrsFeriadasByDateRange($fechinicioturno, $fechinicioturno, $regimen['idgrupodescanso']);
        $hrsDiariasFeriadas = $confCalendarioPersona->getHrsFeriadasPersona($fechinicioturno, $fechinicioturno, $idpersona);
        $auxhrsDiariasFeriadas = explode(':', $hrsDiariasFeriadas[0]['sum']);
        $diaferiadohab = $this->GetDiaFeriadoHabilitado($idpersona, $fechinicioturno);
//        $horas = $configRegimen->GetHrsByDateRange($fechinicioturno, $fechinicioturno, $regimen['idgrupodescanso']);
        $horas = $confCalendarioPersona->getHorasCalendarioPersona($fechinicioturno, $fechinicioturno, $idpersona);
        $auxhoras = explode(':', $horas[0]['sum']);
        //Buscando el turno de trabajo de la persona para saber horario de almuerzo y Hinicio y Hfin
        $horatt = $this->DatAsistencia->getHorarioByPersona($idpersona, $fechinicioturno);
        $Halmuerzo = explode(':', $horatt['horarioalmuerzo']);
        $horaalmuerzo = new DateTime(
            date(
                'H:i',
                mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], 1, 1, 2000)
            )
        );
//        $horaalmuerzo = new DateTime(
//            date(
//                'Y-m-d H:i:s',
//                mktime($Halmuerzo[0], $Halmuerzo[1],  $Halmuerzo[2], $fI[1], $fI[2], $fI[0])
//            )
//        );
        if ($flag == 1) {
            $fechi = explode('-', $fecha);
            $entrada = explode(':', $hora);
            $fechf = explode('-', $fechfinturno);
            if ($dia[0]['idtipodedia'] != 12 && $dia[0]['idtipodedia'] != 8) {
                $salida = explode(':', $horatt['horafin']);
            }
        } else {
            $fechf = explode('-', $fecha);
            $salida = explode(':', $hora);
            $fechi = $a;
            $entrada = $h;
        }

        $horaini = new DateTime(
            date('Y-m-d H:i:s', mktime($entrada[0], $entrada[1], $entrada[2], $fechi[1], $fechi[2], $fechi[0]))
        ); //Construccion del DateTime de la hora inicial

        $horafin = new DateTime(
            date(
                'Y-m-d H:i:s',
                mktime($salida[0], $salida[1], $salida[2], $fechf[1], $fechf[2], $fechf[0])
            )
        ); //Construccion del DateTime de la hora final
        $causa = 'null::int';
        $idturno = 'null::int';
        $hrstrabajadas = 'null';
        $horaFinalextras = 'null';
        $horaFinalperdidas = 'null';
        if ($dia[0]['idtipodedia'] != 12 && $dia[0]['idtipodedia'] != 8) {
            $hitt = explode(':', $horatt['horainicio']);
            $hftt = explode(':', $horatt['horafin']);
            $hdiftt = explode(':', $horatt['hlab']);
            $TDesc = explode(':', $horatt['tdescanso']);
            $te = explode(':', $horatt['toleranciaentrada']);
            $ts = explode(':', $horatt['toleranciasalida']);

            $horainitt = new DateTime(date('Y-m-d H:i', mktime($hitt[0], $hitt[1], 0, $fI[1], $fI[2], $fI[0]))); //Construccion del DateTime de la hora inicial
            $horafintt = new DateTime(date('Y-m-d H:i:s', mktime($hftt[0], $hftt[1], 0, $fF[1], $fF[2], $fF[0]))); //Construccion del DateTime de la hora final
            $horadiftt = new DateTime(date('H:i', mktime($hdiftt[0], $hdiftt[1], 0, 1, 1, 2000)));
            //$horadiftt = new DateTime(date('Y-m-d H:i:s', mktime($hdiftt[0], $hdiftt[1], $hdiftt[2],  $fI[1], $fI[2], $fI[0])));
            $horasdifftt = date_diff($horafintt, $horainitt);
            if ($horasdifftt->d > 0)
                $horastrabajot = $horasdifftt->d * 24 + $horasdifftt->h;
            else
                $horastrabajot = $horasdifftt->h;

            $horainittT = new DateTime(date('Y-m-d H:i', mktime($hitt[0], $hitt[1], 0, $fI[1], $fI[2], $fI[0])));
            if (!empty($te[0])) {
                $HITEMP = $horainittT->add(new DateInterval("PT" . $te[0] . "H" . $te[1] . "M" . $te[2] . "S"));
            }

            if (!empty($horatt['toleranciaentrada']) && $horaini >= $horainitt &&
                $horaini <= $HITEMP
            ) {
                $horaini = $horainitt;
            }

            if ($flag != 1) {
                $horafinttT = new DateTime(date('Y-m-d H:i:s', mktime($hftt[0], $hftt[1], 0, $fF[1], $fF[2], $fF[0])));
                if (!empty($ts[0]))
                    $HFTEMP = $horafinttT->sub(new DateInterval("PT" . $ts[0] . "H" . $ts[1] . "M" . $ts[2] . "S"));
                if (!empty($horatt['toleranciasalida']) && $horafin >= $HFTEMP
                    && $horafin <= $horafintt
                ) {
                    $horafin = $horafintt;
                }
            }

            $habcausas = new ConfHabCausaModel();
            $causasdefecto = $habcausas->getHabilitarcausa();
            $ausencia = false;
            $tarde = false;
            $salidaantes = false;
            $tardesalidaantes = false;
            if ($causasdefecto[0]['habilitado'] == 1) {
                $ausencia = true;
            }
            if ($causasdefecto[1]['habilitado'] == 1) {
                $tarde = true;
            }
            if ($causasdefecto[2]['habilitado'] == 1) {
                $salidaantes = true;
            }
            if ($causasdefecto[3]['habilitado'] == 1) {
                $tardesalidaantes = true;
            }

            $causa = 'null::int';
            if ($flag == 1) {
                if ($horaini > $horainitt && $horaini < $horafintt && $tarde) {
                    $causa = 3;
                }
            } else {
                if ($horaini > $horainitt && $horaini < $horafintt &&
                    $horafin > $horainitt && $horafin < $horafintt && $tardesalidaantes
                ) {
                    $causa = 6;
                } else {
                    if ($horaini > $horainitt && $horaini < $horafintt && $tarde) {
                        $causa = 3;
                    } else {
                        if ($horafin > $horainitt && $horafin < $horafintt && $salidaantes) {
                            $causa = 5;
                        }
                    }
                }
            }
            $horadesc = new DateTime(date('H:i', mktime($TDesc[0], $TDesc[1], $TDesc[2], 1, 1, 2000)));
            //$horadesc = new DateTime(date('Y-m-d H:i:s', mktime($TDesc[0], $TDesc[1], $TDesc[2], $fI[1], $fI[2], $fI[0])));
            $horaentradareal = $horaini; //Construccion del DateTime de la hora inicial
            $horasalidareal = $horafin; //Construccion del DateTime de la hora final

            $diferenciainicial = date_diff($horainitt, $horaentradareal); //Funcion de Date para la diferencia de fechas y horas
            $diferenciafinal = date_diff($horasalidareal, $horafintt); //Funcion de Date para la diferencia de fechas y horas

            $horaalmuerzoplustdesc = new DateTime(date('H:i', mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], 1, 1, 2000)));
            //$horaalmuerzoplustdesc = new DateTime(date('H:i', mktime($Halmuerzo[0], $Halmuerzo[1], 0, $fI[1], $fI[2], $fI[0])));

            if ($horasalidareal <= $horaalmuerzo) {//salida anticipada
                $diferenciafinal = date_diff(new DateTime($diferenciafinal->h . ':' . $diferenciafinal->i . ':' . $diferenciafinal->s), $horadesc);
            }

            $horaalmuerzoplustdesc = $horaalmuerzoplustdesc->add(new DateInterval("PT" . $TDesc[0] . "H" . $TDesc[1] . "M" . $TDesc[2] . "S"));

            if ($horaentradareal >= $horaalmuerzoplustdesc) {//llegada tarde
                $diferenciainicial = date_diff(new DateTime($diferenciainicial->h . ':' . $diferenciainicial->i . ':' . $diferenciainicial->s), $horadesc);
            }
            if ($horaentradareal > $horaalmuerzo && $horaentradareal < $horaalmuerzoplustdesc) {
                $diferencia = date_diff($horaentradareal, $horaalmuerzo);
                $diferenciainicial = date_diff(new DateTime($diferenciainicial->h . ':' . $diferenciainicial->i . ':' . $diferenciainicial->s), new DateTime($diferencia->h . ':' . $diferencia->i . ':' . $diferencia->s));
            }
            if ($horasalidareal > $horaalmuerzo && $horasalidareal < $horaalmuerzoplustdesc) {
                $diferencia = date_diff($horasalidareal, $horaalmuerzoplustdesc);
                $diferenciafinal = date_diff(new DateTime($diferenciafinal->h . ':' . $diferenciafinal->i . ':' . $diferenciafinal->s), new DateTime($diferencia->h . ':' . $diferencia->i . ':' . $diferencia->s));
            }

            if ($horainitt > $horaentradareal) { //horario extra inicial
                $he = $diferenciainicial->h;
                $me = $diferenciainicial->i;
                $hp = 0;
                $mp = 0;
            } else {
                $he = 0;
                $me = 0;
                $hp = $diferenciainicial->h;
                if ($diferenciainicial->d > 0) {
                    $hp = $hp + $diferenciainicial->d * 24;
                }
                $mp = $diferenciainicial->i;
            }
            if ($horafintt < $horasalidareal) { //horario extra final
                $he += $diferenciafinal->h;
                $me += $diferenciafinal->i;
                $he = ($me > 59) ? $he + 1 : $he;
                $me = ($me > 59) ? $me - 60 : $me;
            } else {
                $hp += $diferenciafinal->h;
                if ($diferenciafinal->d > 0) {
                    $hp = $hp + $diferenciafinal->d * 24;
                }
                $mp += $diferenciafinal->i;
                $hp = ($mp > 59) ? $hp + 1 : $hp;
                $mp = ($mp > 59) ? $mp - 60 : $mp;
            }

            $hdriariasmax = ConfHorasextras::getById(1);

            if ($he >= $hdriariasmax->limite) {
                $he = $hdriariasmax->limite;
                $me = '0';
            }

            if (intval($hp) > intval($horastrabajot) || (intval($hp) == intval($horastrabajot) && intval($mp) > 0)) {
                $hp = $horastrabajot;
                $mp = 0;
            }

            $hp = ($hp > 9) ? $hp : '0' . $hp;
            $mp = ($mp > 9) ? $mp : '0' . $mp;
            $he = ($he > 9) ? $he : '0' . $he;
            $me = ($me > 9) ? $me : '0' . $me;

            if ($horaentradareal != null && $horasalidareal != null) {
                if (($horaentradareal < $horainitt && $horasalidareal < $horainitt) || ($horaentradareal > $horafintt && $horasalidareal > $horafintt) || ($horaentradareal > $horasalidareal)) {
                    $horaFinalperdidas = $auxhoras[0] . ':' . $auxhoras[1];
                } else {
                    $horaFinalperdidas = $hp . ':' . $mp;
                }
            }
            $horaFinalextras = $he . ':' . $me;
            $horaFinalextras = ($he != 0 || $me != 0) ? $horaFinalextras : null;
            $hrstrabajadas = $this->RestOnlyTime($horatt['horas'], $horaFinalperdidas);
        } else {
            if (!empty($horafin) && !empty($horaini)) {
                $interval = date_diff($horafin, $horaini);
                $hrstrabajadas = $interval->h . ":" . $interval->i;
            }
        }
        $datReg = new DatRegistro();
        if (count($asistencia) > 0) {
            $idpersonacontrola = "";
            $idpersonamodifica = "";
            if ($flag == 1) {
                $idpersonacontrola = "WHEN " . $idpersona . " THEN " . $idpersona . " ";
                $idpersonamodifica = "WHEN " . $idpersona . " THEN NULL::int ";
                $UPDHE .= "WHEN " . $idpersona . " THEN cast('" . $horaini->format('Y-m-d H:i:s') .
                    "' as timestamp) ";
                $UPDHS .= "WHEN " . $idpersona . " THEN NULL::timestamp ";
                $CAUSA .= "WHEN " . $idpersona . " THEN " . $causa . " ";
            } else {
                if ($asistencia[0]['idpersonacontrola'] != $idpersona) {
                    $idpersonamodifica = "WHEN " . $idpersona . " THEN " . $idpersona . " ";
                } else {
                    $idpersonamodifica = "WHEN " . $idpersona . " THEN NULL::int ";
                }
                $controla = (empty($asistencia[0]['idpersonacontrola'])) ? $idpersona : $asistencia[0]['idpersonacontrola'];
                $idpersonacontrola = "WHEN " . $idpersona . " THEN " . $controla . " ";
                $UPDHE .= "WHEN " . $idpersona . " THEN cast('" . $horaini->format('Y-m-d H:i:s') .
                    "' as timestamp) ";
                $UPDHS .= "WHEN " . $idpersona . " THEN cast('" . $horafin->format('Y-m-d H:i:s') .
                    "' as timestamp) ";
                $CAUSA .= "WHEN " . $idpersona . " THEN " . $causa . " ";
            }
            if ($horaFinalperdidas != null && $horaFinalperdidas != '00:00')
                $UPDD .= "WHEN " . $idpersona . " THEN '" . $horaFinalperdidas . "' ";
            else
                $UPDD .= "WHEN " . $idpersona . " THEN NULL::timestamp ";
            $UPDT .= "WHEN " . $idpersona . " THEN cast('" . $hrstrabajadas . "' as time) ";
            if ($horaFinalextras != null && $horaFinalextras != '00:00')
                $UPDHEX .= "WHEN " . $idpersona . " THEN '" . $horaFinalextras . "' ";
            else
                $UPDHEX .= "WHEN " . $idpersona . " THEN NULL::timestamp ";

            $datAis->UpdateAsistencia($UPDHE, $UPDHS, $CAUSA, $UPDD, $UPDT, $idpersona, $fechinicioturno, $UPDHEX, $idpersonacontrola, $idpersonamodifica);
            $datReg->UpdateRegistro($UPDHE, $UPDHS, $idpersona, $person->data[0]['idcargo'], $fechinicioturno);
        } else {
            $records = Array();
            $recordsregistro = Array();
            $fila = "";
            $filaregistro = "";
            if ($flag == 1) {
                $fila = "(" . $idpersona . "," . $person->data[0]['idcargo'] . ",cast('" . $horaini->format('Y-m-d H:i:s') . "' as timestamp),NULL::timestamp,cast('" . $fechinicioturno . "' as date),
                        " . $idpersona . ",'" . $horaFinalextras . "'," . $causa . ",'" . $horaFinalperdidas . "', " . $regimen['idgrupodescanso'] . ",
                        " . $horatt['idturnotrabajo'] . ",cast('" . $hrstrabajadas . "' as time))";
                $filaregistro = "(" . $idpersona . "," . $person->data[0]['idcargo'] . ",cast('" . $horaini->format('Y-m-d H:i:s') . "' as timestamp),NULL::timestamp,cast('" . $fechinicioturno . "' as date))";
            } else {
                $fila = "(" . $idpersona . "," . $person->data[0]['idcargo'] . ",cast('" . $horaini->format('Y-m-d H:i:s') . "' as timestamp),cast('" . $horafin->format('Y-m-d H:i:s') .
                    "' as timestamp),cast('" . $fechinicioturno . "' as date)," . $idpersona . ",'" . $horaFinalextras . "'," . $causa . ",'" . $horaFinalperdidas . "', " . $regimen['idgrupodescanso'] . ",
                        " . $horatt['idturnotrabajo'] . ",cast('" . $hrstrabajadas . "' as time))";
                $filaregistro = "(" . $idpersona . "," . $person->data[0]['idcargo'] . ",cast('" . $horaini->format('Y-m-d H:i:s') . "' as timestamp),cast('" . $horafin->format('Y-m-d H:i:s') .
                    "' as timestamp),cast('" . $fechinicioturno . "' as date))";
            }
            array_push($records, $fila);
            array_push($recordsregistro, $filaregistro);
            $datAis->InsertAsistencia($records);
            $datReg->InsertRegistro($recordsregistro);
        }
        $result['success'] = true;
        return $result;
    }

    function getasistenciaByUEB($fdesde, $fhasta, $idestructura)
    {
        $r = array();
        $dat = array();
        $idsestructura = array();
        $idspersonas = array();
        $idcargos = array();
        $cantA = 0;
        $cantP = 0;
        $result = array();
        $header = array();
        $headerlimpios = array();
        $a = array();
        $est = array();
        $causasP = array();
        $causasA = array();
        $causasPres = array();
        $causasAus = array();
        $causasPLimpios = array();
        $causasALimpios = array();
        $causasALimp = array();
        $causasALimp = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $domain = new DatAsistencia();
        $obj = new NomCausaModel();
        $causas = $obj->GetCausasMultiEncabezado();
        $r['tienecategoria'] = $causas[1];
        $ConfEstructurasModel = new ConfEstructurasModel();
        $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructura);
        foreach ($r as $t => $estruct) {
            if ($est->idconcepto != 7) {
                $est[] = $estruct;
            }
        }

        /*------------------Iterar por las UEB-----------------*/
        $padre = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        /* if(empty($est)){
             $est[] = $padre[0];
         }*/
        $t = array();
        $t['idestructura'] = $idestructura;
        $t['estructura'] = 'Total';
        $t['entidad'] = $padre[0]->denominacion;
        $t['porplantilla'] = 0;
        $t['cubierto'] = 0;
        $t['presente'] = 0;
        $a['presentesreal'] = 0;
        $t['tarde'] = 0;
        $t['totalfuera'] = 0;
        $t['sinregistro'] = 0;
        foreach ($est as $i => $v) {
            $estructuras = array();
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($v->id, $iddominio, true);

            if (count($cargos) > 0) {
                $idcargos = array();
                foreach ($cargos as $j => $val) {
                    array_push($idcargos, $val['idestructura']);
                }
                $datoscargos = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($idcargos);

                $objasist = new DatAsistencia();
                $a = array();
                $a['idestructura'] = $v->id;
                $a['estructura'] = $v->text;
                $a['entidad'] = $padre[0]->denominacion;
                $a['porplantilla'] = 0;
                $a['cubierto'] = (int)$objasist->GetCubiertosXCargos($idcargos)[0]['cantidad'];
                $a['presente'] = 0;
                $a['totalasistencia'] = 0;
                $a['presentesreal'] = 0;
                $a['tarde'] = 0;
                $a['totalfuera'] = 0;
                $a['sinregistro'] = 0;

                /*---------------Iterar por los cargos de la UEB---------------*/
                foreach ($datoscargos as $key => $idcargo) {
                    if ($v->id) {
                        $a['porplantilla'] = $idcargo['cantidad'] + $a['porplantilla'];
                    }
                }
                $t['porplantilla'] += $a['porplantilla'];

                $result[$i] = $a;
//		print_r($fdesde);die();

                $asistencia = $objasist->GetReporteAsistRangoByCargo($idcargos, $fdesde, $fhasta);

                $result[$i]['totalfuera'] = 0;
                $result[$i]['presente'] = 0;
                $var = 0;
                foreach ($asistencia as $ind => $val) {
                    $result[$i]['totalasistencia'] += 1;
                    if ($val['abreviaturacausa'] == 'T') {
                        $var += 1;
                        $tardanza[$i]['categorias'][] = $val['nombreapellidos'];

                        $fh = explode(' ', $val['fechahoraentrada']);
                        $f = $fh[0];
                        $h = $fh[1];
                        $farr = explode('/', $f);
                        $ff = $farr[2] . "/" . $farr[1] . "/" . $farr[0];
                        $tardanza[$i]['datos'][] = $ff . " " . $h;
                    }
                    if (!empty($val['fechahoraentrada']) && empty($val['idcausa'])) {
                        $result[$i]['presentesreal'] += 1;
                    }
                    if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && $val['abreviaturacausa'] != 'T')) {
                        $result[$i]['presente'] += 1;
                    } elseif ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && (($val['abreviaturacausa'] != 'T') || $val['abreviaturacausa'] != 'SA' ||
                            $val['abreviaturacausa'] != 'T/SA'))
                    ) {
                        $result[$i]['totalfuera'] += 1;
                    }
                    array_push($header, $val['abreviaturacausa']);
                    $causas[$val['idcausa']] = array('idcausa' => $val['idcausa'], 'abreviatura' => $val['abreviaturacausa']);
                    if (!empty($val['idcausa']) && !empty($val['abreviaturacausa'])) {
                        if ($val['abreviaturacausa'] == 'T' || $val['abreviaturacausa'] == 'SA' ||
                            $val['abreviaturacausa'] == 'T/SA' || $val['afectasalario'] == 0
                        ) {
                            $causasP = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                            if (!$this->existe($causasP, $causasPres)) {
                                array_push($causasPres, $causasP);
                            }
                        } else {
                            $causasA = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                            if (!$this->existe($causasA, $causasAus)) {
                                array_push($causasAus, $causasA);

                            }
                        }
                    }

                    $dataindex[$val['idcausa']] = array('dataindex' => $val['idcausa']);
                    $result[$i][$val['idcausa']] += 1;
                    $t[$val['idcausa']] += 1;
                }

                $result[$i]['totalfuera'] = $result[$i]['totalfuera'];
                $result[$i]['presentesreal'] = $result[$i]['presentesreal'] + $var;
                $t['cubierto'] += $result[$i]['cubierto'];
                $t['presente'] += $result[$i]['presente'];
                $t['totalasistencia'] += $result[$i]['totalasistencia'];
                $t['presentesreal'] += $result[$i]['presentesreal'];
                $t['totalfuera'] += $result[$i]['totalfuera'];
                $t['tarde'] += $result[$i]['tarde'];

                $headerlimpios = array_unique($header);
                $dataindexlimpios = array();
                foreach ($dataindex as $index => $obj)
                    $dataindexlimpios[] = $obj;

                //ordenando los dataindex de manera descendente
                usort($dataindexlimpios, "cmp");
            } else {
                $a = array();
                $a['idestructura'] = $v->id;
                $a['estructura'] = $v->text;
                $a['entidad'] = $padre[0]->denominacion;
                $a['porplantilla'] = 0;
                $a['cubierto'] = 0;
                $a['presente'] = 0;
                $a['totalasistencia'] = 0;
                $a['presentesreal'] = 0;
                $a['tarde'] = 0;
                $a['totalfuera'] = 0;
                $a['sinregistro'] = 0;
                $result[$i] = $a;
            }
        }
        $tmpt = array();
        $tmpt['categorias'] = array();
        $tmpt['datos'] = array();
        foreach ($tardanza as $tar) {
            foreach ($tar['categorias'] as $key => $value) {
                array_push($tmpt['categorias'], $tar['categorias'][$key]);
                array_push($tmpt['datos'], $tar['datos'][$key]);
            }
        }
        $tardanza[count($est)] = $tmpt;

        array_push($result, $t);
        $causastodas = array();
        $causastodas = array_merge($causasPres, $causasAus);
        $resumenGrafico = array();
        $grafica = array();
        $categorias = array();
        $datos = array();

        foreach ($result as $key => $per) {
            $datos[$key]['name'] = $per['estructura'];
            $i = 0;
            foreach ($causastodas as $k => $v) {
                if (!empty($per[$v['dataindex']]) && !empty($v['denom'])) {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = $per[$v['dataindex']];
                } else {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = null;
                }
                $i++;
            }
        }
        $r['causasP'] = $causasPres;
        $r['causasA'] = $causasAus;

        $datos['name'] = 'Datos';
        $r['dataindex'] = $dataindexlimpios;
        $r['datos'] = $result;
        $r['cantidad'] = count($result);
        $r['header'] = $headerlimpios;
        $grafic['name'] = $categorias;
        $grafic['data'] = $datos;
        $grafic['tardanza'] = $tardanza;
        $r['resumen'] = $grafic;
        return $r;
    }

    function getasistenciaByCategOcup($fdesde, $fhasta, $idestructura)
    {
        $r = array();
        $dat = array();
        $idsestructura = array();
        $idspersonas = array();
        $idcargos = array();
        $cantA = 0;
        $cantP = 0;
        $result = array();
        $header = array();
        $headerlimpios = array();
        $a = array();
        $est = array();
        $causasP = array();
        $causasA = array();
        $causasPres = array();
        $causasAus = array();
        $causasPLimpios = array();
        $causasALimpios = array();
        $causasALimp = array();
        $causasALimp = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $domain = new DatAsistencia();

        $obj = new NomCausaModel();
        $causas = $obj->GetCausasMultiEncabezado();

        $ConfEstructurasModel = new ConfEstructurasModel();
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, true);
        if (count($cargos) > 0) {
            $idcargos = array();
            foreach ($cargos as $j => $val) {
                array_push($idcargos, $val['idestructura']);
            }
        }

        $cargosPorCatOcupacional = $domain->getCargosPorCatOcupacional($idcargos);

        /*------------------Iterar por las UEB-----------------*/
        $padre = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $t = array();
        $t['idestructura'] = $idestructura;
        $t['estructura'] = 'Total';
        $t['entidad'] = $padre[0]->denominacion;
        $t['porplantilla'] = 0;
        $t['cubierto'] = 0;
        $t['totalasistencia'] = 0;
        $t['presente'] = 0;
        $a['presentesreal'] = 0;
        $t['tarde'] = 0;
        $t['totalfuera'] = 0;
        $t['sinregistro'] = 0;

        $i = 0;
        foreach ($cargosPorCatOcupacional as $k => $v) {
            $estructuras = array();
            $idcargos = $v['cargos'];
            if (count($idcargos) > 0) {
                $datoscargos = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($v['cargos']);
                $objasist = new DatAsistencia();
                $a = array();
                $a['idestructura'] = $idestructura;
                $a['estructura'] = $v['denominacion'];
                $a['entidad'] = $padre[0]->denominacion;
                $a['porplantilla'] = 0;
                $a['cubierto'] = (int)$objasist->GetCubiertosXCargos($idcargos)[0]['cantidad'];
                $a['presente'] = 0;
                $a['totalasistencia'] = 0;
                $a['presentesreal'] = 0;
                $a['tarde'] = 0;
                $a['totalfuera'] = 0;
                $a['sinregistro'] = 0;

                foreach ($datoscargos as $key => $idcargo) {
                    if ($idestructura) {
                        $a['porplantilla'] = $idcargo['cantidad'] + $a['porplantilla'];
                    }
                }
                $t['porplantilla'] += $a['porplantilla'];

                $result[$i] = $a;

                $asistencia = $objasist->GetReporteAsistRangoByCargo($idcargos, $fdesde, $fhasta);
                $result[$i]['totalfuera'] = 0;
                $result[$i]['presente'] = 0;
                $var = 0;
                foreach ($asistencia as $ind => $val) {
                    $result[$i]['totalasistencia'] += 1;
                    if ($val['abreviaturacausa'] == 'T') {
                        $var += 1;
                        $tardanza[$i]['categorias'][] = $val['nombreapellidos'];

                        $fh = explode(' ', $val['fechahoraentrada']);
                        $f = $fh[0];
                        $h = $fh[1];
                        $farr = explode('/', $f);
                        $ff = $farr[2] . "/" . $farr[1] . "/" . $farr[0];
                        $tardanza[$i]['datos'][] = $ff . " " . $h;
                    }
                    if (!empty($val['fechahoraentrada']) && empty($val['idcausa'])) {
                        $result[$i]['presentesreal'] += 1;
                    }
                    if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && $val['abreviaturacausa'] != 'T')) {
                        $result[$i]['presente'] += 1;
                    } elseif ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && ($val['abreviaturacausa'] != 'T')
                        || $val['abreviaturacausa'] != 'SA' || $val['abreviaturacausa'] != 'T/SA')
                    ) {
                        $result[$i]['totalfuera'] += 1;
                    }
                    array_push($header, $val['abreviaturacausa']);
                    $causas[$val['idcausa']] = array('idcausa' => $val['idcausa'], 'abreviatura' => $val['abreviaturacausa']);
                    if (!empty($val['idcausa']) && !empty($val['abreviaturacausa'])) {
                        if ($val['abreviaturacausa'] == 'T' || $val['abreviaturacausa'] == 'SA' ||
                            $val['abreviaturacausa'] == 'T/SA' || $val['afectasalario'] == 0
                        ) {
                            $causasP = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                            if (!$this->existe($causasP, $causasPres)) {
                                array_push($causasPres, $causasP);
                            }
                        } else {
                            $causasA = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                            if (!$this->existe($causasA, $causasAus)) {
                                array_push($causasAus, $causasA);
                            }
                        }
                    }
                    $dataindex[$val['idcausa']] = array('dataindex' => $val['idcausa']);
                    $result[$i][$val['idcausa']] += 1;
                    $t[$val['idcausa']] += 1;
                }

                $result[$i]['totalfuera'] = $result[$i]['totalfuera'];
                $result[$i]['presentesreal'] = $result[$i]['presentesreal'] + $var;
                $t['cubierto'] += $result[$i]['cubierto'];
                $t['totalasistencia'] += $result[$i]['totalasistencia'];
                $t['presente'] += $result[$i]['presente'];
                $t['presentesreal'] += $result[$i]['presentesreal'];
                $t['totalfuera'] += $result[$i]['totalfuera'];
                $t['tarde'] += $result[$i]['tarde'];

                $headerlimpios = array_unique($header);
                $dataindexlimpios = array();
                foreach ($dataindex as $index => $obj)
                    $dataindexlimpios[] = $obj;

                //ordenando los dataindex de manera descendente
                usort($dataindexlimpios, "cmp");
            } else {
                $a = array();
                $a['idestructura'] = $v->idestructura;
                $a['estructura'] = $v->denominacion;
                $a['entidad'] = $padre[0]->denominacion;
                $a['porplantilla'] = 0;
                $a['cubierto'] = 0;
                $a['totalasistencia'] = 0;
                $a['presente'] = 0;
                $a['presentesreal'] = 0;
                $a['tarde'] = 0;
                $a['totalfuera'] = 0;
                $a['sinregistro'] = 0;
                $result[$i] = $a;
            }
            $i++;
        }

        $tmpt = array();
        $tmpt['categorias'] = array();
        $tmpt['datos'] = array();
        foreach ($tardanza as $tar) {
            foreach ($tar['categorias'] as $key => $value) {
                array_push($tmpt['categorias'], $tar['categorias'][$key]);
                array_push($tmpt['datos'], $tar['datos'][$key]);
            }

        }
        $tardanza[count($est)] = $tmpt;

        array_push($result, $t);
        $causastodas = array();
        $causastodas = array_merge($causasPres, $causasAus);
        $resumenGrafico = array();
        $grafica = array();
        $categorias = array();
        $datos = array();
        foreach ($result as $key => $per) {
            $datos[$key]['name'] = $per['estructura'];
            $i = 0;
            foreach ($causastodas as $k => $v) {
                if (!empty($per[$v['dataindex']]) && !empty($v['denom'])) {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = $per[$v['dataindex']];
                } else {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = null;
                }
                $i++;
            }
        }
        $r['causasP'] = $causasPres;
        $r['causasA'] = $causasAus;

        $datos['name'] = 'Datos';
        $r['dataindex'] = $dataindexlimpios;
        $r['datos'] = $result;
        $r['cantidad'] = count($result);
        $r['header'] = $headerlimpios;
        $grafic['name'] = $categorias;
        $grafic['data'] = $datos;
        $grafic['tardanza'] = $tardanza;
        $r['resumen'] = $grafic;
        return $r;
    }

    function getasistenciaByDias($fdesde, $fhasta, $idestructura)
    {
        $r = array();
        $dat = array();
        $idsestructura = array();
        $idspersonas = array();
        $idcargos = array();
        $cantA = 0;
        $cantP = 0;
        $result = array();
        $header = array();
        $headerlimpios = array();
        $a = array();
        $est = array();
        $causasP = array();
        $causasA = array();
        $causasPres = array();
        $causasAus = array();
        $causasPLimpios = array();
        $causasALimpios = array();
        $causasALimp = array();
        $causasALimp = array();

        $fechainicio = explode('/', $fdesde);
        $fechafin = explode('/', $fhasta);
        $finicio = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
        $ffin = date_create($fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0]);

        $columnasGrid = array();
        while ($finicio <= $ffin) {
            array_push($columnasGrid, $finicio->format('d/m/Y'));
            date_add($finicio, date_interval_create_from_date_string('1 day'));
        }

        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $domain = new DatAsistencia();
        $obj = new NomCausaModel();
        $causas = $obj->GetCausasMultiEncabezado();
        $r['tienecategoria'] = $causas[1];
        $ConfEstructurasModel = new ConfEstructurasModel();

        /*------------------Iterar por las UEB-----------------*/
        $padre = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $t = array();
        $t['idestructura'] = $idestructura;
        $t['estructura'] = 'Total';
        $t['entidad'] = $padre[0]->denominacion;
        $t['presente'] = 0;
        $t['totalasistencia'] = 0;
        $a['presentesreal'] = 0;
        $t['tarde'] = 0;
        $t['totalfuera'] = 0;
        $t['sinregistro'] = 0;

        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, true);
        if (count($cargos) > 0) {
            $idcargos = array();
            foreach ($cargos as $j => $val) {
                array_push($idcargos, $val['idestructura']);
            }
        }

        $objasist = new DatAsistencia();
        $asistencia = $objasist->GetReporteAsistRangoCargoByFecha($idcargos, $fdesde, $fhasta);

        foreach ($columnasGrid as $i => $v) {
            $a = array();
            $a['idestructura'] = $idestructura;
            $a['estructura'] = $v;
            $a['entidad'] = $padre[0]->denominacion;
            $a['presente'] = 0;
            $a['totalasistencia'] = 0;
            $a['presentesreal'] = 0;
            $a['tarde'] = 0;
            $a['totalfuera'] = 0;
            $a['sinregistro'] = 0;
            $result[$i] = $a;
            $result[$i]['totalfuera'] = 0;
            $result[$i]['presente'] = 0;
            $var = 0;
            foreach ($asistencia[$v] as $ind => $val) {
                $result[$i]['totalasistencia'] += 1;
                if ($val['abreviaturacausa'] == 'T') {
                    $var += 1;
                    $tardanza[$i]['categorias'][] = $val['nombreapellidos'];

                    $fh = explode(' ', $val['fechahoraentrada']);
                    $f = $fh[0];
                    $h = $fh[1];
                    $farr = explode('/', $f);
                    $ff = $farr[2] . "/" . $farr[1] . "/" . $farr[0];
                    $tardanza[$i]['datos'][] = $ff . " " . $h;
                }
                if (!empty($val['fechahoraentrada']) && empty($val['idcausa'])) {
                    $result[$i]['presentesreal'] += 1;
                }
                if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && $val['abreviaturacausa'] != 'T')) {
                    $result[$i]['presente'] += 1;
                } elseif ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && (($val['abreviaturacausa'] != 'T') || $val['abreviaturacausa'] != 'SA' ||
                        $val['abreviaturacausa'] != 'T/SA'))
                ) {
                    $result[$i]['totalfuera'] += 1;
                }
                array_push($header, $val['abreviaturacausa']);
                $causas[$val['idcausa']] = array('idcausa' => $val['idcausa'], 'abreviatura' => $val['abreviaturacausa']);
                if (!empty($val['idcausa']) && !empty($val['abreviaturacausa'])) {
                    if ($val['abreviaturacausa'] == 'T' || $val['abreviaturacausa'] == 'SA' ||
                        $val['abreviaturacausa'] == 'T/SA' || $val['afectasalario'] == 0
                    ) {
                        $causasP = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                        if (!$this->existe($causasP, $causasPres)) {
                            array_push($causasPres, $causasP);
                        }
                    } else {
                        $causasA = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                        if (!$this->existe($causasA, $causasAus)) {
                            array_push($causasAus, $causasA);
                        }
                    }
                }
                $dataindex[$val['idcausa']] = array('dataindex' => $val['idcausa']);
                $result[$i][$val['idcausa']] += 1;
                $t[$val['idcausa']] += 1;
            }

            $result[$i]['totalfuera'] = $result[$i]['totalfuera'];
            $result[$i]['presentesreal'] = $result[$i]['presentesreal'] + $var;
            //$t['cubierto'] += $result[$i]['cubierto'];
            $t['presente'] += $result[$i]['presente'];
            $t['totalasistencia'] += $result[$i]['totalasistencia'];
            $t['presentesreal'] += $result[$i]['presentesreal'];
            $t['totalfuera'] += $result[$i]['totalfuera'];
            $t['tarde'] += $result[$i]['tarde'];

            $headerlimpios = array_unique($header);
            $dataindexlimpios = array();
            foreach ($dataindex as $index => $obj)
                $dataindexlimpios[] = $obj;

            //ordenando los dataindex de manera descendente
            usort($dataindexlimpios, "cmp");
        }
        $tmpt = array();
        $tmpt['categorias'] = array();
        $tmpt['datos'] = array();
        foreach ($tardanza as $tar) {
            foreach ($tar['categorias'] as $key => $value) {
                array_push($tmpt['categorias'], $tar['categorias'][$key]);
                array_push($tmpt['datos'], $tar['datos'][$key]);
            }
        }
        $tardanza[count($est)] = $tmpt;

        array_push($result, $t);
        $causastodas = array();
        $causastodas = array_merge($causasPres, $causasAus);
        $resumenGrafico = array();
        $grafica = array();
        $categorias = array();
        $datos = array();

        foreach ($result as $key => $per) {
            $datos[$key]['name'] = $per['estructura'];
            $i = 0;
            foreach ($causastodas as $k => $v) {
                if (!empty($per[$v['dataindex']]) && !empty($v['denom'])) {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = $per[$v['dataindex']];
                } else {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = null;
                }
                $i++;
            }
        }
        $r['causasP'] = $causasPres;
        $r['causasA'] = $causasAus;

        $datos['name'] = 'Datos';
        $r['dataindex'] = $dataindexlimpios;
        $r['datos'] = $result;
        $r['cantidad'] = count($result);
        $r['header'] = $headerlimpios;
        $grafic['name'] = $categorias;
        $grafic['data'] = $datos;
        $grafic['tardanza'] = $tardanza;
        $r['resumen'] = $grafic;
        return $r;
    }

    function getasistenciaBySexo($fdesde, $fhasta, $idestructura)
    {
        $r = array();
        $dat = array();
        $idsestructura = array();
        $idspersonas = array();
        $idcargos = array();
        $cantA = 0;
        $cantP = 0;
        $result = array();
        $header = array();
        $headerlimpios = array();
        $a = array();
        $est = array();
        $causasP = array();
        $causasA = array();
        $causasPres = array();
        $causasAus = array();
        $causasPLimpios = array();
        $causasALimpios = array();
        $causasALimp = array();
        $causasALimp = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $domain = new DatAsistencia();

        $obj = new NomCausaModel();
        $causas = $obj->GetCausasMultiEncabezado();

        $ConfEstructurasModel = new ConfEstructurasModel();
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, true);
        if (count($cargos) > 0) {
            $idcargos = array();
            foreach ($cargos as $j => $val) {
                array_push($idcargos, $val['idestructura']);
            }
        }

        $cargosPorSexo = $domain->getCargosPorSexo($idcargos);

        /*------------------Iterar por las UEB-----------------*/
        $padre = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $t = array();
        $t['idestructura'] = $idestructura;
        $t['estructura'] = 'Total';
        $t['entidad'] = $padre[0]->denominacion;
        $t['porplantilla'] = 0;
        $t['cubierto'] = 0;
        $t['totalasistencia'] = 0;
        $t['presente'] = 0;
        $a['presentesreal'] = 0;
        $t['tarde'] = 0;
        $t['totalfuera'] = 0;
        $t['sinregistro'] = 0;

        $i = 0;
        $objasist = new DatAsistencia();
        foreach ($cargosPorSexo as $k => $v) {
            $estructuras = array();
            $idscargo = $v['cargos'];
            if (count($idscargo) > 0) {
                $datoscargos = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($v['cargos']);
                $a = array();
                $a['idestructura'] = $idestructura;
                $a['estructura'] = $v['denominacion'];
                $a['entidad'] = $padre[0]->denominacion;
                $a['porplantilla'] = 0;
                $a['cubierto'] = (int)$objasist->GetCubiertosXCargos($idscargo)[0]['cantidad'];
                $a['presente'] = 0;
                $a['totalasistencia'] = 0;
                $a['presentesreal'] = 0;
                $a['tarde'] = 0;
                $a['totalfuera'] = 0;
                $a['sinregistro'] = 0;

                foreach ($datoscargos as $key => $idcargo) {
                    if ($idestructura) {
                        $a['porplantilla'] = $idcargo['cantidad'] + $a['porplantilla'];
                    }
                }
                $t['porplantilla'] += $a['porplantilla'];

                $result[$i] = $a;

                $asistencia = $objasist->GetReporteAsistRangoByCargo($idscargo, $fdesde, $fhasta);

                $result[$i]['totalfuera'] = 0;
                $result[$i]['presente'] = 0;
                $var = 0;
                foreach ($asistencia as $ind => $val) {
                    $result[$i]['totalasistencia'] += 1;
                    if ($val['abreviaturacausa'] == 'T') {
                        $var += 1;
                        $tardanza[$i]['categorias'][] = $val['nombreapellidos'];

                        $fh = explode(' ', $val['fechahoraentrada']);
                        $f = $fh[0];
                        $h = $fh[1];
                        $farr = explode('/', $f);
                        $ff = $farr[2] . "/" . $farr[1] . "/" . $farr[0];
                        $tardanza[$i]['datos'][] = $ff . " " . $h;
                    }
                    if (!empty($val['fechahoraentrada']) && empty($val['idcausa'])) {
                        $result[$i]['presentesreal'] += 1;
                    }
                    if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && $val['abreviaturacausa'] != 'T')) {
                        $result[$i]['presente'] += 1;
                    } elseif ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && ($val['abreviaturacausa'] != 'T')
                        || $val['abreviaturacausa'] != 'SA' || $val['abreviaturacausa'] != 'T/SA')
                    ) {
                        $result[$i]['totalfuera'] += 1;
                    }
                    array_push($header, $val['abreviaturacausa']);
                    $causas[$val['idcausa']] = array('idcausa' => $val['idcausa'], 'abreviatura' => $val['abreviaturacausa']);
                    if (!empty($val['idcausa']) && !empty($val['abreviaturacausa'])) {
                        if ($val['abreviaturacausa'] == 'T' || $val['abreviaturacausa'] == 'SA' ||
                            $val['abreviaturacausa'] == 'T/SA' || $val['afectasalario'] == 0
                        ) {
                            $causasP = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                            if (!$this->existe($causasP, $causasPres)) {
                                array_push($causasPres, $causasP);
                            }
                        } else {
                            $causasA = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                            if (!$this->existe($causasA, $causasAus)) {
                                array_push($causasAus, $causasA);
                            }
                        }
                    }
                    $dataindex[$val['idcausa']] = array('dataindex' => $val['idcausa']);
                    $result[$i][$val['idcausa']] += 1;
                    $t[$val['idcausa']] += 1;
                }

                $result[$i]['totalfuera'] = $result[$i]['totalfuera'];
                $result[$i]['presentesreal'] = $result[$i]['presentesreal'] + $var;
                $t['cubierto'] += $result[$i]['cubierto'];
                $t['totalasistencia'] += $result[$i]['totalasistencia'];
                $t['presente'] += $result[$i]['presente'];
                $t['presentesreal'] += $result[$i]['presentesreal'];
                $t['totalfuera'] += $result[$i]['totalfuera'];
                $t['tarde'] += $result[$i]['tarde'];

                $headerlimpios = array_unique($header);
                $dataindexlimpios = array();
                foreach ($dataindex as $index => $obj)
                    $dataindexlimpios[] = $obj;

                //ordenando los dataindex de manera descendente
                usort($dataindexlimpios, "cmp");
            } else {
                $a = array();
                $a['idestructura'] = $v->idestructura;
                $a['estructura'] = $v->denominacion;
                $a['entidad'] = $padre[0]->denominacion;
                $a['porplantilla'] = 0;
                $a['cubierto'] = 0;
                $a['totalasistencia'] = 0;
                $a['presente'] = 0;
                $a['presentesreal'] = 0;
                $a['tarde'] = 0;
                $a['totalfuera'] = 0;
                $a['sinregistro'] = 0;
                $result[$i] = $a;
            }
            $i++;
        }

        $tmpt = array();
        $tmpt['categorias'] = array();
        $tmpt['datos'] = array();
        foreach ($tardanza as $tar) {
            foreach ($tar['categorias'] as $key => $value) {
                array_push($tmpt['categorias'], $tar['categorias'][$key]);
                array_push($tmpt['datos'], $tar['datos'][$key]);
            }

        }
        $tardanza[count($est)] = $tmpt;

        array_push($result, $t);
        $causastodas = array();
        $causastodas = array_merge($causasPres, $causasAus);
        $resumenGrafico = array();
        $grafica = array();
        $categorias = array();
        $datos = array();
        foreach ($result as $key => $per) {
            $datos[$key]['name'] = $per['estructura'];
            $i = 0;
            foreach ($causastodas as $k => $v) {
                if (!empty($per[$v['dataindex']]) && !empty($v['denom'])) {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = $per[$v['dataindex']];
                } else {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = null;
                }
                $i++;
            }
        }
        $r['causasP'] = $causasPres;
        $r['causasA'] = $causasAus;
        $datos['name'] = 'Datos';
        $r['dataindex'] = $dataindexlimpios;
        $r['datos'] = $result;
        $r['cantidad'] = count($result);
        $r['header'] = $headerlimpios;
        $grafic['name'] = $categorias;
        $grafic['data'] = $datos;
        $grafic['tardanza'] = $tardanza;
        $r['resumen'] = $grafic;
        return $r;
    }

    function getAsistenciaByCargos($fecha, $idcargos)
    {
        $a = array();
        $resultado = array();
        $causasPres = array();
        $causasAus = array();

        if (count($idcargos) > 0) {
            $datoscargos = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($idcargos);

            $objasist = new DatAsistencia();
            $a = array();
            $a['porplantilla'] = 0;
            $a['cubierto'] = (int)$objasist->GetCubiertosXCargos($idcargos)[0]['cantidad'];
            $a['presente'] = 0;
            $a['totalfuera'] = 0;

            foreach ($datoscargos as $key => $idcargo) {
                $a['porplantilla'] = $idcargo['cantidad'] + $a['porplantilla'];
            }

            $asistencia = $objasist->GetReporteAsistRangoCargo(null, $idcargos, $fecha);

            foreach ($asistencia as $ind => $val) {
                if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && $val['abreviaturacausa'] != 'T')) {
                    $a['presente'] += 1;
                } elseif ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && $val['abreviaturacausa'] != 'T')) {
                    $a['totalfuera'] += 1;
                }
                if (!empty($val['idcausa']) && !empty($val['abreviaturacausa'])) {
                    if ($val['abreviaturacausa'] == 'T' || $val['afectasalario'] == 0) {
                        $causasP = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                        if (!$this->existe($causasP, $causasPres)) {
                            array_push($causasPres, $causasP);
                        }
                    } else {
                        $causasA = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                        if (!$this->existe($causasA, $causasAus)) {
                            array_push($causasAus, $causasA);
                        }
                    }
                }
                $dataindex[$val['idcausa']] = array('dataindex' => $val['idcausa']);
                $a[$val['idcausa']] += 1;
            }
        }

        $resultado[0]['titulo'] = 'Presentes Vs Ausentes';
        $resultado[0]['tipo'] = 2;
        $resultado[0]['series'][0]['name'] = 'Presentes';
        $resultado[0]['series'][0]['y'] = $a['presente'];
        $resultado[0]['series'][1]['name'] = 'Ausentes';
        $resultado[0]['series'][1]['y'] = $a['totalfuera'];

        $resultado[1]['titulo'] = 'Real Vs Presentes';
        $resultado[1]['tipo'] = 2;
        $resultado[1]['series'][0]['name'] = 'Real';
        $resultado[1]['series'][0]['y'] = $a['cubierto'];
        $resultado[1]['series'][1]['name'] = 'Presentes';
        $resultado[1]['series'][1]['y'] = $a['presente'];

        $causastodas = array();
        $causastodas = array_merge($causasPres, $causasAus);

        $i = 0;
        $resultado[2]['titulo'] = 'Causas';
        $resultado[2]['tipo'] = 1;
        foreach ($causastodas as $k => $v) {
            if (!empty($a[$v['dataindex']]) && !empty($v['denom'])) {
                $resultado[2]['series'][$i]['name'] = $v['denominacion'];
                $resultado[2]['series'][$i]['y'] = $a[$v['dataindex']];
            } else {
                $resultado[2]['series'][$i]['name'] = $v['denominacion'];
                $resultado[2]['series'][$i]['y'] = null;
            }
            $i++;
        }

        return $resultado;
    }

    function existe($causa, $arreglocausas)
    {
        $val = false;
        foreach ($arreglocausas as $index => $obj) {
            if ($obj['dataindex'] == $causa['dataindex']) {
                $val = true;
            }
        }
        return $val;
    }

    public function getPersonasCubierto($idestructura)
    {
        ini_set("max_execution_time", 300);
        $idpersonas = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $asistencia = new DatAsistencia();
        if (count($cargosPeople) > 0)
            $datos = $asistencia->GetDatosPersonaReporte($cargosPeople);

        if (count($datos) != 0) {
            $personasordenadas = $asistencia->OrderPersonasByCargo($datos, null, 0);
            $datos = $personasordenadas;

            $denEntAreas = $this->GetDenomEntAreas($datos);

            $denomarea = array();
            foreach ($datos as $p => $dat) {
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
            foreach ($datos as $key => $persona) {
                $datos[$key]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                $datos[$key]['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';

                $datos[$key]['idcategoria'] = $persona['idpadrecategoria'];
                if ($persona['idgrado']) {
                    $denomgrado = ZendExt_IoC::getInstance()->metadatos->dameGrado($persona['idgrado']);
                    $datos[$key]['gradocategoriallamado'] = $denomgrado[0]['denominacion'];
                } else {
                    $datos[$key]['gradocategoriallamado'] = $persona['denomcategoriapersona'];
                }

                if (!empty($persona['identidad']) && (empty($persona['idcargo']) && empty($persona['idarea']))) {
                    $datos[$key]['denomarea'] = 'Sin Cargo';
                    $datos[$key]['denomcargo'] = 'Sin Cargo';
                }
                $datos[$key]['orden'] = intval($persona['orden']);
            }
        } else {
            $datos = array();
        }

        $result['datos'] = $datos;
        $result['cantidad'] = count($datos);
        return $result;
    }

    public function getPersonasCubiertoByCategocup($catocup)
    {
        ini_set("max_execution_time", 300);
        $idpersonas = array();
        $resultcargos = array();
        $asistencia = new DatAsistencia();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $gc = ZendExt_GlobalConcept::getInstance();
        $idestruct = $gc->Estructura->idestructura;
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestruct, $iddominio, false);
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }

        $cargoscatocup = $asistencia->getCargosPorCatOcup($catocup);
        foreach ($cargosPeople as $k => $v) {
            foreach ($cargoscatocup as $j => $val) {
                if ($v == $val['idcargo']) {
                    $cargosunique[] = $v;
                }
            }
        }
        if (empty($cargosunique))
            $cargosunique = $cargosPeople;

        if (count($cargosunique) > 0)
            $datos = $asistencia->GetDatosPersonaReporte($cargosunique);

        if (count($datos) != 0) {
            $personasordenadas = $asistencia->OrderPersonasByCargo($datos, null, 0);
            $datos = $personasordenadas;

            $denEntAreas = $this->GetDenomEntAreas($datos);

            $denomarea = array();
            foreach ($datos as $p => $dat) {
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
            foreach ($datos as $key => $persona) {
                $datos[$key]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                $datos[$key]['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';

                $datos[$key]['idcategoria'] = $persona['idpadrecategoria'];
                if ($persona['idgrado']) {
                    $denomgrado = ZendExt_IoC::getInstance()->metadatos->dameGrado($persona['idgrado']);
                    $datos[$key]['gradocategoriallamado'] = $denomgrado[0]['denominacion'];
                } else {
                    $datos[$key]['gradocategoriallamado'] = $persona['denomcategoriapersona'];
                }

                if (!empty($persona['identidad']) && (empty($persona['idcargo']) && empty($persona['idarea']))) {
                    $datos[$key]['denomarea'] = 'Sin Cargo';
                    $datos[$key]['denomcargo'] = 'Sin Cargo';
                }
                $datos[$key]['orden'] = intval($persona['orden']);
            }
        } else {
            $datos = array();
        }

        $result['datos'] = $datos;
        $result['cantidad'] = count($datos);
        return $result;
    }

    public function getPersonasCubiertoBySexo($sexo)
    {
        ini_set("max_execution_time", 300);
        $idpersonas = array();
        $resultcargos = array();
        $asistencia = new DatAsistencia();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $gc = ZendExt_GlobalConcept::getInstance();
        $idestruct = $gc->Estructura->idestructura;
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestruct, $iddominio, false);
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }

        $cargossexo = $asistencia->getCargosBySexo($sexo);
        foreach ($cargosPeople as $k => $v) {
            foreach ($cargossexo as $j => $val) {
                if ($v == $val['idcargo']) {
                    $cargosunique[] = $v;
                }
            }
        }
        if (empty($cargosunique))
            $cargosunique = $cargosPeople;

        if (count($cargosunique) > 0)
            $datos = $asistencia->GetDatosPersonaReporte($cargosunique);

        if (count($datos) != 0) {
            $personasordenadas = $asistencia->OrderPersonasByCargo($datos, null, 0);
            $datos = $personasordenadas;

            $denEntAreas = $this->GetDenomEntAreas($datos);

            $denomarea = array();
            foreach ($datos as $p => $dat) {
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
            foreach ($datos as $key => $persona) {
                $datos[$key]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                $datos[$key]['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';

                $datos[$key]['idcategoria'] = $persona['idpadrecategoria'];
                if ($persona['idgrado']) {
                    $denomgrado = ZendExt_IoC::getInstance()->metadatos->dameGrado($persona['idgrado']);
                    $datos[$key]['gradocategoriallamado'] = $denomgrado[0]['denominacion'];
                } else {
                    $datos[$key]['gradocategoriallamado'] = $persona['denomcategoriapersona'];
                }

                if (!empty($persona['identidad']) && (empty($persona['idcargo']) && empty($persona['idarea']))) {
                    $datos[$key]['denomarea'] = 'Sin Cargo';
                    $datos[$key]['denomcargo'] = 'Sin Cargo';
                }
                $datos[$key]['orden'] = intval($persona['orden']);
            }
        } else {
            $datos = array();
        }

        $result['datos'] = $datos;
        $result['cantidad'] = count($datos);
        return $result;
    }

    public function Resumenasistencia($columnIndex, $idcausa, $desde, $hasta, $idestructura, $tiporeporte, $estructura, $agrupador)
    {
        $arrdatos = array();
        $cant = 0;
        if ($tiporeporte == 3) {
            $datos = $this->getResumenasistenciaByDias($idestructura, $desde, $hasta, $estructura);
            if (empty($idcausa) && $columnIndex > 6 && $idcausa != 'totalfuera') {
                foreach ($datos['datos'] as $i => $val) {
                    if (is_numeric($val['idcausa']) && $val['idcausa'] == $idcausa) {
                        array_push($arrdatos, $val);
                    }
                }
                $arrResumen['datos'] = $arrdatos;
                $arrResumen['cantidad'] = count($arrdatos);

            } else if (!empty($idcausa) && $columnIndex > 6 && $idcausa != 'totalfuera') {
                foreach ($datos['datos'] as $i => $val) {
                    if ($val['idcausa'] == $idcausa) {
                        array_push($arrdatos, $val);
                    }
                }
                $arrResumen['datos'] = $arrdatos;
                $arrResumen['cantidad'] = count($arrdatos);
            } else {
                if ($columnIndex == 2) {
                    foreach ($datos['datos'] as $i => $val) {
                        if (!empty($val['idcausa']) || !empty($val['fechahoraentrada'])) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($columnIndex == 3) {
                    foreach ($datos['datos'] as $i => $val) {
                        array_push($arrdatos, $val);
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($columnIndex == 5) {
                    foreach ($datos['datos'] as $i => $val) {
                        if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && $val['abreviaturacausa'] != 'T')) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($columnIndex == 6) {
                    $var = 0;
                    foreach ($datos['datos'] as $i => $val) {
                        if ($val['abreviaturacausa'] == 'T') {
                            array_push($arrdatos, $val);
                        }
                        if (!empty($val['fechahoraentrada']) && empty($val['idcausa'])) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($idcausa == 'totalfuera') {
                    foreach ($datos['datos'] as $i => $val) {
                        if ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && $val['abreviaturacausa'] != 'T' && empty($val['fechahoraentrada']))) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                }
            }
        } else {
            if ($tiporeporte == 2) {
                $datos = $this->getResumenasistenciaByCategOcup($idestructura, $desde, $hasta);
            }
            if ($tiporeporte == 4) {
                $datos = $this->getResumenasistenciaBySexo($idestructura, $desde, $hasta);
            }

            if (empty($idcausa) && $columnIndex > 8 && $idcausa != 'totalfuera') {
                if ($tiporeporte == 1)
                    $datos = $this->getResumenasistencia($idestructura, $desde, $hasta);
                foreach ($datos['datos'] as $i => $val) {
                    if (is_numeric($val['idcausa']) && $val['idcausa'] == $idcausa) {
                        array_push($arrdatos, $val);
                    }
                }
                $arrResumen['datos'] = $arrdatos;
                $arrResumen['cantidad'] = count($arrdatos);

            } else if (!empty($idcausa) && $columnIndex > 8 && $idcausa != 'totalfuera') {
                if ($tiporeporte == 1)
                    $datos = $this->getResumenasistencia($idestructura, $desde, $hasta);
                foreach ($datos['datos'] as $i => $val) {
                    if ($val['idcausa'] == $idcausa) {
                        array_push($arrdatos, $val);
                    }
                }
                $arrResumen['datos'] = $arrdatos;
                $arrResumen['cantidad'] = count($arrdatos);
            } else {
                if ($columnIndex == 2) {
                    if ($tiporeporte == 1)
                        $datos = $this->getResumenasistencia($idestructura, $desde, $hasta);
                    foreach ($datos['datos'] as $i => $val) {
                        if (!empty($val['idcausa']) || !empty($val['fechahoraentrada'])) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($columnIndex == 4) {
                    if ($tiporeporte == 1)
                        $arrResumen = $this->getPersonasCubierto($idestructura);
                    else
                        $arrResumen = $this->getPersonasCubiertoByCategocup($idestructura);
                } else if ($columnIndex == 5) {
                    if ($tiporeporte == 1)
                        $datos = $this->getResumenasistencia($idestructura, $desde, $hasta);
                    foreach ($datos['datos'] as $i => $val) {
                        array_push($arrdatos, $val);
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($columnIndex == 7) {
                    if ($tiporeporte == 1)
                        $datos = $this->getResumenasistencia($idestructura, $desde, $hasta);
                    foreach ($datos['datos'] as $i => $val) {
                        if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && $val['abreviaturacausa'] != 'T')) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($columnIndex == 8) {
                    $var = 0;
                    if ($tiporeporte == 1)
                        $datos = $this->getResumenasistencia($idestructura, $desde, $hasta);
                    foreach ($datos['datos'] as $i => $val) {
                        if ($val['abreviaturacausa'] == 'T') {
                            array_push($arrdatos, $val);
                        }
                        if (!empty($val['fechahoraentrada']) && empty($val['idcausa'])) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($idcausa == 'totalfuera') {
                    if ($tiporeporte == 1)
                        $datos = $this->getResumenasistencia($idestructura, $desde, $hasta);
                    foreach ($datos['datos'] as $i => $val) {
                        if ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && $val['abreviaturacausa'] != 'T' && empty($val['fechahoraentrada']))) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                }
            }
        }

        foreach ($arrResumen['datos'] as $i => $val) {
            if ($agrupador == 1) {
                $arrResumen['datos'][$i]['agrupador'] = $val['denomarea'];
            } else if ($agrupador == 2) {
                if (empty($val['idcausa']))
                    $arrResumen['datos'][$i]['agrupador'] = 'Sin causa';
                else
                    $arrResumen['datos'][$i]['agrupador'] = $val['denominacion'];
            } else if ($agrupador == 3) {
                $arrResumen['datos'][$i]['agrupador'] = $val['fecharegistro'];
            }
        }
        $r['datos'] = $arrResumen['datos'];
        $r['cantidad'] = $arrResumen['cantidad'];
        return $r;
    }

    public function getResumenasistencia($idestructura, $desde, $hasta)
    {
        $idpersonas = array();
        $asistencia = new DatAsistencia();
        $estructuras = array();
        $idcargos = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, true);

        foreach ($cargos as $j => $val) {
            array_push($idcargos, $val['id']);
        }
        if (!empty($idcargos))
            $p = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array(), null, null, 0, null, $idcargos, null, 'false', 'true', 'false', 'true');

        $personas = array();
        $idpersonasDatos = array();
        foreach ($p->data as $person) {
            array_push($idpersonas, $person['idpersona']);
            $personas[$person['idpersona']] = $person;
        }

        if (count($idpersonas) > 0) {
            if (!empty($idcargos))
                $datos = $asistencia->GetReporteAsistRangoByCargo($idcargos, $desde, $hasta);

            if (count($datos) > 0) {
                $personasordenadas = $asistencia->OrderPersonasByCargo($datos, null, 0);
                $datos = $personasordenadas;
            }

            $denEntAreas = $this->GetDenomEntAreas($personas);
            foreach ($datos as $person) {
                array_push($idpersonasDatos, $person['idpersona']);
            }
            $posDatos = 0;
            $diff = array_diff($idpersonas, $idpersonasDatos);

            $datosNoRegistro = array();
            $noregistro = array();
            $sinregistro = array();
            foreach ($diff as $i => $p) {
                $noregistro['nombreapellidos'] = $personas[$p]['nombreapellidos'];
                $noregistro['denomcargo'] = $personas[$p]['denomcargo'];
                $noregistro['denomarea'] = (is_numeric($personas[$p]['idarea'])) ?
                    $denEntAreas[$personas[$p]['idarea']]['denominacion'] : 'Sin Cargo';
                $noregistro['denomentidad'] = $denEntAreas[$personas[$p]['identidad']]['denominacion'];
                $noregistro['causa'] = 'Sin registro';
                $noregistro['idpersona'] = $personas[$p]['idpersona'];
                $datosNoRegistro[$posDatos++] = $noregistro;
            }
            if (count($datos) > 0) {
                $denomarea = array();
                foreach ($datos as $p => $dat) {
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
                foreach ($datos as $key => $persona) {

                    $datos[$key]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                    $datos[$key]['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';

                    if (!empty($persona['idcausa']) && !empty($persona['abreviaturacausa']))
                        $datos[$key]['causa'] = $persona['denominacion'] . '[' . $persona['abreviaturacausa'] . ']';
                    if (!empty($persona['identidad']) && (empty($persona['idcargo']) && empty($persona['idarea']))) {
                        $datos[$key]['denomarea'] = 'Sin Cargo';
                        $datos[$key]['denomcargo'] = 'Sin Cargo';
                    }
                    if (empty($persona['idcausa']) && empty($persona['fechahoraentrada']) && empty($persona['fechahorasalida'])) {
                        $persona['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                        $persona['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';
                        $persona['causa'] = 'Sin registro';
                        array_push($datosNoRegistro, $persona);
                    }

                    if (!empty($persona['fechahoraentrada'])) {
                        $v = explode(' ', $persona['fechahoraentrada']);
                        $k = explode(':', $v[1]);
                        $datos[$key]['fechahoraentrada'] = (!empty($v[1])) ? $k[0] . ':' . $k[1] : null;
                        if (empty($v[0]))
                            $datos[$key]['fechaentrada'] = $persona['fecharegistro'];
                        else
                            $datos[$key]['fechaentrada'] = $v[0];

                        $a = explode(' ', $persona['fechahorasalida']);
                        $j = explode(':', $a[1]);
                        $datos[$key]['fechahorasalida'] = (!empty($a[1])) ? $j[0] . ':' . $j[1] : null;
                        $datos[$key]['fechasalida'] = $a[0];

                    }
                }
            } else {
                $datos = array();
                $canttotal = 0;
            }
        } else {
            $datos = array();
            $canttotal = 0;
        }
        $result['datos'] = $datos;
        $result['sinregistro'] = $datosNoRegistro;
        $result['cantidad'] = count($datos);
        return $result;
    }

    public function getResumenasistenciaByCategOcup($catocup, $desde, $hasta)
    {
        $idpersonas = array();
        $asistencia = new DatAsistencia();
        $estructuras = array();
        $idcargos = array();
        $resultcargos = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $gc = ZendExt_GlobalConcept::getInstance();
        $idestruct = $gc->Estructura->idestructura;
        $cargosunique = array();
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestruct, $iddominio, true);

        foreach ($cargos as $j => $val) {
            array_push($idcargos, $val['id']);
        }

        $cargoscatocup = $asistencia->getCargosPorCatOcup($catocup);
        foreach ($idcargos as $k => $v) {
            foreach ($cargoscatocup as $j => $val) {
                if ($v == $val['idcargo']) {
                    $cargosunique[] = $v;
                }
            }
        }
        if (empty($cargosunique))
            $cargosunique = $idcargos;

        if (!empty($cargosunique))
            $p = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array(), null, null, 0, null, $cargosunique, null, 'false', 'true', 'false', 'true');

        $personas = array();
        $idpersonasDatos = array();
        foreach ($p->data as $person) {
            array_push($idpersonas, $person['idpersona']);
            $personas[$person['idpersona']] = $person;
        }

        if (count($idpersonas) > 0) {
            if (!empty($cargosunique))
                $datos = $asistencia->GetReporteAsistRangoByCargo($cargosunique, $desde, $hasta);

            if (count($datos) > 0) {
                $personasordenadas = $asistencia->OrderPersonasByCargo($datos, null, 0);
                $datos = $personasordenadas;
            }

            $denEntAreas = $this->GetDenomEntAreas($personas);
            foreach ($datos as $person) {
                array_push($idpersonasDatos, $person['idpersona']);
            }
            $posDatos = 0;
            $diff = array_diff($idpersonas, $idpersonasDatos);

            $datosNoRegistro = array();
            $noregistro = array();
            $sinregistro = array();

            foreach ($diff as $i => $p) {
                $noregistro['nombreapellidos'] = $personas[$p]['nombreapellidos'];
                $noregistro['denomcargo'] = $personas[$p]['denomcargo'];
                $noregistro['denomarea'] = (is_numeric($personas[$p]['idarea'])) ?
                    $denEntAreas[$personas[$p]['idarea']]['denominacion'] : 'Sin Cargo';
                $noregistro['denomentidad'] = $denEntAreas[$personas[$p]['identidad']]['denominacion'];
                $noregistro['causa'] = 'Sin registro';
                $noregistro['idpersona'] = $personas[$p]['idpersona'];
                $datosNoRegistro[$posDatos++] = $noregistro;
            }
            if (count($datos) > 0) {
                $denomarea = array();
                foreach ($datos as $p => $dat) {
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

                foreach ($datos as $key => $persona) {

                    $datos[$key]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                    $datos[$key]['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';

                    if (!empty($persona['idcausa']) && !empty($persona['abreviaturacausa']))
                        $datos[$key]['causa'] = $persona['denominacion'] . '[' . $persona['abreviaturacausa'] . ']';
                    if (!empty($persona['identidad']) && (empty($persona['idcargo']) && empty($persona['idarea']))) {
                        $datos[$key]['denomarea'] = 'Sin Cargo';
                        $datos[$key]['denomcargo'] = 'Sin Cargo';
                    }
                    if (empty($persona['idcausa']) && empty($persona['fechahoraentrada']) && empty($persona['fechahorasalida'])) {
                        $persona['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                        $persona['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';
                        $persona['causa'] = 'Sin registro';
                        array_push($datosNoRegistro, $persona);
                    }

                    if (!empty($persona['fechahoraentrada'])) {
                        $v = explode(' ', $persona['fechahoraentrada']);
                        $k = explode(':', $v[1]);
                        $datos[$key]['fechahoraentrada'] = (!empty($v[1])) ? $k[0] . ':' . $k[1] : null;
                        if (empty($v[0]))
                            $datos[$key]['fechaentrada'] = $persona['fecharegistro'];
                        else
                            $datos[$key]['fechaentrada'] = $v[0];

                        $a = explode(' ', $persona['fechahorasalida']);
                        $j = explode(':', $a[1]);
                        $datos[$key]['fechahorasalida'] = (!empty($a[1])) ? $j[0] . ':' . $j[1] : null;
                        $datos[$key]['fechasalida'] = $a[0];
                    }

                }
            } else {
                $datos = array();
                $canttotal = 0;
            }
        } else {
            $datos = array();
            $canttotal = 0;
        }
        $result['datos'] = $datos;
        $result['sinregistro'] = $datosNoRegistro;
        $result['cantidad'] = count($datos);
        return $result;
    }

    public function getResumenasistenciaBySexo($sexo, $desde, $hasta)
    {
        $idpersonas = array();
        $asistencia = new DatAsistencia();
        $estructuras = array();
        $idcargos = array();
        $resultcargos = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $gc = ZendExt_GlobalConcept::getInstance();
        $idestruct = $gc->Estructura->idestructura;
        $cargosunique = array();
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestruct, $iddominio, true);

        foreach ($cargos as $j => $val) {
            array_push($idcargos, $val['id']);
        }

        $sexo = $asistencia->getCargosBySexo($sexo);
        foreach ($idcargos as $k => $v) {
            foreach ($sexo as $j => $val) {
                if ($v == $val['idcargo']) {
                    $cargosunique[] = $v;
                }
            }
        }
        if (empty($cargosunique))
            $cargosunique = $idcargos;

        if (!empty($cargosunique))
            $p = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array(), null, null, 0, null, $cargosunique, null, 'false', 'true', 'false', 'true');

        $personas = array();
        $idpersonasDatos = array();
        foreach ($p->data as $person) {
            array_push($idpersonas, $person['idpersona']);
            $personas[$person['idpersona']] = $person;
        }

        if (count($idpersonas) > 0) {
            if (!empty($cargosunique))
                $datos = $asistencia->GetReporteAsistRangoByCargo($cargosunique, $desde, $hasta);

            if (count($datos) > 0) {
                $personasordenadas = $asistencia->OrderPersonasByCargo($datos, null, 0);
                $datos = $personasordenadas;
            }

            $denEntAreas = $this->GetDenomEntAreas($personas);
            foreach ($datos as $person) {
                array_push($idpersonasDatos, $person['idpersona']);
            }
            $posDatos = 0;
            $diff = array_diff($idpersonas, $idpersonasDatos);

            $datosNoRegistro = array();
            $noregistro = array();
            $sinregistro = array();

            foreach ($diff as $i => $p) {
                $noregistro['nombreapellidos'] = $personas[$p]['nombreapellidos'];
                $noregistro['denomcargo'] = $personas[$p]['denomcargo'];
                $noregistro['denomarea'] = (is_numeric($personas[$p]['idarea'])) ?
                    $denEntAreas[$personas[$p]['idarea']]['denominacion'] : 'Sin Cargo';
                $noregistro['denomentidad'] = $denEntAreas[$personas[$p]['identidad']]['denominacion'];
                $noregistro['causa'] = 'Sin registro';
                $noregistro['idpersona'] = $personas[$p]['idpersona'];
                $datosNoRegistro[$posDatos++] = $noregistro;
            }
            if (count($datos) > 0) {
                $denomarea = array();
                foreach ($datos as $p => $dat) {
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

                foreach ($datos as $key => $persona) {

                    $datos[$key]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                    $datos[$key]['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';

                    if (!empty($persona['idcausa']) && !empty($persona['abreviaturacausa']))
                        $datos[$key]['causa'] = $persona['denominacion'] . '[' . $persona['abreviaturacausa'] . ']';
                    if (!empty($persona['identidad']) && (empty($persona['idcargo']) && empty($persona['idarea']))) {
                        $datos[$key]['denomarea'] = 'Sin Cargo';
                        $datos[$key]['denomcargo'] = 'Sin Cargo';
                    }
                    if (empty($persona['idcausa']) && empty($persona['fechahoraentrada']) && empty($persona['fechahorasalida'])) {
                        $persona['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                        $persona['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';
                        $persona['causa'] = 'Sin registro';
                        array_push($datosNoRegistro, $persona);
                    }

                    if (!empty($persona['fechahoraentrada'])) {
                        $v = explode(' ', $persona['fechahoraentrada']);
                        $k = explode(':', $v[1]);
                        $datos[$key]['fechahoraentrada'] = (!empty($v[1])) ? $k[0] . ':' . $k[1] : null;
                        if (empty($v[0]))
                            $datos[$key]['fechaentrada'] = $persona['fecharegistro'];
                        else
                            $datos[$key]['fechaentrada'] = $v[0];

                        $a = explode(' ', $persona['fechahorasalida']);
                        $j = explode(':', $a[1]);
                        $datos[$key]['fechahorasalida'] = (!empty($a[1])) ? $j[0] . ':' . $j[1] : null;
                        $datos[$key]['fechasalida'] = $a[0];
                    }

                }
            } else {
                $datos = array();
                $canttotal = 0;
            }
        } else {
            $datos = array();
            $canttotal = 0;
        }
        $result['datos'] = $datos;
        $result['sinregistro'] = $datosNoRegistro;
        $result['cantidad'] = count($datos);
        return $result;
    }

    public function getResumenasistenciaByDias($idestructura, $desde, $hasta, $fecharegistro)
    {
        $idpersonas = array();
        $asistencia = new DatAsistencia();
        $estructuras = array();
        $idcargos = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, true);

        foreach ($cargos as $j => $val) {
            array_push($idcargos, $val['id']);
        }
        if (!empty($idcargos))
            $p = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array(), null, null, 0, null, $idcargos, null, 'false', 'true', 'false', 'true');

        $personas = array();
        $idpersonasDatos = array();
        foreach ($p->data as $person) {
            array_push($idpersonas, $person['idpersona']);
            $personas[$person['idpersona']] = $person;
        }

        if (count($idpersonas) > 0) {
            if (!empty($idcargos)) {
                if ($fecharegistro == 'Total') {
                    $datos = $asistencia->GetReporteAsistRangoByCargo($idcargos, $desde, $hasta);
                } else {
                    $datos = $asistencia->GetReporteAsistFechaCargo($idcargos, $fecharegistro);
                }
            }

            if (count($datos) > 0) {
                $personasordenadas = $asistencia->OrderPersonasByCargo($datos, null, 0);
                $datos = $personasordenadas;
            }

            $denEntAreas = $this->GetDenomEntAreas($personas);
            foreach ($datos as $person) {
                array_push($idpersonasDatos, $person['idpersona']);
            }
            $posDatos = 0;
            $diff = array_diff($idpersonas, $idpersonasDatos);

            $datosNoRegistro = array();
            $noregistro = array();
            $sinregistro = array();
            foreach ($diff as $i => $p) {
                $noregistro['nombreapellidos'] = $personas[$p]['nombreapellidos'];
                $noregistro['denomcargo'] = $personas[$p]['denomcargo'];
                $noregistro['denomarea'] = (is_numeric($personas[$p]['idarea'])) ?
                    $denEntAreas[$personas[$p]['idarea']]['denominacion'] : 'Sin Cargo';
                $noregistro['denomentidad'] = $denEntAreas[$personas[$p]['identidad']]['denominacion'];
                $noregistro['causa'] = 'Sin registro';
                $noregistro['idpersona'] = $personas[$p]['idpersona'];
                $datosNoRegistro[$posDatos++] = $noregistro;
            }
            if (count($datos) > 0) {
                $denomarea = array();
                foreach ($datos as $p => $dat) {
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
                foreach ($datos as $key => $persona) {

                    $datos[$key]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                    $datos[$key]['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';

                    if (!empty($persona['idcausa']) && !empty($persona['abreviaturacausa']))
                        $datos[$key]['causa'] = $persona['denominacion'] . '[' . $persona['abreviaturacausa'] . ']';
                    if (!empty($persona['identidad']) && (empty($persona['idcargo']) && empty($persona['idarea']))) {
                        $datos[$key]['denomarea'] = 'Sin Cargo';
                        $datos[$key]['denomcargo'] = 'Sin Cargo';
                    }
                    if (empty($persona['idcausa']) && empty($persona['fechahoraentrada']) && empty($persona['fechahorasalida'])) {
                        $persona['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                        $persona['denomarea'] = (is_numeric($persona['idarea'])) ? $denomarea[$persona['idarea']] : 'Sin Cargo';
                        $persona['causa'] = 'Sin registro';
                        array_push($datosNoRegistro, $persona);
                    }

                    if (!empty($persona['fechahoraentrada'])) {
                        $v = explode(' ', $persona['fechahoraentrada']);
                        $k = explode(':', $v[1]);
                        $datos[$key]['fechahoraentrada'] = (!empty($v[1])) ? $k[0] . ':' . $k[1] : null;
                        if (empty($v[0]))
                            $datos[$key]['fechaentrada'] = $persona['fecharegistro'];
                        else
                            $datos[$key]['fechaentrada'] = $v[0];

                        $a = explode(' ', $persona['fechahorasalida']);
                        $j = explode(':', $a[1]);
                        $datos[$key]['fechahorasalida'] = (!empty($a[1])) ? $j[0] . ':' . $j[1] : null;
                        $datos[$key]['fechasalida'] = $a[0];

                    }
                }
            } else {
                $datos = array();
                $canttotal = 0;
            }
        } else {
            $datos = array();
            $canttotal = 0;
        }
        $result['datos'] = $datos;
        $result['sinregistro'] = $datosNoRegistro;
        $result['cantidad'] = count($datos);
        return $result;
    }

    public function GetDatosExportarestadisticoExcel($arreglo, $tiporeporte)
    {
        $objPHPExcel = new PHPExcel();

        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Reporte estadístico');

        $objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

        $rencabezado = array('Datos generales', 'Presentes', 'Ausentes');

        if ($tiporeporte == 1) {
            $rcampos = array('Estructura', 'Por plantilla', 'Real', 'Con asistencia', 'Total presentes', 'En la entidad');
            $rdimension = array(40, 15, 10, 15, 15, 15);
        } else if ($tiporeporte == 2) {
            $rcampos = array('Categoría ocupacional', 'Por plantilla', 'Real', 'Con asistencia', 'Total presentes', 'En la entidad');
            $rdimension = array(30, 15, 10, 15, 15, 15);
        } else if ($tiporeporte == 3) {
            $rcampos = array('Fecha', 'Con asistencia', 'Total presentes', 'En la entidad');
            $rdimension = array(15, 15, 15, 15);
        } else if ($tiporeporte == 4) {
            $rcampos = array('Género', 'Por plantilla', 'Real', 'Con asistencia', 'Total presentes', 'En la entidad');
            $rdimension = array(20, 15, 10, 15, 15, 15);
        }
        $dimpresentes = 0;
        $causasP = $arreglo['causasP'];
        foreach ($causasP as $key => $causa) {
            $rcampos[] = $causa['denom'];
            $rdimension[] = 10;
            $dimpresentes += 10;
        }
        $rcampos = array_merge($rcampos, array(
            'Total ausentes'
        ));
        $rdimension = array_merge($rdimension, array(15));
        $dimausentes = 0;
        $causasA = $arreglo['causasA'];
        foreach ($causasA as $key => $causa) {
            $rcampos[] = $causa['denom'];
            $rdimension[] = 10;
            $dimausentes += 10;
        }

        if ($tiporeporte == 1) {
            $rdimencabez = array(80, 30 + $dimpresentes, 15 + $dimausentes);
        } else if ($tiporeporte == 2) {
            $rdimencabez = array(70, 30 + $dimpresentes, 15 + $dimausentes);
        } else if ($tiporeporte == 3) {
            $rdimencabez = array(30, 30 + $dimpresentes, 15 + $dimausentes);
        } else if ($tiporeporte == 4) {
            $rdimencabez = array(60, 30 + $dimpresentes, 15 + $dimausentes);
        }

        $letraactualE = '';
        foreach ($rencabezado as $ind => $campo) {
            $letraactualE = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            //$objPHPExcel->getActiveSheet()->mergeCells($letraactualE. '1:D1');
            $objPHPExcel->getActiveSheet()->setCellValue($letraactualE . '1', $campo);
            $this->fnPintarBordes($objPHPExcel, $letraactualE . '1', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactualE . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactualE . '1', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactualE . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
        }
        foreach ($rdimencabez as $ind => $campo) {
            $rdimencabez = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $objPHPExcel->getActiveSheet()->getColumnDimension($rdimencabez)->setWidth($campo);
        }
        //Pintar fondo de encabezado
        $this->fnPintarFondo($objPHPExcel, 'A1:' . $letraactualE . '1', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');


        $letraactual = '';
        foreach ($rcampos as $ind => $campo) {
            $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual . '2', $campo);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '2', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '2', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        }
        foreach ($rdimension as $ind => $campo) {
            $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $objPHPExcel->getActiveSheet()->getColumnDimension($letraactual)->setWidth($campo);
        }
        //Pintar fondo de encabezado
        $this->fnPintarFondo($objPHPExcel, 'A2:' . $letraactual . '2', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');


        foreach ($arreglo['datos'] as $key => $value) {
            $rdatos = array();

            //Arreglo de datos de la persona en cuestion
            if ($tiporeporte != 3) {
                $rdatos = array($value['estructura'], $value['porplantilla'], $value['cubierto'], $value['totalasistencia'],
                    $value['presente'], $value['presentesreal']);
            } else {
                $rdatos = array($value['estructura'], $value['totalasistencia'],
                    $value['presente'], $value['presentesreal']);
            }

            foreach ($causasP as $ind => $causa) {
                $rdatos[] = ($value[$causa['dataindex']]) ? $value[$causa['dataindex']] : '';
            }
            $rdatos = array_merge($rdatos, array($value['totalfuera']));
            foreach ($causasA as $ind => $causa) {
                $rdatos[] = ($value[$causa['dataindex']]) ? $value[$causa['dataindex']] : '';
            }

            foreach ($rdatos as $ind => $datospersona) {
                $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
                $objPHPExcel->getActiveSheet()->setCellValue($letraactual . intval($key + 1 + 2), $datospersona);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 1 + 2), 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 1 + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 1 + 2), 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 1 + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($objPHPExcel, $letraactual . intval($key + 1 + 2) . '', 'left', 'center', 0);
            }
        }

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Reporte estadistico.xls" ');
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

    public function GetDatosExportarNominalExcel($arreglo)
    {
        $objPHPExcel = new PHPExcel();

        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Reporte nominal');

        $objPHPExcel->getActiveSheet()->getColumnDimension("A")->setWidth(5);
        $objPHPExcel->getActiveSheet()->getColumnDimension("B")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("C")->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension("D")->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension("E")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("F")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("G")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("H")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("I")->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension("J")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("K")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("L")->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension("M")->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension("N")->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension("O")->setWidth(30);

        $objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

        $rcampos = array('No', 'CI', 'Nombre y apellidos', 'Cargo', 'Fecha entrada', 'Hora entrada', 'Fecha salida', 'Hora salida',
            'Causa', 'Desde', 'Hasta', 'Perdidas', 'Controlado por', 'Modificado por', 'Certificado por');

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

        foreach ($arreglo['datos'] as $key => $datos) {
            $rdatos = array();

            //Arreglo de datos de la persona en cuestion
            $rdatos = array($key, $datos['numid'], $datos['nombreapellidos'], $datos['denomcargo'], $datos['fechaentrada'], $datos['fechahoraentrada'],
                $datos['fechasalida'], $datos['fechahorasalida'], $datos['causa'], $datos['fdesde'], $datos['fhasta'], $datos['hrsdescontadas'],
                $datos['personacontrola'], $datos['personamodifica'], $datos['personacertifica']);

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
        header('Content-Disposition: attachment;filename="Reporte nominal.xls" ');
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

    public function FormatTime($diference)
    {
        $hrs = ($diference->h < 10) ? '0' . $diference->h : $diference->h;
        $min = ($diference->i < 10) ? '0' . $diference->i : $diference->i;
        $seg = ($diference->s < 10) ? '0' . $diference->s : $diference->s;
        return $hrs . ':' . $min . ':' . $seg;
    }

    function generarReporteAsistencia($fechdesde, $fechhasta, $idpersona)
    {
        $datAsistencia = new DatAsistencia();
        $fechd = explode('/', $fechdesde);
        $asistencia = $datAsistencia->GetAllByMonthYearAndPersonBySesion($fechdesde, $fechhasta, $idpersona, $fechd[1], $fechd[2], null, 0);
        return $asistencia;
    }

    function NotificarCorreoAsistencia($fechdesde, $fechhasta, $idspersona, $mes, $year)
    {
        $ids = array();
        foreach ($idspersona as $id) {
            $ids[] = $id['idpersona'];
        }
        $datAsistencia = new DatAsistencia();
        $result = array();
        $asunto = 'Resumen de asistencia';
        $asistencia = $datAsistencia->GetAllByMonthYearAndArrayPerson($fechdesde, $fechhasta, $ids, $mes, $year, null, 0);
        foreach ($idspersona as $key => $val) {
            $result[$key]['idpersona'] = $val['idpersona'];
            $result[$key]['todos'] = true;
            if (count($asistencia[$val['idpersona']]) > 0) {
                $result[$key]['msghtml'] = $this->GetEmailTemplate($fechdesde, $fechhasta, $asistencia[$val['idpersona']]);
            } else {
                $datos = $datAsistencia->getdatospersona(array($val['idpersona']));
                $result[$key]['msghtml'] = $this->GetEmailTemplateSinAsistencia($fechdesde, $fechhasta, $datos);
            }
            $result[$key]['asunto'] = $asunto;
        }
        return $result;
    }

    private function GetEmailTemplate($fechdesde, $fechhasta, $asistencia)
    {
        $correo = "<html><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><head>";
        $style = "<style>
            #encabezado{margin-top:20px;}
            #encabezado td{width:100%;color: #15428b;font: 11px/15px tahoma,arial,verdana,sans-serif;}            
            #encabezado td.header{width:100%;color: #15428b;font: bold 12px/16px tahoma,arial,verdana,sans-serif;}            
            #datospersonales td{width:100%;}          
            #datospersonales td{width:100%;color: #15428b;font: 11px/15px tahoma,arial,verdana,sans-serif;}            
            .pagina {/*box-shadow: 10px 10px 5px #ccdbe1;*/width:100%;height: 100%;background-color: #fff;border-left: 1px solid #ccdbe1;border-top:1px solid #ccdbe1;padding-left:5px; margin-left:5px;}            
            .separador{width:99%;height: 1px;border: 0;border-top: 2px solid #54A3EE;margin: 1em 0;padding: 0;}            
            #asistencia {width:99%;}            
            #asistencia th{color: #15428b;font: 11px/15px tahoma,arial,verdana,sans-serif;border-bottom: 1px solid #54A3EE;border-top: 1px solid #54A3EE;border-left: 0;border-right: 0;text-align:left;height:2em;padding:1px 1px 1px 3px;background-color:#C1D5F0;}            
            #asistencia td{color: #15428b;font: 11px/15px tahoma,arial,verdana,sans-serif;border-left: 0px;border-right: 0px;height:1.8em;padding:1px 1px 1px 3px;}            
            #asistencia tbody tr.even {background: #fafafa}            
            #asistencia tbody tr.odd {background: #FFF}   
            #asistencia tbody tr.weekend {background: #C1D5F0}
            #asistencia tbody tr td.month {border-bottom: 2px solid #54A3EE;font: bold 11px/15px tahoma,arial,verdana,sans-serif;}
            </style>";
        $correo .= $style . "</head>";
        $body = "<body>
                <div class='pagina'>
                <table id='encabezado'>
                    <tr>
                        <td class='header'>
                            Resumen de Asistencia
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Período: " . $fechdesde . " - " . $fechhasta . "
                        </td>
                    </tr>
                </table>                
                <hr class='separador'>            
                <table id='datospersonales'>
                    <tr>
                        <td>
                            Nombres y Apellidos: " . $asistencia['nombreapellidos'] . "
                            </td>
                    </tr>
                    <tr>
                        <td>
                            No. identificación: " . $asistencia['noidentidad'] . "
                            </td>
                        </tr>
                    </table>                
                    <br/> 
                    <table id='asistencia' cellspacing='0' cellpadding='0'>
                    <thead>
                        <tr>
                            <th>
                                Fecha
                            </th>                            
                            <th>
                                Hora de entrada
                            </th>
                            <th>
                                Hora de salida
                            </th>
                            <th>
                                Causa
                            </th> 
                            <th>
                                Controlado por
                            </th>                           
                           
                        </tr>		
                    </thead>
                    <tbody>";

        $rowstyle = "odd";
        foreach ($asistencia['asistencia'] as $keymes => $mesanno) {
            $body .= "<tr class='month'>
                        <td colspan='5' class='month'>
                            " . $keymes . "
                         </td>
                    </tr>";

            foreach ($mesanno as $k => $asis) {
                $fechahoraentrada = '-';
                if ($asis['fechahoraentrada'] != "") {
                    $fhe = explode(' ', $asis['fechahoraentrada']);
                    $he = explode(':', $fhe[1]);
                    $fechahoraentrada = $he[0] . ":" . $he[1];
                }

                $fechahorasalida = '-';
                if ($asis['fechahorasalida'] != "") {
                    $fhs = explode(' ', $asis['fechahorasalida']);
                    $hs = explode(':', $fhs[1]);
                    $fechahorasalida = $hs[0] . ":" . $hs[1];
                }

                $causa = $asis['causa'] != '' ? $asis['causa'] : '-';
                $fdesde = $asis['fdesde'] != '' ? $asis['fdesde'] : '-';
                $fhasta = $asis['fhasta'] != '' ? $asis['fhasta'] : '-';
                $hrsdescontadas = $asis['hrsdescontadas'] != '' ? $asis['hrsdescontadas'] : '-';
                $horasextras = $asis['horasextras'] != '' ? $asis['horasextras'] : '-';
                $personacontrola = $asis['personacontrola'] != '' ? $asis['personacontrola'] : '-';
                $time = strtotime($asis['mes'] . '/' . $asis['dia'] . '/' . $asis['year']);
                $newformat = date('Y-m-d', $time);
                $iswend = $this->isWeekend($newformat);
                $estilo = $rowstyle;
                if ($iswend) {
                    $fechahoraentrada = '';
                    $fechahorasalida = '';
                    $estilo = 'weekend';
                    $causa = '';
                    $fdesde = '';
                    $fhasta = '';
                    $hrsdescontadas = '';
                    $horasextras = '';
                    $personacontrola = '';
                    $TEXTO = "";
                    if ($iswend == 'sabado')
                        $TEXTO = "SÁBADO";
                    if ($iswend == 'domingo')
                        $TEXTO = "DOMINGO";

                    $body .= "<tr class='" . $estilo . "'>
                        <td>
                            " . $asis['dia'] . "
                        </td>
                        <td colspan='4' style='text-align: center'>
                            " . $TEXTO . "
                        </td>	
                    </tr>";

                } else
                    $body .= "<tr class='" . $estilo . "'>
                        <td>
                            " . $asis['dia'] . "
                        </td>                       
                        <td>
                            " . $fechahoraentrada . "
                        </td>
                        <td>
                            " . $fechahorasalida . "
                        </td>
                        <td>
                            " . $causa . "
                        </td>
                        <td>
                            " . $personacontrola . "
                        </td>	
                    </tr>";
                $rowstyle = $rowstyle == "odd" ? "even" : "odd";
            }

        }

        $body .= "</tbody>
	            </table>
	            </div> 
                </body>";
        $correo .= $body . "</html>";
        return utf8_decode($correo);
    }

    function isWeekend($date)
    {
        $dia = date('N', strtotime($date));
        if ($dia >= 6) {
            if ($dia == 6)
                return 'sabado';
            if ($dia == 7)
                return 'domingo';
        }
        return false;
    }

    private function GetEmailTemplateSinAsistencia($fechdesde, $fechhasta, $datos)
    {
        $hoy = date('d/m/Y');
        $correo = "<html><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><head>";
        $style = "<style>
            #encabezado{margin-top:20px;}
            #encabezado td{width:100%;color: #15428b;font: 11px/15px tahoma,arial,verdana,sans-serif;}            
            #encabezado td.header{width:100%;color: #15428b;font: bold 12px/16px tahoma,arial,verdana,sans-serif;}     
            #encabezado td.text{width:100%;color: #15428b; font: bold 10px/14px tahoma,arial,verdana,sans-serif;}
            #datospersonales td{width:100%;}          
            #datospersonales td{width:100%;color: #15428b;font: 11px/15px tahoma,arial,verdana,sans-serif;}            
            .pagina {/*box-shadow: 10px 10px 5px #ccdbe1;*/width:100%;height: 100%;background-color: #fff;border-left: 1px solid #ccdbe1;border-top:1px solid #ccdbe1;padding-left:5px; margin-left:5px;}            
            .separador{width:99%;height: 1px;border: 0;border-top: 2px solid #54A3EE;margin: 1em 0;padding: 0;}         
            
            </style>";
        $correo .= $style . "</head>";
        $body = "<body>
                <div class='pagina'>
                <table id='encabezado'>
                    <tr>
                        <td class='header'>
                            Resumen de Asistencia
                        </td>
                    </tr>
                    <tr>
                        <td class='text'>
                            Usted no tiene registro de asistencia del " . $fechdesde . " al " . $hoy . "
            </td>
                    </tr>
                </table>                
                <hr class='separador'>            
                <table id='datospersonales'>
                    <tr>
                        <td>
                            Nombre y Apellidos: " . $datos[0]['nombreapellidos'] . "
                            </td>
                    </tr>
                    <tr>
                        <td>
                            No. identificación: " . $datos[0]['noidentidad'] . "
                            </td>
                        </tr>
                    </table>                
                    <br/> 
                    <tbody>";

        $body .= "</tbody>
	            </div> 
                </body>";
        $correo .= $body . "</html>";
        return utf8_decode($correo);
    }

    /*public function enviarCorreo ($body)
    {
        ini_set('max_execution_time','300');
        foreach ($body as $key => $val){
            $mail = new PHPMailer();
            $mail->IsSMTP();
            $mail->SMTPSecure = "tls";
            $mail->SMTPDebug = 0;
            $mail->SMTPAuth = true;

            $mail->SMTPSecure = "ssl";
            $mail->Host = "correo.xetid.cu";
            $mail->Port = 465;
            //$mail->Username = $nominas.'@xetid.cu';
            //$mail->Password = $pass;
            $mail->Username = 'asistencia@xetid.cu';
            $mail->Password = 'Asistencia*2017-.,@';

            $mail->Mailer = "smtp";
            $mail->Timeout = 500;
            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            //====== DE QUIEN ES ========
            //$mail->From = $usuario.'@xetid.cu';
            $mail->From = 'asistencia@xetid.cu';
            $mail->FromName = "Resumen de la asistencia";

            //====== PARA QUIEN =========
            $mail->Subject = utf8_decode($val['asunto']);
            //$mail->AddAddress('nominas@trdcaribe.co.cu', 'Nominas');
            $mail->AddAddress($val['correo'], $val['nombreapellidos']);

            //Cuerpo del mensaje

            $mail->Body .= $val['msghtml'];

            $mail->IsHTML(true);
            ob_start();
            $exito = $mail->Send();
            ob_get_clean();
            $r = new stdClass();
            $r->codMsg = "Ok";
        }

    }*/

    public function enviarCorreo($body)
    {
        ini_set('max_execution_time', '300');
        $result = array();
        $peopleSinCorreo = array();
        try {
            $datAsistencia = new DatAsistencia();
            $r = ZendExt_IoC_Inter::getInstance()->comun->enviarCorreo($_SESSION['Zeolides']['entidad']->idestructura, 2, $body);

            if (count($r['noenviado']) > 0) {
                $datos = $datAsistencia->getdatospersona($r['noenviado']);
                foreach ($datos as $v) {
                    array_push(
                        $peopleSinCorreo, '<li>' . $v['nombreapellidos'] . '</li>'
                    );
                }
            }
            $result['noenviado'] = (count($peopleSinCorreo) > 0) ? implode(' ', $peopleSinCorreo) : array();
            if (count($r['enviado']) > 0) {
                $result['cod'] = 1;
            } else
                $result['cod'] = 3;
            return $result;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function Aprobar($fechdesde, $fechhasta, $idsasistencia, $idpersonaaprueba)
    {
        try {
            $result = $this->DatAsistencia->AprobarAsist(/*$fechdesde, $fechhasta, */
                $idsasistencia, $idpersonaaprueba);
            return 1;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

//    public function Certificar($fechdesde, $fechhasta, $idsasistencia, $idpersonacertifica)
//    {
//        try {
//            $result = $this->DatAsistencia->CertificarAsist(/*$fechdesde, $fechhasta, */
//                $idsasistencia, $idpersonacertifica);
//            return 1;
//        } catch (Exception $e) {
//            return $e->getMessage();
//        }
//    }

    public function Certificar($fechdesde, $fechhasta, $idsasistencia, $idpersonacertifica)
    {
        try {
            $chuncked = $this->chunkAsistenceBeforeCertification($fechhasta, $idsasistencia);
            if ($chuncked) {
                $result = $this->DatAsistencia->CertificarAsist(/*$fechdesde, $fechhasta, */
                    $idsasistencia, $idpersonacertifica);
                return 1;
            } else
                return 3;

        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    //metodo nuevo
    public function chunkAsistenceBeforeCertification($fechahasta, $idasistencia)
    {
        $asistenciasAfterFhasta = Doctrine::getTable('DatAsistencia')
            ->findBySql("idasistencia in (" . implode(',', $idasistencia) . ") AND fhasta > cast('" . $fechahasta . "' as date)");

        //convertir la fecha hasta
        $fh = explode('/', $fechahasta);
        $fhasta = date_create($fh[2] . '-' . $fh[1] . '-' . $fh[0]);
        //sumarle un dia
        $newTempFHasta = date_add($fhasta, date_interval_create_from_date_string('1 day'));
        $newFechaHasta = $newTempFHasta->format('d/m/Y');
        //$newFechaHasta = date_create($FHTEMPORAL[2] . '-' . $FHTEMPORAL[1] . '-' . $FHTEMPORAL[0]);

        //copiar las asistencias seleccionadas para insertar las nuevas a partir de la fechahasta + i dia
        $newDatAsistenciaCollection = new Doctrine_Collection('DatAsistencia');
        $arrNewAsistencias = array();
        foreach ($asistenciasAfterFhasta as $ind => $item) {
            //modificando las asistencias para que terminen en la fechahasta
            $oldFdesde = $item->fdesde;
            $oldFecharegistro = $item->fecharegistro;
            $tempAsistencia = $item;
            $tempAsistencia->fdesde = $newFechaHasta;
            $tempAsistencia->fecharegistro = $newFechaHasta;
            array_push($arrNewAsistencias, $tempAsistencia->toArray());

            $asistenciasAfterFhasta[$ind]->fhasta = $fechahasta;
            $asistenciasAfterFhasta[$ind]->fdesde = $oldFdesde;
            $asistenciasAfterFhasta[$ind]->fecharegistro = $oldFecharegistro;
        }

        $newDatAsistenciaCollection->synchronizeFromArray($arrNewAsistencias);
        //insettar las asistencias modificadas y las nuevas asistencias
        $asistenciasAfterFhasta->save();
        $newDatAsistenciaCollection->save();
        return true;
    }

    public function QuitarCertificacion($fechdesde, $fechhasta, $idpersonas, $idpersonacertifica)
    {
        try {
            $result = $this->DatAsistencia->QuitarCertificacion($fechdesde, $fechhasta, $idpersonas, $idpersonacertifica);
            return 1;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function CertificarAsist($idasistencia, $idpersonacertifica)
    {
        try {
            $result = $this->DatAsistencia->CertificarAsist($idasistencia, $idpersonacertifica);
            return 1;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function QuitarCertificacionAsist($idasistencia, $idpersonacertifica)
    {
        try {
            $result = $this->DatAsistencia->QuitarCertificacionAsist($idasistencia, $idpersonacertifica);
            return 1;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function createAsistenciaSession($hora, $fecha, $sesion, $evento)
    {
        $idasistencia = array();
        $idpersonas = array();
        $hrsdescontadas = array();
        $idcausa = array();
        $fdesde = array();
        $fhasta = array();
        $observacion = array();
        $fecharegistro = $fecha;
        $fechahoraentradass = array();
        $fechahorasalidass = array();
        $fechahoraentradaps = array();
        $fechahorasalidaps = array();
        $idcausaps = array();
        $idcausass = array();

        $asistencia = $this->DatAsistencia->getAsistByFechaWithSesion($_SESSION['Zeolides']['perfil']['idpersona'], $fecha);

        $person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
            array($_SESSION['Zeolides']['perfil']['idpersona']), null, null, null, null, null, null, 'false', 'true', 'false', 'true'
        );
        $configRegimen = new ConfCalendarioModel();
        $regimen = Array();
        foreach ($person->data[0]['DatRegimentrabajo'] as $regimentrab) {
            if ($regimentrab['actual'] == 1)
                $regimen = $regimentrab;
        }

        $time = explode(':', $hora);
        $date = explode('/', $fecha);
        $horapersona = new DateTime(date('H:i:s', mktime($time[0], $time[1], $time[2], $date[1], $date[0], $date[2])));

        $horatt = $this->DatAsistencia->getHorarioByPersona($_SESSION['Zeolides']['perfil']['idpersona']);
        $HSTPS = explode(':', $horatt['horasalidaps']);
        $horaSalidaTurnops = new DateTime(date('H:i:s', mktime($HSTPS[0], $HSTPS[1], $HSTPS[2], $date[1], $date[0], $date[2])));
        $HSTSS = explode(':', $horatt['horasalidass']);
        $horaSalidaTurnoss = new DateTime(date('H:i:s', mktime($HSTSS[0], $HSTSS[1], $HSTSS[2], $date[1], $date[0], $date[2])));
        $HETPS = explode(':', $horatt['horaentradaps']);
        $horaEntradaTurnops = new DateTime(date('H:i:s', mktime($HETPS[0], $HETPS[1], $HETPS[2], $date[1], $date[0], $date[2])));
        $HETSS = explode(':', $horatt['horaentradass']);
        $horaEntradaTurnoss = new DateTime(date('H:i:s', mktime($HETSS[0], $HETSS[1], $HETSS[2], $date[1], $date[0], $date[2])));

        $sesion = 0;
        if ($horapersona <= $horaSalidaTurnops) {
            $sesion = 0;
        } else {
            if ($horapersona > $horaSalidaTurnops && $horapersona <= $horaSalidaTurnoss) {
                $sesion = 1;
            }
        }

        if (count($asistencia) == 0) {
            $datAsis = array(0 => "(" . $_SESSION['Zeolides']['perfil']['idpersona'] . ",Null,Null,cast('" . $fecha . "' as date)," . $_SESSION['Zeolides']['perfil']['idpersona'] . ",Null,Null, " . $regimen['idgrupodescanso'] . "," . $horatt['idturnotrabajo'] . ")");

            $idasistencia = $this->DatAsistencia->Insert($datAsis);
            if (!$idasistencia)
                return array('success' => false, 'msg' => $idasistencia);

            $datSes = array(
                0 => "(" . $idasistencia[0] . ",0,Null,Null,Null)",
                1 => "(" . $idasistencia[0] . ",1,Null,Null,Null)"
            );
            $this->DatAsistencia->InsertSesiones($datSes);
            array_push($idpersonas, $_SESSION['Zeolides']['perfil']['idpersona']);
            if ($evento == 0 && $sesion == 1)
                array_push($fechahoraentradass, $hora);
            if ($evento == 1 && $sesion == 1)
                array_push($fechahorasalidass, $hora);
            if ($evento == 0 && $sesion == 0)
                array_push($fechahoraentradaps, $hora);
            if ($evento == 1 && $sesion == 0)
                array_push($fechahorasalidaps, $hora);

        } else {
            array_push($idasistencia, $asistencia[0]['idasistencia']);
            array_push($idpersonas, $asistencia[0]['idpersona']);
            array_push($hrsdescontadas, $asistencia[0]['hrsdescontadas']);
            array_push($idcausa, $asistencia[0]['idcausa']);
            array_push($fdesde, $asistencia[0]['fdesde']);
            array_push($fhasta, $asistencia[0]['fhasta']);
            array_push($observacion, $asistencia[0]['observacion']);
            array_push($fecharegistro, $fecha);

            if ($evento == 0 && $sesion == 1)
                array_push($fechahoraentradass, $hora);
            else
                array_push($fechahoraentradass, $asistencia[0]['DatAsistenciasesion'][1]['fechahoraentrada']);

            if ($evento == 1 && $sesion == 1)
                array_push($fechahorasalidass, $hora);
            else
                array_push($fechahorasalidass, $asistencia[0]['DatAsistenciasesion'][1]['fechahorasalida']);

            if ($evento == 0 && $sesion == 0)
                array_push($fechahoraentradaps, $hora);
            else
                array_push($fechahoraentradaps, $asistencia[0]['DatAsistenciasesion'][0]['fechahoraentrada']);

            if ($evento == 1 && $sesion == 0)
                array_push($fechahorasalidaps, $hora);
            else
                array_push($fechahorasalidaps, $asistencia[0]['DatAsistenciasesion'][0]['fechahorasalida']);

            array_push($idcausaps, $asistencia[0]['DatAsistenciasesion'][0]['idcausa']);
            array_push($idcausass, $asistencia[0]['DatAsistenciasesion'][1]['idcausa']);
        }

        $this->InsertarWithSesions($idasistencia, $idpersonas, $hrsdescontadas, $idcausa, $fdesde, $fhasta, $fecharegistro, $observacion,
            $fechahoraentradass, $fechahorasalidass, $fechahoraentradaps, $fechahorasalidaps, $idcausaps, $idcausass, true);
        return array('success' => true);
    }

    public function RestaurarHorasPerdidas($fdesde, $fhasta)
    {
        $sqlsUPD = array();
        $diferencias = $this->DatAsistencia->GetDiferenciaHoras($fdesde, $fhasta);
        $configRegimen = new ConfCalendarioModel();
        $calendario = new ConfCalendario();
        foreach ($diferencias as $key => $diferencia) {
            $tiempoFinal = "";
            if (!empty($diferencia['tiempoperiodo']) && (!empty($diferencia['idcausa']) && $diferencia['afectasalario'] == 1)) {

                list($h, $m, $s) = explode(':', $diferencia['tiempoperiodo']);
                $tiempoFinal = "'" . $this->FormatearHora($h, $m) . "'";
                if ($tiempoFinal == '00:00')
                    $tiempoFinal = "null";
                array_push($sqlsUPD, "UPDATE 
                          mod_regimentrabajo.dat_asistencia 
                        SET  
                          hrsdescontadas = " . $tiempoFinal . " 
                        WHERE 
                          idasistencia = " . $diferencia['idasistencia'] . "
                        ; ");
            } else {

                $de = explode('.', $diferencia['diferenciaentrada']);
                $ds = explode('.', $diferencia['diferenciasalida']);
                $diferenciaentrada = explode('-', $de[0]);
                $diferenciasalida = explode('-', $ds[0]);
                if (count($diferenciaentrada) > 1 && count($diferenciasalida) > 1) {
                    //sumo las 2 diferencias en horas perdidas
                    if (empty($diferencia['fechahorasalida'])) {
                        if ($diferencia['fechaactual']) {
                            $setcausa = "";
                            $difentrada = explode(':', $diferenciaentrada[1]);
                            if ((int)$difentrada[0] > 0 || (int)$difentrada[1] > 0)
                                $final1 = "'" . $difentrada[0] . ":" . $difentrada[1] . "'";
                            else {
                                $final1 = "null";
                                if ($diferencia['afectasalario'] == 1)
                                    $setcausa = " , idcausa = null";
                                else
                                    $setcausa = "";
                            }

                            array_push($sqlsUPD, "
                            UPDATE 
                                  mod_regimentrabajo.dat_asistencia 
                                SET  
                                  hrsdescontadas = " . $final1 . " ,
                                  horasextras = NULL " . $setcausa . "
                                WHERE 
                                  idasistencia = " . $diferencia['idasistencia'] . "
                                ; 
                            ");
                        } else {
                            $setcausa = "";
                            $difsalida = explode(':', $diferenciasalida[1]);
                            if ((int)$difsalida[0] > 0 || (int)$difsalida[1] > 0) {
                                $final2 = "'" . $difsalida[0] . ":" . $difsalida[1] . "'";
                                if (!empty($diferencia['horas']) && $diferencia['horas'] != '00:00:00')
                                    $hrstrab = "CAST('" . $this->RestOnlyTime($diferencia['horas'], $final2) . "' as time)";
                                else
                                    $hrstrab = "null";
                            } else {
                                $final2 = "null";
                                $hrstrab = "null";
                                if ($diferencia['afectasalario'] == 1)
                                    $setcausa = " , idcausa = null";
                                else
                                    $setcausa = "";
                            }

                            array_push($sqlsUPD, "
                            UPDATE 
                                  mod_regimentrabajo.dat_asistencia 
                                SET  
                                  hrsdescontadas = " . $final2 . " ,
                                   hrstrabajadas = " . $hrstrab . ",                                   
                                  horasextras = NULL
                                  " . $setcausa . "
                                WHERE 
                                  idasistencia = " . $diferencia['idasistencia'] . "
                                ; 
                            ");
                        }
                    } else {
                        if (empty($diferencia['idcausa']) || (!empty($diferencia['idcausa']) && $diferencia['afectasalario'] == 1)) {
                            $setcausa = "";
                            $tiempo = $this->SumOnlyTime($diferenciaentrada[1], $diferenciasalida[1]);
                            list($ho, $mi, $se) = explode(':', $tiempo);
                            $tiempoFinal = "'" . $this->FormatearHora($ho, $mi) . "'";
                            if (!empty($horas[0]['sum']) && $horas[0]['sum'] != '00:00:00')
                                $hrstrab = "CAST('" . $this->RestOnlyTime($horas[0]['sum'], $tiempoFinal) . "' as time)";
                            else
                                $hrstrab = "null";
                            if ($tiempoFinal == '00:00') {
                                $tiempoFinal = "null";
                                if ($diferencia['afectasalario'] == 1)
                                    $setcausa = " , idcausa = null";
                                else
                                    $setcausa = "";
                            }

                            array_push($sqlsUPD, "
                            UPDATE 
                                  mod_regimentrabajo.dat_asistencia 
                                SET  
                                  hrsdescontadas = " . $tiempoFinal . " ,
                                  hrstrabajadas = " . $hrstrab . ",
                                  horasextras = NULL
                                  " . $setcausa . "
                                WHERE 
                                  idasistencia = " . $diferencia['idasistencia'] . "
                                ; 
                            ");
                        }
                    }
                } else {
                    if (count($diferenciaentrada) == 1 && count($diferenciasalida) == 1) {
                        //sumo las 2 diferencias en horas extras
                        if (!empty($diferenciaentrada[0]) && !empty($diferenciasalida[0])) {
                            $tiempo = $this->SumOnlyTime($diferenciaentrada[0], $diferenciasalida[0]);
                            list($ho, $mi, $se) = explode(':', $tiempo);
                            $tiempoFinal = "'" . $this->FormatearHora($ho, $mi) . "'";
                            if ($tiempoFinal == '00:00')
                                $tiempoFinal = "null";
                            array_push($sqlsUPD, "
                                UPDATE 
                                      mod_regimentrabajo.dat_asistencia 
                                    SET  
                                      horasextras = " . $tiempoFinal . ",                                       
                                      hrsdescontadas = NULL
                                    WHERE 
                                      idasistencia = " . $diferencia['idasistencia'] . "
                                    ; 
                            ");
                        }
                    } else {
                        if (count($diferenciaentrada) > 1 && (count($diferenciasalida) == 1 || empty($diferencia['diferenciasalida']))) {
                            //sumo la diferencia de entrada en horas perdidas y la salida en horas extras
                            $iniSQL = " UPDATE 
                                      mod_regimentrabajo.dat_asistencia 
                                    SET  ";
                            $set = array();
                            $ex = false;
                            $pe = false;
                            if (!empty($diferenciasalida[0])) {
                                list($ho, $mi, $se) = explode(':', $diferenciasalida[0]);
                                $tiempoex = "'" . $this->FormatearHora($ho, $mi) . "'";
                                if ($tiempoex == '00:00')
                                    $tiempoex = "null";
                                array_push($set, " horasextras = " . $tiempoex . "");
                                $ex = true;
                            }

                            if (!empty($diferenciaentrada[1])) {
                                if (empty($diferencia['idcausa']) || (!empty($diferencia['idcausa']) && $diferencia['afectasalario'] == 1)) {
                                    $setcausa = "";
                                    list($hor, $min, $seg) = explode(':', $diferenciaentrada[1]);
                                    $tiempodes = "'" . $this->FormatearHora($hor, $min) . "'";
                                    if ($tiempodes == '00:00') {
                                        $tiempodes = "null";
                                        if ($diferencia['afectasalario'] == 1)
                                            array_push($set, " idcausa =null");

                                    }

                                    if (!empty($diferencia['horas']) && $diferencia['horas'] != '00:00:00')
                                        $hrstrab = "CAST('" . $this->RestOnlyTime($diferencia['horas'], $tiempodes) . "' as time)";
                                    else
                                        $hrstrab = "null";
                                    array_push($set, " hrsdescontadas = " . $tiempodes . "");
                                    array_push($set, " hrstrabajadas = " . $hrstrab . "");
                                    $pe = true;
                                }

                            }

                            if (!$pe) {
                                array_push($set, " hrsdescontadas = null");
                                array_push($set, " hrstrabajadas = null");
                            }
                            if (!$ex) {
                                array_push($set, " horasextras = null");
                            }

                            array_push($sqlsUPD, $iniSQL . " " . implode(',', $set) . "                               
                                    WHERE 
                                      idasistencia = " . $diferencia['idasistencia'] . "
                                    ; ");
                        } else {
                            if ((count($diferenciaentrada) == 1 || empty($diferencia['diferenciaentrada'])) && count($diferenciasalida) > 1) {

                                //sumo la diferencia de salida en horas perdidas y la entrada en horas extras
                                if (empty($diferencia['fechahorasalida']) && empty($diferencia['idcausa'])) {
                                    if ($diferencia['fechaactual']) {
                                        $difentrada = explode(':', $diferenciaentrada[1]);
                                        if ((int)$difentrada[0] > 0 || (int)$difentrada[1] > 0)
                                            $final = "'" . $difentrada[0] . ":" . $difentrada[1] . "'";
                                        else
                                            $final = "null";
                                        if (!empty($diferencia['horas']) && $diferencia['horas'] != '00:00:00')
                                            $hrstrab = "CAST('" . $this->RestOnlyTime($diferencia['horas'], $final) . "' as time)";
                                        else
                                            $hrstrab = "null";
                                        array_push($sqlsUPD, "
                                        UPDATE 
                                              mod_regimentrabajo.dat_asistencia 
                                            SET
                                              hrsdescontadas = " . $final . " ,
                                              hrstrabajadas = " . $hrstrab . ",
                                              horasextras = NULL
                                            WHERE 
                                              idasistencia = " . $diferencia['idasistencia'] . "
                                            ; 
                                        ");
                                    } else {
                                        $difsalida = explode(':', $diferenciasalida[1]);
                                        if ((int)$difsalida[0] > 0 || (int)$difsalida[1] > 0)
                                            $finals = "'" . $difsalida[0] . ":" . $difsalida[1] . "'";
                                        else
                                            $finals = "null";
                                        if (!empty($diferencia['horas']) && $diferencia['horas'] != '00:00:00')
                                            $hrstrab = "CAST('" . $this->RestOnlyTime($diferencia['horas'], $finals) . "' as time)";
                                        else
                                            $hrstrab = "null";
                                        array_push($sqlsUPD, "
                                            UPDATE 
                                                  mod_regimentrabajo.dat_asistencia 
                                                SET  
                                                  hrsdescontadas = " . $finals . " ,
                                                  hrstrabajadas = " . $hrstrab . ",
                                                  horasextras = NULL
                                                WHERE 
                                                  idasistencia = " . $diferencia['idasistencia'] . "
                                                ; 
                                            ");
                                    }
                                } else {

                                    $iniSQL = " UPDATE 
                                      mod_regimentrabajo.dat_asistencia 
                                    SET  ";
                                    $set = array();
                                    $ex = false;
                                    $pe = false;
                                    if (!empty($diferenciaentrada[0])) {
                                        list($ho, $mi, $se) = explode(':', $diferenciaentrada[0]);
                                        $tiempoex = "'" . $this->FormatearHora($ho, $mi) . "'";
                                        if ($tiempoex == '00:00')
                                            $tiempoex = "null";
                                        array_push($set, " horasextras = " . $tiempoex . "");
                                        $ex = true;
                                    }

                                    if (!empty($diferenciasalida[1])) {
                                        if (empty($diferencia['idcausa']) || (!empty($diferencia['idcausa']) && $diferencia['afectasalario'] == 1)) {
                                            list($hor, $min, $seg) = explode(':', $diferenciasalida[1]);
                                            //print_r($diferenciasalida);die;
                                            $tiempodes = "'" . $this->FormatearHora($hor, $min) . "'";
                                            if ($tiempodes == '00:00') {
                                                $tiempodes = "null";
                                                if ($diferencia['afectasalario'] == 1)
                                                    array_push($set, " idcausa =null");
                                            }

                                            if (!empty($diferencia['horas']) && $diferencia['horas'] != '00:00:00')
                                                $hrstrab = "CAST('" . $this->RestOnlyTime($diferencia['horas'], $tiempodes) . "' as time)";
                                            else
                                                $hrstrab = "null";
                                            array_push($set, " hrsdescontadas = " . $tiempodes . "");
                                            array_push($set, " hrstrabajadas = " . $hrstrab . "");
                                            $pe = true;
                                        }

                                    }

                                    if (!$pe) {
                                        array_push($set, " hrsdescontadas = null");
                                        array_push($set, " hrstrabajadas = null");
                                    }
                                    if (!$ex) {
                                        array_push($set, " horasextras = null");
                                    }
                                    array_push($sqlsUPD, $iniSQL . " " . implode(',', $set) . " 
                                    WHERE 
                                      idasistencia = " . $diferencia['idasistencia'] . "
                                    ; ");
                                }

                            }
                        }
                    }
                }
            }
        }
        $this->DatAsistencia->ExecuteSQL($sqlsUPD);
        return true;
    }

    public function FormatearHora($h, $m)
    {
        if ($h != '00') {
            if ((int)$h > 0 && (int)$h < 10) {
                $val = (int)$h;
                $h = '0' . $val;
            } else
                $h = $h;
        } else
            $h = '00';

        $minut = (is_numeric($m)) ? $m : '00';
        $tiempoFinal = $h . ':' . $minut;
        return $tiempoFinal;
    }

    public function registrarAsistencia($idpersona,$estado)
    {
        $datAsist = new DatAsistenciaModel();
        $datAis = new DatAsistencia();
        date_default_timezone_set("America/Havana");
        $fecha = date("Y-m-d");
        $hora = date("H:i:s");

        $asistencia = $datAis->getAsistenciaByPersona($idpersona, $fecha);

        if (is_array($asistencia) && count($asistencia) > 0) {
            ////new///////
            if (empty($asistencia[0]['fechahoraentrada'])) {
                if (!empty($asistencia[0]['idcausa'])) {
                    $nomcausa = new NomCausa();
                    $causa = $nomcausa->GetCausasById($asistencia[0]['idcausa']);
                    if ($causa[0]['modifica'] == 1) {
                        $result1 = $datAis->EliminarCausaFromAsistencia($idpersona);
                        $result = $datAsist->guardarAsistencia($fecha, $hora, 1, $idpersona,$estado);
                        $result['estado'] = 0;
                    } else {
                        $result['codigo'] = 'ERROR';
                        $result['error'] = 'Usted no tiene permiso para modificarse la causa. Diríjase a su controlador de asistencia.';
                        return $result;
                    }
                } else {
                    $result = $datAsist->guardarAsistencia($fecha, $hora, 1, $idpersona,$estado);
                    $result['estado'] = 0;
                }
            } else {
                $result1 = $datAis->EliminarCausaFromAsistencia($idpersona);
                $result = $datAsist->guardarAsistencia($fecha, $hora, 2, $idpersona,$estado);
                $result['estado'] = 1;
            }
        } else {
//            $result1 = $datAis->EliminarCausaFromAsistencia($idpersona);
            $result = $datAsist->guardarAsistencia($fecha, $hora, 1, $idpersona,$estado);
            $result['estado'] = 0;
        }
        $result['codigo'] = 'OK';
        return $result;
    }

    public function ordenarInfoByCargo(array $orden, array $datos)
    {
        $result = Array();
        $pos = count($datos);
        foreach ($orden as $val) {
            foreach ($datos as $obj) {
                if ($val == $obj['idcargo']) {
                    array_push($result, $obj);
                    $result[count($result) - 1]['orden'] = $pos;
                    $pos--;
                }
            }
        }
        return $result;
    }

    public function registrarAcceso($ci,$fechahoraacceso,$evento,$idarbolestructura){
        date_default_timezone_set("America/Havana");
        if(empty($fechahoraacceso)){
            $fechahoraacceso = date("Y-m-d").' '.date("H:i:s");
        }
        $cumpleCondiciones = false;
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        try{
            $dirwww = $_SERVER['DOCUMENT_ROOT'];
            $modulo_path = str_replace('web', 'apps', $dirwww) . '/pvd/persona/comun/recursos/json/' . 'staticlink.json';

            if (file_exists($modulo_path)) {
                if (is_readable($modulo_path)) {
                    $staticlink = json_decode(file_get_contents($modulo_path));

                }
            }
            $sexos = ($staticlink->img_sexo) ? $staticlink->img_sexo : array();
            $persona = "SELECT pers.idpersona, (CASE
                                  WHEN pers.snombre is not null THEN pers.nombre || ' ' || pers.snombre || ' '
                                    || pers.papel || ' ' || pers.sapel
                                  ELSE pers.nombre || ' ' || pers.papel || ' ' || pers.sapel
                                END) AS nombreapellidos, ent.identidad, lab.idarea AS idarea, lab.idcargo,nc.denominacion as denomcargo,(CASE WHEN dfot.foto IS NOT NULL THEN encode(dfot.foto,'escape')
                       WHEN pers.sexo = 1 THEN '{$sexos->male}' ElSE '{$sexos->famale}' END) as foto
                        FROM mod_persona.dat_persona pers
                        LEFT JOIN mod_persona.dat_docidentidad doc ON pers.idpersona = doc.idpersona and doc.principal = 1
                        INNER JOIN mod_persona.dat_personaentidad ent ON pers.idpersona = ent.idpersona
                        INNER JOIN mod_persona.dat_situacionlaboral lab ON ent.idpersonaentidad = lab.idpersonaentidad and lab.estado = 0
                        INNER JOIN mod_estructuracomp.dat_cargo dc ON lab.idcargo = dc.idcargo AND (dc.idproyecto = 0) 
                        INNER JOIN mod_estructuracomp.nom_cargo nc ON dc.idnomcargo = nc.idnomcargo
                        LEFT JOIN mod_persona.dat_foto dfot on dfot.idpersona = pers.idpersona and dfot.principal = 1
                        WHERE doc.numero = '".$ci."';";
            $rPersona = $conn->fetchAll($persona);

            if(count($rPersona) > 0)
            {
                $denEntAreas = DatAsistenciaModel::GetDenomEntAreas($rPersona);
                foreach ($rPersona as $key => $persona) {
                    $dataPersona['nombreapellidos'] = $persona['nombreapellidos'];
                    $dataPersona['denomentidad'] = $denEntAreas[$rPersona[$key]['identidad']]['denominacion'];
                    $dataPersona['denomarea'] = (is_numeric($rPersona[$key]['idarea'])) ? $denEntAreas[$rPersona[$key]['idarea']]['denominacion'] : 'Sin Cargo';
                    $dataPersona['denomcargo'] = $persona['denomcargo'];
                    $dataPersona['foto'] = $persona['foto'];
                }
                if(!empty($rPersona[0]['identidad'])){
                    if(!empty($rPersona[0]['idcargo'])){
                        $cumpleCondiciones = true;
                        $sql = "INSERT INTO 
                                      mod_controlacceso.dat_controlaccesopersona
                                    (
                                      idpersona, acceso, fechahoraacceso,idarbolestructura
                                    )
                                    VALUES (
                                      ".$rPersona[0]['idpersona'].", $evento, cast('" .$fechahoraacceso."' as timestamp),$idarbolestructura
                                    );";
                        $conn->execute($sql);
                    }else{
                        $result['codigo'] = 'ERROR';
                        $result['error'] = "La persona no tiene asociado cargo en la entidad.";
                    }
                }else{
                    $result['codigo'] = 'ERROR';
                    $result['error'] = "La persona no pertenece a la entidad.";
                }
            }else{
                $result['codigo'] = 'ERROR';
                $result['error'] = "La persona no existe.";
            }
            if($cumpleCondiciones)
            {
                return $dataPersona;
            }
            else
            {
                return $result;
            }

        }catch(Exception $e)
        {
            $res['codigo'] = 'ERROR';
            $res['error'] = $e->getMessage();
            return $res;
        }
    }

    public function getAsistenciaRegistradaFeriado($idpersona, $fInicio, $fFin){
        $sql = "select  sum(m.horas), count(m.idcalendariopersona), nca.afectasalario  
                from mod_regimentrabajo.conf_calendariopersona m
                join mod_regimentrabajo.dat_diaferiadohabilitado dfa on dfa.idpersona = m.idpersona and m.fecha = dfa.fecha
                inner join mod_regimentrabajo.nom_tipodedia nt ON m.idtipodedia = nt.idtipodedia
                inner join mod_regimentrabajo.dat_asistencia ad on ad.idpersona = m.idpersona and m.fecha = ad.fecharegistro
                inner join mod_regimentrabajo.nom_causa nca on nca.idcausa = ad.idcausa
                where m.idpersona = {$idpersona} and m.fecha BETWEEN '{$fInicio}'::date and '{$fFin}'::date and nt.feriado = 1
                group by nca.afectasalario";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}
