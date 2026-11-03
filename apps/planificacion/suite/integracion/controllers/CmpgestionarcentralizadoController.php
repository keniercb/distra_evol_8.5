<?php

/**
 * @author
 * 
 * @version
 * @copyright
 */
class CmpgestionarcentralizadoController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function cmpgestionarcentralizadoAction() {
        $this->render();
    }

    function tareasParaGanttAction()
    {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->arrayTiposElementos = json_decode(
            stripslashes($this->_request->getPost('arrayTiposElementos'))
        );
        $parametros->idproy = $this->_request->getPost('idproy');
        $model = new CmpIntegracionModel();
        if ($parametros->idproy != '') {
            $result = $model->tareasParaGanttProy($parametros);
        } else {
            $result = $model->tareasParaGantt($parametros);
        }
        echo json_encode($result);
    }



}

?>