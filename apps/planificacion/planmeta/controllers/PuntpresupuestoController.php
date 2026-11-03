<?php

/**
 * PuntpresupuestoController
 * Controlador para la puntualizacion del presupuesto
 *
 * @ author Damian Oscar Falcon Borras
 * @ package Planificaci?n
 * @ subpackage Planificaci?n Empresarial y Presupuestaria
 * @ copyright SISPLAN
 * @ version 1.0-0
 * */
class PuntpresupuestoController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function puntpresupuestoAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

}
