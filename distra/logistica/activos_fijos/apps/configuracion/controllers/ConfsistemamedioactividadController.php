<?php

/**
 * Daniel Arias Espinosa
 * 07/12/15
 */
if (!class_exists('BaseController')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication
        . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

class ConfsistemamedioactividadController extends BaseController //Zend_Controller_Action
{

    protected $_modelo;

    /**
     *
     */
    function init()
    {
        parent::init('log.aft.configuracionaf');
        $this->_modelo = new ConfSistemaMedioActividadModel();
    }

    /**
     *
     */
    function confsistemamedioactividadAction()
    {
        $this->render();
    }

    function adicionarSistemaAction()
    {
        $this->success = $this->_modelo->adicionarSistemaMedio($this->uiParams);
    }

    function eliminarSistemaAction()
    {
        try{
            $this->success = $this->_modelo->eliminarSistemaMedio($this->uiParams);
        }
        catch (Doctrine_Exception $e) {
            $this->success = false;
            $this->code = $e->getCode();
        }

    }

    function cargarSistemaAction()
    {
        $reslt = $this->_modelo->cargarSistemaMedio($this->uiParams);
        $this->jsonResponse($reslt);
    }

    function adicionarActividadesAction()
    {

        $this->_modelo->adicionarActividadesPorSistema($this->uiParams);
    }

    function eliminarActividadesAction()
    {
        try{
            $this->success = $this->_modelo->eliminarActividad($this->uiParams);
        }
        catch (Doctrine_Exception $e) {
            $this->success = false;
            $this->code = $e->getCode();
        }

    }

    function cargarActividadesAction()
    {
        $result = $this->_modelo->cargarActividades($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['totalpaginado'];
    }

    function cargarActividadesSistemaAction()
    {
        $result = $this->_modelo->cargarActividadesPorSistema($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    function adicionarMediosAction()
    {
        $this->_modelo->adicionarMedioPorSistema($this->uiParams);
    }

    function eliminarMediosAction()
    {
        try{
            $this->_modelo->eliminarMedios($this->uiParams);
        }
        catch (Doctrine_Exception $e) {
            $this->success = false;
            $this->code = $e->getCode();
        }

    }

    function cargarMediosSistemaAction()
    {
        $result = $this->_modelo->cargarMedioPorSistema($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    function cargarMediosAction()
    {
        $result = $this->_modelo->cargarMedios($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

}
