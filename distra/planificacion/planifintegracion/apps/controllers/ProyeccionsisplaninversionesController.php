<?php

require_once __DIR__ . '/../../planmeta/controllers/ProyeccionController.php';

class ProyeccionsisplaninversionesController extends ProyeccionController {

    public function init() {
        parent::init();
    }

    //Listar modelos para adicionar una proyeccion
    public function listarComboModelosAction() {
        $componente = $this->_request->getPost('componente');
        $idejercicio = $this->_request->getPost('idejercicio');

        $model = new ProyeccionModel();
        $ent = $model->buscarEntidades($this->_request->getPost('identidad'));
        $identidades = implode(",", $ent);

        $objPlanModel = new DatPlanModel();
        if ($componente == 2 || $componente == 3) {
            $data = $objPlanModel->obtenerPlanesEntidadesPP($identidades, $idejercicio);
        } else {
            $data = DatPlansisplaninversionesModel::obtenerPlanesEntidadesPPN($identidades, $idejercicio);
        }
        echo json_encode(array('data' => $data));
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

        $ent = $model->buscarEntidades($params['identidad']);

        $params['identidades'] = implode(",", $ent);

        $resp = ProyeccionsisplaninversionesModel::adicionarProyeccion($params);

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
        $model = new ProyeccionsisplaninversionesModel();
        $model->exportarAExcel($params);
    }

}
