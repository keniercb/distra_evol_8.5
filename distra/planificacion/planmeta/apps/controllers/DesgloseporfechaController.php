<?php

class DesgloseporfechaController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function desgloseporfechaAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    //Lista los ejercicios de la planificación
    public function getEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicio();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    public function listarNivelesActividadAction() {
        ini_set("max_execution_time", 600);
        $params = array();
        $params['esrector'] = $this->_request->getPost('esrector');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params ['idEstructuraPadre'] = $this->_request->getPost('idEstructuraPadre');
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
        $isLeaf = $this->_request->getPost('is_leaf');
        if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0') {
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;

            $modelContEjecPlan = new DatNivelactividadporfechaModel();
            $security = ZendExt_Aspect_Security_Sgis::getInstance();

            if ($this->_request->getPost('glob') == 'false') {
                $params['entidades'] = array('0' => $params['identidad']);
                $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
                $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;
                if ($params['esrector'] == 'true') {
                    $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
                }
                $result = $modelContEjecPlan->listarNivelesAct($params, 'list', false);
                if ($result == -1) {
                    $data->data = array();
                    echo json_encode($data);
                } else {
                    echo json_encode($result);
                }
            } else {
                $idestructura = $this->integrator->metadatos->DameEstructura($params['identidad']);
                $modeloActEnt = new DatActividadentidad();
                $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($idestructura[0]->idestructura);
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
                    $result = $modelContEjecPlan->listarNivelesAct($params, 'list', false);
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
                echo json_encode(array('codMsg' => 3, 'mensaje' => 'Su secci&oacute;n ha expirado, por favor reinicie el sistema.'));
            }
        }
    }

    public function listarDesglosesAction() {
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $modeloActEnt = new DatActividadentidad();
        $params['idactividadentidad'] = DatActividadentidad::BuscarIdactividadEntidades1(
                        $params['identidad'], $params['idactividad'], $params['idejercicio']
        );
        $params['idactividadentidad'] = $params['idactividadentidad'][0]['idactividadentidad'];
        $params['filtros'] = $this->_request->getPost('filtros');
        $modeloNivelAct = new DatNivelactividadporfechaModel();
        echo json_encode(
                $modeloNivelAct->listarNivelactividadporfecha(
                        $params
                )
        );
    }

    public function guardarDesglosesAction() {
        $params['desgloses'] = json_decode(stripslashes($this->_request->getPost('desgloses')));
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $modeloActEnt = new DatActividadentidad();
        $params['idactividadentidad'] = DatActividadentidad::BuscarIdactividadEntidades1($params['identidad'], $params['idactividad'], $params['idejercicio']);
        $params['idactividadentidad'] = $params['idactividadentidad'][0]['idactividadentidad'];
        $modeloNivelAct = new DatNivelactividadporfechaModel();
        echo json_encode(array('codMsgG' => $modeloNivelAct->adicionar_modif_nivactporfecha($params)));
    }

    public function eliminarDesglosesAction() {
        $params['desgloses'] = json_decode(stripslashes($this->_request->getPost('desgloses')));
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $modeloActEnt = new DatActividadentidad();
        $params['idactividadentidad'] = DatActividadentidad::BuscarIdactividadEntidades1($params['identidad'], $params['idactividad'], $params['idejercicio']);
        $params['idactividadentidad'] = $params['idactividadentidad'][0]['idactividadentidad'];
        $modeloNivelAct = new DatNivelactividadporfechaModel();
        echo json_encode(array('codMsgE' => $modeloNivelAct->eliminarDesgloses($params)));
    }

    public function listarEspecialidadesAction() {
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $data->data = $this->nomenclador->selectParam('nom_especialidad', array('idespecialidad', 'denespecialidad'));
        echo json_encode($data);
    }

    public function exportarAction() {
        ini_set("max_execution_time", 600);
        $params = array();
        $params['esrector'] = $this->_request->getParam('esrector');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['denoejercicio'] = $this->_request->getParam('denoejercicio');
        $params ['idEstructuraPadre'] = $this->_request->getParam('idEstructuraPadre');
        $global = ZendExt_GlobalConcept::getInstance();
        if ($this->_request->getParam('idespecialidad') != '') {
            $params['idespecialidad'] = $this->_request->getParam('idespecialidad');
        } else {
            $params['idespecialidad'] = $global->Estructura->idespecialidad;
        }
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['denoentidad'] = $this->_request->getParam('denoentidad');
        if ($params ['idEstructuraPadre'] == 'undefined') {
            $params ['idEstructuraPadre'] = $params['identidad'];
        }
        $isLeaf = $this->_request->getParam('is_leaf');

        if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0') {
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];
            if (is_array(json_decode(stripslashes($this->_request->getParam('filtros'))))) {
                foreach (json_decode(stripslashes($this->_request->getParam('filtros'))) as $key => $datos) {
                    if ($datos->field == 'codigo' || $datos->field == 'denominacion') {
                        $params['filtros'][$key]['field'] = $datos->field;
                    } elseif ($datos->field == 'nivelactividad' || $datos->field == 'nivelactividadreal' || $datos->field == 'nivelactividadpordesglozar') {
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
            $modelContEjecPlan = new DatNivelactividadporfechaModel();
            $security = ZendExt_Aspect_Security_Sgis::getInstance();

            if ($this->_request->getParam('glob') == 'false') {
                $params['entidades'] = array('0' => $params['identidad']);
                $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
                $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;
                if ($params['esrector'] == 'true') {
                    $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
                }
                $modelContEjecPlan->exportarAExcel($params);
            } else {
                $idestructura = $this->integrator->metadatos->DameEstructura($params['identidad']);
                $modeloActEnt = new DatActividadentidad();
                $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($idestructura[0]->idestructura);
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

                    $modelContEjecPlan->exportarAExcel($params);
                } else {
                    $data->data = array();
                    $data->total = 0;
                    echo json_encode($data);
                }
            }
        }
    }

}
