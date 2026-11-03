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

class ConfplanificacionmantenimientoController extends BaseController //Zend_Controller_Action
{

    private $_modelo;

    /**
     *
     */
    function init()
    {
        parent::init('log.aft.configuracionaf');
        $this->_modelo = new ConfPlanificacionMantenimientoModel();
    }

    /**
     *
     */
    function confplanificacionmantenimientoAction()
    {
        $this->render();
    }

    function adicionarPlanificacionAction()
    {
        $this->_modelo->adicionarPlanificacion($this->uiParams);
    }

    function eliminarPlanifAction()
    {
        $this->_modelo->eliminarPlanificacion($this->uiParams);
    }

    function eliminarActvidadesAction()
    {
        $this->_modelo->eliminarActividadPlanificada($this->uiParams);
    }

    function cargarPlanificacionesAction()
    {
        $result = $this->_modelo->cargarPlanificaciones($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    function cargarActvidadesSistemasMedioAction()
    {
        $result = $this->_modelo->cargarActividadesDelMedioSistema($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    function cargarActvidadesPlanificadasAction()
    {
        $result = $this->_modelo->cargarActvidadesPlanificadas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    function cargarActvidadesPlanificadasParaOrdenAction()
    {
        $result = $this->_modelo->cargarActvidadesPlanificadasParaOrden($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

}
