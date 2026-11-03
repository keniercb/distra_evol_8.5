<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class EstadiaController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.estadia');
        $this->_model = new EstadiaModel();
        $this->view->uiVariables = array_merge(
            array(
            'idestructura' => $this->global->Estructura->idestructura
            ), $this->view->uiVariables
        );
    }
    public function gestestadiaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.estadia');
        $this->rendertemplate();
    }
    
    public function cargarClientesAction(){
        $this->objectHelper->synchronize($this, $this->_model->getClientes($this->uiParams));
    }
    public function cargarSectorAction(){
        $this->objectHelper->synchronize($this, $this->_model->getSector($this->uiParams));
    }
    
    public function getestadiaAction(){
        if($this->uiParams['tiporeporte']){
        $this->objectHelper->synchronize($this, $this->_model->getDatosReporte($this->uiParams));   
        }
    }
}
