<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 11:31 AM
 */
class RecuperaciondesgloseController extends ZendExt_Controller_Secure
{


    function init()
    {
        parent::init();
        $this->model = new RecuperacionDesgloseModel();
    }

    function recuperaciondesglosenAction()
    {
//        $this->render();
    }

    function getMainRecuperacionDesgloseAction(){
        $result = $this->model->getMainRecuperacionDesglose($this->_request->getParams());
        echo json_encode($result);
    }

}