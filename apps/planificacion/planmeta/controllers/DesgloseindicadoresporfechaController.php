<?php

/**
 * DesgloseindicadoresporfechaController
 * Controlador para gestionar los desgloses por fecha
 *
 * @ author Pedro Enrique Rojas Aguilar
 * @ package Planificaci?n
 * @ subpackage Planificaci?n Empresarial y Presupuestaria
 * @ copyright Planificacion
 * @ version 1.0-0
 * */
class DesgloseindicadoresporfechaController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function desgloseindicadoresporfechaAction() {

        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    //Lista los ejercicios de la planificación
    public function getEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    public function listarIndicadoresAction() {
        ini_set("max_execution_time", 600); //10min de conexion
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['glob'] = $this->_request->getPost('glob');
        $identidad = $this->_request->getPost('identidad');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        if ($this->_request->getPost('glob') == 'false') {
            $parametros['entidades'] [] = $identidad;
            $parametros['consolidar'] = 0;
        } else {
            if ($this->_request->getPost('glob') == 'true') {
                $parametros['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
                $parametros['consolidar'] = 1;
            }
        }
        $parametros['contar'] = 3;
        $parametros['listar'] = 3;

        $datos = DatPlanificacionporfechaModel::listarIndEjecsinmodelo($parametros);
        echo json_encode($datos);
    }

    public function listarModelosAction() {
        ini_set("max_execution_time", 3600);
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        if ($this->_request->getPost('glob') == 'false') {
            $parametros['hijosentidad'][] = $parametros['identidad'];
        } else {
            if ($this->_request->getPost('glob') == 'true') {
                $parametros['hijosentidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $parametros['identidad']
                );
            }
        }
        $parametros['uri'] = $this->_request->getPost('uri');

        $cbmodel = new DatPlanModel();

        $data = $cbmodel->obtenerPlanesEntidadPlanif($parametros);
        echo json_encode(array('data' => $data));
    }

    public function listarDesglosesAction() {
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['idplanificacion'] = $this->_request->getPost(
                'idplanificacion'
        );
        $params['filtros'] = $this->_request->getPost('filtros');
        echo json_encode(
                DatPlanificacionporfechaModel::listarPlanifporfecha(
                        $params
                )
        );
    }

    public function guardarDesglosesAction() {
        $params['desgloses'] = json_decode(
                stripslashes($this->_request->getPost('desgloses'))
        );
        $params['idplanificacion'] = $this->_request->getPost(
                'idplanificacion'
        );
        echo json_encode(
                array('codMsgG' => DatPlanificacionporfechaModel::adicionar_modif_planifporfecha(
                            $params
                    ))
        );
    }

    public function eliminarDesglosesAction() {
        $params['desgloses'] = json_decode(
                stripslashes($this->_request->getPost('desgloses'))
        );
        $params['idplanificacion'] = json_decode(
                stripslashes($this->_request->getPost('idplanificacion'))
        );
        echo json_encode(
                array('codMsgE' => DatPlanificacionporfechaModel::eliminarIndDesgloses(
                            $params
                    ))
        );
    }

    public function exportarAction() {
        ini_set("max_execution_time", 600); //10min de conexion
        $parametros['idmodelo'] = $this->_request->getParam('idmodelo');
        $parametros['limit'] = $this->_request->getParam('limit');
        $parametros['start'] = $this->_request->getParam('start');
        $parametros['filtros'] = $this->_request->getParam('filtros');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $identidad = $this->_request->getParam('identidad');
        $parametros['esHoja'] = $this->_request->getParam('esHoja');
        $parametros['glob'] = $this->_request->getParam('glob');

        if ($parametros['glob'] == 'false') {
            $parametros['entidades'] [] = $identidad;
            $parametros['consolidar'] = 0;
        } else {
            if ($parametros['glob'] == 'true') {
                $parametros['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
                $parametros['consolidar'] = 1;
            }
        }
        $modelContEjecPlan = new DatPlanificacionporfechaModel();
        $modelContEjecPlan->exportarIndAExcel($parametros);
    }

}
