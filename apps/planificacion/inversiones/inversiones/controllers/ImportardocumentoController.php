<?php

/**
 * ImportarController
 * Controlador para gestionar las importaciones al sistema.
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificación
 * @ subpackage Planificación
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class ImportardocumentoController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar los atributos de la clase
     *
     * @return void
     */
    function init() {
        parent::init();
    }

    function importardocumentoAction() {
        $this->render();
    }

    public function cargaInicialAction() {
        //servicio para obtener el id de la entidad que esta logueada
        $identidad = $this->global->Estructura->idestructura;
        $denoEntidad = $this->global->Estructura->denominacion;
        echo json_encode(array('identidad' => $identidad, 'denoEntidad' => $denoEntidad));
    }

    function subirdocumentoAction() {
        $params['file_name'] = ($this->_request->getPost('file_name')) ? $this->_request->getPost('file_name') : null;
        $params['idtipomaterial'] = ($this->_request->getPost('idtipomaterial')) ? $this->_request->getPost(
                        'idtipomaterial'
                ) : null;
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $result = DatImportardocumentoModel::subirDocumento($_FILES, $params);
        echo json_encode($result);
    }

    public function listardocumentosAction() {
        $parametros = Array();

        $parametros['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;


        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $key => $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'tipomaterial') {
                    $parametros ['filtros']['tipomaterial'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'cargo') {
                    $parametros ['filtros']['cargo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'fecha') {
                    $parametros ['filtros']['fecha'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'hora') {
                    $parametros ['filtros']['hora'] = $datos ['data'] ['value'];
                }
            }
        }
        $model = new DatImportardocumentoModel();

        $result = $model->listarDatos($parametros);
        echo json_encode(array('data' => $result[0], 'total' => $result[1]));
    }

    public function eliminardocumentoAction() {
        $idtempelements = $this->_request->getPost('file_name');
        $obj = new DatImportardocumentoModel();
        $result = $obj->eliminarDocumento($idtempelements);
        if ($result == 1) {
            echo json_encode(array('cod' => 1));
        } else {
            echo json_encode(array('cod' => 3));
        }
    }

    public function abrirdocumentoAction($req, $res) {
        $iddocumento = $this->_request->getParam('iddocumento');
        $documento = DatCargadocumento::obtenerDocumentoDadoId($iddocumento);
        $dir = $_SERVER['DOCUMENT_ROOT'] . '/../apps/planificacion/planmeta/models/bussines/importarxls';
        $file_name = $dir . '/' . $documento->denominacion;
        $content = file_get_contents($file_name);
        $this->_response->setHeader('Content-Type', 'application/download');
        $fsize = filesize($file_name);
        $this->_response->setHeader("Content-Length", $fsize);
        $this->_response->setHeader('Content-Disposition', ' attachment; filename="' . $documento->denominacion . '"');
        $this->_response->setBody($content);
        readfile($file_name);
        $this->view->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
    }

    public function listartipomaterialAction() {
        $result = NomTipomaterial::listarTodos();
        echo json_encode(array('data' => $result));
    }

}

//fin de la clase GesttipomodeloController