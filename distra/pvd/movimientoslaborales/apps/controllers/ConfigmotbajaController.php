<?php
class ConfigmotbajaController extends ZendExt_Controller_Secure
{
    protected $_response;

    function init()
    {
        parent::init();
    }

    public function responseRequest()
    {
        $this->_response->success = TRUE;
        if (isset($this->_response->success)) {
            $this->_response->success = $this->_response->success;
        }
        echo json_encode($this->_response);
    }

    public function responseExceptions($error)
    {
        $this->_response->success = FALSE;
        $this->_response->codigo = $error->getCode();
        $this->_response->mensaje = $error->getMessage();
        $this->_response->traza = $error->getTraceAsString();
        $this->responseRequest();
    }

    function configmotbajaAction()
    {
        $vioc = ZendExt_IoC_Inter::getInstance();
        $this->view->plantilla = $vioc->maestro->mostrarIUPlantilla();
        $this->render();
    }

    function getConfiguracionesAction()
    {
        $modeloNegocio = new ConfMotivosbaja();
        $arr = $modeloNegocio->getConfiguraciones();
        echo Zend_Json::encode($arr);
    }

    function getMotivosBajaAction()
    {
        $modeloNegocio = new NomMotivobaja();
        $arr = $modeloNegocio->getMotivosActivos();
        echo Zend_Json::encode($arr);
    }

    public function guardarConfiguracionNivelesAction()
    {
        $obj = new ConfMotivosbajaModel();
        $r = $obj->addConfig(
            $this->_getParam('idconfmotivobaja'), $this->_getParam('idmotivobaja')
        );
        echo Zend_Json::encode($r);
    }
}