<?php

class Reccomplejas2Controller extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function reccomplejas2Action() {
       
       //ZendExt_IoC::getInstance()->comunpersona->ExportarReporte(
        //$this->view->dirScriptsCmpReccomplejas = $this->integrator->reccomplejas2->obtenerScriptsReccomplejas();
        //die('asdasdas');
         $this->view->dirScriptsCmpReccomplejas = ZendExt_IoC::getInstance()->reccomplejas2->obtenerScriptsReccomplejas();
       //die('yismel');
       // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

}

?>
