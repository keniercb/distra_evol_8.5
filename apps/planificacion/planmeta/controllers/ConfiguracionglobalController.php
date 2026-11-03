<?php

/**
 * ConfigurarejercicioplanificacionController
 * Controlador para gestionar las bases para un plan
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 1.0-0
 * */
class ConfiguracionglobalController extends ZendExt_Controller_Secure
{

    /**
     * init
     * Inicializar los atributos de la clase
     *
     * @return void
     */
    function init()
    {
        parent::init();
    }

    /**
     *
     * Renderizar la vista
     * */
    public function configuracionglobalAction()
    {
        $this->render();
    }

//fin de la funcion gestcolumnas

    public function listarEjercicioActualAction()
    {
        $ejact = NomEjercicioplanificacion::listarEjercicioActual();
        echo json_encode(array('ej' => $ejact->anno));
    }

    public function configurarEjercicioAction()
    {
        $ej = $this->_request->getPost('nbejercicio');
        $margen = $this->_request->getPost('margen');
        $ejactual = NomEjercicioplanificacion::listarEjercicioActual();
        $ejactual->actual = 0;
        $ejactual->save();

        if (Doctrine::getTable('NomEjercicioplanificacion')->find($ej)) {
            $newej = Doctrine::getTable('NomEjercicioplanificacion')->find($ej);
            $newej->actual = 1;
            $newej->save();
        } else {
            $newej = new NomEjercicioplanificacion();
            $newej->actual = 1;
            $newej->ejercicio = $ej;
            $newej->save();
        }
        echo json_encode(array('m' => 1));
    }

//fin de la funcion gestcolumnas
}