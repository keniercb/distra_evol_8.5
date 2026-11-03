<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()
            ->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AuditoriaController
 *
 * @author kenier
 */
class AuditoriadocumentoController extends BaseController
{
    private $model;
    public function init()
    {
        parent::init('log.lb.auditoria');
        $this->model = new AuditoriaDocumentoModel();
        $monedas = $this->model->getMonedas();
        //$fecha = new DateTime();
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,10);
        $fecha = str_ireplace('/','-',$fecha->fecha);
        $this->view->uiVariables = array_merge(
            array('cmpArmamento' => $this->jsonComponent->getComponent(
                'log.inv.armamento', true) ? 'true' : 'false',
                /*'fecha' => "'{$fecha->format('d/m/Y')}'",*/
                'fecha' => "'{$fecha}'",
                'codigoContable' => "'" . "{$monedas->codigoiso}" . "'",
                'codigoAlternativa' => "'" . "{$monedas->codigoisoalt}" . "'",
                'alternativa' => $monedas->idmonedaalternativa ? 'true' : 'false',
                'monedacontable' => "'" . "{$monedas->idmoneda}" . "'",
                'monedaalternativa' => "'" . "{$monedas->idmonedaalternativa}" . "'"
            ), $this->view->uiVariables
        );
    }

    public function auditoriaDocumentoAction(){
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array();

        $this->initComponent('log.lb.auditoria');
        $this->renderTemplate();

    }

    public function devolverDocumentosAction()
    {
        $this->objectHelper->synchronize($this,$this->model->devolverDocumentos($this->uiParams));
    }

    public function obtenerDepositosAction()
    {
        $this->datos = $this->model->devolverDepositos();
    }

    public function obtenerTipoDocumentoAction()
    {
        $this->datos = $this->model->devolverTipoDocumentos();
    }

    public function devolverMovimientosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->devolverMovimientos($this->uiParams));
    }
}
