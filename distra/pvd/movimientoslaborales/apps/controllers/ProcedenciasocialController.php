<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 26/05/16
 * Time: 11:45
 */
class ProcedenciasocialController extends ZendExt_Controller_Secure
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
    function procedenciasocialAction()
    {
        $this->render();
    }

    /**
     * Obtiene el listado de las fuentes de procedencia
     * @return Arreglo con todas las fuentes de procedencia
     * @author Yaricel Guerra Velázquez
     */
    function getProcedenciaAction()
    {
        $modeloNegocio = new NomProcedenciasocialModel();
        $arr = $modeloNegocio->getActiveSocialOrigin(
            $this->_getParam('id'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar fuentes de procedencia
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addProcedenciaAction()
    {
        $obj = new NomProcedenciasocialModel();
        $obj->addSocialOrigin(
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('descripcion'),
            $this->_getParam('idpadre')
        );
        echo Zend_Json::encode($obj);
    }

    /**
     * Modifica procedencia social
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updateProcedenciaAction()
    {
        $obj = new NomProcedenciasocialModel();
        $r = $obj->modSocialOrigin(
            $this->_getParam('idprocedenciasocial'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('descripcion')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Elimina procedencia social
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deleteProcedenciaAction()
    {
        $obj = new NomProcedenciasocialModel();
        $resp = $obj->delSocialOrigin($this->_getParam('idprocedenciasocial'));
        echo json_encode($resp);
    }
}