<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class MercanciatransitoController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.inv.mercanciatransito');
        $this->_model = new MercanciaTransitoModel();
        $this->view->uiVariables = array_merge(array(
            'estructuraactual' => $this->global->Estructura->idestructura,
        ), $this->view->uiVariables
    );
    }

    public function cargarDepositosAction()
    {
        $this->uiParams['idseleccionados'] = Zend_Json::decode(
            $this->uiParams['idseleccionados']
        );
        
        $depositos = $this->_model->cargarEstructuras($this->uiParams);
        $this->datos = $depositos['datos'];
        $this->cantidad = $depositos['cantidad'];
    }

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
    }
    public function cargardistribucionpadreAction(){
        $this->objectHelper->synchronize($this, $this->_model->getcargardistribucionpadre($this->uiParams));
    }
}