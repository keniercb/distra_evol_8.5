<?php

/**
 * Created by PhpStorm.
 * User: Ariel
 * Date: 07/08/2015
 * Time: 9:26
 */
class CmpdiagramaganttController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function cmpdiagramaganttAction()
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

    function actividadesparaganttAction()
    {
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
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->listarARC = $this->_request->getPost('listarARC');
        $parametros->listarCapitulos = $this->_request->getPost('listarCapitulos');
        $model = new CmpgestionaractividadesModel();
        if ($parametros->idplan != '') {
            $result = $model->actividadesParaGanttPlan($parametros);
        } else {
            $result = $model->ActividadesParaGantt($parametros);
        }
        //print_r($result);die;
        echo json_encode($result);
    }

    function detallesdeganttAction()
    {
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
    function eliminarDependenciaAction()
    {
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

    /**
     * Accion para eliminar una Dependencia de una actividad
     */
    function modificarFechaGanttAction()
    {
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

    /**
     * Accion para cargar el combo planes
     */
    function cargarComboPlanesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;
        $model = new CmpgestionaractividadesModel();
        $respuesta = $model->cargarComboPlanes($parametros);
        if ($respuesta != null) {
            foreach ($respuesta as $val) {
                $dat->data [] = array('idplan'       => $val['idplan'],
                                      'denominacion' => $val['denominacion']

                );
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }


} 