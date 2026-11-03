<?php

class ReportereccomplejaController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function reportereccomplejaAction()
    {
        $this->view->reccompleja = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        $this->render('reportereccompleja');
    }


}