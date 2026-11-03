<?php
/**
 * @name NomsistemaController
 * @package   sistema.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomsistemaController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomsistemaAction()
    {
        //$this->render();
    }

    function getSistemaAction()
    {
        $modeloNegocio = new NomSistemaModel();
        $arr = $modeloNegocio->getSistemas(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    public function addSistemaAction()
    {
        $obj = new NomSistemaModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addSistema(
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

    public function updateSistemaAction()
    {
        $obj = new NomSistemaModel();
        $r = $obj->updateSistema(
            $this->_getParam('idsistema'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    public function deleteSistemaAction()
    {
        $sistemas = json_decode(stripslashes($this->_request->getPost('sistemas')));
        $respuesta = true;
        $obj = new NomSistemaModel();
        foreach ($sistemas as $p) {
            $r = $obj->deleteSistema($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }


    function getParteSistemaAction()
    {
        $modeloNegocio = new NomParteSistemaModel();
        $arr = $modeloNegocio->getPartesistemas(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit'), $this->_getParam('idsistema')
        );
        echo Zend_Json::encode($arr);
    }

    public function addParteSistemaAction()
    {
        $obj = new NomParteSistemaModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addParteSistema(
                $this->_getParam('idsistema'), $this->_getParam('denominacion'), $this->_getParam('descripcion')
                , $this->_getParam('fdesde'), $this->_getParam('fhasta')
            );
            $this->_enviarNotificacionCorrecta();
        } else {
            echo Zend_Json::encode(false);
        }
    }

    public function updateParteSistemaAction()
    {
        $obj = new NomParteSistemaModel();
        $r = $obj->updateParteSistema(
            $this->_getParam('idpartesistema'), $this->_getParam('denominacion'), $this->_getParam('descripcion'),
            $this->_getParam('fdesde'), $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    public function deleteParteSistemaAction()
    {
        $sistemas = json_decode(stripslashes($this->_request->getPost('partessistema')));
        $respuesta = true;
        $obj = new NomParteSistemaModel();
        foreach ($sistemas as $p) {
            $r = $obj->deleteParteSistema($p);
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