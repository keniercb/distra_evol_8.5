<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class PartespiezasagregadosController extends BaseController
{

    private $model;

    function init()
    {
        parent::init();
        $this->model = new PartesPiezasAgregadosModel();
    }

    public function gestPartespiezasagregadosAction()
    {
        $this->render();
    }

    public function adicionarPartespiezasagregadosAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->model->adicionarPieza($datos);
    }

    public function cargarPartespiezasagregadosAction()
    {
        $result = $this->model->cargarPiezas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function eliminarPiezaAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->model->eliminarPieza($datos);
    }

    public function cargarPiezasConfiguradasAction()
    {
        $result = $this->model->cargarPiezasConfiguradas($this->uiParams);
        $this->datos = $result;
        $this->cantidad = count($result);
    }

}
