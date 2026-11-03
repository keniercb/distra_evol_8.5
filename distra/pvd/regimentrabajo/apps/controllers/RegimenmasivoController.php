<?php

class RegimenmasivoController extends ZendExt_Controller_Secure
{
    private $parte = array();

    function init()
    {
        parent::init();
    }

    function regimenmasivoAction()
    {

        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista.
        $this->render('regimenmasivo');
    }

    public function getPersonasporcargoAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $obj = new NomRegimentrabajoModel();
        $grupo = new NomGrupodescansoModel();
        $turno = new NomTurnotrabajoModel();
        $datAsistencia = new DatAsistencia();
        $datAsistenciaModel = new DatAsistenciaModel();
        $idestructura = $this->_getParam('idestructura');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $filtro = $this->_getParam('filtro');
        $idconcepto = $this->_getParam('idconcepto');
        $idregimentrabajo = $this->_getParam('idregimentrabajo');
        $idgrupodescanso = $this->_getParam('idgrupodescanso');
        $agrupador = $this->_getParam('agrupador');
        $arrayCargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $_SESSION['Zeolides']['perfil']['iddominio'], false);
        $cargos = array();
        foreach ($arrayCargos as $cargo) {
            array_push($cargos, $cargo['idcargo']);
        }
        if (count($cargos) > 0) {
            $arrayPersona = $datAsistencia->GetDatosPersonaReporte($cargos, $filtro, null, 0, null, null, null, $idregimentrabajo, $idgrupodescanso);
            //$arrayPersona = $datAsistenciaModel->ordenarInfoByCargo($cargos, $arrayPersona);
            $denEntAreas = $datAsistenciaModel->GetDenomEntAreas($arrayPersona);

            if (count($arrayPersona) > 0) {
                foreach ($arrayPersona as $ind => $valor) {
                    if (!empty($valor['idregimentrabajo']) && $valor['idcargo'] == $valor['idcargodrt']) {
                        $arrayPersona[$ind]['regimentrabajo'] = $obj->getDenomRegimenById($valor['idregimentrabajo']);
                        $arrayPersona[$ind]['grupotrabajo'] = $grupo->getGrupoById($valor['idgrupodescanso']);
                        $arrayPersona[$ind]['turnotrabajo'] = $turno->getTurnoTrabajoById($valor['idturnotrabajo']);
                    }
                    if ($valor['idcargo']) {
                        $arrayPersona[$ind]['denomcargo'] = $valor['denomcargo'];
                    } else
                        $arrayPersona[$ind]['denomcargo'] = 'Sin cargo';
                    if ($valor['idarea']) {
                        $arrayPersona[$ind]['denomentidadarea'] = $denEntAreas[$valor['idarea']]['denominacion'];
                    } else
                        $arrayPersona[$ind]['denomentidadarea'] = 'NO ASIGNADO A CARGO';
                    if ($valor['numid']) {
                        $arrayPersona[$ind]['numid'] = $valor['numid'];
                    } else
                        $arrayPersona[$ind]['numid'] = '-';
                }

                $result['cantidad'] = count($arrayPersona);
                $result['datos'] = $arrayPersona;
                $result['cod'] = 1;
            } else {
                $result['cantidad'] = 0;
                $result['datos'] = array();
                $result['cod'] = 3;
            }
        } else {
            $result['cantidad'] = 0;
            $result['datos'] = array();
            $result['cod'] = 3;
        }
        $_SESSION['parte'] = $result;
        echo(json_encode($result));
    }

    public function obtenerRegimenTrabajoAction()
    {
        $obj = new NomRegimentrabajoModel();
        $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
        $identidades = ZendExt_IoC::getInstance()->metadatos->BuscarArrIdsEstructurasHijasArbolCompleto($identidad);
        $rtModel = new NomRegimentrabajo();
        $res = $rtModel->getRegimenTrabajoByEntidadActive(null, null, 0, $identidades);
        $r['datos'] = $res;
        echo(json_encode($r));
    }

    public function obtenerGrupoTrabajoAction()
    {
        $idregimen = $this->_getParam('idregimentrabajo');
        $obj = new NomGrupodescansoModel();
        if(!empty($idregimen))
            $result = $obj->GetAll($idregimen);
        else
            $result = $obj->getAllGrupoDescansoActive();
        $r['datos'] = $result;
        echo(json_encode($r));
    }

    public function obtenerTurnoTrabajoAction()
    {
        $result = array();
        $objregimen = new NomRegimentrabajo();
        $objturno = new NomTurnotrabajo();
        $obj = new NomTurnotrabajoModel();
        $turnos = $obj->GetAll();
        $r['datos'] = $turnos;
        echo(json_encode($r));
    }

    function guardarRegimenPersonasAction()
    {
        $arreglo = json_decode(stripslashes($this->_request->getPost('array')));
        $idregimentrabajo = $this->_getParam('idregimentrabajo');
        $idgrupodescanso = $this->_getParam('idgrupodescanso');
        $fdesde = $this->_getParam('fdesde');
        $idestructura = $this->_getParam('idestructura');
        $personasEstructura = array();
        $idpersonas = array();
        $datAsistencia = new DatAsistencia();
        if ($idestructura) {
            $arrayCargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $_SESSION['Zeolides']['perfil']['iddominio'], false);
            $cargos = array();
            foreach ($arrayCargos as $cargo) {
                array_push($cargos, $cargo['idcargo']);
            }
            $PersonCargo = $datAsistencia->GetDatosPersonaReporte($cargos, null);

            foreach ($PersonCargo as $ind => $valor) {
                $personasEstructura[$ind]['idpersona'] = $valor['idpersona'];
                $personasEstructura[$ind]['idcargo'] = $valor['idcargo'];
                $personasEstructura[$ind]['idcargodrt'] = $valor['idcargodrt'];
                array_push($idpersonas, $valor['idpersona']);
            }
        } else {
            foreach ($arreglo as $i => $v) {
                $personasEstructura[$i]['idpersona'] = $v->idpersona;
                $personasEstructura[$i]['idcargo'] = $v->idcargo;
                $personasEstructura[$i]['idcargodrt'] = $v->idcargodrt;
                array_push($idpersonas, $v->idpersona);
            }
        }

        $result = ZendExt_IoC_Inter::getInstance()->persona->saveRegimentrabajoMasivo($personasEstructura, $idregimentrabajo, $idgrupodescanso, $fdesde);

        if ($result) {
            $calPersonas = new ConfCalendariopersonaModel();
            $res = $calPersonas->saveCalendarioPersonasMasivo($personasEstructura, $idgrupodescanso, $fdesde);

            $asistenciapers = array();
            $asistencia = array();
            $datAsistencia = new DatAsistencia();
            $asistenciapers = $datAsistencia->GetAllByDatesByFdesde($fdesde, $idpersonas);

            if (count($asistenciapers) > 0) {
                foreach ($asistenciapers as $i => $val) {
                    if ($val['idgrupodescanso'] != $idgrupodescanso) {
                        array_push($asistencia, $val);
                    }
                }
                if (count($asistencia) > 0) {
                    $calPers = new ConfCalendariopersona();
                    $calendario = $calPers->getCalendarioPersonasByFdesde($fdesde, $idpersonas);
                    $idasist = array();
                    $idasistupd = array();
                    $calIndexado = array();
                    foreach ($calendario as $index => $cal) {
                        foreach ($cal as $j => $valor) {
                            $calIndexado[$index][$valor['fecha']] = $valor['idturnotrabajo'];
                        }
                    }

                    foreach ($asistencia as $k => $v) {
                        if ($calIndexado[$v['idpersona']][$v['fecharegistro']] != $v['idturnotrabajo']) {
                            array_push($idasist, $v['idasistencia']);
                        } else {
                            array_push($idasistupd, $v['idasistencia']);
                        }
                    }
                    if (count($idasistupd) > 0) {
                        $actualizar = $datAsistencia->ActualizarAsistencia(array_unique($idasistupd), $idgrupodescanso);
                    }
                    if (count($idasist) > 0) {
                        $delasist = $datAsistencia->deleteAsistencia(array_unique($idasist));
                    }
                }
            }
        }
        if ($result && $res)
            $resultado['cod'] = 1;
        else
            if (!$result)
                $resultado['cod'] = 2;
            else
                if (!$res)
                    $resultado['cod'] = 3;
                else
                    $resultado['cod'] = 4;

        echo json_encode($resultado);
    }

    function eliminarregimenAction()
    {
        $model = new DatAsistencia();
        $modelCalPers = new ConfCalendariopersona();
        $idspersona = json_decode(stripslashes($this->_request->getPost('idspersona')));
        $result = $model->EliminarRegimen($idspersona);
        if ($result == 1) {
            $r['cod'] = $result;
        }
        echo(json_encode($r));
    }

    function exportarPDFAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $arreglo = $_SESSION['parte'];
        $denomarea = array();
        foreach ($arreglo['datos'] as $p => $dat) {
            if (!in_array($dat['idarea'], $denomarea)) {
                $denomarea[$dat['idarea']] = $dat['denomentidadarea'];
            }
        }
        $DatpdfregimenmasivoModel = new DatpdfregimenmasivoModel();
        $DatpdfregimenmasivoModel->construirReporte($arreglo,$denomarea);
        echo(json_encode('ok'));
    }
}

?>