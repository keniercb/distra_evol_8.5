<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class MercanciadistribuidaController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.inv.mercanciadistribuida');
        $this->_model = new MercanciadistribuidaModel();
        $this->view->uiVariables = array_merge(array(
            'estructuraactual' => $this->global->Estructura->idestructura,
        ), $this->view->uiVariables
    );
    }

    public function getEstructurasAction(){
        $this->objectHelper->synchronize($this, $this->_model->getEstructuras());
    }
    
    public function  getcargarmercanciadistribuidaAction(){
        $this->objectHelper->synchronize($this, $this->_model->cargarmercanciadistribuida($this->uiParams));
    }

    public function getcargarDepositoAction(){
        $this->objectHelper->synchronize($this, $this->_model->getDeposito($this->uiParams));
    }
    public function getcargardocumentoAction(){
        $this->objectHelper->synchronize($this, $this->_model->getDocumento($this->uiParams));
    }
    public function getcargarnaturalezaAction(){
        $this->objectHelper->synchronize($this, $this->_model->getNaturaleza($this->uiParams));
    }

    ////metodos de la ventana ver detalles
    public function   getcargarProductosAction(){
        $this->objectHelper->synchronize($this, $this->_model->cargarproductos($this->uiParams));
    }
    public function   getestadoAction(){
        $this->objectHelper->synchronize($this, $this->_model->cargarestado($this->uiParams));
    }
    public function   getestadoejecucionAction(){
        $this->objectHelper->synchronize($this, $this->_model->cargarestadoejecucion($this->uiParams));
    }
/*
    public function getEstructurasAction(){
        $this->objectHelper->synchronize($this, $this->_model->getEstructuras());
    }

    public function gestMercanciaTransitoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.mercanciatransito');
        $this->rendertemplate();
    }
    public function getmercanciatransitoAction(){
        $this->objectHelper->synchronize($this, $this->_model->getDatosMercancias($this->uiParams));
    }*/
}