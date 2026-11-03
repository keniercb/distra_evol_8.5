<?php

class ReportecomplejoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function reportecomplejoAction()
    {
        $this->view->reccompleja = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        $this->render('reportecomplejo');
    }


}