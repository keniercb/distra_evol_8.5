<?php

/**
 * @author
 * 
 * @version
 * @copyright
 */
class CmpfondodetiempoController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function cmpfondodetiempoAction() {
        $this->view->jsFondodetiempo = $this->pIntegrator->configuracionpdo->getJSFondodetiempo();
        $this->render();
    }

    function cargaInicialAction() {
        return true;
    }

}

?>