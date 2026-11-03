<?php

require_once __DIR__ . '/../../../../lib/Adapters/PHPExcel/1.8.0/PHPExcel.php';

class NomencladorController extends ZendExt_Controller_Secure {

    function init() {
        $this->model = new NomencladorModel();
        parent::init();
    }

    public function nomencladorAction() {
        $this->render();
    }

    public function listarNomencladorAction() {
        try {
            $node = $this->_request->getPost('node');
            $criteriobusqueda = $this->_request->getPost('criteriobusqueda');
            echo json_encode($this->model->listarNomenclador($node, $criteriobusqueda));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarGridNomencladorAction() {
        try {
            $node = $this->_request->getPost('node');
            $filtros = $this->_request->getPost('filtros');
            echo json_encode($this->model->listarGridNomenclador($node, $filtros));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function exportarGridNomencladorAction() {
        $params['node'] = $this->_request->getParam('node');
        $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        $params['text'] = $this->_request->getParam('text');
        NomencladorModel::exportarGridNomenclador($params);
    }

    public function addModNomencladorAction() {
        try {
            $params['accion'] = $this->_request->getPost('accion');
            $params['idpadre'] = $this->_request->getPost('idpadre');
            $params['denominacion'] = $this->_request->getPost('denominacion');
            $params['descripcion'] = $this->_request->getPost('descripcion');
            $params['valordefecto'] = $this->_request->getPost('valordefecto');
            $params['idnomenclador'] = $this->_request->getPost('idnomenclador');
            $result->codMsgN = $this->model->addModNomenclador($params);
            echo json_encode($result);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    public function eliminarNomencladorAction() {
        $params['idnomenclador'] = $this->_request->getPost('idnomenclador');
        $params['idpadre'] = $this->_request->getPost('idpadre');
        $result->codMsgN = $this->model->eliminarNomenclador($params);
        echo json_encode($result);
    }

    public function definirValorDefectoAction() {
        try {
            $params['idpadre'] = $this->_request->getPost('idpadre');
            $params['idnomenclador'] = $this->_request->getPost('idnomenclador');
            $result->codMsgN = $this->model->definirValorDefecto($params);
            echo json_encode($result);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    public function activarDesactivarAction() {
        try {
            $params['idnomenclador'] = $this->_request->getPost('idnomenclador');
            $params['activacion'] = $this->_request->getPost('activacion');
            $result->codMsgN = $this->model->activarDesactivar($params);
            echo json_encode($result);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    public function actualizarOrdenAction() {
        try {
            $params['nomenclador'] = json_decode(stripslashes($this->_request->getPost('nomenclador')));
            $actualizados = 0;
            if ($params['nomenclador'][0]->nomenclador->idnomenclador != null) {
                $actualizados = $this->model->actualizarOrden($params);
            }
            echo json_encode(array('codMsgN' => $actualizados));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function ordenAlfabeticoAction() {
        try {
            $params['idpadre'] = $this->_request->getPost('idpadre');
            $result->codMsgN = $this->model->ordenAlfabetico($params['idpadre']);
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode($exc->getMessage());
        }
    }

    public function moverRamaAction() {
        try {
            $params['idnodo'] = $this->_request->getPost('idnodo');
            $params['idviejopadre'] = $this->_request->getPost('idviejopadre');
            $params['idnuevopadre'] = $this->_request->getPost('idnuevopadre');
            $params['idnuevopadre'] = (($params['idnuevopadre'] == 0) ? $params['idnodo'] : $params['idnuevopadre']);
            $result->codMsgN = $this->model->moverRama($params);
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode($exc->getMessage());
        }
    }

    public function importarFicheroNomencladorAction() {
        try {
            ini_set("max_execution_time", 60000);
            //leyendo el excel
            $filename = $_FILES['file']['tmp_name'];
            $file = $filename;
            include 'PHPExcel/IOFactory.php';
            $inputFileType = 'Excel5';
            /**  Create a new Reader of the type defined in $inputFileType  * */
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            /**  Advise the Reader that we only want to load cell data  * */
            $objReader->setReadDataOnly(true);
            /**  Load $inputFileName to a PHPExcel Object  * */
            $objPHPExcel = $objReader->load($file);
            $sheetData = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
            $params['data'] = $sheetData;
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $result = NomencladorModel::importarFicheroNomenclador($params);
            echo json_encode(array('columnas' => $result->columnas, 'columnasExcel' => $result->columnasExcel));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function importarDatosRelacionadosNomencladorAction() {
        try {
            $params['relaciones'] = json_decode(stripslashes($this->_request->getPost('relaciones')));
            $params['node'] = $this->_request->getPost('node');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $result = NomencladorModel::importarDatosRelacionadosNomenclador($params);
            echo json_encode(array('campos' => 1, 'result' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarDatosValidadosNomencladorAction() {
        try {
            $idusuario = $this->global->Perfil->idusuario;
            $start = ($this->_request->getPost('start') != null) ? $this->_request->getParam('start') : 0;
            $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getParam('limit') : 20;
            $filtros = $this->_request->getPost('filtros');
            $data = NomencladorModel::listarDatosValidados($idusuario, $start, $limit, $filtros);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function insertarDatosImportarNomencladorAction() {
        try {
            ini_set("max_execution_time", 60000);
            $idusuario = $this->global->Perfil->idusuario;
            $node = $this->_request->getPost('node');
            $data = NomencladorModel::insertarDatosImportar($idusuario, $node);
            echo json_encode(array('codMsgN' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

}
