<?php
/**
 * @name NomaseguramientoController
 * @package   capacitacion.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomaseguramientoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomaseguramientoAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los aseguramientos
     * @return Arreglo con todas los aseguramientos
     * @author Yaricel Guerra Velazquez
     */
    function getAseguramientosAction()
    {
        $modeloNegocio = new NomAseguramientoModel();
        $arr = $modeloNegocio->getAseguramientos(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar aseguramientos
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addAseguramientoAction()
    {
        $obj = new NomAseguramientoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addAseguramiento(
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
     * Modificar aseguramientos
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function updateAseguramientoAction()
    {
        $obj = new NomAseguramientoModel();
        $r = $obj->updateAseguramiento(
            $this->_getParam('idaseguramiento'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar aseguramientos
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function deleteAseguramientoAction()
    {
        $aseguramientos = json_decode(stripslashes($this->_request->getPost('aseguramientos')));
        $respuesta = true;
        $obj = new NomAseguramientoModel();
        foreach ($aseguramientos as $p) {
            $r = $obj->deleteAseguramiento($p);
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