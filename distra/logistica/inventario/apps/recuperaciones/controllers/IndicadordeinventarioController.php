<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class IndicadordeinventarioController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.inv.indicadordeinventario');
        $this->_model = new IndicadordeinventarioModel();
        $this->view->uiVariables = array_merge(array(
            'estructuraactual' => $this->global->Estructura->idestructura,
        ), $this->view->uiVariables
    );
    }

    public function getEstructurasAction(){
        $this->objectHelper->synchronize($this, $this->_model->getEstructuras());
    }

    public function getcargarindicadordeinventarioAction(){
        $this->objectHelper->synchronize($this, $this->_model->getcargarindicadordeinventario($this->uiParams));
    }
    
  /* public function getcargardepositoAction(){
        $this->objectHelper->synchronize($this, $this->_model->getcargardeposito());
    }*/
    
    public function getcargarcodigoAction(){
        $this->objectHelper->synchronize($this, $this->_model->getcargarcodigo());

    }
    public function cargardepositosAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->loadDepositos());
        
    }
    public function obtenerlineasproductoAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->obtenerLineasProductoBusqueda());
        
    }

    public function cargarnaturalezaAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->cargarnaturaleza());
        
    }
    
    
    
}