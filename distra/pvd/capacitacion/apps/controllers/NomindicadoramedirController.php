<?php
/**
 * @name NomindicadoramedirController
 * @package   capacitacion.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomindicadoramedirController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomindicadoramedirAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los indicadores a medir
     * @return Arreglo con todos los indicadores a medir
     * @author Eddy Santana Navarro
     */
    function getIndicadoresAMedirAction()
    {
        $modeloNegocio = new NomIndicadoramedirModel();
        $arr = $modeloNegocio->getIndicadores(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de las escalas
     * @return Arreglo con todas las escalas
     * @author Yaricel Guerra Velazquez
     */
    function getEscalasAction()
    {
        $escalas = Array();
        $escalas = ZendExt_IoC_Inter::getInstance()->maestro->obtenerEscalas();
        echo Zend_Json::encode($escalas);
    }

    /**
     * Adicionar indicador a medir
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addIndicadorAMedirAction()
    {
        $obj = new NomIndicadoramedirModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'), $this->global->Estructura->idestructura)) {
            $obj->addIndicador(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('idescala')
            );
            $this->_enviarNotificacionCorrecta();
        } else {
            echo Zend_Json::encode(false);
        }            
    }

    /**
     * Modificar indicador a medir
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateIndicadorAMedirAction()
    {
        $obj = new NomIndicadoramedirModel();
        $r = $obj->updateIndicador(
            $this->_getParam('idindicador'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('idescala')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar indicador a medir
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteIndicadorAMedirAction()
    {
        $indicadores = json_decode(stripslashes($this->_request->getPost('indicadores')));
        $respuesta = true;
        $obj = new NomIndicadoramedirModel();
        foreach ($indicadores as $p) {
            $r = $obj->deleteIndicador($p);
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