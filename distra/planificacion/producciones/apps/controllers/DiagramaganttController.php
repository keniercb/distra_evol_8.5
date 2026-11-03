<?php

class DiagramaganttController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function diagramaganttAction() {
        try {
            $usargd = $this->pIntegrator->planpdo->verificarGestorDoc();
        } catch (Exception $e) {
            $usargd = false;
            $this->view->usarGD = '<script> var usarGD = false; </script>';
        }
        if ($usargd) {
            $this->view->gestdoc = '';
            $this->view->usarGD = '<script> var usarGD = true; </script>';
        } else {
            $this->view->usarGD = '<script> var usarGD = false; </script>';
            $this->view->gestdoc = '';
        }
        $dircmp = 'planificacion/pdo/plan/views/scripts/cmpdiagramagantt/cmpdiagramagantt.phtml';
        $gantt = $this->integrator->planificacion->obtenerJS($dircmp);
        if (!$gantt)
            echo('El componente Gantt no se encuentra disponible.');
        else {
            $this->view->diagramaGantt = $gantt;
            $this->render();
        }
    }

}
