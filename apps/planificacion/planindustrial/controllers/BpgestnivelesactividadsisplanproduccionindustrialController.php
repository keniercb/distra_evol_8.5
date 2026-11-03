<?php

require_once __DIR__ . '/../../planmeta/controllers/BpgestnivelesactividadController.php';

class BpgestnivelesactividadsisplanproduccionindustrialController extends BpgestnivelesactividadController {

    public function init() {
        parent::init();
    }

    public function listarActsNivActAction() {
        try {
            ini_set("max_execution_time", 600);
            $params = array();
            $params['esrector'] = $this->_request->getPost('esrector');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['columnasamostrar'] = json_decode(stripslashes($this->_request->getPost('columnsToShow')));
            $params['idmodelo'] = $this->_request->getPost('idmodelo');
            $params ['idaprobacion_actividad'] = array(3, 4);
            $params ['idEstructuraPadre'] = $this->_request->getPost('idEstructuraPadre');
            $params ['calcularrestoxdistrib'] = $this->_request->getPost('calcularrestoxdistrib');
            $global = ZendExt_GlobalConcept::getInstance();
            if ($this->_request->getPost('idespecialidad') != '') {
                $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
            } else {
                $params['idespecialidad'] = $global->Estructura->idespecialidad;
            }
            $params['identidad'] = $this->_request->getPost('identidad');
            if ($params ['idEstructuraPadre'] == 'undefined') {
                $params ['idEstructuraPadre'] = $params['identidad'];
            }
            /* aki se guarda si se manda o no a calcular el importe */
            $params ['calcularimporte'] = $this->_request->getPost('calcularimporte');
            if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0') {
                $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
                $params ['nivel'] = $arrayResFormatoUltimonivel[1];
                if ($this->_request->getPost('codigo') != '') {
                    $params ['codigo'] = $this->_request->getPost('codigo');
                }
                if ($this->_request->getPost('denominacion') != '') {
                    $params ['denominacion'] = $this->_request->getPost('denominacion');
                }
                if ($this->_request->getPost('calcularimporte') != '') {
                    $params ['calcularimporte'] = $this->_request->getPost('calcularimporte');
                }
                if ($this->_request->getPost('idaprobacion') != '') {
                    $params ['idaprobacion'] = $this->_request->getPost('idaprobacion');
                }
                $params['filtros'] = $this->_request->getPost('filtros');
                $params['start'] = $this->_request->getPost('start');
                $params['limit'] = $this->_request->getPost('limit');
                $modelActEnt = new DatActividadentidadsisplanproduccionindustrialModel();
                $params['entidades_productoras'] = array('-1');
                if ($params ['calcularrestoxdistrib'] == 'true') {
                    $params['entidades_productoras'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params ['idEstructuraPadre']);
                }
                if ($this->_request->getPost('glob') == 'false') {
                    $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($params['identidad']);
                    if ($params['identidad'][0] == null || $params['identidad'][0] == '' || !$params['identidad'][0]) {
                        $data->data = array();
                        $data->data[0]['idactividadentidad'] = -1;
                        echo json_encode($data);
                    } else {
                        $params['identidad'] = $params['identidad'][0];
                        $params['entidades'] = array('0' => $params['identidad']);
                        $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
                        $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;
                        if ($params['esrector'] == 'true') {
                            $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
                        }
                        $result = $modelActEnt->listarActsNivActPorEntidad($params);

                        if ($result == -1) {
                            $data->data = array();
                            echo json_encode($data);
                        } else {
                            echo json_encode($result);
                        }
                    }
                } else {
                    /* Consolidar niveles de actividad */
                    $idestructura = $this->integrator->metadatos->DameEstructura($params['identidad']);
                    $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($idestructura[0]->idestructura);
                    $var = implode(',', $params['entidades']);
                    $params['entidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
                    if ($params['entidades'] [0] != null) {
                        $params['id_especialidades'] = array();
                        foreach ($params['entidades'] as $key => $valorIdentidad) {
                            $tempEspecialidades = 0;
                            $entidades[] = $this->integrator->metadatos->DameEstructura($valorIdentidad);
                            foreach ($params['id_especialidades'] as $esp) {
                                if ($esp == $entidades [$key][0]->idespecialidad) {
                                    $tempEspecialidades = 1;
                                }
                            }
                            if ($tempEspecialidades == 0) {
                                $params['id_especialidades'] [] = $entidades [$key][0]->idespecialidad;
                            }
                        }
                        $result = $modelActEnt->listarActsNivActPorEntidad($params);
                        if ($result == -1) {
                            $data->data = array();
                            echo json_encode($data);
                        } else {
                            echo json_encode($result);
                        }
                    } else {
                        $data->data = array();
                        $data->total = 0;
                        echo json_encode($data);
                    }
                }
            } else {
                if ($params['identidad'] == '0' || $params['identidad'] == null) {

                    $data->total = 0;
                    echo json_encode($data);
                } else {
                    echo json_encode(
                            array('codMsg' => 3,
                                'mensaje' => 'Su secci&oacute;n ha expirado, por favor reinicie el sistema. ')
                    );
                }
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function listarPlanModeloAction() {
        try {
            $identidad = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');

            if ($identidad != 'undefined') {
                $tipo = $this->_request->getPost('tipo');
                $node = $this->_request->getPost('node');
                $arrenthijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
                $arrenthijas = implode(',', $arrenthijas);
                $model = new DatPlanProduccionindustrialModel();
                $elementos = $model->Listar($identidad, $tipo, $node, $params['idejercicio'], $arrenthijas, true);
                echo json_encode($elementos);
            } else {
                echo json_encode(array());
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function actualizarPlanAction() {
        try {
            $params = array();
            ini_set("max_execution_time", 3600); //600 = 10 min de conexion    3600 = 1hora
            $params['idEstructura'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['tipoplan'] = $this->_request->getPost('tipoplan');
            $entidades[] = $this->integrator->metadatos->DameEstructura($params['idEstructura']);
            $params['idespecialidad'] = $entidades [0][0]->idespecialidad;
            $params['idmodelo'] = $this->_request->getPost('idmodelo');
            $iddesglose = DatDesglose::getAsociado($params['idmodelo']);
            $params['iddesglose'] = $iddesglose[0];
            $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
            $modelDesgloseEnt = new DatDesgloseentidadProduccionindustrialModel();
            $result = $modelDesgloseEnt->actualizarPlan($params);
            echo json_encode(array('codMsgA' => $result));
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

    public function exportarNivelesActvAExcelAction() {
        ini_set("max_execution_time", 600);
        $params = array();
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['text'] = $this->_request->getParam('text');
        $params['is_leaf'] = $this->_request->getParam('is_leaf');
        $params['glob'] = $this->_request->getParam('glob');
        $params['esrector'] = $this->_request->getParam('esrector');
        $params ['idEstructuraPadre'] = $this->_request->getParam('idEstructuraPadre');
        $params ['calcularrestoxdistrib'] = $this->_request->getParam('calcularrestoxdistrib');
        $params ['calcularimporte'] = 'true';
        //para el exportar de niveels con desgloses
        $params['idmodelo'] = $this->_request->getParam('idmodelo');
        $params['tipoExportar'] = $this->_request->getParam('tipo');
        $params['columnasamostrar'] = array(
            0 => 'importe',
            1 => 'importeajustado',
            2 => 'importefinal'
        );
        $global = ZendExt_GlobalConcept::getInstance();
        if ($this->_request->getParam('idespecialidad') != '') {
            //temporal falta enviarlo en el GET
            $params['idespecialidad'] = $this->_request->getParam('idespecialidad');
        } else {
            $params['idespecialidad'] = $global->Estructura->idespecialidad;
        }
        if ($params ['idEstructuraPadre'] == 'undefined') {
            $params ['idEstructuraPadre'] = $params['identidad'];
        }
        if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0') {
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];
            if (is_array(json_decode(stripslashes($this->_request->getParam('filtros'))))) {
                foreach (json_decode(stripslashes($this->_request->getParam('filtros'))) as $key => $datos) {
                    if ($datos->field == 'codigo' || $datos->field == 'denominacion' || $datos->field == 'denespecialidad' || $datos->field == 'descripcion' || $datos->field == 'idaprobacion' || $datos->field == 'denmodelo' || $datos->field == 'comportamiento') {
                        $params['filtros'][$key]['field'] = $datos->field;
                    } elseif ($datos->field == 'nivelactividadautomatico' || $datos->field == 'nivelactividadct' || $datos->field == 'nivelactividadmanual' || $datos->field == 'nivelactividadindustrial' || $datos->field == 'nivelactividad' || $datos->field == 'restoxdistrib' || $datos->field == 'ajuste' || $datos->field == 'nivelactividadajuste' || $datos->field == 'importe' || $datos->field == 'importeajustado' || $datos->field == 'importefinal') {
                        $params['filtros'][$key]['field'] = $datos->field;
                        $params['filtros'][$key]['data']['comparison'] = $datos->data->comparison;
                    }
                    if (is_array($datos->data->value)) {
                        $params['filtros'][$key]['data']['value'] = $datos->data->value[0];
                    } else {
                        $params['filtros'][$key]['data']['value'] = $datos->data->value;
                    }
                }
            }
            $params['entidades_productoras'] = array('-1');
            if ($params ['calcularrestoxdistrib'] == 'true') {
                $params['entidades_productoras'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params ['idEstructuraPadre']);
            }
            $modelActEnt = new DatActividadentidadsisplanproduccionindustrialModel();
            if ($params['tipoExportar'] == 1) {
                $modelActEnt->exportarAExcel($params);
            } else if ($params['tipoExportar'] == 2) {
                $modelActEnt->exportarAExcelConDesgloses($params);
            }
        }
    }

    public function actualizarNivActividadAction() {
        try {
            ini_set("max_execution_time", 600);
            $params['actividades'] = json_decode(stripslashes($this->_request->getPost('niveles')));
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $var = $params['actividades'][0]->identidad;
            $datosentidad = $this->integrator->metadatos->DameEstructura($var);
            $params['espcomp'] = $datosentidad[0]->idespecialidad;
            $model = new DatActividadentidadsisplanproduccionindustrialModel();
            if ($params['actividades'][0] != null) {
                $model->modificarNivelesActividad($params);
            }
            echo json_encode(array('codMsgE' => 1));
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

    public function exportarCalculoNivelesActvAExcelAction() {
        ini_set("max_execution_time", 600); //setear el tiempo de ejecucion a 10 min
        $params = array();
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['global'] = $this->_request->getParam('glob');
        $params['idactividad'] = json_decode(stripslashes($this->_request->getParam('idactividades')));
        $modelActEnt = new DatActividadentidadsisplanproduccionindustrialModel ();
        $modelActEnt->exportarCalculoAExcel($params);
    }

    public function aprobarDesaprobarNivelActividadAction() {
        $idejercicio = $this->_request->getPost('idejercicio');
        $actividades = json_decode(stripslashes($this->_request->getPost('actividades')));
        $identidad = $this->_request->getPost('identidad');
        $idaprobacion = $this->_request->getPost('idaprobacion');
        $ajusteAD = $this->_request->getPost('aprobarOdesaprobarA');
        $isLeaf = $this->_request->getPost('is_leaf');
        $aprobarDesaprobarTodosNivAct = $this->_request->getPost('todos');
        $esrector = ($this->_request->getPost('es_rector') == 'true') ? true : false;
        $aux = "false";
        if ($ajusteAD == "") {
            $aux = "true";
        }
        $modelActEnt = new DatActividadentidadsisplanproduccionindustrialModel();
        if ($aprobarDesaprobarTodosNivAct == 'true') {
            if ($isLeaf == 'true') {
                $datosentidad = $this->integrator->metadatos->DameEstructura($identidad);
                $idespecialidades[0] = $datosentidad[0]->idespecialidad;
                $modelActEnt->aprobar_desaprobarTodosNivelesActividad($identidad, $idejercicio, $idaprobacion, null, $esrector, $aux, $idespecialidades);
                echo json_encode(
                        array('codMsgE' => 1,
                            'mensaje' => (($idaprobacion == '3' || $idaprobacion == '4') ? 'aprobada' : 'desaprobada'),
                            'idaprobacion' => $idaprobacion)
                );
            } else {
                $entidadesHijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
                $idespecialidades = array();
                foreach ($entidadesHijas as $key => $valorIdentidad) {
                    $tempEspecialidades = 0;
                    $entidades[] = $this->integrator->metadatos->DameEstructura($valorIdentidad);
                    foreach ($idespecialidades as $esp) {
                        if ($esp == $entidades [$key][0]->idespecialidad) {
                            $tempEspecialidades = 1;
                        }
                    }
                    if ($tempEspecialidades == 0) {
                        $idespecialidades [] = $entidades [$key][0]->idespecialidad;
                    }
                }
                $modelActEnt->aprobar_desaprobarTodosNivelesActividad($identidad, $idejercicio, $idaprobacion, $entidadesHijas, $esrector, $aux = true, $idespecialidades);
                echo json_encode(
                        array('codMsgE' => 1,
                            'mensaje' => (($idaprobacion == '3' || $idaprobacion == '4') ? 'aprobada' : 'desaprobada'),
                            'idaprobacion' => $idaprobacion)
                );
            }
        } elseif ($modelActEnt->aprobarDesaprobarNivelAct(
                        array('actividades' => $actividades, 'identidad' => $identidad,
                            'idejercicio' => $idejercicio,
                            'idaprobacion' => $idaprobacion,
                            'esrector' => $esrector)
                )
        ) {
            echo json_encode(
                    array('codMsgE' => 1,
                        'mensaje' => (($idaprobacion == '3' || $idaprobacion == '4' || $idaprobacion == '5') ? 'aprobada' : 'desaprobada'),
                        'idaprobacion' => $idaprobacion)
            );
        } else {
            echo("{'codMsgE':3 }");
        }
    }

}
