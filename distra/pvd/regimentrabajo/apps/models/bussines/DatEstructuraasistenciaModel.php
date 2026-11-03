<?php

class DatEstructuraasistenciaModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAsistenciaPersonas($idpadre)
    {
        $obj = new DatEstructuraasistencia();
        if (!is_numeric($idpadre)) {
            $array = $obj->getAllPersonas();
        } else {
            $array = $obj->getAllPersonasid($idpadre, null, null, null, array());
        }
        $result = Array();
        foreach ($array as $k => $value) {
            $result[$k]['id'] = $value['idestructuraasistencia'];
            $result[$k]['idpersona'] = $value['idpersona'];
            if ($value['leaf'] > 0) {
                $result[$k]['leaf'] = true;
            } else {
                $result[$k]['leaf'] = false;
            }
            if (!is_numeric($idpadre)) {
                $persona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                    array($value['idpersona']), null, null, null, null, null, null
                );
                $result[$k]['text'] =
                    $persona->data[0]['nombre'] . ' ' . $persona->data[0]['papel'] . ' ' . $persona->data[0]['sapel'];
            } else {
                $result[$k]['text'] = $value['nombreapellidos'];
            }
        }
        return $result;
    }

    public function getPFP($idestructura)
    {
        $personas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
            null, null, null, null, $idestructura, null, null
        );
        $result = Array();
        $cont = 0;
        foreach ($personas->data as $k => $person) {
            if (!empty($person['idsituacionlaboral']) && empty($person['idcargo'])) {
                $result['data'][$cont]['idpersona'] = $person['idpersona'];
                $result['data'][$cont]['numid'] = $person['numid'];
                $result['data'][$cont]['nombreapellidos'] = $person['nombreapellidos'];
                $result['data'][$cont]['denomsituacion'] = $person['denomsituacionlaboral'];
                $cont++;
            }
        }
        $result['quantity'] = $cont;
        return $result;
    }

    public function getAsistenciaCargos($idpadre)
    {
        $obj = new DatEstructuraasistencia();
        if (!is_numeric($idpadre)) {
            $result = $obj->getAllPersonas(-1);
        } else {
            $result = $obj->getAllPersonas($idpadre);

        }
        foreach ($result as $val) {
            $arrayId[] = $val['idcargo'];
        }
        $estructura = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arrayId);
        $arrayId = Array();
        foreach ($result as $k => $value) {
            $result[$k]['id'] = $value['idestructuraasistencia'];
            if (is_numeric($idpadre)) {
                $result[$k]['leaf'] = true;
            } else {
                $result[$k]['leaf'] = false;
            }
            $datos = true;
            foreach ($estructura as $ind => $valor) {
                if ($valor['idcargo'] == $value['idcargo']) {
                    if (!empty($value['idpersona'])) {
                        $persona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                            array($value['idpersona']), null, null, null, null, null
                        );
                        $result[$k]['text'] =
                            $persona->data[0]['nombreapellidos'] . '(' . $valor['padre'] . '->' .
                            $valor['denominacion'] . ')';
                    } else {
                        $result[$k]['text'] = $valor['padre'] . '->' . $valor['denominacion'];
                    }
                    $result[$k]['icon'] = $estructura[0]->icon;
                    break;
                }
            }
        }
        return $result;
    }

    public function getPersonasByCargoPadre($fecha, $pers, $ipersonacontrolador, $sesiones,$pturno)
    {
        $modelHabHorario = new ConfHabilitarhorarioModel();
        $habcausas = new ConfHabCausaModel();
        $personas = array();
        $personas = $pers;
        $idpersonas = array();
        $idpersonasunicas = array();
        $personasunicas = array();
        $objAsist = new DatAsistencia();
        $fecharegistro = $fecha;
        $fechaentsal = $fecha;

        if (is_array($pers[0])) {
            foreach ($personas as $per => $peop) {
                $idpersonas[$per] = $peop['idpersona'];
            }
        } else {
            $idpersonas = $pers;
        }

        $existecontrolador = false;
        foreach ($idpersonas as $idpersona) {
            if ($idpersona == $ipersonacontrolador) {
                $existecontrolador = true;
            }
        }

        $asistenciaJefe = Doctrine::getTable('DatAsistencia')->findBySql("idpersona = " . $ipersonacontrolador . " and
        fecharegistro = cast('" . $fecha . "' as date)");


        if ($asistenciaJefe->count() == 0 && !$existecontrolador) {
            array_push($idpersonas, $ipersonacontrolador);
			
			$datospersona = $objAsist->getdatospersona(array($_SESSION['Zeolides']['perfil']['idpersona']), null, null);

          if(!$this->existepers($datospersona[0]['idpersona'], $personas))
            array_push($personas, $datospersona[0]);
        }
        $fechaselect = explode('/', $fecha);
        $obj = new DatEstructuraasistencia();
        $records = array();
        $recordsSesion = array();
        $recordsferiados = array();
        $recordsferiadosSesion = array();
        $sinregistro = array();
        $idsunicos = array();

        $idsunicos = array_unique($idpersonas);
        //pregunto si alguien tiene justificado el dia o tiene registro de asistencia en el dia
        if(($pturno['fechat'] == null) || ($pturno['fechat'] == $fecha))
            $registeredOrJustified = $obj->GetPersonasJustificadasORegistradas($fecha, $idsunicos, -1, $sesiones);
        $fentrada = explode('/', $fecha);
        $f = $fentrada;
        $fsal = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
        $fs = date_add($fsal, date_interval_create_from_date_string('-1 day'));
        $FIT1 = explode('/', $fsal->format('d/m/Y'));
        $fsal = date_create($FIT1[2] . '-' . $FIT1[1] . '-' . $FIT1[0]);
        if(($pturno['fechat'] == null) || ($pturno['fechat'] == $fs->format('d/m/Y')))
            $registeredOrJustifiedAyer = $obj->GetPersonasJustificadasORegistradas($fs->format('d/m/Y'), $idsunicos, $ipersonacontrolador, $sesiones);
        foreach ($registeredOrJustifiedAyer as $rojay) {
            if ($rojay['otrodia'] == 1 && !$this->existepers($rojay['idpersona'], $registeredOrJustified)) {
                $registeredOrJustified[] = $rojay;
            }
            if($pturno['fechat'] != null && $rojay['otrodia'] == 0){
                $registeredOrJustified[] = $rojay;
            }
        }
        $registered = array();
        foreach ($registeredOrJustified as $key1 => $person1) {
            array_push($registered, $person1['idpersona']);
        }
        $diferencia = array();
        $diferencia = array_diff($idsunicos, $registered);

        $final = $registeredOrJustified;
        
        $peopleSinRegimen = array();
        $peopleSinCalendario = array();
        $Nomturno = new NomTurnotrabajo();

        if (count($diferencia) > 0) {
            foreach ($personas as $key => $person) {
                $tieneRegistro = false;
                $fecharegistro = $fecha;
                if (count($registeredOrJustified) > 0) {
                    foreach ($registeredOrJustified as $key1 => $person1) {
                        if ($person['idpersona'] == $person1['idpersona']) {
                            $personas[$key]['idturnotrabajo'] = $person1['idturnotrabajo'];
                            $tieneRegistro = true;                           
                            break;
                        }
                    }
                }

                if (!$tieneRegistro) {
                    //Buscando el regimen de trabajo actual de la persona
                    $regimentrabajo = array();
                    //buscando si la persona en cuestion que no tiene justificado el dia tiene regimen de trabajo
                    if (!empty($person['idgrupodescanso'])) {
                        //buscando si la persona en cuestion que no tiene justificado el dia y tiene regimen de trabajo tinene que trabajar este dia
                        $calend = new ConfCalendario();
                        $model = new DatEstructuraasistenciaModel();
                        $asistenciamodel = new DatAsistenciaModel();
                        $fechaforcalendar = $fecha;

                        if($pturno['fechat'] != null)
                            $fechaforcalendar = $pturno['fechat'];
                        $confCalendarioPersona = new ConfCalendariopersona();
                        $calendario = $confCalendarioPersona->getCalendarioPersona($fechaforcalendar,$fechaforcalendar,$person['idpersona']);

                        if($pturno['fechat'] == null){
                            if (count($calendario) == 0  || $calendario[0]['trabajo'] == 0) {
                                $fentrada = explode('/', $fecha);
                                $f = $fentrada;
                                $fsal = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                                $fs = date_add($fsal, date_interval_create_from_date_string('-1 day'));
                                $FIT2 = explode('/', $fsal->format('d/m/Y'));
                                $fsal = date_create($FIT2[2] . '-' . $FIT2[1] . '-' . $FIT2[0]);
                                $calendario2 = $confCalendarioPersona->getCalendarioPersona($fs->format('d/m/Y'),$fs->format('d/m/Y'),$person['idpersona']);
                                if ($calendario2[0]['otrodia'] == 1) {
                                    $fecharegistro = $fs->format('d/m/Y');
                                    $calendario = $calendario2;
                                }
                            } else {
                                $fecharegistro = $fecha;
                            }
                        } else{
                            $fecharegistro = $pturno['fechat'];
                        }
                        $personas[$key]['idturnotrabajo'] = $calendario[0]['idturnotrabajo'];
                        $person['idturnotrabajo'] = $calendario[0]['idturnotrabajo'];

                        $fechaforturno = $fecha;
                        if($pturno['fechat'] != null)
                            $fechaforturno = $pturno['fechat'];

                        $turno = $objAsist->getHorarioByPersona($person['idpersona'], $fecharegistro);
                        $Hrs = $confCalendarioPersona->getHorasCalendarioPersona($fecharegistro, $fecharegistro, $person['idpersona']);
                        $auxHrs = explode(':', $Hrs[0]['sum']);
                        $hrstrabajadas = '00:00:00';
                        $hferiadas = '00:00';
                        $hrsdescontadas = null;
						
                        if (count($calendario) > 0) {
                            $diaferiadohab = $asistenciamodel->GetDiaFeriadoHabilitado($person['idpersona'], $fechaforturno);

                            $hrsDiariasFeriadas = $confCalendarioPersona->getHrsFeriadasPersona($fechaforturno, $fechaforturno, $person['idpersona']);
                            $auxhrsDiariasFeriadas = explode(':', $hrsDiariasFeriadas[0]['sum']);

                            $causasdefecto = $habcausas->getHabilitarcausa();
                            $ausencia = false;
                            $habilitarentradasalida = $modelHabHorario->getHabilitarhorario()[0]['habilitado'];
                            $ConfEstructurahorario = new ConfEstructurahorario();
                            $estructuras = $ConfEstructurahorario->getEstructurahorario();

//                            if(!empty($person['ueb']))
//								$idestruct = $person['ueb'];
//							else
//								$idestruct = $person['identidad'];

                            if (count($estructuras) > 0) {
                                $existe = $ConfEstructurahorario->getByIdEstructura($person['identidad']);
                                if(count($existe) == 0){
                                    $existe = $ConfEstructurahorario->getByIdEstructura($person['idarea']);
                                }
                                if(count($existe) == 0){
                                    $existe = $ConfEstructurahorario->getByIdEstructura($person['idcargo']);
                                }
                            } else {
                                $existe = array(0 => true);
                            }

                            $fregistroarr = explode('/', $fecharegistro);
                            $fhoyarray = explode('/', date('d/m/Y'));
                            if (($causasdefecto[0]['habilitado'] == 1 && count($diaferiadohab) > 0 && $habilitarentradasalida == 0) || $causasdefecto[0]['habilitado'] == 1 && (($fecharegistro == date('d/m/Y') && $turno['horainicio'] < date('H:i:s')) || (mktime(0,0,0,$fregistroarr[1],$fregistroarr[0],$fregistroarr[2]) < mktime(0,0,0,$fhoyarray[1],$fhoyarray[0],$fhoyarray[2])))
                                && ($habilitarentradasalida == 0 || ($habilitarentradasalida == 1 && count($existe) == 0)) 
							 && ($calendario[0]['idtipodedia'] != 12 && $calendario[0]['idtipodedia'] != 8)) {
                                $idcausa = 1;
                                $hrsdescontadasaux = ((int)$Hrs[0]['sum'] > '00:00:00') ? $auxHrs[0] . ':' . $auxHrs[1] : $auxhrsDiariasFeriadas[0] . ':' . $auxhrsDiariasFeriadas[1];
                                $hrsdescontadas = ($hrsdescontadasaux != null)?("'$hrsdescontadasaux'"):null;
                                $hrstrabajadas = '00:00:00';
                            } else {
                                $idcausa = 'null';
                                $hrsdescontadas = 'null';
                                $hrstrabajadas = '00:00:00';
                                if($habilitarentradasalida == 1 )
                                    $hrstrabajadas = ((int)$Hrs[0]['sum'] > '00:00:00') ? $auxHrs[0] . ':' . $auxHrs[1] : '00:00:00';
                            }
                            //verifico que el regimen de la persona este configurado y que la persona trabaje ese dia
                            if ((count($calendario) > 0 && $calendario[0]['trabajo'] == 1)) {
                                if ($sesiones == 1) {
                                    if ($habilitarentradasalida == 1 && count($existe) > 0) {
                                        //primera sesion de trabajo
                                        list($fechahoraentradaps, $fechahorasalidaps, $fechahoraentradass, $fechahorasalidass) = $this->getHorarioESsesiones($turno, $fechaselect);

                                        $fila = "(" . $person['idpersona'] . ",".$person['idcargo'].",Null,Null,cast('" . $fechaforturno .
                                            "' as date),null,Null,null,".(empty($person['idgrupodescanso'])?"Null":$person['idgrupodescanso']).",".(empty($person['idturnotrabajo'])?"Null":$person['idturnotrabajo']) . ",'" . $hrstrabajadas . "')";

                                        list($filaSesionps, $filaSesionss) = $this->GetSqlInsertWithSession($fechaforturno, $person, $fechahoraentradaps, $fechahorasalidaps, $fechahoraentradass, $fechahorasalidass, $idcausa);

                                        array_push($recordsSesion, $filaSesionps);
                                        array_push($recordsSesion, $filaSesionss);
                                    } else {
                                        $hrstrabajadas = '00:00:00';
                                        $fila = "(" . $person['idpersona'] . ",".$person['idcargo'].",Null,Null,cast('" . $fechaforturno . "' as date),null,Null,Null,".(empty($person['idgrupodescanso'])?"Null":$person['idgrupodescanso']).",".(empty($person['idturnotrabajo'])?"Null":$person['idturnotrabajo']) . ",'" . $hrstrabajadas . "')";
                                        list($filaSesionps, $filaSesionss) = $this->getSqlInsertWithSesionNull($fechaforturno, $person, "null");
                                        array_push($recordsSesion, $filaSesionps);
                                        array_push($recordsSesion, $filaSesionss);
                                    }
                                } else {
                                    $horai = explode(':', $turno['horainicio']);
                                    if ($habilitarentradasalida == 1 && count($existe) > 0) {
                                        $fech = explode('/', $fecharegistro);
                                        $fechahoraentrada = date(
                                            'd/m/Y H:i:s',
                                            mktime($horai[0], $horai[1], 0, $fech[1], $fech[0], $fech[2])
                                        );
                                        $horaf = explode(':', $turno['horafin']);
                                        if ($calendario[0]['otrodia'] == 1) {
                                            $f2 = date_create($fech[2] . '-' . $fech[1] . '-' . $fech[0]);
                                            $fechsalturno = date_add($f2, date_interval_create_from_date_string('1 day'));
                                            $FIT3 = explode('/', $f2->format('d/m/Y'));
                                            $f2 = date_create($FIT3[2] . '-' . $FIT3[1] . '-' . $FIT3[0]);
                                            $fechfinturno = $fechsalturno->format('d-m-Y');
                                            $fF = explode('-', $fechfinturno);
                                            $fechahorasalida = date(
                                                'd/m/Y H:i:s',
                                                mktime($horaf[0], $horaf[1], 0, $fF[1], $fF[0], $fF[2])
                                            );
                                        } else {
                                            $fechahorasalida = date(
                                                'd/m/Y H:i:s',
                                                mktime($horaf[0], $horaf[1], 0, $fech[1], $fech[0], $fech[2])
                                            );
                                        }
                                        $fila = "(" . $person['idpersona'] . ",".$person['idcargo'].",cast('" . $fechahoraentrada .
                                            "' as timestamp),cast('" . $fechahorasalida . "' as timestamp),cast('" . $fecharegistro .
                                            "' as date),$ipersonacontrolador,$idcausa,$hrsdescontadas,".(empty($person['idgrupodescanso'])?"Null":$person['idgrupodescanso']).",".(empty($person['idturnotrabajo'])?"Null":$person['idturnotrabajo']).",'" . $hrstrabajadas . "')";
                                    } else{
                                        $hrstrabajadas = '00:00:00';
                                        $fila = "(" . $person['idpersona'] . ",".$person['idcargo'].",Null,Null,cast('" . $fecharegistro . "' as date),Null,$idcausa,$hrsdescontadas,".(empty($person['idgrupodescanso'])?"Null":$person['idgrupodescanso']).",".(empty($person['idturnotrabajo'])?"Null":$person['idturnotrabajo']).",'" . $hrstrabajadas . "')";
                                    }
                                }
                                array_push($records, $fila);
                            } else {
                                if ($sesiones == 1) {
                                    if (count($calendario) > 0 && count($diaferiadohab) > 0) {
                                        if(!empty($auxhrsDiariasFeriadas[0]))
                                            $hferiadas = $auxhrsDiariasFeriadas[0] . ':' . $auxhrsDiariasFeriadas[1];
                                        if ($habilitarentradasalida == 1 && count($existe) > 0) {
                                            list($fechahoraentradaps, $fechahorasalidaps, $fechahoraentradass, $fechahorasalidass) = $this->getHorarioESsesiones($turno, $fechaselect);

                                            $fila = "(" . $person['idpersona'] . ",".$person['idcargo'].",Null,Null,cast('" . $fechaforturno .
                                                "' as date), 1,'" . $hferiadas . "',null,Null,null,".$person['idgrupodescanso'] . ",'" . $hrstrabajadas . "')";


                                            list($filaSesionps, $filaSesionss) = $this->GetSqlInsertWithSession($fechaforturno, $person, $fechahoraentradaps, $fechahorasalidaps, $fechahoraentradass, $fechahorasalidass, $idcausa);
                                        } else {
                                            $hrstrabajadas = '00:00:00';
                                            $fila = "(" . $person['idpersona'] . ",".$person['idcargo'].",null,null,cast('" . $fechaforturno . "' as date), 1,'" . $hferiadas . "',Null,Null,".(empty($person['idgrupodescanso'])?"Null":$person['idgrupodescanso']).",".(empty($person['idturnotrabajo'])?"Null":$person['idturnotrabajo']) . ",'" . $hrstrabajadas . "')";
                                            list($filaSesionps, $filaSesionss) = $this->getSqlInsertWithSesionNull($fechaforturno, $person, "Null");

                                        }
                                        array_push($recordsferiados, $fila);
                                        array_push($recordsSesion, $filaSesionps);
                                        array_push($recordsSesion, $filaSesionss);
                                    } else {
                                        $fila = "(" . $person['idpersona'] . ",".$person['idcargo'].",Null,Null,cast('" . $fechaforturno . "' as date),Null,Null,null,".(empty($person['idgrupodescanso'])?"Null":$person['idgrupodescanso']).",".(empty($person['idturnotrabajo'])?"Null":$person['idturnotrabajo']) . ",'" . $hrstrabajadas . "')";
                                        list($filaSesionps, $filaSesionss) = $this->getSqlInsertWithSesionNull($fechaforturno, $person, "Null");
                                        array_push($records, $fila);
                                        array_push($recordsSesion, $filaSesionps);
                                        array_push($recordsSesion, $filaSesionss);
                                    }
                                } else {
                                    if (count($calendario) > 0 && count($diaferiadohab) > 0) {
                                        if(!empty($auxhrsDiariasFeriadas[0]))
                                            $hferiadas = $auxhrsDiariasFeriadas[0] . ':' . $auxhrsDiariasFeriadas[1];
                                        if ($habilitarentradasalida == 1 && count($existe) > 0) {
                                            $horai = explode(':', $turno['horainicio']);
                                            $fechahoraentrada = date(
                                                'd/m/Y H:i:s',
                                                mktime($horai[0], $horai[1], 0, $fechaselect[1], $fechaselect[0], $fechaselect[2])
                                            );

                                            $horaf = explode(':', $turno['horafin']);

                                            if ($calendario[0]['otrodia'] == 1) {
                                                $fech = explode('/', $fecharegistro);
                                                $f2 = date_create($fech[2] . '-' . $fech[1] . '-' . $fech[0]);
                                                $fechsalturno = date_add($f2, date_interval_create_from_date_string('1 day'));
                                                $FIT6 = explode('/', $f2->format('d/m/Y'));
                                                $f2 = date_create($FIT6[2] . '-' . $FIT6[1] . '-' . $FIT6[0]);
                                                $fechfinturno = $fechsalturno->format('d-m-Y');
                                                $fF = explode('-', $fechfinturno);
                                                $fechahorasalida = date(
                                                    'd/m/Y H:i:s',
                                                    mktime($horaf[0], $horaf[1], 0, $fF[1], $fF[0], $fF[2])
                                                );
                                            } else {
                                                $fechahorasalida = date(
                                                    'd/m/Y H:i:s',
                                                    mktime($horaf[0], $horaf[1], 0, $fechaselect[1], $fechaselect[0], $fechaselect[2])
                                                );
                                            }

                                            $fila = "(" . $person['idpersona'] . ",".$person['idcargo'].",cast('" . $fechahoraentrada .
                                                "' as timestamp),cast('" . $fechahorasalida . "' as timestamp),cast('" . $fecharegistro .
                                                "' as date), 1,'" . $hferiadas . "',$ipersonacontrolador,$idcausa,$hrsdescontadas,".(empty($person['idgrupodescanso'])?"Null":$person['idgrupodescanso']).",".(empty($person['idturnotrabajo'])?"Null":$person['idturnotrabajo']).",'" . $hferiadas . "')";
                                        } else {
                                            $hrstrabajadas = '00:00:00';
                                            $fila = "(" . $person['idpersona'] . ",".$person['idcargo'].",null,null,cast('" . $fecharegistro . "' as date), 1,'" . $hferiadas . "',$ipersonacontrolador,$idcausa,$hrsdescontadas,".(empty($person['idgrupodescanso'])?"Null":$person['idgrupodescanso']).",".(empty($person['idturnotrabajo'])?"Null":$person['idturnotrabajo']).",'" . $hrstrabajadas . "')";
                                        }
                                        array_push($recordsferiados, $fila);
                                    }
                                }
                            }
                        } else {
                            array_push(
                                $peopleSinCalendario, '<li>' . $person['nombreapellidos'] . '</li>'
                            );
                        }

                    } else {
                        array_push(
                            $peopleSinRegimen, '<li>' . $person['nombreapellidos'] . '</li>'
                        );
                    }
                }
            }

            if (count($records) > 0) {
                $model = new DatAsistenciaModel();
                $var = $model->Insert($records);
            }
            if (count($recordsferiados) > 0) {
                $model = new DatAsistenciaModel();
                $var = $model->Insertferiados($recordsferiados);
            }

            if (count($recordsSesion) > 0) {
                $model = new DatAsistenciaModel();
                $var = $model->InsertSesiones($recordsSesion);
            }
            if(($pturno['fechat'] == null) || ($pturno['fechat'] == $fecha))
                $final = $obj->GetPersonasJustificadasORegistradas($fecha, $idsunicos, $ipersonacontrolador, $sesiones);

            $fentrada = explode('/', $fecha);
            $f = $fentrada;
            $fsal = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
            $fs = date_add($fsal, date_interval_create_from_date_string('-1 day'));
            $FIT4 = explode('/', $fsal->format('d/m/Y'));
            $fsal = date_create($FIT4[2] . '-' . $FIT4[1] . '-' . $FIT4[0]);
            if(($pturno['fechat'] == null) || ($pturno['fechat'] == $fs->format('d/m/Y')))
                $finalayer = $obj->GetPersonasJustificadasORegistradas($fs->format('d/m/Y'), $idsunicos, $ipersonacontrolador, $sesiones);

            foreach ($finalayer as $fa) {
                if ($fa['otrodia'] == 1 && !$this->existepersona($fa['idpersona'], $final)) {
                    $final[] = $fa;
                }
            }
            foreach ($final as $k => $fin) {
                foreach ($personas as $p => $per1) {
                    if ($per1['idpersona'] == $fin['idpersona']) {
                        if (($per1['idcargo'] != $fin['idcargo'] ||
                            $per1['idregimentrabajop'] != $fin['idregimentrabajop'] ||
                            $per1['idgrupodescanso'] != $fin['idgrupodescanso'])
                        ) {
                            unset($final[$k]);
                        }
                    }
                }
            }

        }
        $finaltemp = array();
        if($pturno['fechat'] != null){
            foreach ($final as $k => $fin) {
                if(($pturno['fechat'] == null) || ($pturno['fechat'] != null && $pturno['idturnotrabajo'] == $fin['idturnotrabajo'])){
                    $finaltemp[] = $fin;
                }
            }
            $final = $finaltemp;
        }
        //$altasbajas = $obj->getAsistPersBajasMov($fecha,$ipersonacontrolador);//print_r($altasbajas);die;
        //$final = array_merge($final,$altasbajas);
        $result['data'] = $final;
        $result['sinRegimen'] = (count($peopleSinRegimen) > 0) ? implode(' ', $peopleSinRegimen) : array();
        $result['sincalendario'] = (count($peopleSinCalendario) > 0) ? implode(' ', $peopleSinCalendario) : array();
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

    public function existepersona($idpersona, $personas)
    {
        $flag = false;
        foreach ($personas as $k => $per) {
            if ($per['idpersona'] == $idpersona)
                $flag = true;
        }

        return $flag;
    }

    public function GetDenomCargo($idcargo)
    {
        $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idcargo);
        $padre = ZendExt_IoC::getInstance()->metadatos->DameEstructura($estructura[0]->idpadre);
        $denomcargo = '<li>' . $padre[0]->denominacion . '->' . $estructura[0]->denominacion . '</li>';
        return $denomcargo;
    }

    public function guardarPersonasAsistencia($idpersona, $idpadre, $idcargos)
    {
        if (!is_numeric($idpadre)) {
            $controlador = Doctrine::getTable('DatEstructuraasistencia')
                ->findBySql('idestructuraasistencia = idpadre and idpersona = ' . $idpersona);
        }
        if (is_object($controlador) && $controlador->count() != 0) {
            $persona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                array($idpersona), null, null, null, null, null, null
            );
            $result['tipo'] = 1;
            $result['data'] = $persona->data[0]['nombreapellidos'];
            return $result;
        }
        $salva = new Doctrine_Collection(Doctrine::getTable('DatEstructuraasistencia'));
        $objRec = new DatEstructuraasistencia();
        if (is_numeric($idpadre)) {
            $Childrens = $objRec->getHijosProfundidad($idpadre);
            $CParents = $objRec->getPadresProfundidad($idpadre);
            $parentChildrens = array_merge($Childrens, $CParents);
        }
        $existen = array();
        foreach ($idcargos as $cargo) {
            $ExistePadre = Doctrine::getTable('DatEstructuraasistencia')
                ->findBySql('idestructuraasistencia = idpadre and idcargo = ' . $cargo);
            if (is_numeric($idpadre)) {
                $Padre = Doctrine::getTable('DatEstructuraasistencia')
                    ->findBySql('idestructuraasistencia = ' . $idpadre);
            }
            if ($ExistePadre[0]->idpersona > 0
            ) {
                $obj = new DatSubordinacion();
                $obj->idestructuraasistencia = $idpadre;
                $obj->idpersona = $ExistePadre[0]->idpersona;
                $obj->save();
            } else {
                $exist = false;
                if (!is_numeric($idpadre)) {
                    $padre = Doctrine::getTable('DatEstructuraasistencia')
                        ->findBySql('idpersona =' . $idpersona . ' and idcargo = ' . $cargo);
                    if (is_object($padre) && count($padre) > 0) {
                        $denomcargo = $this->GetDenomCargo($cargo);
                        array_push($existen, $denomcargo);
                        $exist = true;
                    }
                } else {
                    $exisCSP = Doctrine::getTable('DatEstructuraasistencia')
                        ->findBySql('idpersona is null and idcargo = ' . $cargo);
                    if (is_object($exisCSP) && $exisCSP->count() > 0) {
                        $denomcargo = $this->GetDenomCargo($cargo);
                        array_push($existen, $denomcargo);
                        $exist = true;
                    }
                }
                if (!$exist) {
                    $obj = new DatEstructuraasistencia();
                    $obj->idpersona = ($idpersona != -1) ? $idpersona : null;
                    $obj->idpadre = $idpadre;
                    $obj->idcargo = $cargo;
                    $salva->add($obj);
                }
            }
        }
        if ($salva->count() > 0) {
            $salva->save();
        }
        $result['tipo'] = 2;
        $result['data'] = $existen;
        return $result;
    }

    public function cambiarOrden($idpadre, $idestructuraasistencia)
    {
        $obj = DatEstructuraasistencia::getById($idestructuraasistencia);
        $obj->idpadre = $idpadre;
        $obj->save();
    }

    public function eliminarCargo($idestructuraasistencia)
    {
        try {
            $query = Doctrine_Query::create()
                ->delete('DatEstructuraasistencia ea')
                ->where('ea.idestructuraasistencia in (' . implode(',', $idestructuraasistencia) . ')');
            $query->execute();
            return true;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function existeCargo($idcargo, $idestructuraasistencia, $idpersona)
    {
        if (is_numeric($idpersona)) {
            $persona = Doctrine::getTable('DatEstructuraasistencia')
                ->findBy('idpersona', $idpersona);
            if ($persona->count() != 0) {
                return false;
            } else {
                return false;
            }
        }
        $childrens = DatEstructuraasistencia::getHijosProfundidad($idestructuraasistencia);
        foreach ($childrens as $child) {
            if ($child['idcargo'] == $idcargo) {
                return true;
            }
        }
        return false;
    }

    public function existe($idpersona)
    {
        return DatEstructuraasistencia::existe($idpersona);
    }

    public function getCalendarioByFecha($fecha, $grupodescanso)
    {
        return ConfCalendario:: getCalendarioByFecha($fecha, $grupodescanso);
    }

    public function cambiarPadre($idcargonew, $idestructuraasistencia, $idpersona)
    {
        try {
            $obj = Doctrine::getTable('DatEstructuraasistencia')
                ->find($idestructuraasistencia);
            if (is_numeric($idpersona)) {
                $obj->idpersona = $idpersona;
            }
            $obj->idcargo = $idcargonew;
            $obj->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function cutCargos($estructuraPadreToPaste, $idestructurasToPaste)
    {
        $domain = new DatEstructuraasistencia();
        $salva = new Doctrine_Collection(Doctrine::getTable('DatEstructuraasistencia'));
        $parentChilds = Doctrine::getTable('DatEstructuraasistencia')
            ->findBy('idpadre', $estructuraPadreToPaste);
        $padre = Doctrine::getTable('DatEstructuraasistencia')
            ->find($estructuraPadreToPaste);
        foreach ($idestructurasToPaste as $estrucToPaste) {
            $obj = Doctrine::getTable('DatEstructuraasistencia')
                ->find($estrucToPaste);
            $existe = false;
            if ($padre->idcargo == $obj->idcargo) {
                $domain->deleteEstructuraAsistenciaById($obj->idestructuraasistencia);
                $existe = true;
            } else {
                foreach ($parentChilds as $child) {
                    if ($child->idcargo == $obj->idcargo) {
                        $existe = true;
                        $val = $domain->deleteEstructuraAsistenciaById($obj->idestructuraasistencia);
                        break;
                    }
                }
            }
            if (!$existe) {
                $obj->idpadre = $estructuraPadreToPaste;
                $salva->add($obj);
            }
        }
        if ($salva->count() > 0) {
            $salva->save();
        }
        return true;
    }

    public function copyRecursivo($parent, $chidrens)
    {
        $parentChilds = Doctrine::getTable('DatEstructuraasistencia')
            ->findBy('idpadre', $parent);
        $padre = Doctrine::getTable('DatEstructuraasistencia')
            ->find($parent);
        foreach ($chidrens as $child) {
            $obj = Doctrine::getTable('DatEstructuraasistencia')
                ->find($child);
            $existe = false;
            if ($padre->idcargo == $obj->idcargo) {
                $existe = true;
            } else {
                foreach ($parentChilds as $child1) {
                    if ($child1->idcargo == $obj->idcargo) {
                        $existe = true;
                        break;
                    }
                }
            }
            if (!$existe) {
                $newCopy = new DatEstructuraasistencia();
                $newCopy->idpadre = $parent;
                $newCopy->idcargo = $obj->idcargo;
                $newCopy->save();
                $hijosChild = Doctrine::getTable('DatEstructuraasistencia')
                    ->findBy('idpadre', $child);
                if ($hijosChild->count() > 0) {
                    $arrTempChild = array();
                    foreach ($hijosChild as $hijoChild) {
                        $arrTempChild[] = $hijoChild->idestructuraasistencia;
                    }
                    $this->copyRecursivo($newCopy->idestructuraasistencia, $arrTempChild);
                }
            }
        }
        return;
    }

    public function copyCargos($estructuraPadreToPaste, $idestructurasToPaste)
    {
        $this->copyRecursivo($estructuraPadreToPaste, $idestructurasToPaste);
        return true;
    }

    public function cambiarPersonaCargo($idestructuraasistencia, $personas)
    {
        foreach ($personas as $valor) {
            $obj = new DatSubordinacion();
            $obj->idestructuraasistencia = $idestructuraasistencia;
            $obj->idpersona = $valor;
            $obj->save();
        }
    }

    public function actualizar($idestructuraasistencia, $personasother)
    {
        $domain = new DatSubordinacion();
        foreach ($personasother as $valor) {
            $obj = $domain->existePrsonaSub($valor);
            $id = $obj[0]['idsubordinacion'];
            $obj = Doctrine::getTable('DatSubordinacion')
                ->find($id);
            $obj->idestructuraasistencia = $idestructuraasistencia;
            $obj->idpersona = $valor;
            $obj->save();
        }
    }

    public function existePrsonaSub($personas, $idestructuraasistencia)
    {
        $domain = new DatSubordinacion();
        $result = array();
        $var = 0;
        $variable = false;
        if ($personas != null) {
            foreach ($personas as $key => $val) {
                if ($domain->existePrsonaSub($val['idpersona']) == null) {
                    $result[$var] = $val['idpersona'];
                    $var++;
                }
            }
        }
        $cargos = $domain->existeEstructuraSub($idestructuraasistencia);
        if ($cargos != null) {
            foreach ($cargos as $ind => $valor) {
                $result[$var] = $valor['idpersona'];
                $variable = true;
                $var++;
            }
        }
        return $result;
    }

    public function getSubByIdPerson($idpersona)
    {
        $domain = new DatSubordinacion();
        $subordinacion = $domain->existePrsonaSub($idpersona);
        return $subordinacion;
    }

    public function eliminarPersona($idsubordinacion)
    {
        $query = Doctrine_Query::create()
            ->delete('DatSubordinacion sub')
            ->where('sub.idpersona in (' . implode(',', $idsubordinacion) . ')');
        $query->execute();
        return true;
    }

    public function getPadreByIdCargo($idcargo)
    {
        $domain = new DatEstructuraasistencia();
        return $domain->getPadreByIdCargo($idcargo);
    }

    /**
     * @param $turno
     * @param $fechaselect
     * @return array
     */
    public function getHorarioESsesiones($turno, $fechaselect)
    {
        $horaips = explode(':', $turno['horaentradaps']);
        $fechahoraentradaps = date(
            'd/m/Y H:i:s',
            mktime($horaips[0], $horaips[1], 0, $fechaselect[1], $fechaselect[0], $fechaselect[2])
        );
        $horafps = explode(':', $turno['horasalidaps']);
        $fechahorasalidaps = date(
            'd/m/Y H:i:s',
            mktime($horafps[0], $horafps[1], 0, $fechaselect[1], $fechaselect[0], $fechaselect[2])
        );
        //segunda sesion de trabajo
        $horaiss = explode(':', $turno['horaentradass']);
        $fechahoraentradass = date(
            'd/m/Y H:i:s',
            mktime($horaiss[0], $horaiss[1], 0, $fechaselect[1], $fechaselect[0], $fechaselect[2])
        );
        $horafss = explode(':', $turno['horasalidass']);
        $fechahorasalidass = date(
            'd/m/Y H:i:s',
            mktime($horafss[0], $horafss[1], 0, $fechaselect[1], $fechaselect[0], $fechaselect[2])
        );
        return array($fechahoraentradaps, $fechahorasalidaps, $fechahoraentradass, $fechahorasalidass);
    }

    /**
     * @param $fecha
     * @param $person
     * @param $fechahoraentradaps
     * @param $fechahorasalidaps
     * @param $fechahoraentradass
     * @param $fechahorasalidass
     * @return array
     */
    public function GetSqlInsertWithSession($fecha, $person, $fechahoraentradaps, $fechahorasalidaps, $fechahoraentradass, $fechahorasalidass, $idcausa)
    {
        $filaSesionps = "((SELECT 
                                                          idasistencia
                                                        FROM 
                                                          mod_regimentrabajo.dat_asistencia 
                                                        WHERE
                                                            idpersona = " . $person['idpersona'] . " and fecharegistro = cast('" . $fecha . "' as date)),
                                                             0,
                                                             cast('" . $fechahoraentradaps .
            "' as timestamp),cast('" . $fechahorasalidaps . "' as timestamp)," . $idcausa . "
                                                            )";

        $filaSesionss = "((SELECT 
                                                          idasistencia
                                                        FROM 
                                                          mod_regimentrabajo.dat_asistencia 
                                                        WHERE
                                                            idpersona = " . $person['idpersona'] . " and fecharegistro = cast('" . $fecha . "' as date)),
                                                             1,
                                                             cast('" . $fechahoraentradass .
            "' as timestamp),cast('" . $fechahorasalidass . "' as timestamp)," . $idcausa . "
                                                            )";
        return array($filaSesionps, $filaSesionss);
    }

    /**
     * @param $fecha
     * @param $person
     * @return array
     */
    public function getSqlInsertWithSesionNull($fecha, $person, $idcausa)
    {
        $filaSesionps = "((SELECT 
                                                          idasistencia
                                                        FROM 
                                                          mod_regimentrabajo.dat_asistencia 
                                                        WHERE
                                                            idpersona = " . $person['idpersona'] . " and fecharegistro = cast('" . $fecha . "' as date)),
                                                             0,
                                                            Null,Null," . $idcausa . "
                                                            )";


        $filaSesionss = "((SELECT 
                                                          idasistencia
                                                        FROM 
                                                          mod_regimentrabajo.dat_asistencia 
                                                        WHERE
                                                            idpersona = " . $person['idpersona'] . " and fecharegistro = cast('" . $fecha . "' as date)),
                                                             1,
                                                            Null,Null," . $idcausa . "
                                                            )";
        return array($filaSesionps, $filaSesionss);
    }
}
