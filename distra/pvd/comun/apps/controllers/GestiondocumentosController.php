<?php
class GestiondocumentosController extends ZendExt_Controller_Secure {

    private $documentosModel;

    function init() {
        $this->documentosModel = new GestiondocumentosModel();
        parent::init();
    }

    function gestiondocumentosAction() {

        $this->render();
    }

    function uploadDocumentAction() {

        if($_FILES['nombreFichero']['error'] != 1)
        {
            $tmpFile = $_FILES['nombreFichero']['tmp_name'];
            $fileName = $_FILES['nombreFichero']['name'];

            $idRootWorkSpace = $this->_request->getPost('idRootWorkSpace');
            $denomRootWorkSpace = $this->_request->getPost('denomRootWorkSpace');
            $documentSavePath = $this->_request->getPost('documentSavePath');
            $temporalDirectory = $this->_request->getPost('temporalDirectory');

            try{
                $resp = $this->documentosModel->uploadDocument($tmpFile, $fileName, $idRootWorkSpace, $denomRootWorkSpace, $documentSavePath, $temporalDirectory);

                $r['codigo'] = 1;//OK
                $r['iddocumento'] = $resp['iddocumento'];//identificador del documento en alfresco para poder descargarlo
                $r['nombredocumento'] = $resp['nombredocumento'];//nombre del documento
            }
            catch(Exception $e){
                $r['codigo'] = $e->getCode();
                $r['mensaje'] = $e->getMessage();
            }
        }
        else{
            $r['codigo'] = 5;//ocurrió un error al subir el documento(el dropzone no lee el documento)
            $r['mensaje'] = 'ocurrió un error al subir el documento(el dropzone no lee el documento)';
        }
        echo Zend_Json::encode($r);

    }

    function viewDocumentAction(){
//        $gestiondocumentosModel = new GestiondocumentosModel();
        try{
            $url = $this->documentosModel->viewDocument($this->_request->getPost('iddocumento'));
            $error = false;
            $msg = 'OK';
        }
        catch(Exception $e){
            $url = '';
            $error = true;
            $msg = $e->getMessage();
        }
        echo Zend_Json::encode(array('url' => $url, 'error' => $error, 'msg' => $msg));
    }

    function browseWorkSpaceAction(){
//        $gestiondocumentosModel = new GestiondocumentosModel();
        $docsOrFiles = $this->documentosModel->browseFolder('/'.$this->_request->getPost('folderpath'));
        echo Zend_Json::encode(array('documents' => $docsOrFiles, 'cantidad' => count($docsOrFiles)));
    }
	
	function deleteDocumentAction(){
        try{
            $arriddocumento = json_decode(stripslashes($this->_request->getPost('arriddocumento')));
            $elementtype = json_decode(stripslashes($this->_request->getPost('elementtype')));
            $result = $this->documentosModel->deleteDocument($arriddocumento, $elementtype);
            $error = false;
            $msg = 'OK';
        }
        catch(Exception $e){
            $result = '';
            $error = true;
            $msg = $e->getMessage();
        }
        echo Zend_Json::encode(array('result' => $result, 'error' => $error, 'msg' => $msg));
	}

    public function changeNameAction()
    {
        try{
            $newname = $this->_request->getPost('newname');
            $iddocumento = $this->_request->getPost('iddocumento');
            $result = $this->documentosModel->renameDocument($iddocumento, $newname);
            if ($result == true){
                $error = false;
                $msg = 'OK';
            }
            else{
                $error = true;
                $msg = 'Error al cambiar el nombre del documento.';
            }

        }
        catch(Exception $e){
            $result = '';
            $error = true;
            $msg = $e->getMessage();
        }
        echo Zend_Json::encode(array('result' => $result, 'error' => $error, 'msg' => $msg));
	}
}

?>
