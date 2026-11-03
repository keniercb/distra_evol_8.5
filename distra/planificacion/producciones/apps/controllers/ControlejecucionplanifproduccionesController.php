<?php

class ControlejecucionplanifproduccionesController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function controlejecucionplanifproduccionesAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    //Lista los ejercicios de la planificacion    
    public function cargarEjerciciosAction() {
        $data = null;
        $data->data = $this->pIntegrator->planmeta->obtenerEjercicios();
        echo json_encode($data);
    }

}
