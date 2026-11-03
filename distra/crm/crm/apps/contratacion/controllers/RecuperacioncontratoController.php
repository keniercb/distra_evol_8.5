<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 11:31 AM
 */
class RecuperacioncontratoController extends ZendExt_Controller_Secure
{


    function init()
    {
        parent::init();
        $this->model = new RecuperacionContratoModel();
    }

    function recuperacioncontratoAction()
    {
//        $this->render();
    }

    function getMainRecuperacionContratoAction(){
        $result = $this->model->getMainRecuperacionContrato($this->_request->getParams());
        echo json_encode($result);
    }

    function calcularMontosTotalesAction(){
        $result = $this->model->calcularMontosTotales($this->_request->getParams());
        echo json_encode($result);
    }

}