<?php
/**
 * @name NomnecesidaddecapacitacionController
 * @package   capacitacion.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomnecesidaddecapacitacionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomnecesidaddecapacitacionAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de las necesidades de capacitacion
     * @return Arreglo con todas las necesidades de capacitacion
     * @author Eddy Santana Navarro
     */
    function getNecesidadesDeCapacitacionAction()
    {
        $modeloNegocio = new NomNecesidaddecapacitacionModel();
        $arr = $modeloNegocio->getNecesidades(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar necesidad de capacitacion
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addNecesidadDeCapacitacionAction()
    {
        $obj = new NomNecesidaddecapacitacionModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'), $this->global->Estructura->idestructura)) {
            $obj->addNecesidad(
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
     * Modificar necesidad de capacitacion
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateNecesidadDeCapacitacionAction()
    {
        $obj = new NomNecesidaddecapacitacionModel();
        $r = $obj->updateNecesidad(
            $this->_getParam('idnecesidad'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar necesidad de capacitacion
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteNecesidadDeCapacitacionAction()
    {
        $necesidades = json_decode(stripslashes($this->_request->getPost('necesidades')));
        $respuesta = true;
        $obj = new NomNecesidaddecapacitacionModel();
        foreach ($necesidades as $p) {
            $r = $obj->deleteNecesidad($p);
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