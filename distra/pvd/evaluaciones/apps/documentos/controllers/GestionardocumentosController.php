<?php

/**TEXT
 * Class GestionardocumentosController
 */
class GestionardocumentosController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
        $this->objModel = new GestionardocumentosModel();
    }

    public function gestionardocumentosAction(){

          $this->render();
    }
    
    function cargarDocumentosAction()
    {   
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idpersona = $this->_request->getPost('idPersona');
        $valor = $this->_request->getPost('valor');

        $documentos = $this->objModel->getDocumentos($idpersona,$valor, $start, $limit);
        $cantDocumentos = $this->objModel->getCantDocumentos($idpersona,$valor);

        $array = array('data' => $documentos, 'quantity' => $cantDocumentos);
        echo json_encode($array);
    }
    
    function adicionarDocumentoAction()
    {
        $tipoDoc = $this->_request->getPost('tipoDoc');
        $fechaCreacion = $this->_request->getPost('fechaCreacion');
        $idpersona = $this->_request->getPost('idpersona');
        $valor = $this->_request->getPost('valor');
        $arreglo = json_decode($this->_request->getPost('arreglo'));
        
        $arrayCalifDetalles = array();
        foreach ($arreglo as $key => $v) {
            $arrayCalifDetalles[$key]['idscalificadores'] = $arreglo[$key]->iddetallesxcalif;
            $arrayCalifDetalles[$key]['detalles'] = $arreglo[$key]->detalles;
        }
        
        $r = $this->objModel->adicionarDocumento($tipoDoc, $fechaCreacion, $idpersona, $arrayCalifDetalles,$valor);
        echo(json_encode($r));
    }
    
    function modificarDocumentoAction()
    {
        $tipoDoc = $this->_request->getPost('tipoDoc');
        $fechaCreacion = $this->_request->getPost('fechaCreacion');
        $idpersona = $this->_request->getPost('idpersona');
        $valor = $this->_request->getPost('valor');
        $arreglo = json_decode($this->_request->getPost('arreglo'));
        $iddocpersona = json_decode($this->_request->getPost('idDocPers'));
        
        $arrayCalifDetalles = array();
        foreach ($arreglo as $key => $v) {
            $arrayCalifDetalles[$key]['idscalificadores'] = $arreglo[$key]->iddetallesxcalif;
            $arrayCalifDetalles[$key]['detalles'] = $arreglo[$key]->detalles;
        }
        
        $r = $this->objModel->modificarDocumento($tipoDoc, $fechaCreacion, $idpersona, $arrayCalifDetalles, $iddocpersona, $valor);
        echo(json_encode($r));
    }
    
    function eliminarDocumentoAction()
    {
        $idDocumento = $this->_request->getPost('idDocumento');
        $r = $this->objModel->eliminarDocumento($idDocumento);
        echo(json_encode($r));
    }
    
    function cargarComboTipoDocAction()
    {
        $result = $this->objModel->getTipoDocumento();
        if (is_array($result)) {
            $resultUno = array('cant' => count($result), 'datos' => $result);
            echo(json_encode($resultUno));
        }
    }
    
    function cargarComboCalificadoresAction()
    {
        $result = $this->objModel->getCalificadores();
        if (is_array($result)) {
            $resultUno = array('cant' => count($result), 'datos' => $result);
            echo(json_encode($resultUno));
        }
    }
    
    function obtenerDatosDocumentoAction()
    {
        $documento = new stdClass();
        $iddocpersona = $this->_request->getPost('iddocpersona');
        $documento->datos = $this->objModel->obtenerDatosDocumento($iddocpersona);
        echo(json_encode($documento));
    }
    
    function asociarDocumentoAction()
    {
        $iddocpersona = $this->_request->getPost('iddocpersona');
        $idgestdoc = $this->_request->getPost('idgestdoc');
        $r = $this->objModel->asociarDocumento($iddocpersona, $idgestdoc);
        echo(json_encode($r));
    }
    
    function verDocumentoAction()
    {
        $iddocumentogestordocumental = $this->_request->getPost('iddocumentogestordocumental');
        $r = $this->integrator->gestordocumental->abrirdocumento($iddocumentogestordocumental);
        echo(json_encode($r));
    }
    
   /* function cargarEspacioTrabajoAction()
    {
        $direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
            "pvd/comun/models/bussines/ConfiguracionCH.php";
        include($direccionComun);
        $objConfig = new ConfiguracionCH();
        $idWorkspace = $objConfig->getEspacioTrabajoEvaluaciones();
        $r->success = true;
        $r->workspace = $idWorkspace;        
        echo(json_encode($r));
    }*/
    function cargarEspacioTrabajoAction()
    {
        $idpersona      = $this->_request->getPost('id');
        $persona        = $this->integrator->pvd->getPrincipalesDatosPersona($idpersona);
        $nombre         = $persona->data[0]['nombreapellidos'];
        $direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
            "pvd/comun/models/bussines/ConfiguracionCH.php";
        include($direccionComun);
        $objConfig   = new ConfiguracionCH();
        $idWorkspace = $objConfig->getEspacioTrabajoEvaluaciones();

        $objEsp      = new DatEspacioporpersona();

        $idespacio   = $objEsp->verificarDatos($idpersona);

        if (count($idespacio) > 0) {
            $espacio = $idespacio[0]['espacio'];
        } else {
            $result  = $this->integrator->gestordocumental->adicionarEspacioTrabajo(
                $idWorkspace, $idpersona . "_" . $nombre, 'Espacio de trabajo de la persona ' . $nombre
            );

            $espacio = $result['identificadorNodoPadre'];
            $objEsp->insertarDatos($idpersona, $espacio);
        }
        $r->success   = true;
        $r->workspace = $espacio;
        echo(json_encode($r));
    }
}
