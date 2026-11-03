<?php

/**
 * Controlador para gestionar ejercicios *
 */
class CmpejercicioController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
        $this->model = new CmpgestionarejercicioModel();
    }

    /**
     * Accion para mostrar la vista gestionar ejercicio
     */
    function cmpejercicioAction()
    {
        $this->view->extensionesPLAN = $this->pIntegrator->integracion->extensionesPLAN();
        $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
        $this->view->matrizrelacionesComponent = $this->pIntegrator->integracion->matrizrelacionesComponent();
        $this->view->getJSRelaciones = $this->pIntegrator->planpdo->getJSRelaciones();
        $this->view->getJSPert = $this->pIntegrator->planpdo->getJSPert();
        $this->render();
    }

    /**
     * Accion para listar los ejercicios
     */
    function listarEjerciciosAction()
    {
        $parametros->identidad = $this->_request->getPost('idEstructura');
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 15;
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $data = $this->model->listarEjercicios($parametros);
        echo json_encode(array('total' => $data['total'], 'data' => $data['data']));
    }

    /**
     * Accion para adicionar los ejercicios
     */
    function adicionarEjercicioAction()
    {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->identidad = $this->_request->getPost('identidad');
        $parametros->denejercicio = $this->_request->getPost('tfdenominacion');
        $parametros->desejercicio = ($this->_request->getPost('tfdescripcion')) ? $this->_request->getPost('tfdescripcion') : '';
        $parametros->arrayElementos = json_decode($this->_request->getPost('arrayElementos'));
        $temp = $this->model->adicionarEjercicio($parametros);
        if ($temp != 0) {
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    /**
     * Accion para modificar los ejercicios
     */
    function modificarEjercicioAction()
    {
        $parametros->idejercicio = $this->_request->getPost('idejercicio');
        $parametros->denejercicio = $this->_request->getPost('tfdenominacion');
        $parametros->desejercicio = ($this->_request->getPost('tfdescripcion')) ? $this->_request->getPost('tfdescripcion') : '';
        $parametros->arrayElementos = json_decode($this->_request->getPost('arrayElementos'));
        $temp = $this->model->modificarEjercicio($parametros);
        if ($temp != 0) {
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    /**
     * Accion para eliminar los ejercicios
     */
    function eliminarEjercicioAction()
    {
        $arrayidejercicios = json_decode($this->_request->getPost('arrayidejercicios'));
        $this->model->eliminarEjercicio($arrayidejercicios);
        echo json_encode(array('mensaje' => 1));
    }

}
