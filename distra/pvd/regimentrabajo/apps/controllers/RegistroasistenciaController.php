<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class RegistroasistenciaController extends ZendExt_Controller_Secure
{
    protected $configSesiones;
    protected $zona;

    function init()
    {
        parent::init();
        $habSesiones = new ConfHabilitarsesiones();
        $confSesion = $habSesiones->getHabilitarsesiones();
        $this->configSesiones = $confSesion[0]['habsesion'];
        /*
		cuando estemos en horario de verano poner "America/Chicago"
		cuando regresemos al horario normal poner "America/Havana"
		*/
        $this->zona = "America/Havana";
    }

    function registroasistenciaAction()
    {
        $this->view->fecha = date('d/m/Y');
        $this->render();
    }

    function getAsistenciaAction()
    {
        $mes = date('m');
        $year = date('Y');
        $fechdesde = $this->_request->getPost('fdesde');
        $fechhasta = $this->_request->getPost('fhasta');
        $result = array();
        $model = new DatEstructuraasistenciaModel();
        $datAsistencia = new DatAsistencia();
        $confCalendarioPersona = new ConfCalendariopersona();

        $p = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
            array($_SESSION['Zeolides']['perfil']['idpersona']), null, null, null, null, null, null
        );
		if(!empty($p->data[0]['idpersona']))
			$regimen = $datAsistencia->getRegimenByPerson($p->data[0]['idpersona']);

        if (count($regimen) > 0) {
            $fechiniturno = date('d/m/Y');
            $ConfCalendario = new ConfCalendario();
//            $calendario = $ConfCalendario->getCalendarioByFecha($fechiniturno, $regimen[0]['idgrupodescanso']);
            $calendario = $confCalendarioPersona->getCalendarioPersona($fechiniturno,$fechiniturno,$p->data[0]['idpersona']);
            //Verificando si es que el turno comenzo ayer
            if (count($calendario) == 0) {
                $fecha = date('d-m-Y');
                $f1 = explode('-', $fecha);
                $f2 = date_create($f1[2] . '/' . $f1[1] . '/' . $f1[0]);
                $fechiniturno = date_add($f2, date_interval_create_from_date_string('-1 days'))->format("d/m/Y");
                $FIT = explode('/', $f2->format('d/m/Y'));
                $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                //$caltmp = $ConfCalendario->getCalendarioByFecha($fechiniturno, $regimen[0]['idgrupodescanso']);
                $caltmp = $confCalendarioPersona->getCalendarioPersona($fechiniturno,$fechiniturno,$p->data[0]['idpersona']);
                if ($caltmp[0]['otrodia'] == 1) {
                    $calendario = $caltmp;
                }
            }

            $DatAsistenciaModel = new DatAsistenciaModel();
            $diaferiadohab = $DatAsistenciaModel->GetDiaFeriadoHabilitado($_SESSION['Zeolides']['perfil']['idpersona'], date('d/m/Y'));

            if ($calendario[0]['otrodia'] == 1)
                $otrodia = 1;

            $r['habentsal'] = "no";
            if ($calendario[0]['trabajo'] == 1 || count($diaferiadohab) > 0) {
                $asistencia = $datAsistencia->GetAllByRangeAndPersonBySesion($fechdesde, $fechhasta, $_SESSION['Zeolides']['perfil']['idpersona'], $mes, $year, $this->configSesiones);
                $r['tieneentrada'] = 0;
                $r['tienesalida'] = 0;
                $r['tienecausa'] = 0;
                date_default_timezone_set($this->zona);
                $r['habentsal'] = "entrada";
                foreach ($asistencia as $key => $value) {
                    if ($value['fecharegistro'] == $fechiniturno && !empty($value['fechahoraentrada']))
                        $r['habentsal'] = "salida";
                    if ($value['fecharegistro'] == $fechiniturno && !empty($value['fechahoraentrada']) && !empty($value['fechahorasalida']))
                        $r['habentsal'] = "no";

                    if ($value['fecharegistro'] == date('d/m/Y')) {
                        if ($value['fechahoraentrada'] != "")
                            $r['tieneentrada'] = 1;
                        if ($value['fechahorasalida'] != "")
                            $r['tienesalida'] = 1;
                    }
                    if($value['hrsdescontadas'] == 'null')
                        $asistencia[$key]['hrsdescontadas'] = '';
                    if($value['horasextras'] == 'null')
                        $asistencia[$key]['horasextras'] = '';

                    if (($value['idcausa'] != "" && $value['fecharegistro'] == date('d/m/Y')) || ($value['idcausa'] != "" && $value['fdesde'] >= date('d/m/Y') && $value['fdesde'] <= date('d/m/Y'))) {
                        $r['tienecausa'] = 1;
                    }
                    $mes = $this->getMes($value['mes']);
                    $asistencia[$key]['mes'] = $mes . ' - ' . $value['year'];
                    if ($value['idpersonacontrola'] == 1) {
                        $asistencia[$key]['personacontrola'] = 'Control de Acceso';
                    }

                    $fechentrada = explode(' ', $value['fechahoraentrada']);
                    $asistencia[$key]['fechaentrada'] = $fechentrada[0];

                    $fechsalida = explode(' ', $value['fechahorasalida']);
                    $asistencia[$key]['fechasalida'] = $fechsalida[0];

                    if ($calendario[0]['trabajo'] == 1 && $calendario[0]['otrodia'] == 0) {
                        $fechainicioturno = $value['fecharegistro'];
                        $fechafinturno = $value['fecharegistro'];
                    } else {
                        if ($calendario[0]['trabajo'] == 1 && $calendario[0]['otrodia'] == 1) {
                            $f1 = explode('/', $value['fecharegistro']);
                            $f2 = date_create($f1[2] . '-' . $f1[1] . '-' . $f1[0]);
                            $fechsalturno = date_add($f2, date_interval_create_from_date_string('1 day'));
                            $FIT = explode('/', $f2->format('d/m/Y'));
                            $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                            $fechafinturno = $fechsalturno->format('d/m/Y');
                            $fechainicioturno = $value['fecharegistro'];
                        } else {
                            $f1 = explode('/', $value['fecharegistro']);
                            $f2 = date_create($f1[2] . '-' . $f1[1] . '-' . $f1[0]);
                            $fechiniturno = date_add($f2, date_interval_create_from_date_string('-1 days'));
                            $FIT = explode('/', $f2->format('d/m/Y'));
                            $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                            //$dia1 = $model->getCalendarioByFecha($fechiniturno->format('Y-m-d'), $value['idgrupodescanso']);
                            $dia1 = $confCalendarioPersona->getCalendarioPersona($fechiniturno->format('Y-m-d'),$fechiniturno->format('Y-m-d'),$p->data[0]['idpersona']);
                            if ($dia1[0]['trabajo'] == 1 && $dia1[0]['otrodia'] == 1)
                                $fechainicioturno = $fechiniturno->format('d/m/Y');
                            $fechafinturno = $value['fecharegistro'];
                        }
                    }
                    $horatt = $datAsistencia->getHorarioByPersona($_SESSION['Zeolides']['perfil']['idpersona'], $fechainicioturno);
                    $inicioturno = $fechainicioturno . '-' . $horatt['horainicio'];
                    $finturno = $fechafinturno . '-' . $horatt['horafin'];
                    $asistencia[$key]['turno'] = $inicioturno . '----' . $finturno;
                    $asistencia[$key]['initurno'] = $horatt['horainicio'];
                    $asistencia[$key]['otrodia'] = $calendario[0]['otrodia'];
                }
                foreach ($asistencia as $key => $value) {
                    $result[] = $value;
                }
                $resumenGrafico = array();
                $grafica = array();
                foreach ($result as $key => $per) {
                    if (!empty($per['fechahoraentrada'])) {
                        $resumenGrafico['Presente'] += 1;
                    }
                    if (!empty($per['idcausa'])) {
                        $resumenGrafico[$per['causa']] += 1;
                    }
                }
                $llaves = array_keys($resumenGrafico);
                $cont = 0;
                foreach ($resumenGrafico as $key => $valor) {
                    $grafica[$cont] = array(0 => $llaves[$cont], 1 => $valor);
                    $cont++;
                }
            } else {
                $r['cod'] = 4;
            }

        } else {
            $r['cod'] = 3;
        }


        if (is_array($result)) {
            $r['datos'] = $result;
            $r['cantidad'] = count($result);
            $grafic['name'] = $llaves;
            $grafic['data'] = $grafica;
            $r['resumen'] = $grafic;
            $r['sesiones'] = $this->configSesiones;
            $r['fecha'] = date('d/m/Y');
            $r['otrodia'] = $otrodia;
        } else {
            $r['datos'] = Array();
            $r['cantidad'] = 0;
            $r['sesiones'] = $this->configSesiones;
            $r['fecha'] = date('d/m/Y');
            $r['otrodia'] = $otrodia;
        }
        echo(json_encode($r));
    }

    function guardarEntradaAction()
    {
        date_default_timezone_set($this->zona);
        $datAsist = new DatAsistenciaModel();
        $datAsistencia = new DatAsistencia();
        $otrodia = $this->_getParam('otrodia');
        $bandera = false;
        if ($this->_getParam('idasistencia')) {
            $asistence = Doctrine::getTable('DatAsistencia')->find($this->_getParam('idasistencia'));
            $asis = $asistence->toArray();
            $nomcausa = new NomCausa();
            $causa = $nomcausa->GetCausasById($asis['idcausa']);
            if ($causa[0]['modifica'] == 1) {
                $bandera = true;
            } else {
                $cod = 4;
            }
        } else {
            $bandera = true;
        }
        if ($bandera == true) {
            if ($this->_getParam('accion') == 0 || $this->_getParam('accion') == 1) {
                $result1 = $datAsistencia->EliminarCausaFromAsistencia($_SESSION['Zeolides']['perfil']['idpersona']); //paso 0 para que la causa sea eliminada solo en el dia en cuestion
                if ($otrodia == 1)
                    $result = $datAsist->guardarAsistenciaOtrodia(date('Y-m-d'), date('H:i:s'), 1, $_SESSION['Zeolides']['perfil']['idpersona']);
                else
                    $result = $datAsist->guardarAsistencia(date("Y-m-d"), date("H:i:s"), 1, $_SESSION['Zeolides']['perfil']['idpersona']);
            }
            if ($this->_getParam('accion') == -1) {
                if ($this->configSesiones == '1') {
                    $result = $datAsist->createAsistenciaSession(date("H:i:s"), date("d/m/Y"), $this->_getParam('sesion'), $this->_getParam('evento'));
                } else {
                    if ($otrodia == 1)
                        $result = $datAsist->guardarAsistenciaOtrodia(date('Y-m-d'), date('H:i:s'), 1, $_SESSION['Zeolides']['perfil']['idpersona']);
                    else
                        $result = $datAsist->guardarAsistencia(date("Y-m-d"), date("H:i:s"), 1, $_SESSION['Zeolides']['perfil']['idpersona']);
                }
            }
        }
        $r['datos'] = $result;
        $r['cod'] = $cod;

        echo(json_encode($r));
    }

    function guardarSalidaAction()
    {
        date_default_timezone_set($this->zona);
        $otrodia = $this->_getParam('otrodia');

        $datAsist = new DatAsistenciaModel();
        if ($this->configSesiones == '1') {
            $result = $datAsist->createAsistenciaSession(date("H:i:s"), date("d/m/Y"), $this->_getParam('sesion'), $this->_getParam('evento'));
        } else {
            if ($otrodia == 1) {
                $result = $datAsist->guardarAsistenciaOtrodia(date('Y-m-d'), date('H:i:s'), 2, $_SESSION['Zeolides']['perfil']['idpersona']);
            } else {
                $result = $datAsist->guardarAsistencia(date("Y-m-d"), date("H:i:s"), 2, $_SESSION['Zeolides']['perfil']['idpersona']);
            }
        }
        echo(json_encode($result));
    }

    function datosPersonaAction()
    {
        $person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array($this->_request->getPost('idpersona')), null, null, null, null, null, null);
        $r = $person->data[0];
        $datAsist = new DatAsistenciaModel();
        $denEntAreas = $datAsist->GetDenomEntAreas($person->data);
        $r['denomentidad'] = (is_numeric($r['identidad'])) ? $denEntAreas[$r['identidad']]['denominacion'] : '';
        $r['denomarea'] = (is_numeric($r['idarea'])) ? $denEntAreas[$r['idarea']]['denominacion'] : '';
        $obj = new NomRegimentrabajoModel();
        $grupo = new NomGrupodescansoModel();
        $turno = new NomTurnotrabajoModel();
        foreach ($r['DatRegimentrabajo'] as $regimentrab) {
            if ($regimentrab['actual'] == 1)
                $regimen = $regimentrab;
        }
        $r['regimentrabajo'] = (is_numeric($regimen['idregimentrabajo'])) ? $obj->getDenomRegimenById($regimen['idregimentrabajo']) : '';
        $r['grupodescanso'] = (is_numeric($regimen['idgrupodescanso'])) ? $grupo->getGrupoById($regimen['idgrupodescanso']) : '';
        $r['turnotrabajo'] = (is_numeric($regimen['idturnotrabajo'])) ? $turno->getTurnoTrabajoById($regimen['idturnotrabajo']) : '';
        echo(json_encode($r));
    }

    function generarPdfReporteAction()
    {
        $fechdesde = $this->_getParam('fdesde');
        $fechhasta = $this->_getParam('fhasta');

        $datAsistencia = new DatAsistencia();
        $asistencia = $datAsistencia->GetAllByRangeAndPersonBySesion($fechdesde, $fechhasta, $_SESSION['Zeolides']['perfil']['idpersona']);

        $asistenciatemp = array();
        $cantidad = count($asistencia);
        $nummes = $asistencia[0]['mes'];
        foreach ($asistencia as $key => $value) {
            $mes = $this->getMes($value['mes']);
            if ($nummes != $value['mes'])
                $nummes = $value['mes'];
            if ($nummes == $value['mes']) {
                $asistenciatemp[$mes . ' - ' . $value['year']][] = $value;
            }
        }
        $asistencia = $asistenciatemp;

        $cantidad += count($asistencia);

        $person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array($_SESSION['Zeolides']['perfil']['idpersona']), null, null, null, null, null, null);
        $r = $person->data[0];
        $datAsist = new DatAsistenciaModel();
        $denEntAreas = $datAsist->GetDenomEntAreas($person->data);
        $r['denomentidad'] = (is_numeric($r['identidad'])) ? $denEntAreas[$r['identidad']]['denominacion'] : '';
        $r['denomarea'] = (is_numeric($r['idarea'])) ? $denEntAreas[$r['idarea']]['denominacion'] : '';

        $objReportePDF = new DatpdfregistrarasistenciaModel();
        $objReportePDF->construirReporte($asistencia, $r, $fechdesde, $fechhasta, $cantidad);
        return true;
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