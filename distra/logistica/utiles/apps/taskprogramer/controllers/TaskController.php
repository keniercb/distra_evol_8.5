<?php

/**
 * @class     TaskController
 * @package
 * @author Osleidy Quiala
 * @copyright XETID 2017
 * @version   1.0
 */

if (!class_exists('BaseController')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication
        . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}


class TaskController extends BaseController
{
    private $model;


    public function init()
    {
        parent::init('log.lb.task');
        $this->model = new TaskModel();
    }

    public function taskAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.task');
        $this->renderTemplate();
    }

    public function cargarTaskAction()
    {
        $params = $this->uiParams;
        $resultado = $this->model->cargarTask();
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function adicionarTaskAction()
    {
        $params = Zend_Json::decode($this->uiParams['data']);
        $params['json'] = '{}';
        $result = $this->model->adicionarTask($params);
    }

    public function eliminarTaskAction()
    {
        $params = Zend_Json::decode($this->uiParams['id']);
        $this->model->eliminarTask($params);
    }

    public function savePropiedadesAction()
    {
        $params = $this->_request->GetPost();
        $this->model->savePropiedades($params);
    }


}
