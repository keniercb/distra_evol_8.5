<?php

/**
 * Created by PhpStorm.
 * User: Osleidy
 * Date: 16/01/2017
 */
class CmpdiagramaganttController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function cmpdiagramaganttAction()
    {
        $this->render();
    }

    function tareasganttAction()
    {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->arrayTiposElementos = json_decode(
            stripslashes($this->_request->getPost('arrayTiposElementos'))
        );
        $parametros->idproy = $this->_request->getPost('idproy');
        $model = new CmpganttModel();
        if ($parametros->idproy != '') {
            $result = $model->tareasGanttProy($parametros);
        } else {
            $result = $model->tareasGantt($parametros);
        }
        //print_r($result);die;
        echo json_encode($result);
    }




} 