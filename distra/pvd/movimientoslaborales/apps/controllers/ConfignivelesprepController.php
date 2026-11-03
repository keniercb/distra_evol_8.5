<?php
class ConfignivelesprepController extends ZendExt_Controller_Secure
{
    protected $_response;

    /**
     * Constructor
     */
    function init()
    {
        parent::init();
    }

    /**
     *
     */
    public function responseRequest()
    {
        $this->_response->success = TRUE;
        if (isset($this->_response->success)) {
            $this->_response->success = $this->_response->success;
        }
        echo json_encode($this->_response);
    }

    /**
     * @param $error
     */
    public function responseExceptions($error)
    {
        $this->_response->success = FALSE;
        $this->_response->codigo = $error->getCode();
        $this->_response->mensaje = $error->getMessage();
        $this->_response->traza = $error->getTraceAsString();
        $this->responseRequest();
    }

    /**
     *
     */
    function confignivelesprepAction()
    {
        $vioc = ZendExt_IoC_Inter::getInstance();
        $this->view->plantilla = $vioc->maestro->mostrarIUPlantilla();
        $this->render();
    }
   
    /**
     * Obtiene el listado de los niveles de preparacion del cargo
     * @return Arreglo con todos los niveles
     * @author Yaricel Guerra Velázquez
     */
    function getNivelesPreparacionAction()
    {
        $modeloNegocio = new ConfNiveles();
        $arr = $modeloNegocio->getNivelesPrep();
        echo Zend_Json::encode($arr);
    }

    function getNivelesEduAction()
    {
        $modeloNegocio = new ConfNiveles();
        $arr = $modeloNegocio->getNivelesEducacionales();
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de los niveles educ por nivel de prep
     * @return Arreglo con todas las configuraciones
     * @author Yaricel Guerra Velázquez
     */
    function getNivelesEduByIdNivelPAction()
    {
        $arr = ConfNiveles::getConfig($this->_getParam('idpreparacion'));
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar configuración de niveles
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function guardarConfiguracionNivelesAction()
    {
        $nivelesedu = json_decode(
            stripslashes($this->_request->getPost('nivelesedu'))
        );//print_r($nivelesedu);die;
        $obj = new ConfNivelesModel();
        $r = $obj->addConfig(
            $this->_getParam('idpreparacion'),
            $nivelesedu
        );
        echo Zend_Json::encode($r);
    }


    private function _enviarNotificacionCorrecta()
    {
        echo "{success: 'true'}";
    }
}
