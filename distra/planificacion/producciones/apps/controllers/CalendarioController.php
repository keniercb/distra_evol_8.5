<?php

/**
 * Created by PhpStorm.
 * User: Ariel
 * Date: 07/08/2015
 * Time: 9:26
 */
class CalendarioController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function calendarioAction() {
        $dircmp = 'planificacion/pdo/plan/views/scripts/cmpcalendarionuevo/cmpcalendarionuevo.phtml';
        $calendario = $this->integrator->planificacion->obtenerJS($dircmp);
        if (!$calendario)
            echo('El componente Calendario no se encuentra disponible.');
        else {
            $this->view->usarGD = '<script> var usarGD = false; </script>';
            $this->view->gestdoc = '';
            $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
            $this->view->jsestructura = $jsestructura;
            $this->view->calendario = $calendario;
            $this->render();
        }
    }

    public function cargarElementosCalAction() {
        $idestructura = json_decode($this->_request->getPost('idestructura'));
        if (!empty($idestructura)) {
            $parametros['idestructura'] = $idestructura;
            $fechainicio = $this->_request->getPost('start');
            $fechafin = $this->_request->getPost('end');
            $filista = explode('-', $fechainicio);
            $fflista = explode('-', $fechafin);
            $parametros['fechainicio'] = $filista[1] . '/' . $filista[0] . '/' . $filista[2];
            $parametros['fechafin'] = $fflista[1] . '/' . $fflista[0] . '/' . $fflista[2];
            $calendarioModel = new CalendarioModel();
            $actividadesProd = $calendarioModel->obtenerActividadesProduccionConFecha($parametros);
            if (isset($actividadesProd[0])) {
                foreach ($actividadesProd as $value => $actividad) {
                    $fechainicio = explode(' ', $actividad['fechainicio']);
                    $horainicio = $fechainicio[1];
                    $fechainicio = explode('/', $fechainicio[0]);
                    $fechafin = explode(' ', $actividad['fechafin']);
                    $horafin = $fechafin[1];
                    $fechafin = explode('/', $fechafin[0]);
                    $startdatelegible = $fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0];
                    $enddatelegible = $fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0];
                    $actividadesProd[$value]['start'] = $startdatelegible . ' 08:00';
                    $actividadesProd[$value]['end'] = $enddatelegible . ' 17:00';
                    $actividadesProd[$value]['modificar'] = 0;
                    $actividadesProd[$value]['eliminar'] = 0;
                    $actividadesProd[$value]['color'] = '#00CCFF';
                }
                echo json_encode(array('data' => $actividadesProd));
            } else {
                echo json_encode(array('data' => array()));
            }
        } else
            echo json_encode(array('data' => array()));
    }

    public function cargarCalendariosInicialesAction() {
        echo json_encode(array());
    }

}
