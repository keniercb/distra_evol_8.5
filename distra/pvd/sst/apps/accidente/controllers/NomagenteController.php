<?php
/**
 * @name NomagenteController
 * @package   accidente.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomagenteController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomagenteAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de agentes
     * @return Arreglo con todos los agentes
     * @author Eddy Santana Navarro
     */
    function getAgentesAction()
    {
        $modeloNegocio = new NomAgenteModel();
        $arr = $modeloNegocio->getAgentes(
            $this->_getParam('denominacion'),
            $this->_getParam('idtipoagente'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar agente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addAgenteAction()
    {
        $obj = new NomAgenteModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'), $this->_getParam('idtipoagente'))) {
            $resp = $obj->addAgente(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('idtipoagente')
            );
            echo Zend_Json::encode($resp);
        } else
            echo Zend_Json::encode(2);
    }

    /**
     * Modificar agente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateAgenteAction()
    {
        $obj = new NomAgenteModel();
        $r = $obj->updateAgente(
            $this->_getParam('idagente'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('idtipoagente')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar agente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteAgenteAction()
    {
        $agentes = json_decode(stripslashes($this->_request->getPost('agentes')));
        $respuesta = true;
        $obj = new NomAgenteModel();
        foreach ($agentes as $p) {
            $r = $obj->deleteAgente($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
}