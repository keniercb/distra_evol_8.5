<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class CuadredeprocesoController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.cuadredeproceso');
        $this->_model = new CuadredeprocesoModel();
    }
    public function gestCuadredeprocesoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.cuadredeproceso');
        $this->rendertemplate();
    }
    
    public function cargarClientesAction(){
        $this->objectHelper->synchronize($this, $this->_model->getClientes($this->uiParams));
    }
    public function cargarSectorAction(){
        $this->objectHelper->synchronize($this, $this->_model->getSector($this->uiParams));
    }
    
    public function getCuadredeprocesoAction(){
        $this->objectHelper->synchronize($this, $this->_model->getDatosReporte($this->uiParams));
    }
    public function listarValeEntregaAction(){
        $this->objectHelper->synchronize($this, $this->_model->listarValeEntrega($this->uiParams));
    }
   public function listarValedevolucionAction(){
    $this->objectHelper->synchronize($this, $this->_model->listarValedevolucion($this->uiParams));
    }
    public function listarproductosAction(){
        $this->objectHelper->synchronize($this, $this->_model->listarproductos($this->uiParams));
        }
}
