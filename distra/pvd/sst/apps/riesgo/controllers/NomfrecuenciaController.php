<?php
/**
 * @name NomfrecuenciaController
 * @package   riesgo.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomfrecuenciaController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomfrecuenciaAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los estados de riesgo
     * @return Arreglo con todos los estados de riesgo
     * @author Eddy Santana Navarro
     */
    function getFrecuenciasAction()
    {
        $modeloNegocio = new NomFrecuenciaModel();
        $arr = $modeloNegocio->getFrecuencias(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar estado de riesgo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addFrecuenciaAction()
    {
        $obj = new NomFrecuenciaModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addFrecuencia(
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
     * Modificar estado de riesgo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateFrecuenciaAction()
    {
        $obj = new NomFrecuenciaModel();
        $r = $obj->updateFrecuencia(
            $this->_getParam('idfrecuencia'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('valor')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar estado de riesgo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteFrecuenciaAction()
    {
        $estados = json_decode(stripslashes($this->_request->getPost('frecuencias')));
        $respuesta = true;
        $obj = new NomFrecuenciaModel();
        foreach ($estados as $p) {
            $r = $obj->deleteFrecuencia($p);
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