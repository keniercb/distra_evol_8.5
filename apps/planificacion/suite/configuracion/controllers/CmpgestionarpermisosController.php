<?php

/**
 * @author
 * 
 * @version
 * @copyright
 */
class CmpgestionarpermisosController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function cmpgestionarpermisosAction() {
        $this->view->jsPermisos = $this->pIntegrator->configuracionpdo->getJSPermisos();
        $this->render();
    }

}

?>