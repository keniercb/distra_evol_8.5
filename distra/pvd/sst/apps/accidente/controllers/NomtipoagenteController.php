<?php
/**
 * @name NomtipoagenteController
 * @package   accidente.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomtipoagenteController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomtipoagenteAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de tipos de agente
     * @return Arreglo con todos los tipos de agente
     * @author Eddy Santana Navarro
     */
    function getTiposAgenteAction()
    {
        $modeloNegocio = new NomTipoagenteModel();
        $arr = $modeloNegocio->getTiposAgente(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar tipo de agente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addTipoAgenteAction()
    {
        $obj = new NomTipoagenteModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addTipoAgente(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta')
            );
            $this->_enviarNotificacionCorrecta();
        } else
            echo Zend_Json::encode(false);
    }

    /**
     * Modificar tipo de agente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateTipoAgenteAction()
    {
        $obj = new NomTipoagenteModel();
        $r = $obj->updateTipoAgente(
            $this->_getParam('idtipoagente'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar tipo de agente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteTipoAgenteAction()
    {
        $tiposagente = json_decode(stripslashes($this->_request->getPost('tiposagente')));
        $respuesta = true;
        $obj = new NomTipoagenteModel();
        foreach ($tiposagente as $p) {
            $r = $obj->deleteTipoAgente($p);
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