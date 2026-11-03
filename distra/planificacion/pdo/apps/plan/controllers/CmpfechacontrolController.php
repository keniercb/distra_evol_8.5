<?php

/**
 * Controlador para gestionar actividades
 *

 */
class CmpfechacontrolController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     *
     */
    function init()
    {
        parent::init();
    }

    function cargarfechascontrolAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariosession = $this->global->Perfil->idusuario;
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $objcmpfechacontrolmodel = new CmpfechacontrolModel();
        $arrayfechascontrol = $objcmpfechacontrolmodel->CargarFechasControl(
            $parametros
        );
        if (isset($arrayfechascontrol[0])) {
            echo json_encode(
                array('data' => $arrayfechascontrol,
                      'total' => count($arrayfechascontrol))
            );
        } else {
            echo json_encode(array('data' => array(), 'total' => 0));
        }
    }

    function adicionarfechascontrolAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->fechacontrol = $this->_request->getPost('dffechacontrol');
        $parametros->comentario = $this->_request->getPost('hcomentario');
        $parametros->fechacreacion = date('d/m/Y');
        $objcmpfechacontrolmodel = new CmpfechacontrolModel();
        $respuesta = $objcmpfechacontrolmodel->AdicionarFechaControl(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function eliminarfechascontrolAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->arrayidfechascontrol = json_decode(
            stripslashes($this->_request->getPost('arrayidfechascontrol'))
        );
        $objcmpfechacontrolmodel = new CmpfechacontrolModel();
        $respuesta = $objcmpfechacontrolmodel->EliminarFechasControl(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

}


