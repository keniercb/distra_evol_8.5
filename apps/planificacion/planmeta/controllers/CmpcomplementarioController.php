<?php

/**
 * Cierre para la Planificacion
 * Controlador para el control del a ejecucion
 *
 * @ author NBV
 * @ package Planificación
 * @ subpackage Planificacion material
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class CmpcomplementarioController extends ZendExt_Controller_Secure
{

    /**
     * funcion init()
     * Para inicializar el modulo
     * */
    function init()
    {
        parent::init();
    }

    function efectuaracciondwhAction()
    {

        ini_set("max_execution_time", 3600);
        $parametros->tipoelemento = $this->_request->getPost('elemento');
        $parametros->accion = $this->_request->getPost('accion');

        $objcierremodel = new CmpcomplementarioModel();
        switch ($parametros->accion) {
            case 'Cierre':
                $respuesta = $objcierremodel->EfectuarCierre($parametros);
                break;
            case 'Actualizar':
                $respuesta = $objcierremodel->EfectuarActualizacion(
                    $parametros
                );

                break;
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

}
