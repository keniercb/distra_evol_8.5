<?php
class NomeventoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomeventoAction()
    {
        //$this->render();
    }

    function getEventosAction()
    {
        $objModel = new NomEventoModel();
        $arr = $objModel->getEventos(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    public function addEventoAction()
    {
        $objModel = new NomEventoModel();
        if (!$objModel->existeDenom($this->_getParam('denominacion'))) {
            $objModel->addEvento(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta')
            );
            $this->_enviarNotificacionCorrecta();
        } else {
            echo Zend_Json::encode(false);
        }            
    }

    public function updateEventoAction()
    {
        $obj = new NomEventoModel();
        $r = $obj->updateEvento(
            $this->_getParam('idevento'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    public function deleteEventoAction()
    {
        $eventos = json_decode(stripslashes($this->_request->getPost('eventos')));
        $respuesta = true;
        $obj = new NomEventoModel();
        foreach ($eventos as $p) {
            $r = $obj->deleteEvento($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
    private function _enviarNotificacionCorrecta()
    {
        echo "{success: 'true'}";
    }
}