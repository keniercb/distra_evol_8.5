<?php

/**
 * @class      ComprobanteController
 * Clase controladora para gestion de comprobantes de operaciones
 * @package    Utiles
 * @subpackage Comrpobante
 * @author     Maricet Estevez
 * @copyright  XETID
 * @version    1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ComprobanteController extends BaseController
{

    protected $comprobantesModel, $cobrosPagosModel;

    function init($cmp = 'log.lb.comprobante')
    {
        parent::init($cmp);
        $this->comprobantesModel = new LogisticaComprobanteModel();
        $this->cobrosPagosModel = new LogisticaObligacionesCPModel();

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
    public function gestcomprobanteAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
       // $this->view->arrayJs = array($this->contabilidadHelper->getComprobanteComponent());
        $this->initComponent('log.lb.comprobante');
        $this->rendertemplate();
    }

    /**
     * Devuelve una colección de lotes.
     *
     * @return array
     */
    public function cargarDocumentosContabilizadosAction()
    {
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->objectHelper->synchronize($this, $this->comprobantesModel->cargarDocContabilizados($this->uiParams));
    }

    /**
     *
     */
    public function generarComrpobanteAction()
    {
        try {
            $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
            $this->uiParams['anticipos'] = Zend_Json::decode($this->uiParams['anticipos']);
            $this->comprobante = $this->comprobantesModel->contabilizarDocumento(
                $this->uiParams['iddocumento'], LogisticaGlobal::SUBSISTEMA_INV, '', '', $this->uiParams['anticipos']
            );
            $this->iddocumento = $this->uiParams['iddocumento'];
            (new TrazasDocumentoModel())->guardarTraza('Generando comprobante de operaciones', $this->uiParams['iddocumento'][0]);
        } catch (Exception $e) {
            print_r($e->getMessage());
        }
    }

    /**
     *
     */
    public function anularComprobanteAction() {
        try {
            $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
            $this->comprobante = $this->comprobantesModel->anularDocumento(
                $this->uiParams['iddocumento'], LogisticaGlobal::SUBSISTEMA_INV
            );
            $this->iddocumento = $this->uiParams['iddocumento'];
            (new TrazasDocumentoModel())->guardarTraza('Anulando generacion de comprobante de operaciones', $this->uiParams['iddocumento'][0]);
        }
        catch (Exception $e) {
            print_r($e->getMessage());
        }
    }

    public function postCreateComprobanteAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        $this->uiParams['anticipos'] = Zend_Json::decode($this->uiParams['anticipos']);
        if (count($this->uiParams['iddocumento']) > 0) {
          $this->cobrosPagosModel->generarObligaciones($this->uiParams);
          (new TrazasDocumentoModel())->guardarTraza('Generando obligaciones financieras.', $this->uiParams['iddocumento'][0]);
        }
    }

    public function postCreateComprobanteAutoAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        //$this->uiParams['anticipos'] = Zend_Json::decode($this->uiParams['anticipos']);
        if (count($this->uiParams['iddocumento']) > 0) {
            $this->comprobantesModel->insertDocumentoContabilidad($this->uiParams);
            $this->comprobantesModel->actualizarDocumentosContabilizados($this->uiParams);
            $this->cobrosPagosModel->generarObligaciones($this->uiParams);
        }
    }

    /**
     *
     */
    public function actualizarDocumentosAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['id']);
        $this->uiParams['anticipos'] = Zend_Json::decode($this->uiParams['anticipos']);
        $this->comprobantesModel->actualizarDocumentosContabilizados($this->uiParams);
    }

    /***
     *
     */
    public function obtenerTipoDocumentoAction()
    {
        $this->objectHelper->synchronize($this, $this->comprobantesModel->devolverTipoDoc());
    }

    public function cargarAnticiposClienteAction() {
        $this->objectHelper->synchronize($this, $this->comprobantesModel->getAnticiposByIdcliente(
            Zend_Json::decode($this->uiParams['iddocumento'])
        ));
    }
}
