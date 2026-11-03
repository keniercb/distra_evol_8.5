<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ComprobanteaftController extends BaseController
{

    private $comprobantesModel, $cobrosPagosModel;

    /**
     *
     */
    function init()
    {
        parent::init('log.aft.comprobanteaft');
        $this->comprobantesModel = new ActivoComprobanteModel();
        $this->cobrosPagosModel = new LogisticaObligacionesCPModel($this->comprobantesModel);
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $alternativa = 0;
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['codigoAlternativa'] = $value['codigoiso'];
            } else {
                $moneda['codigoContable'] = $value['codigoiso'];
            }
        }
        $this->view->uiVariables = array_merge(array(
            'alternativa' => $alternativa == 1 ? 'true' : 'false',
            'codigoContable' => "'" . "{$moneda['codigoContable']}" . "'",
            'codigoAlternativa' => "'" . "{$moneda['codigoAlternativa']}" . "'"
        ), $this->view->uiVariables);
    }

    /**
     *
     */
    public function comprobanteaftAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array($this->contabilidadHelper->getComprobanteComponent());
        $this->initComponent('log.aft.comprobanteaft');
        $this->rendertemplate();
    }

    /**
     *
     */
    public function cargarDocumentosContabilizadosAction()
    {
        $result = $this->comprobantesModel->cargarDocContabilizados($this->uiParams);
        $this->datos = $result;
        $this->cantidad = count($result);
    }

    /**
     *
     */
    public function generarComrpobanteAction()
    {
        try {
            $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
            $this->comprobante = $this->comprobantesModel->contabilizarDocumento(
                $this->uiParams['iddocumento'], LogisticaGlobal::SUBSISTEMA_AFT
            );
            $this->iddocumento = $this->uiParams['iddocumento'];
        } catch (Exception $e) {
            $this->comprobante = array();
        }
    }

    public function postCreateComprobanteAction()
    {
        try {
            $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
            $this->uiParams['subsistema'] = LogisticaGlobal::SUBSISTEMA_AFT;
            $this->comprobantesModel->actualizarDocumentosContabilizados($this->uiParams);
            if (count($this->uiParams['iddocumento']) > 0) {
                $this->cobrosPagosModel->generarObligaciones($this->uiParams);
            }
        } catch (Exception $exc) {
            print_r($exc);
            die;
        }
    }

    /**
     *
     */
    public function actualizarDocumentosAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        $this->uiParams['subsistema'] = LogisticaGlobal::SUBSISTEMA_AFT;
        $this->comprobantesModel->actualizarDocumentosContabilizados($this->uiParams);
    }

    /**
     *
     */
    public function anularComprobanteAction()
    {
        try {
            $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
            $this->comprobante = $this->comprobantesModel->anularDocumento(
                $this->uiParams['iddocumento'], LogisticaGlobal::SUBSISTEMA_INV
            );
            $this->iddocumento = $this->uiParams['iddocumento'];
        } catch (Exception $e) {
            print_r($e->getMessage());
        }
    }
}
