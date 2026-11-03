<?php

/**
 * Created by JetBrains PhpStorm.
 * User: adrian
 * Date: 4/09/13
 * Time: 9:48
 * To change this template use File | Settings | File Templates.
 */
class ViewconfigController extends ZendExt_Controller_Secure
{

    private $model;

    function init()
    {
        $this->model = new ViewConfigModel();
        parent::init();
    }

    function viewconfigAction()
    {
        $this->render();
    }

    public function cargarconfiguracionAction(){
        $idusuario = $this->_request->getPost('idusuario');

        $datos = $this->model->cargarConfiguracionByUsuario($idusuario);
        echo json_encode($datos);

    }

    public function salvarconfiguracionAction(){
        $idusuario = $this->_request->getPost('idusuario');
        $datos = $this->_request->getPost('datos');
        $this->model->salvarConfiguracionVistaByUsuario($idusuario, $datos);
        echo json_decode(array("codMsg"=> "OK"));
    }
}
