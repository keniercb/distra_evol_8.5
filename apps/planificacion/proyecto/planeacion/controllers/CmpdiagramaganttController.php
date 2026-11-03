<?php

/**
 * Created by PhpStorm.
 * User: Ariel
 * Date: 07/08/2015
 * Time: 9:26
 */
class CmpdiagramaganttController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function cmpdiagramaganttAction() {
        $this->view->extensionesPLAN = $this->pIntegrator->integracion->extensionesPLAN();
        $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
        $this->view->matrizrelacionesComponent = $this->pIntegrator->integracion->matrizrelacionesComponent();
        $this->view->getJSRelaciones = $this->pIntegrator->planpdo->getJSRelaciones();
        $this->view->getJSPert = $this->pIntegrator->planpdo->getJSPert();
        $this->view->jsreportes = $this->pIntegrator->reportes->devolverJS();
        $this->render();
    }

    function cargarDiagramaDeGanttAction() {

        $parametros->idusuariosession = $this->global->Perfil->idusuario;
        $parametros->denominacion = $this->_request->getPost('denominacion');
        /* $parametros->fechainicio = $this->_request->getPost('fechainicio');
          $parametros->fechafin = $this->_request->getPost('fechafin'); */
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $filista = explode('-', $fechainicio);
        $fflista = explode('-', $fechafin);

        $parametros->fechainicio = $filista[1] . '/' . $filista[0] . '/' . $filista[2];
        $parametros->fechafin = $fflista[1] . '/' . $fflista[0] . '/' . $fflista[2];
        $parametros->idproyecto = $this->_request->getPost('idproyecto'); //9000021303;

        $modelGantt = new CmpdiagramaganttModel();
        $result = $modelGantt->obtenerHitosTareasGanttDadoProyecto($parametros);

        echo json_encode($result);
    }

    function actividadesparaganttAction() {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->arrayTiposElementos = json_decode(
                stripslashes($this->_request->getPost('arrayTiposElementos'))
        );
        $parametros->actividades = $this->_request->getPost('actividades');
        $parametros->proyectos = $this->_request->getPost('proyectos');
        $parametros->material = $this->_request->getPost('material');
        $parametros->inversiones = $this->_request->getPost('inversiones');
        $parametros->idplan = $this->_request->getPost('idplan');
        $model = new CmpgestionaractividadesModel();
        if ($parametros->idplan != '') {
            $result = $model->actividadesParaGanttPlan($parametros);
        } else {
            $result = $model->ActividadesParaGantt($parametros);
        }
        echo json_encode($result);
    }

    function detallesdeganttAction() {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;
        $parametros->idactividad = $this->_request->getPost('idactividad');
        $model = new CmpgestionaractividadesModel();
        $result = $model->DetallesDeGantt($parametros);
        echo json_encode($result);
    }

    /**
     * Accion para eliminar una Dependencia de una actividad
     */
    function eliminarDependenciaAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idelementopadre = $this->_request->getPost(
                'idelementopadre'
        );
        $parametros->idelementohijo = $this->_request->getPost(
                'idelementohijo'
        );
        $parametros->origen = $this->_request->getPost('origen');
        $objactmodel = new CmpgestionaractividadesModel();
        $respuesta = $objactmodel->eliminarDependencia($parametros);
        echo json_encode(array('mensaje' => $respuesta));
    }

    function modificarFechaGanttAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->finiact = $this->_request->getPost('finiact');
        $parametros->ffinact = $this->_request->getPost('ffinact');
        $parametros->idactividad = $this->_request->getPost('idactividad');
        $parametros->efecto = $this->_request->getPost('efecto');
        $parametros->tipo = $this->_request->getPost('tipo');
        $parametros->gantt = 1;
        if ($parametros->tipo == 3) {
            $objActModel = new CmpgestionaractividadesModel();
            $respuesta = $objActModel->modificarFechaGantt($parametros);
        } else {
            $objElemenModel = new CmpgestionarelementoModel();
            $respuesta = $objElemenModel->modificarFechaGanttE($parametros);
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    function obtenerTareasParaGanttAction() {

        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->idproyecto = 9000021303; //$this->_request->getPost('idproyecto');

        $model = new CmpdiagramaganttModel();
        $result = $model->obtenerHitosTareasGanttDadoProyecto($parametros);

        echo json_encode($result);
    }

}

