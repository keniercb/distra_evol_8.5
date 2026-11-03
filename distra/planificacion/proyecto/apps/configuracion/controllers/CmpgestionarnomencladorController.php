<?php

/**
 * @author
 * 
 * @version
 * @copyright
 */
class CmpgestionarnomencladorController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function cmpgestionarnomencladorAction() {
        $this->view->jsNomenclador = $this->pIntegrator->configuracionpdo->getJSNomenclador();
        $this->render();
    }


}

?>