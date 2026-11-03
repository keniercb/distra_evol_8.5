<?php
/**
 * Created by PhpStorm.
 * User: fidel
 * Date: 6/06/14
 * Time: 9:39
 */

class PublisherController extends ZendExt_Controller_Secure
{

    public function getAction(){

        $module = $this->_request->modulo;
        $service = $this->_request->service;
        $params =json_decode( $this->_request->params,true);
        //print_r($_REQUEST);die;
        if(!is_array($params)){
            $params=array();
        }

        //$this->integrator->notification->enviarAviso('asd','asd');die;
        $result = call_user_func_array(
            array($this->integrator->$module,$service), $params);
        //print_r($result);die;
        if(is_object($result)){
            $result=json_encode($result);
        }
        echo json_encode($result);
    }
    public function publisherAction(){
        $this->render();
    }

}