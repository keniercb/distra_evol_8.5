<?php
class ConfcontratacionController extends ZendExt_Controller_Secure
{
    private $_model;

    function init()
    {
        parent::init();
        $this->_model = new ConfContratacionModel();
    }

    function confcontratacionAction()
    {

    }

    function loadConfComiteAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->loadConfComite();
        echo json_encode($result);
    }

    function saveConfComiteAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfComite($data);
        echo json_encode($result);
    }

    function loadConfContratoAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->loadConfContrato($data);
        echo json_encode($result);
    }

    function loadConfContratoImportacionAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->loadConfContratoImportacion($data);
        echo json_encode($result);
    }

    function loadConfContratoPlanifAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->loadConfContratoPlanif($data);
        echo json_encode($result);
    }

    public function saveConfContratoAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfContrato($data);
        echo json_encode($result);
    }

    public function saveConfContratoImportacionAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfContratoImportacion($data);
        echo json_encode($result);
    }

    public function saveConfPlanifAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfPlanif($data);
        echo json_encode($result);
    }

    function getWorkSpaceAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->getWorkSpace($data);
        echo json_encode($result);
    }

    public function loadConfOfertaNegocioAction(){
        $result = $this->_model->loadConfOfertaNegocio();
        echo json_encode($result);
    }

    public function saveConfOfertaNegocioAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfOfertaNegocio($data);
        echo json_encode($result);
    }
    public function saveConfClientesproveedoresAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfClientesproveedores($data);
        echo json_encode($result);
    }
    public function loadConfSolicitudNegocioAction(){
        $result = $this->_model->loadConfSolicitudNegocio();
        echo json_encode($result);
    }
    public function loadConfClientesproveedoresAction(){
        $result = $this->_model->loadConfClientesproveedores();
        echo json_encode($result);
    }

    public function saveConfSolicitudNegocioAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfSolicitudNegocio($data);
        echo json_encode($result);
    }

    public function loadConfCompartimentacionAction(){
        $params = $this->_request->getParams();
        $result = $this->_model->loadConfCompartimentacion($params);
        echo json_encode($result);
    }

    public function saveConfCompartimentacionAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfCompartimentacion($data);
        echo json_encode($result);
    }

    public function deleteConfCompartimentacionAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->deleteConfCompartimentacion($data);
        echo json_encode($result);
    }

    public function getRolesAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->getRoles($data);
        echo json_encode($result);
    }

    public function getFiltrosAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->getFiltros($data);
        echo json_encode($result);
    }

    public function getValoresAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->getValores($data);
        echo json_encode($result);
    }

    public function getConfComiteAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->getConfComite($data);
        echo json_encode($result);
    }

    public function guardarComiteAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->guardarComite($data);
        echo json_encode($result);
    }

    public function getConfComitePorIdAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->getConfComitePorId($data);
        echo json_encode($result);
    }

    public function eliminarComiteAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->eliminarComite($data);
        echo json_encode($result);
    }

    function loadConfContratoContabilidadAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->loadConfContratoContabilidad($data);
        echo json_encode($result);
    }

    public function saveConfContabilidadAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfContabilidad($data);
        echo json_encode($result);
    }

    function loadConfSolicitudPagoAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->loadConfSolicitudPago($data);
        echo json_encode($result);
    }

    public function saveConfSolicitudPagoAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfSolicitudPago($data);
        echo json_encode($result);
    }
    
    public function loadConfContratoGeneralAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->loadConfContratoGeneral($data);
        echo json_encode($result);
    }
    public function saveConfContratoGeneralAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfContratoGeneral($data);
        echo json_encode($result);
    }
    public function loadConfProformaAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->loadConfProforma($data);
        echo json_encode($result);
    }
    public function saveConfProformaAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->saveConfProforma($data);
        echo json_encode($result);
    }

    public function getFileConfiguracionAction(){
//        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $objComp = new ConfiguracionModel();
        $r['code'] = $objComp->getDataFile();

        echo json_encode($r);
    }
    public function saveFileConfiguracionAction(){
//        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $code = $this->_request->getPost('code');
        $objComp = new ConfiguracionModel();
        $r['success'] = $objComp->saveFile($code);
        echo json_encode($r);
    }

    public function getVariablesAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->getVariables($data);
        echo json_encode($result);
    }

    public function guardarVariableAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->guardarVariable($data);
        echo json_encode($result);
    }

    public function eliminarVariableAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->eliminarVariable($data);
        echo json_encode($result);
    }

    public function getIndicadoresPliegoAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->getIndicadoresPliego($data);
        echo json_encode($result);
    }
    public function getVariablesPliegoAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->getVariablesPliego($data);
        echo json_encode($result);
    }
    public function guardarIndicadoresPliegoAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->guardarIndicadoresPliego($data);
        echo json_encode($result);
    }
    public function eliminarIndicadoresPliegoAction(){
        $data = $this->_request->getParams();
        $result = $this->_model->eliminarIndicadoresPliego($data);
        echo json_encode($result);
    }

}
