<?php

require_once __DIR__ . '/../../planmeta/controllers/ControlejecucionplanifController.php';

class ControlejecucionplanifsisplaninversionesController extends ControlejecucionplanifController {
    
    public function init() {
        parent::init();
    }

    //Lista los niveles de actividad mayores que cero dada una entidad y un ejercicio
    public function listarNivelesActAction() {
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

            $modelContEjecPlan = new ControlejecucionplanifsisplaninversionesModel();

            if ($this->_request->getPost('glob') == 'false') {
                $params['entidades'] = array('0' => $params['identidad']);
                $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
                $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;

                if ($params['esrector'] == 'true') {
                    $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
                }
                $result = $modelContEjecPlan->listarNivelesAct($params);
                if ($result == -1) {
                    $data->data = array();
                    echo json_encode($data);
                } else {
                    echo json_encode($result);
                }
            } else {
                $idestructura = $this->integrator->metadatos->DameEstructura($params['identidad']);
                $modeloActEnt = new DatActividadentidad();
                $params['entidades'] = DatActividadentidad::buscarEntidadesHijas($idestructura[0]->idestructura);

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
                    $result = $modelContEjecPlan->listarNivelesAct($params);
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
                            'mensaje' => 'Su secci&oacute;n ha expirado, por favor reinicie el sistema.')
                );
            }
        }
    }

}
