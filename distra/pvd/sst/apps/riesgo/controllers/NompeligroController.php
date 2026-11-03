<?php
/**
 * @name NompeligroController
 * @package   riesgo.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NompeligroController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nompeligroAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los peligros
     * @return Arreglo con todos de los peligros
     * @author Eddy Santana Navarro
     */
    function getPeligroAction()
    {
        $modeloNegocio = new NomPeligroModel();
        $arr = $modeloNegocio->getPeligros(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar peligro
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addPeligroAction()
    {
        $obj = new NomPeligroModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addPeligro(
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

    /**
     * Modificar peligro
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updatePeligroAction()
    {
        $obj = new NomPeligroModel();
        $r = $obj->updatePeligro(
            $this->_getParam('idpeligro'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar peligro
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deletePeligroAction()
    {
        $peligros = json_decode(stripslashes($this->_request->getPost('peligros')));
        $respuesta = true;
        $obj = new NomPeligroModel();
        foreach ($peligros as $p) {
            $r = $obj->deletePeligro($p);
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