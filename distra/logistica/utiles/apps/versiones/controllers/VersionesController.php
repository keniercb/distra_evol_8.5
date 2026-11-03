<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class VersionesController extends BaseController
{

    private $model;

    /**
     *
     */
    function init()
    {
        parent::init('log.lb.versiones');
        $this->model = new VersionesModel();
       
    }

    /**
     *
     */
    public function versionesAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.versiones');
        $this->rendertemplate();
    }

    public function getProyectosAction(){
        $this->datos = $this->model->getProyectos();

    }
    public function leerFicheroAction()
    {
        $this->datos = $this->model->leerFichero($this->uiParams['dir']);



    }

   
}
