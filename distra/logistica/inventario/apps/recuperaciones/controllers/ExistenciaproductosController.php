<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ExistenciaproductosController extends BaseController
{
    /**
     * @var ExistenciaproductosModel
     */
    private $model;

    public function init()
    {
        parent::init('log.inv.existenciaproductos');
        $this->model = new ExistenciaproductosModel();
    }

    public function gestExistenciaproductosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.existenciaproductos');
        $this->rendertemplate();
    }

    public function cargarProductosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarProductos($this->uiParams));
    }
    
    public function exportarExcelAction()
    {
        unset($this->uiParams['start']);
        unset($this->uiParams['limit']);
        $this->dirFichero = $this->model->exportarExcel($this->uiParams);
    }
    
    public function cargarMinisteriosAction()
    {
        $this->autoShow = false;
        echo json_encode($this->model->cargarMinisterios($this->uiParams));
    }

    public function cargarSubordinacionAction()
    {
        $this->autoShow = false;
        echo json_encode($this->model->cargarSubordinacion($this->uiParams));
    }
    
    public function obtenerNaturalezaAction()
    {
        $this->autoShow = false;
        $params = $this->uiParams;
        $result = ServiciosConfiguracionGeneralHelper::__init()->obtenerDatosArbolNaturaleza($params);
        echo json_encode(array('datos' => $result));
    }

}
