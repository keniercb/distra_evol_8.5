<?php
/**
 * @name NomperiodoController
 * @package   capacitacion.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomperiodoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomperiodoAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los periodos
     * @return Arreglo con todos los periodos
     * @author Yaricel Guerra Velazquez
     */
    function getPeriodosAction()
    {
        $modeloNegocio = new NomPeriodoModel();
        $arr = $modeloNegocio->getperiodos(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar Periodo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addPeriodoAction()
    {
        $obj = new NomPeriodoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addPeriodo(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('tiempo')
            );
            $this->_enviarNotificacionCorrecta();
        } else {
            echo Zend_Json::encode(false);
        }            
    }

    /**
     * Modificar Periodo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function updatePeriodoAction()
    {
        $obj = new NomPeriodoModel();
        $r = $obj->updatePeriodo(
            $this->_getParam('idperiodo'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('tiempo')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar Periodo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function deletePeriodoAction()
    {
        $periodos = json_decode(stripslashes($this->_request->getPost('periodos')));
        $respuesta = true;
        $obj = new NomPeriodoModel();
        foreach ($periodos as $p) {
            $r = $obj->deletePeriodo($p);
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