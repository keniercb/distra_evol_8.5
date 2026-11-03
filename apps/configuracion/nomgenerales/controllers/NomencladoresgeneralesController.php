<?php
class NomencladoresgeneralesController extends ZendExt_Controller_Secure
{
    private $nomencladoresModel;

    function init()
    {
        parent :: init();
        $this->view->jsnomgen = $this->integrator->datosmaestros->mostrarNomencladoresGenerales();
        $this->view->jsArbolNaturaleza = $this->integrator->datosmaestros->obtenerJSArbolNaturaleza();
        $this->view->arrayJs = $this->integrator->logistica->getComponentDefinition('log.lb.treeagrupaciones');
        $params = $this->_request->getParams();
        $this->nomencladoresModel = ($params['bussines']) ? new $params['bussines']()
            : new NomencladoresGeneralesModel();
    }

    function nomencladoresgeneralesAction()
    {
        $this->render();
    }

    public function cargarnomencladorAction()
    {
        $params = $this->_request->getParams();
        $params['incluirvencidas'] = 2;                
        if ($params['treesearch']) {
            $result = $this->nomencladoresModel->cargarArbol($params);
        } else {
            $result = $this->nomencladoresModel->buscar($params);
        }
        echo(json_encode($result));
    }

    public function insertarnomencladorAction()
    {
       // print_r('zxc');
        $params = $this->_request->getParams();
//        print_r($this->nomencladoresModel);die;
        $res = $this->nomencladoresModel->InsertarNomenclador($params);        
        if ($res == 1) {
            echo "{success: 'true'}";
        } elseif ($res == -1) {
            echo ("{'etiqueta':'msjAddCodDescexist'}");
        } elseif ($res == -2) {
            echo ("{'etiqueta':'msjAddDescexist'}");
        } else {
            echo ("{'etiqueta':'msjAddCodexist'}");
        }
    }

    public function modificarnomencladorAction()
    {
        $params = $this->_request->getParams();
        $res = $this->nomencladoresModel->ModificarNomenclador($params);
        if ($res == 1) {
            echo "{'cod':1, success: 'true'}";
        } elseif ($res == -1) {
            echo ("{'cod':3,'etiqueta':'msjModCodexist'}");
        } elseif ($res == -2) {
            echo ("{'cod':3,'etiqueta':'msjModDescexist'}");
        }
    }

    public function eliminarnomencladorAction()
    {
        $params = $this->_request->getParams();
        $res = $this->nomencladoresModel->EliminarNomenclador($params);
        if ($res === 3) {
            echo ("{'Cod':3}");
        } elseif ($res) {
            echo "{success: 'true'}";
        }
    }

    public function habilitardesabiltarentidadAction()
    {
        $params = $this->_request->getParams();
        $res = $this->nomencladoresModel->habilitarDesabiltarEntidad($params);
        if ($res) {
            echo "{success: 'true'}";
        } else {
            echo "{success: 'false'}";
        }
    }

    public function activarnomencladorAction()
    {
        $params = $this->_request->getParams();
        $res = $this->nomencladoresModel->ActivarNomenclador($params);
        if ($res) {
            echo "{success: 'true'}";
        } else {
            echo "{success: 'false'}";
        }
    }

    public function getnaturalezasAction()
    {
        echo json_encode($this->integrator->datosmaestros->obtenerDatosArbolNaturaleza($this->_request->getPost()));
    }

    public function cargarnomencladorentidadAction() {
        $params = $this->_request->getParams();
        $result = $this->nomencladoresModel->cargarComboNomenclador($params);
        echo(json_encode($result));
    }

    public function exportarOrganoAction()
    {
        echo json_encode(array('dirFichero' =>$this->nomencladoresModel->exportarOrgano()));
    }
}
