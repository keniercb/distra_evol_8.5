<?php
class NomresultadoinspeccionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomresultadoinspeccionAction()
    {
        $this->render();
    }

    function getresultadoinspeccionAction()
    {
        $modeloNegocio = new NomResultadoinspeccionModel();
        $arr = $modeloNegocio->getResultadoinspeccion(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    public function addResultadoinspeccionAction()
    {
        $obj = new NomResultadoinspeccionModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->add(
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

    public function updateResultadoinspeccionAction()
    {
        $obj = new NomResultadoinspeccionModel();
        $r = $obj->update(
            $this->_getParam('idresultadoinspeccion'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    public function deleteResultadoinspeccionAction()
    {
        $clasif = json_decode(stripslashes($this->_request->getPost('resultadoinspeccion')));
        $respuesta = true;
        $obj = new NomResultadoinspeccionModel();
        foreach ($clasif as $p) {
            $r = $obj->delete($p);
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