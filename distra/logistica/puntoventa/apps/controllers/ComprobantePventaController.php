<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ComprobantePventaController extends /*ZendExt_Controller_Secure//*/ComprobanteController
{

    function init()
    {

        parent::init('log.fac.comprobantepventa');
        //$this->comprobantesModel = new FacturacionComprobanteModel();
        /*$this->cobrosPagosModel = new LogisticaObligacionesCPModel();*/
    }

    /**
     *
     */
    public function gestcomprobanteAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array($this->contabilidadHelper->getComprobanteComponent());
        $this->initComponent('log.fac.comprobantepventa');
        $this->rendertemplate();
    }
    
    public function generarComrpobanteAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        $this->comprobante = $this->comprobantesModel->contabilizarDocumento(
            $this->uiParams['iddocumento'], LogisticaGlobal::SUBSISTEMA_FAC,
                '', 'Comprobante de operaciones de punto de venta'
        );
        $this->iddocumento = $this->uiParams['iddocumento'];
    }


    public function postCreateComprobanteAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        $this->uiParams['subsistema'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->comprobantesModel->actualizarDocumentosContabilizados($this->uiParams);
        $this->cobrosPagosModel->generarObligaciones($this->uiParams);
    }
}
