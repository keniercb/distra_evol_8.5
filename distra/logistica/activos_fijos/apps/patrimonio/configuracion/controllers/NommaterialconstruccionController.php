<?php

class NommaterialconstruccionController extends ZendExt_Controller_Secure
{
    private $tipomaterialModel;

    public function init()
    {
        $this->tipomaterialModel = new MaterialConstruccionModel();
        /* print_r($this->integrator);die;
          $this->view->jsnomgen = $this->integrator->configuracion->mostrarNomencladoresGenerales();
          $this->view->jsayuda = $this->integrator->ayuda->devolverJS(); */
        parent:: init();
    }

    public function nommaterialconstruccionAction()
    {
        $this->render();
    }

    public function cargarnomencladorAction()
    {
        $parametros = $this->_request->getPost();

        if ($parametros['idpadre']) {
            $resultado = $this->tipomaterialModel->getMaterialConstruccion($parametros);
        } else {
            $resultado = $this->tipomaterialModel->getTipoConstruccion($parametros);
        }
        echo(json_encode($resultado));
    }

    public function insertarnomencladorAction()
    {        
        $parametros = $this->_request->getPost();       
        $origen = 'tipomamerial';
        if ($parametros['model'] == 'NomMaterialConstruccion') {
            $duplicado = $this->tipomaterialModel->getInsertarMaterialConstruccion($parametros);
            $origen = 'materialconstrucccion';
        } else {
            $duplicado = $this->tipomaterialModel->getInsertarTipoConstruccion($parametros);
        }

        if ($duplicado == 1) {
            echo "{'cod': '0',success: 'true'}";
        } elseif ($duplicado == 2) {
            echo ("{'cod': '2', 'etiqueta':'msjAddDescexist'}");
        } else if ($duplicado == 3) {
            echo ("{'cod':'2','modificar':'true' ,'etiqueta':'msjModDescexistMC'}");
        }
    }

    public function modificarnomencladorAction()
    {

        $parametros = $this->_request->getPost();

        if ($parametros['model'] == 'NomMaterialConstruccion') {

            $res = $this->tipomaterialModel->modificarMaterialConstruccion($parametros);
        } else {

            $res = $this->tipomaterialModel->modificarTipoConstruccion($parametros);
        }

        if ($res == 1) {
            echo "{'cod':'0', success: 'true'}";
        } else if ($res == 2) {
            echo ("{'cod':'2','modificar':'true' ,'etiqueta':'msjModDescexistTC'}");
        } else if ($res == 3) {
            echo ("{'cod':'2','modificar':'true' ,'etiqueta':'msjModDescexistMC'}");
        }
    }

    public function eliminarnomencladorAction()
    {

        $parametros = $this->_request->getParams();

        if ($parametros['modelo'] == 'NomMaterialConstruccion') {
            $res = $this->tipomaterialModel->eliminarMaterialConstruccion($parametros);
        } else if ($parametros['modelo'] == 'NomTipoConstruccion') {
            $res = $this->tipomaterialModel->eliminarTipoConstruccion($parametros);
        } else {
            $res = $this->tipomaterialModel->EliminarNomenclador($parametros);
        }

        if ($res) {
            echo "{'CodMsg':1, success: 'true'}";
        } else {
            echo ("{'CodMsg':3,'mensaje':'No se puede eliminar.'}");
        }
    }

    public function activarnomencladorAction()
    {
        $parametros = $this->_request->getParams();
        $res = $this->tipomaterialModel->ActivarNomenclador($parametros);

        if ($res) {
            echo "{success: 'true'}";
        } else {
            echo "{success: 'false'}";
        }
    }

}
