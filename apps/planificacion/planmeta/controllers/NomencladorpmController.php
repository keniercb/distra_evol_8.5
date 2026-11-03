<?php

require_once __DIR__ . '/../../../../lib/Adapters/PHPExcel/1.8.0/PHPExcel.php';

class NomencladorpmController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function nomencladorpmAction() {
        $this->render();
    }

    public function listarTiponomencladorAction() {
        try {
            $params['permisoConfigSistema'] = $this->_request->getPost('permisoConfigSistema');
            $params['criteriobusqueda'] = $this->_request->getPost('criteriobusqueda');
            $data = NomTiponomencladorModel::listarTiponomenclador($params);
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function addModTiponomencladorAction() {
        try {
            $params['accion'] = $this->_request->getPost('accion');
            $params['idtiponomenclador'] = $this->_request->getPost('idtiponomenclador');
            $params['denominacion'] = $this->_request->getPost('denominacion');
            $params['descripcion'] = $this->_request->getPost('descripcion');
            $result->codMsgN = NomTiponomencladorModel::addModTiponomenclador($params);
            echo json_encode($result);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    public function eliminarTiponomencladorAction() {
        try {
            $params['idtiponomenclador'] = $this->_request->getPost('idtiponomenclador');
            $result->codMsgN = NomTiponomencladorModel::eliminarTiponomenclador($params);
            echo json_encode($result);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    public function listarDatonomencladorAction() {
        try {
            $params['idtiponomenclador'] = $this->_request->getPost('idtiponomenclador');
            $params['filtros'] = $this->_request->getPost('filtros');
            $data = NomDatosnomencladorModel::listarDatonomenclador($params);
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function exportarDatoNomencladorAction() {
        $params['idtiponomenclador'] = $this->_request->getParam('idtiponomenclador');
        $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        $params['denomTiponomenclador'] = $this->_request->getParam('denomTiponomenclador');
        NomDatosnomencladorModel::exportarDatoNomenclador($params);
    }

    public function addModDatonomencladorAction() {
        try {
            $params['accion'] = $this->_request->getPost('accion');
            $params['idtiponomenclador'] = $this->_request->getPost('idtiponomenclador');
            $params['denominacion'] = $this->_request->getPost('denominacion');
            $params['descripcion'] = $this->_request->getPost('descripcion');
            $params['valordefecto'] = $this->_request->getPost('valordefecto');
            $params['iddatosnomenclador'] = $this->_request->getPost('iddatosnomenclador');
            $result->codMsgN = NomDatosnomencladorModel::addModDatonomenclador($params);
            echo json_encode($result);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    public function eliminarDatonomencladorAction() {
        $params['iddatosnomenclador'] = $this->_request->getPost('iddatosnomenclador');
        $params['idtiponomenclador'] = $this->_request->getPost('idtiponomenclador');
        $result->codMsgN = NomDatosnomencladorModel::eliminarDatonomenclador($params);
        echo json_encode($result);
    }

    public function definirValorDefectoAction() {
        try {
            $params['idtiponomenclador'] = $this->_request->getPost('idtiponomenclador');
            $params['iddatosnomenclador'] = $this->_request->getPost('iddatosnomenclador');
            $result->codMsgN = NomDatosnomencladorModel::definirValorDefecto($params);
            echo json_encode($result);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    public function activarDesactivarAction() {
        try {
            $params['iddatosnomenclador'] = $this->_request->getPost('iddatosnomenclador');
            $params['activacion'] = $this->_request->getPost('activacion');
            $result->codMsgN = NomDatosnomencladorModel::activarDesactivar($params);
            echo json_encode($result);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    public function actualizarOrdenAction() {
        try {
            $params['datonomenclador'] = json_decode(stripslashes($this->_request->getPost('datonomenclador')));
            $actualizados = 0;
            if ($params['datonomenclador'][0]->datonomenclador->iddatosnomenclador != null) {
                $actualizados = NomDatosnomencladorModel::actualizarOrden($params);
            }
            echo json_encode(array('codMsgN' => $actualizados));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function ordenAlfabeticoAction() {
        try {
            $params['idtiponomenclador'] = $this->_request->getPost('idtiponomenclador');
            $result->codMsgN = NomDatosnomencladorModel::ordenAlfabetico($params['idtiponomenclador']);
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode($exc->getMessage());
        }
    }

    public function importarFicheroDatonomencladorAction() {
        try {
            ini_set("max_execution_time", 60000);
            //leyendo el excel
            $filename = $_FILES['file']['tmp_name'];
            $file = $filename;
            include 'PHPExcel/IOFactory.php';
            //$inputFileType = 'Excel5';
            $inputFileType = PHPExcel_IOFactory::identify($file);
            
            /**  Create a new Reader of the type defined in $inputFileType  * */
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            /**  Advise the Reader that we only want to load cell data  * */
            $objReader->setReadDataOnly(true);
            /**  Load $inputFileName to a PHPExcel Object  * */
            $objPHPExcel = $objReader->load($file);
            $sheetData = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
            $params['data'] = $sheetData;
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $result = NomDatosnomencladorModel::importarFicheroDatonomenclador($params);
            echo json_encode(array('columnas' => $result->columnas, 'columnasExcel' => $result->columnasExcel));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function importarDatosRelacionadosDatonomencladorAction() {
        try {
            $params['relaciones'] = json_decode(stripslashes($this->_request->getPost('relaciones')));
            $params['idtiponomenclador'] = $this->_request->getPost('idtiponomenclador');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $result = NomDatosnomencladorModel::importarDatosRelacionadosDatonomenclador($params);
            echo json_encode(array('campos' => 1, 'result' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarDatosValidadosDatonomencladorAction() {
        try {
            $idusuario = $this->global->Perfil->idusuario;
            $start = ($this->_request->getPost('start') != null) ? $this->_request->getParam('start') : 0;
            $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getParam('limit') : 20;
            $filtros = $this->_request->getPost('filtros');
            $data = NomDatosnomencladorModel::listarDatosValidados($idusuario, $start, $limit, $filtros);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function insertarDatosImportarDatonomencladorAction() {
        try {
            ini_set("max_execution_time", 60000);
            $idusuario = $this->global->Perfil->idusuario;
            $idtiponomenclador = $this->_request->getPost('idtiponomenclador');
            $data = NomDatosnomencladorModel::insertarDatosImportar($idusuario, $idtiponomenclador);
            echo json_encode(array('codMsgN' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

}
