<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class BalancecuadreprocesoController extends BaseController
{

    private $_model, $_logistEstrucUbica;

    function init()
    {
        parent::init('log.tall.balancecuadreproceso');
        $this->_model = new BalancecuadreprocesoModel();
        $this->_logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
    }
    public function gestBalancecuadreprocesoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.balancecuadreproceso');
        $this->rendertemplate();
    }
    
    public function getBalancecuadreprocesoAction(){
        $this->objectHelper->synchronize($this, $this->_model->getDatosReporte($this->uiParams));
    }

    public function cargardocumentoscuadreAction(){
        $this->objectHelper->synchronize($this, $this->_model->getDatosCuadre($this->uiParams));
    }

    public function cargardocumentoscuadretalladoAction(){
        $this->objectHelper->synchronize($this, $this->_model->getDatosReporteDetallado($this->uiParams));
    }

    public function cargardepositosAction()
    {
        $depositos = $this->_logistEstrucUbica->cargardepositos(null,null,null,null,null,-1);
        $this->datos = $depositos['depositos'];
    }

    public function guardarComprobanteAction()
    {
        $this->uiParams['arregloDatos'] = (array) Zend_Json::decode(
            $this->uiParams['arregloDatos']
        );
        $this->objectHelper->synchronize($this, $this->_model->guardarComprobante($this->uiParams));
    }

    public function adicionarBalanceAction($uiParams) {
        $this->uiParams['arrayCuentas'] = (array) Zend_Json::decode(
            $this->uiParams['arrayCuentas']
        );
        
    $this->objectHelper->synchronize($this, $this->_model->adicionarBalance($this->uiParams));
         
     }
    public function cargarHistorialBalanceAction(){
        $this->objectHelper->synchronize($this, $this->_model->cargarHistorialBalance($this->uiParams));
    }
    public function cerrarConDiferenciaAction(){
        $this->objectHelper->synchronize($this, $this->_model->cerrarConDiferencia($this->uiParams));
    }
}
