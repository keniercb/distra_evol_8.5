<?php
/**
 * @class   ConfiguraciontalleresController
 * @author  Daniel Arias Espinosa
 * @version 1.1
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

class ConfiguraciontalleresController extends BaseController //Zend_Controller_Action
{
    private $_modelo;

    function init()
    {
        parent::init('log.tall.configuracion');
        $this->_modelo = new ConfiguracionTalleresModel();
    }

    public function configuraciontalleresAction()
    {
        $this->autoShow = false;
        $this->render();
    }

    public function adicionarServiciosAlAreaAction()
    {
        $this->_modelo->adicionarServicioAlArea($this->uiParams);
    }

    public function cargarConfiguracionContratoAction()
    {
        $resultado = $this->_modelo->cargarConfiguracionContrato($this->uiParams);
        $this->datos = $resultado['datos'];
    }

    public function cargarConfiguracionTalleresAction()
    {
        $resultado = $this->_modelo->cargarConfiguracionTalleres($this->uiParams);
        $this->datos = $resultado['datos'];
    }

    public function cargarServiciosExistentesAction()
    {
        $resultado = $this->_modelo->cargarServiciosExistentes($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['totalpaginado'];
    }

    public function cargarServiciosAreaAction()
    {
        $resultado = $this->_modelo->cargarServiciosArea($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarAreasDelTallerAction()
    {
        $resultado = $this->_modelo->cargarAreasDelTaller($this->uiParams /*$this->global->Perfil->iddominio */);
        $this->datos = $resultado;
        $this->cantidad = count($resultado);
    }

    public function cargarAreasDelServicioAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $resultado = $this->_modelo->cargarAreasServicio($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarPersonasAction()
    {
        $result = $this->_modelo->cargarPersonas($this->global->Estructura->idestructura, $this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarPersonasAreaAction()
    {
        $resultado = $this->_modelo->cargarPersonasArea($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarComboCentroCostoAction()
    {
        $result = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
            $this->global->Estructura->idestructura, 0, 10000,
            false
        );
        $this->datos = $result;
        $this->cantidad = count($result);
    }

    public function cargarComboCuentasAction()
    {
        $result = $this->contabilidadHelper->obtenerCuentasBancarias(
            $this->global->Estructura->idestructura, 0, 10000,
            false
        );
        $this->datos = $result;
        $this->cantidad = count($result);
    }
}