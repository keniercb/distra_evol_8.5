<?php
/**
 * @name NompartecuerpoController
 * @package   accidente.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NompartecuerpoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nompartecuerpoAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de las partes del cuerpo
     * @return Arreglo con todas las partes del cuerpo
     * @author Eddy Santana Navarro
     */
    function getParteCuerpoAction()
    {
        $modeloNegocio = new NomPartecuerpoModel();
        $arr = $modeloNegocio->getPartes(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar parte del cuerpo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addParteCuerpoAction()
    {
        $obj = new NomPartecuerpoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addParte(
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
     * Modificar parte del cuerpo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateParteCuerpoAction()
    {
        $obj = new NomPartecuerpoModel();
        $r = $obj->updateParte(
            $this->_getParam('idpartecuerpo'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar parte del cuerpo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteParteCuerpoAction()
    {
        $partes = json_decode(stripslashes($this->_request->getPost('partes')));
        $respuesta = true;
        $obj = new NomPartecuerpoModel();
        foreach ($partes as $p) {
            $r = $obj->deleteParte($p);
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