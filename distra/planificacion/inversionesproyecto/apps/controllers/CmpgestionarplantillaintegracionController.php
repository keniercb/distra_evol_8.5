<?php

require_once __DIR__ . '/../../proyecto/planeacion/controllers/CmpgestionarplantillaController.php';

class CmpgestionarplantillaintegracionController extends CmpgestionarplantillaController {

//Arielon 2.0
    public function init() {
        parent::init();
    }

    public function cmpgestionarplantillaintegracionAction() {
        $this->view->extensionesPLAN
            = $this->pIntegrator->integracion->extensionesPLAN();
        $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
        $this->view->matrizrelacionesComponent
            = $this->pIntegrator->integracion->matrizrelacionesComponent();
        $this->view->getJSRelaciones
            = $this->integrator->planpdo->getJSRelaciones();
        $this->view->getJSPert
            = $this->integrator->planpdo->getJSPert();
        $this->render();
    }

}
