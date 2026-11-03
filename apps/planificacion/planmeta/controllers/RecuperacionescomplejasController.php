<?php

/**
 * BasesParaPlanController
 * Controlador para gestionar las bases para un plan
 *
 * @ author Pedro Enrique Rojas Aguilar
 * @ package PlanificaciÃƒÆ’Ã‚Â³n
 * @ subpackage PlanificaciÃƒÆ’Ã‚Â³n Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 1.0-0
 * */
class RecuperacionescomplejasController extends ZendExt_Controller_Secure
{

    /**
     * init
     * Inicializar el componente
     * */
    public function init()
    {


        parent::init();
    }

//fin de la funciÃƒÆ’Ã‚Â³n init

    /**
     * gestActividades
     * Renderizar la vista
     * */
    public function RecuperacionescomplejasAction()
    {

        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->view->recuperacionescomplejas
            = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        $this->render();
    }

}
