<?php

class ProyeccionController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar el componente
     * */
    public function init() {
        parent::init();
    }

    public function proyeccionAction() {
        // $this->view->jsayuda = $jsayuda;
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    //Listar grid de proyecciones
    public function listarProyeccionAction() {
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['filtros'] = $this->_request->getPost('filtros');
        $model = new ProyeccionModel();
        echo json_encode($model->listarProyeccion($params));
    }

    //Listar grid de proyecciones x ejercicio
    public function listarProyeccionporejercicioAction() {
        $params['idproyeccion'] = $this->_request->getPost('idproyeccion');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $model = new ProyeccionModel();
        echo json_encode($model->listarProyeccionporejercicio($params));
    }

    //Adicionar o modificar una proyeccion
    public function adicionarProyeccionAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['componente'] = $this->_request->getPost('componente');
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['descripcion'] = $this->_request->getPost('descripcion');
        $params['planes'] = $this->_request->getPost('planes');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['tipo'] = $this->_request->getPost('tipo');
        $params['porciento'] = $this->_request->getPost('porciento');
        $params['idproyeccion'] = $this->_request->getPost('idproyeccion');
        $params['fecha'] = date('d/m/Y');

        $model = new ProyeccionModel();
        $ent = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        $params['identidades'] = implode(",", $ent);

        $resp = $model->adicionarProyeccion($params);

        if ($resp == 2) {
            if ($params['idproyeccion']) {
                echo json_encode(array('codMsgP' => 2, 'mensaje' => 'mod'));
            } else {
                echo json_encode(array('codMsgP' => 2, 'mensaje' => 'add'));
            }
        } else {
            if ($params['idproyeccion']) {
                echo json_encode(array('codMsgP' => 1, 'mensaje' => 'mod'));
            } else {
                echo json_encode(array('codMsgP' => 1, 'mensaje' => 'add'));
            }
        }
    }

    //Adicionar o modificar una proyeccion por ejercicio
    public function adicionarProyeccionxejercicioAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['porciento'] = $this->_request->getPost('porciento');
        $params['idproyeccionxejercicio'] = $this->_request->getPost('idproyeccionxejercicio');
        $params['idproyeccion'] = $this->_request->getPost('idproyeccion');
        $params['tipo'] = $this->_request->getPost('tipo');
        $params['importegasto'] = $this->_request->getPost('importegasto');
        $params['importeingreso'] = $this->_request->getPost('importeingreso');

        $model = new ProyeccionModel();
        $resp = $model->adicionarProyeccionporejercicio($params);

        if ($resp == 2) {
            if ($params['idproyeccionxejercicio']) {
                echo json_encode(array('codMsgP' => 2, 'mensaje' => 'mod'));
            } else {
                echo json_encode(array('codMsgP' => 2, 'mensaje' => 'add'));
            }
        } else {
            if ($resp == 1) {
                if ($params['idproyeccionxejercicio']) {
                    echo json_encode(array('codMsgP' => 1, 'mensaje' => 'mod'));
                } else {
                    echo json_encode(array('codMsgP' => 1, 'mensaje' => 'add'));
                }
            } else {
                if ($params['idproyeccionxejercicio']) {
                    echo json_encode(array('codMsgP' => 3, 'mensaje' => 'mod'));
                } else {
                    echo json_encode(array('codMsgP' => 3, 'mensaje' => 'add'));
                }
            }
        }
    }

    //Eliminar proyecciones
    public function eliminarProyeccionAction() {
        $idproyecciones = $this->_request->getPost('idproyeccion');
        $model = new ProyeccionModel();
        $resp = $model->eliminarProyeccion($idproyecciones);
        echo json_encode(array('codMsgP' => 1));
    }

    //Eliminar proyecciones por ejercicio
    public function eliminarProyeccionxejercicioAction() {
        $idproyeccionporejercicio = $this->_request->getPost('idproyeccionporejercicio');
        $model = new ProyeccionModel();
        $resp = $model->eliminarProyeccionxejercicio($idproyeccionporejercicio);
        echo json_encode(array('codMsgP' => 1));
    }

    //Eliminar proyecciones por ejercicio todos
    public function eliminarProyeccionxejercicioTodosAction() {
        $idproyeccion = $this->_request->getPost('idproyeccion');
        $model = new ProyeccionModel();
        $resp = $model->eliminarProyeccionxejercicioTodos($idproyeccion);
        echo json_encode(array('codMsgP' => 1));
    }

    //Exportar
    public function exportarAction() {
        ini_set("max_execution_time", 600); //10 min de conexion
        $params = array();
        $params['tipo'] = $this->_request->getParam('tipo');
        $params['idproyeccion'] = $this->_request->getParam('idproyeccion');
        $params['componente'] = $this->_request->getParam('componente');

        if ($params['componente'] == 1)
            $params['comp'] = "Niveles de actividad";
        if ($params['componente'] == 2)
            $params['comp'] = "Plan";
        if ($params['componente'] == 3)
            $params['comp'] = "Balance material";

        $params['tipoProy'] = $this->_request->getParam('tipoProy');
        if ($params['tipoProy'] == 1)
            $params['tipoProy'] = "Lineal";
        if ($params['tipoProy'] == 0)
            $params['tipoProy'] = "Progresiva";

        $params['planes'] = $this->_request->getParam('planes');
        $params['entidad'] = $this->_request->getParam('entidad');
        $params['ejerciciobase'] = $this->_request->getParam('ejerciciobase');
        $params['idejerciciobase'] = $this->_request->getParam('idejerciciobase');
        $params['importegasto'] = $this->_request->getParam('importegasto');
        $params['importeingreso'] = $this->_request->getParam('importeingreso');
        $params['porciento'] = $this->_request->getParam('porciento');
        $params['identidad'] = $params['entidad'];
        $params['entidad'] = $this->integrator->metadatos->DameEstructura($params['entidad']);
        $params['entidad'] = $params['entidad'][0]->denominacion;
        $model = new ProyeccionModel();
        $model->exportarAExcel($params);
    }

    /*     * **********Metodos auxiliares***************** */

    //Obtener ids dadas denominaciones de planes
    public function obtenerIdsAction() {
        $denominaciones = $this->_request->getPost('denominaciones');
        $arrdenominaciones = explode(",", $denominaciones);
        $model = new ProyeccionModel();
        $resp = $model->obtenerIds($arrdenominaciones);
        echo json_encode($resp);
    }

    //Listar ejercicios para filtros de los grids
    public function listarEjerciciosAction() {
        $model = new ProyeccionModel();
        $data->data = $model->listarEjercicios();
        echo json_encode($data);
    }

    //Listar planes para filtros del grid de proyecciones
    public function listarPlanesAction() {
        $model = new ProyeccionModel();
        $data->data = $model->listarPlanes();
        echo json_encode($data);
    }

    //Listar modelos para adicionar una proyeccion
    public function listarComboModelosAction() {
        $componente = $this->_request->getPost('componente');
        $idejercicio = $this->_request->getPost('idejercicio');

        $model = new ProyeccionModel();
        $ent = DatActividadentidad::auxObtenerEntidadesHijasComun($this->_request->getPost('identidad'));
        $identidades = implode(",", $ent);

        $objPlanModel = new DatPlanModel();
        if ($componente == 2 || $componente == 3) {
            $data = $objPlanModel->obtenerPlanesEntidadesPP($identidades, $idejercicio);
        } else {
            $data = $objPlanModel->obtenerPlanesEntidadesPPN($identidades, $idejercicio);
        }
        echo json_encode(array('data' => $data));
    }

}
