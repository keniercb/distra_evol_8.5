<?php
/**
 * @name NommodoformacionController
 * @package   capacitacion.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NommodoformacionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nommodoformacionAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los modos de formacion
     * @return Arreglo con todos los modos de formacion
     * @author Eddy Santana Navarro
     */
    function getModosFormacionAction()
    {
        $modeloNegocio = new NomModoformacionModel();
        $arr = $modeloNegocio->getModos(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar modo de formacion
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addModoFormacionAction()
    {
        $obj = new NomModoformacionModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addModo(
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
     * Modificar modo de formacion
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateModoFormacionAction()
    {
        $obj = new NomModoformacionModel();
        $r = $obj->updateModo(
            $this->_getParam('idmodoformacion'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar modo de formacion
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteModoFormacionAction()
    {
        $modos = json_decode(stripslashes($this->_request->getPost('modos')));
        $respuesta = true;
        $obj = new NomModoformacionModel();
        foreach ($modos as $p) {
            $r = $obj->deleteModo($p);
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