<?php

class ServiciosController extends ZendExt_Controller_Secure {


    /**
     * @method init() - Constructor de la clase.
     * @return void
     */
    public function init()
    {
        parent::init();
    }

    public function getServiceAction() {
        $this->render();
    }

  
}
