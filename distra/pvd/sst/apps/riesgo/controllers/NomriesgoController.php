<?php
/**
 * @name NomriesgoController
 * @package   riesgo.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomriesgoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomriesgoAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los riesgos
     * @return Arreglo con todos los riesgos
     * @author Eddy Santana Navarro
     */
    function getRiesgoAction()
    {
        $modeloNegocio = new NomRiesgoModel();
        $arr = $modeloNegocio->getRiesgos(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar riesgo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addRiesgoAction()
    {
        $obj = new NomRiesgoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addRiesgo(
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
     * Modificar riesgo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateRiesgoAction()
    {
        $obj = new NomRiesgoModel();
        $r = $obj->updateRiesgo(
            $this->_getParam('idnriesgo'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar riesgo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteRiesgoAction()
    {
        $riesgos = json_decode(stripslashes($this->_request->getPost('riesgos')));
        $respuesta = true;
        $obj = new NomRiesgoModel();
        foreach ($riesgos as $p) {
            $r = $obj->deleteRiesgo($p);
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