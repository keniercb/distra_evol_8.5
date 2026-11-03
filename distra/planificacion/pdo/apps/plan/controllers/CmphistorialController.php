<?php

/**
 * Controlador de historial
 *
 * @author    Osleidy Quiala Fernáandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmphistorialController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista historial.phtml
     */
    function cmphistorialAction()
    {
        $this->render();
    }

    /**
     * Accion para listar Actividades
     */
    function listarActividadesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->sort = $this->_request->getPost('sort');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->dir = $this->_request->getPost('dir');
        $parametros->start = ($this->_request->getPost('start'))
            ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit'))
            ? $this->_request->getPost('limit') : 1000;
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->integrator = $this->integrator;
        $model = new CmphistorialModel();
        $result = $model->listarActividades($parametros);
        echo json_encode($result);
    }

    /**
     * Accion para listar Planes
     */
    function listarPlanesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->sort = $this->_request->getPost('sort');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->dir = $this->_request->getPost('dir');
        $parametros->start = ($this->_request->getPost('start'))
            ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit'))
            ? $this->_request->getPost('limit') : 1000;
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->integrator = $this->integrator;
        $model = new CmphistorialModel();
        $result = $model->listarPlanes($parametros);
        echo json_encode($result);
    }

    /**
     * Accion para listar Objetivos
     */
    function listarObjetivosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->sort = $this->_request->getPost('sort');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->dir = $this->_request->getPost('dir');
        $parametros->start = ($this->_request->getPost('start'))
            ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit'))
            ? $this->_request->getPost('limit') : 1000;
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->integrator = $this->integrator;
        $model = new CmphistorialModel();
        $result = $model->listarObjetivos($parametros);
        echo json_encode($result);
    }

    /**
     * Accion para listar Objetivos
     */
    function listarFIPAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->sort = $this->_request->getPost('sort');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->dir = $this->_request->getPost('dir');
        $parametros->start = ($this->_request->getPost('start'))
            ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit'))
            ? $this->_request->getPost('limit') : 1000;
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->integrator = $this->integrator;
        $model = new CmphistorialModel();
        $result = $model->listarFIP($parametros);
        echo json_encode($result);
    }

    /**
     * Accion para Eliminar Historial
     */
    function eliminarhistorialAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->arrayIdhistorial = json_decode(
            stripslashes($this->_request->getPost('array_idhistorial'))
        );
        $model = new CmphistorialModel();
        $respuesta = $model->EliminarHistorial($parametros);
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para Comparar historial de actividad con version actual
     */
    function compactualactividadAction($parametros)
    {
        ini_set("max_execution_time", 3600);
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->idhistorial = $this->_request->getPost('idhistorial');
        $parametros->punt = $this->_request->getPost('puntualizacion');
        $model = new CmphistorialModel();
        $actual = $model->comActualActividad($parametros);
        $seleccionada = $model->seleccionada($parametros);
        echo json_encode(
            array('seleccionada' => $seleccionada, 'actual' => $actual[0])
        );
    }

    function compactualfipAction($parametros)
    {
        ini_set("max_execution_time", 3600);
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->idhistorial = $this->_request->getPost('idhistorial');
        $parametros->punt = $this->_request->getPost('puntualizacion');
        $model = new CmphistorialModel();
        $actual = $model->comActualFIP($parametros);
        $seleccionada = $model->seleccionada($parametros);
        echo json_encode(
            array('seleccionada' => $seleccionada, 'actual' => $actual[0])
        );
    }

    /**
     * Accion para Comparar historial de objetivo con version actual
     */
    function compactualobjetivoAction($parametros)
    {
        ini_set("max_execution_time", 3600);
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->idhistorial = $this->_request->getPost('idhistorial');
        $model = new CmphistorialModel();
        $actual = $model->compactualobjetivo($parametros);
        $seleccionada = $model->seleccionada($parametros);
        echo json_encode(
            array('seleccionada' => $seleccionada, 'actual' => $actual[0])
        );
    }

    /**
     * Accion para Comparar historial de plan con version actual
     */
    function compactualplanAction($parametros)
    {
        ini_set("max_execution_time", 3600);
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->idhistorial = $this->_request->getPost('idhistorial');
        $model = new CmphistorialModel();
        $actual = $model->compactualplan($parametros);
        $seleccionada = $model->seleccionada($parametros);
        echo json_encode(
            array('seleccionada' => $seleccionada, 'actual' => $actual[0])
        );
    }

    /**
     * Accion para Comparar historial con version anterior
     */
    function comphistorialanteriorAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->idhistorial = $this->_request->getPost('idhistorial');
        $model = new CmphistorialModel();
        $anterior = $model->compAnterior($parametros);
        $seleccionada = $model->seleccionada($parametros);
        echo json_encode(
            array('seleccionada' => $seleccionada, 'anterior' => $anterior[0])
        );
    }

    /**
     * Accion para ver detalles de un historial seleccionado
     */
    function seleccionadaAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idhistorial = $this->_request->getPost('idhistorial');
        $model = new CmphistorialModel();
        $result = $model->seleccionada($parametros);
        echo json_encode($result);
    }


}
