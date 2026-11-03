<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ComprobantetalleresController extends ComprobanteController /*ZendExt_Controller_Secure//*/
{

    function init()
    {

        parent::init('log.tall.comprobantetall');
        $this->comprobantesModel = new TalleresComprobanteModel();
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
        $this->initComponent('log.tall.comprobantetall');
        $this->rendertemplate();
    }
    
    public function generarComrpobanteAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        $this->uiParams['anticipos'] = Zend_Json::decode($this->uiParams['anticipos']);
        $this->comprobante = $this->comprobantesModel->contabilizarDocumento(
            $this->uiParams['iddocumento'], LogisticaGlobal::SUBSISTEMA_TALLERES,
                '', 'Comprobante de operaciones de talleres', $this->uiParams['anticipos']
        );
        $this->iddocumento = $this->uiParams['iddocumento'];
    }
}
