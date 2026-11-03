<?php
/**
 * @name NomconsecuenciaController
 * @package   riesgo.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomconsecuenciaController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomconsecuenciaAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de las consecuencias
     * @return Arreglo con todas de las consecuencias
     * @author Eddy Santana Navarro
     */
    function getConsecuenciaAction()
    {
        $modeloNegocio = new NomConsecuenciaModel();
        $arr = $modeloNegocio->getConsecuencias(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar consecuencia
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addConsecuenciaAction()
    {
        $obj = new NomConsecuenciaModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addConsecuencia(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('valor')
            );
            $this->_enviarNotificacionCorrecta();
        } else {
            echo Zend_Json::encode(false);
        }            
    }

    /**
     * Modificar consecuencia
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateConsecuenciaAction()
    {
        $obj = new NomConsecuenciaModel();
        $r = $obj->updateConsecuencia(
            $this->_getParam('idconsecuencia'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('valor')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar consecuencia
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteConsecuenciaAction()
    {
        $consecuencias = json_decode(stripslashes($this->_request->getPost('consecuencias')));
        $respuesta = true;
        $obj = new NomConsecuenciaModel();
        foreach ($consecuencias as $p) {
            $r = $obj->deleteConsecuencia($p);
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