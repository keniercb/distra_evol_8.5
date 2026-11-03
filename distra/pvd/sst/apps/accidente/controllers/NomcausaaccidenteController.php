<?php
/**
 * Author: Eddy Santana Navarro
 * Date: 21/11/2017
 * Time: 10:45 am
 */
class NomcausaaccidenteController extends ZendExt_Controller_Secure
{
    protected $_response;

    /**
     * Constructor
     */
    function init()
    {
        parent::init();
    }

    public function responseRequest()
    {
        $this->_response->success = isset($this->_response->success) ? $this->_response->success : TRUE;
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

    function nomcausaaccidenteAction()
    {
        //$this->render();
    }

    /**
     * Obtiene el listado de las causas de accidente
     * @return Arreglo con todas las causas de accidente
     * @author Eddy Santana Navarro
     */
    function getCausaAction()
    {
        $modeloNegocio = new NomCausaaccidenteModel();
        $arr = $modeloNegocio->getActiveCausas(
            $this->_getParam('id'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar causa de accidente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addCausaAction()
    {
        $obj = new NomCausaaccidenteModel();
        $obj->addCausa(
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('descripcion'),
            $this->_getParam('idpadre')
        );
        echo Zend_Json::encode($obj);
    }

    /**
     * Modificar causa de accidente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateCausaAction()
    {
        $obj = new NomCausaaccidenteModel();
        $r = $obj->modCausa(
            $this->_getParam('idcausaaccidente'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('descripcion')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar causa de accidente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteCausaAction()
    {
        $obj = new NomCausaaccidenteModel();
        $resp = $obj->delCausa($this->_getParam('idcausaaccidente'));
        echo json_encode($resp);
    }
}