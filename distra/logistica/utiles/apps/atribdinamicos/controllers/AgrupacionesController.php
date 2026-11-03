<?php

/**
 * @class     AgrupacionesController
 * @package
 * @author Osleidy Quiala
 * @copyright XETID 2017
 * @version   1.0
 */

if (!class_exists('BaseController')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class AgrupacionesController extends BaseController
{
    private $model, $modelAtributos;

    public function init()
    {
        parent::init('log.lb.agrupaciones');
        $this->model = new AgrupacionesModel();
        $this->modelAtributos = new AtributosdinamicosModel();
    }

    public function agrupacionesAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.agrupaciones');
        $this->renderTemplate();
    }

    public function cargarAgrupacionesAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarAgrupaciones($this->uiParams));
    }

    public function adicionarAgrupacionAction()
    {
        $datos = Zend_Json::decode($this->uiParams['data']);
        $this->objectHelper->synchronize($this, $this->model->adicionarAgrupacion($datos));
    }

    public function eliminarAgrupacionesAction()
    {
        $filtro = Zend_Json::decode($this->uiParams['id']);
        $this->model->eliminarAgrupaciones($filtro);
    }

    public function getTreeAgrupacionesAction()
    {
        $this->model->getTreeAgrupaciones($this->uiParams);
    }

}
