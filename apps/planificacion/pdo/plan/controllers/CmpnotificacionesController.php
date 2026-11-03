<?php

/**
 * Controlador para exportar-importar datos
 *
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpnotificacionesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista notificaciones.phtml
     */
    function cmpnotificacionesAction()
    {
        try {
            $usargd = $this->pIntegrator->planpdo->verificarGestorDoc();
        } catch (Exception $e) {
            $usargd = false;
        }
        if ($usargd) {
            $this->view->gestdoc
                = '';//$this->integrator->gestordocumental->devolverJSContenido();
            $this->view->usarGD = '<script> var usarGD = false; </script>';
        } else {
            $this->view->usarGD = '<script> var usarGD = false; </script>';
            $this->view->gestdoc = '';
        }
        $this->render();
    }

    function cargarTipoNotificacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $objNotificacionesModel = new CmpnotificacionesModel();
        $result = $objNotificacionesModel->cargarTipoNotificaciones();
        echo json_encode(array('datos' => $result));
    }


    function cargarNotificacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $noleidas = $this->_request->getPost('noleidas');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        if ($this->_request->getParam('asunto')) {
            $asunto = $this->_request->getParam('asunto');
        }
        if ($this->_request->getParam('idaccion')) {
            $idaccion = $this->_request->getParam('idaccion');
        }
        if ($this->_request->getParam('arraytipoelem')) {
            $arraytipoelem = json_decode(
                stripslashes($this->_request->getPost('arraytipoelem'))
            );
        }
        if ($this->_request->getParam('fecha')) {
            $fecha = json_decode(
                stripslashes($this->_request->getPost('fecha'))
            );
            if ($fecha) {
                $fech = $fecha;
                $fech = explode('T', $fech);
                $fecha = $fech[0];
            }
        }
        if ($this->_request->getParam('autores')) {
            $autores = json_decode(
                stripslashes($this->_request->getPost('autores'))
            );
        }
        $idusuario = $this->global->Perfil->idusuario;
        $involucrado = new DatInvolucrados();
        $usuariorelacionado = $involucrado->dameInvolucradosDadoIdUsuario(
            $idusuario
        );
        $idusuariorelacionado = $usuariorelacionado[0]['idinvolucrado'];
        $objNotificacionesModel = new CmpnotificacionesModel();
        $result = $objNotificacionesModel->cargarNotificaciones(
            $idusuario, $idusuariorelacionado, $asunto, $idaccion,
            $arraytipoelem, $fecha, $autores, $limit, $start, $noleidas
        );

        if ($noleidas) {
            echo json_encode(
                array('success' => true, 'cantidad_total' => $result['total'], 'notificaciones' => $result['datos'])
            );
        } else {
            echo json_encode(
                array('total' => $result['total'], 'datos' => $result['datos'])
            );
        }
    }

    function eliminarNotificacionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrayidnotificaciones = json_decode(
            stripslashes($this->_request->getPost('idnotificacion'))
        );

        $idusuario = $this->global->Perfil->idusuario;
        $involucrado = new DatInvolucrados();
        $usuariorelacionado = $involucrado->dameInvolucradosDadoIdUsuario(
            $idusuario
        );
        $idusuariorelacionado = $usuariorelacionado[0]['idinvolucrado'];
        $objNotificacionesModel = new CmpnotificacionesModel();
        $result = $objNotificacionesModel->eliminarNotificacion(
            $idusuario, $idusuariorelacionado, $arrayidnotificaciones
        );
        if ($result) {
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    function eliminarTodasNotificacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

        $idusuario = $this->global->Perfil->idusuario;
        $involucrado = new DatInvolucrados();
        $usuariorelacionado = $involucrado->dameInvolucradosDadoIdUsuario(
            $idusuario
        );

        $idusuariorelacionado = $usuariorelacionado[0]['idinvolucrado'];

        $obj = new CmpnotificacionesModel();
        $arrayidnotificaciones = $obj->getArrayIdNotificaciones($idusuariorelacionado, $idusuario);

//        print_r($arrayidnotificaciones);die;


        $objNotificacionesModel = new CmpnotificacionesModel();
        $result = $objNotificacionesModel->eliminarNotificacion(
            $idusuario, $idusuariorelacionado, $arrayidnotificaciones
        );
        if ($result) {
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    function notificacionLeidaAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idnotificacion = $this->_request->getParam('idnotificacion');
        $idusuario = $this->global->Perfil->idusuario;
        $involucrado = new DatInvolucrados();
        $usuariorelacionado = $involucrado->dameInvolucradosDadoIdUsuario(
            $idusuario
        );
        $idusuariorelacionado = (count($usuariorelacionado)==0)?null:$usuariorelacionado[0]['idinvolucrado'];
        $objNotificacionesModel = new CmpnotificacionesModel();
        $result = $objNotificacionesModel->actualizarNotificacion(
            $idusuario, $idusuariorelacionado, $idnotificacion
        );
        if ($result) {
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    function nuevaNotificacionAction()
    {
        //$notificaciones = $this->_request->getPost('notificaciones');
        //$idusuario = $this->global->Perfil->idusuario;
        /*$objNotificacionesModel = */
        new CmpnotificacionesModel();
    }

    function jsonNotificacionAction()
    {
        $pathDataJson = $_SERVER['DOCUMENT_ROOT'];
        $pathDataJson = str_ireplace('/web', '/apps', $pathDataJson);
        $pathDataJson .= '/planificacion/comun/recursos/xmpp/';
        $diferencias = 0;
        $idusuario = $this->global->Perfil->idusuario;
        if (file_exists($pathDataJson . $idusuario . '.json')) {
            $diferencias++;
            unlink($pathDataJson . $idusuario . '.json');
        }
        echo $diferencias;
    }


}

