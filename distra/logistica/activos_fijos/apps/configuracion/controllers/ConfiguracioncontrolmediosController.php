<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication
        . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

class ConfiguracioncontrolmediosController extends BaseController
{

    protected $_modelo;

    function init()
    {
        parent::init('log.aft.configuracionaf');
        $this->_modelo = new ConfiguracionControlMediosModel();
    }

    public function configuracioncontrolmediosAction()
    {
        $this->render();
    }

    public function devolverAtributosIndicadorAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $campos = $this->_modelo->devolverAtributosIndicador($datos);
        if (count($campos)) {
            $this->datos = $campos;
            $this->cantidad = count($campos);
        } else {
            $this->success = false;
        }
    }

    public function guardarAtributosAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_modelo->guardarAtributos($datos);
    }

    public function eliminarAtributosAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_modelo->eliminarAtributos($datos);
    }

    public function cargarAtributosAction()
    {
        $id = Zend_Json::decode($this->uiParams['idindicador']);
        if ($id) {
            $result = $this->_modelo->cargarAtributos($this->uiParams);
            $this->datos = $result['datos'];
            $this->cantidad = $result['cantidad'];
        }
    }

    public function cargarTiposMediosAction()
    {
        $maestro = new MaestroProductoModel();
        $this->uiParams['grid'] = true;
        $this->objectHelper->synchronize($this, $maestro->devolverPadresHojas($this->uiParams));
    }

}
