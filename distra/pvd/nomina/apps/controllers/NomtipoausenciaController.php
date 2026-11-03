<?php

class NomtipoausenciaController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function nomtipoausenciaAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    

}

?>
