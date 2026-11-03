<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ComprobantefactController extends /*ZendExt_Controller_Secure//*/ComprobanteController
{

    function init()
    {

        parent::init('log.fac.comprobantefact');
        $this->comprobantesModel = new FacturacionComprobanteModel();
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
        $this->initComponent('log.fac.comprobantefact');
        $this->rendertemplate();
    }
    
    public function generarComrpobanteAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        $this->uiParams['anticipos'] = Zend_Json::decode($this->uiParams['anticipos']);
        $this->comprobante = $this->comprobantesModel->contabilizarDocumento(
            $this->uiParams['iddocumento'], LogisticaGlobal::SUBSISTEMA_FAC,
                '', 'Comprobante de operaciones de facturación', $this->uiParams['anticipos']
        );
        $this->iddocumento = $this->uiParams['iddocumento'];
    }

    /*public function cargarDocumentosContabilizadosAction()
    {
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $result = $this->comprobantesModel->cargarDocContabilizados($this->uiParams);
        $this->datos = $result;
        $this->cantidad = count($result);
    }

    public function generarComrpobanteAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        $this->comprobante = $this->comprobantesModel->contabilizarDocumento(
            $this->uiParams['iddocumento'], LogisticaGlobal::SUBSISTEMA_INV
        );
        $this->iddocumento = $this->uiParams['iddocumento'];
    }*/

    public function postCreateComprobanteAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        $this->uiParams['anticipos'] = Zend_Json::decode($this->uiParams['anticipos']);
        $this->uiParams['subsistema'] = LogisticaGlobal::SUBSISTEMA_FAC;
        if (count($this->uiParams['iddocumento']) > 0) {
            //$this->comprobantesModel->actualizarDocumentosContabilizados($this->uiParams);
            $this->cobrosPagosModel->generarObligaciones($this->uiParams);
        }  
    }

    public function postCreateComprobanteAutoAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        //$this->uiParams['anticipos'] = Zend_Json::decode($this->uiParams['anticipos']);
        $this->uiParams['subsistema'] = LogisticaGlobal::SUBSISTEMA_FAC;
        if (count($this->uiParams['iddocumento']) > 0) {
            $this->comprobantesModel->insertDocumentoContabilidad($this->uiParams);
            $this->comprobantesModel->actualizarDocumentosContabilizados($this->uiParams);
            $this->cobrosPagosModel->generarObligaciones($this->uiParams);
        }
    }

    public function cargarClientesAction()
    {
        $clientes = $this->comprobantesModel->getClientes($this->uiParams);
        $this->datos = $clientes['datos'];
        $this->total = $clientes['cantidad'];
    }
}
