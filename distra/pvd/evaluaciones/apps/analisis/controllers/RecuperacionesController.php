<?php

class RecuperacionesController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function recuperacionesAction() {
        $this->view->dirScriptsCmpReccomplejas = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        $this->render();
    }

}