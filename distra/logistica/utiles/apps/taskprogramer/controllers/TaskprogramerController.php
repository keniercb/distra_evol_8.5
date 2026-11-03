<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

/**
 * @class LoteController
 * (Descripcion de la clase, objetivo) *
 * @package Inventario
 * @subpackage Lote
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class TaskprogramerController extends BaseController
{
    /**
     * Instancia de la modelo de lote.
     * @var TaskProgramerModel
     */
    private $model;

    function init()
    {
        parent::init('log.lb.taskprogramer');
        $this->model = new TaskProgramerModel();
    }

    public function gesttaskprogramerAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.lb.taskprogramer');
        $this->rendertemplate();
    }

    /**
     * Devuelve una colección de tareas programadas.
     */
    public function cargarTareasAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->cargarTareas($this->uiParams));
    }

    /**
     * Adiciona una tarea.
     */
    public function adicionarTareaAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->success = $this->model->adicionarTarea($this->uiParams['data']);
    }

    /**
     * Elimina las tareas seleccionadas.
     */
    public function eliminarTareaAction()
    {
        $this->uiParams['id'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['id']));
        $this->unsetNullValues();
        $this->success = $this->model->eliminarTarea($this->uiParams['id']);
    }
    
    /**
     * Activa o desactiva una tarea programada.
     */
    public function activarTareaAction()
    {
        $this->uiParams['id'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['id']));
        $this->unsetNullValues();
        $this->success = $this->model->activarTarea($this->uiParams['id'], $this->uiParams['activar']);
    }

    /**
     * Devuelve un arreglo de NomTarea.
     */
    public function cargarComboNomTareasAction()
    {
        $this->autoShow = false;
        echo json_encode($this->model->cargarComboNomTareas());
    }

}
