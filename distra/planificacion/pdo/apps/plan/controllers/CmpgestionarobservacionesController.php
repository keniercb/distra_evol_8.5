<?php

/**
 * Controlador para gestionar observaciones
 *

 */
class CmpgestionarobservacionesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     *
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionarplan.phtml
     */
    function cmpgestionarobservacionesAction()
    {
        $this->render();
    }


    /**
     * Accion para cargar las observaciones de un determinado elemento
     *
     */
    function cargarobservacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $idelemento = $this->_request->getPost('idelemento');
        $objcmpobsmodel = new CmpgestionarobservacionesModel();
        $arrayobservaciones = $objcmpobsmodel->CargarObservaciones(
            $idelemento, $idusuariocrea
        );
        echo json_encode($arrayobservaciones);
    }


    /**
     * Accion para adicionar las observaciones
     *
     */
    function adicionarobservacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $asunto = $this->_request->getPost('asunto');
        $cuerpo = $this->_request->getPost('cuerpo');
        $idelemento = $this->_request->getPost('idelemento');
        $idusuariocrea = $this->global->Perfil->idusuario;
        $objcmpobsmodel = new CmpgestionarobservacionesModel();
        $respuesta = $objcmpobsmodel->AdicionarObservaciones(
            $asunto, $cuerpo, $idelemento, $idusuariocrea
        );
        echo json_encode(array('mensaje' => $respuesta));
    }


    /**
     * Accion para eliminar las observaciones
     *
     */
    function eliminarobservacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrayidobservaciones = json_decode(
            stripslashes($this->_request->getPost('arrayidobservaciones'))
        );
        $objcmpobsmodel = new CmpgestionarobservacionesModel();
        $respuesta = $objcmpobsmodel->EliminarObservaciones(
            $arrayidobservaciones
        );
        echo json_encode(array('mensaje' => $respuesta));
    }
}


