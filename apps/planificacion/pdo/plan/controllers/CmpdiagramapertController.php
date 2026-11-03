<?php

/**
 * Controlador para gestionar desviaciones
 *

 */
class CmpdiagramapertController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista cmpgestionardesviaciones.phtml
     */
    function cmpdiagramapertAction()
    {
        try {
            $this->view->getJSCompresion = $this->pIntegrator->proyecto->getJSCompresion();
        } catch (Exception $e) {
            $this->view->getJSCompresion = null;
        }
        try {
            $this->view->extensionesPLAN
                = $this->pIntegrator->integracion->extensionesPLAN();
            $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
            $this->view->matrizrelacionesComponent
                = $this->pIntegrator->integracion->matrizrelacionesComponent();
        } catch (Exception $e) {
            $this->view->matrizrelacionesComponent = null;
            $this->view->extensionesPLAN = null;
            $this->view->pyeComun = null;
        }

        $this->render();
    }


    function obtenerActividadesPertAction()
    {

        $arrayActividadesPert = array();
        $arrayRelacionesPert = array();
        $duracionPlan = 0;
        $duracionPlanTotal = "";
        $nodosCriticos = array();
        $relacionNodosCriticos = array();
        $caminoCritico = array();
        $arrayGrupoHitos = array();

        $parametros->elemento = json_decode(stripslashes($this->_request->getPost('elemento')));
        $parametros->idTipoElemento = $this->_request->getPost('idTipoElemento');
        $parametros->generarDiagramaDesde = $this->_request->getPost('generarDiagramaDesde');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->dependenciaTotal = 1;
        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;

        $objDiagramaPert = new CmpDiagramaPertModel();
        $resultado = $objDiagramaPert->ObtenerActividadesPert($parametros);
        if (isset($resultado['arrayActividadesPert'][0])) {
            $arrayActividadesPert = $resultado['arrayActividadesPert'];
            $arrayRelacionesPert = $resultado['arrayRelacionesPert'];
            $duracionPlan = $resultado['duracionPlan'];
            $nodosCriticos = $resultado['nodosCriticos'];
            $relacionNodosCriticos = $resultado['relacionNodosCriticos'];
            $caminoCritico = $resultado['caminoCritico'];
            $duracionPlanTotal = $resultado['duracionPlanTotal'];
            $cantTareasParalelas = $resultado['cantTareasParalelas'];
        }
        $arrayGrupoHitos = (isset($resultado['arrayGrupoHitos'][0])) ? $resultado['arrayGrupoHitos'] : array();
        // print_r($caminoCritico);die;
        echo json_encode(array('actividadesPert' => $arrayActividadesPert, 'relacionesPert' => $arrayRelacionesPert, 'duracionPlan' => $duracionPlan,
            'nodosCriticos' => $nodosCriticos, 'relacionNodosCriticos' => $relacionNodosCriticos, 'caminoCritico' => $caminoCritico,
            'duracionPlanTotal' => $duracionPlanTotal, 'cantTareasParalelas' => $cantTareasParalelas, 'arrayGrupoHitos' => $arrayGrupoHitos));


    }

    function cargarTareasAEjecutarAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idproyecto = $this->_request->getPost('idproyecto');

        $objDiagramaPert = new CmpDiagramaPertModel();
        $arrayTareas = $objDiagramaPert->ObtenerTareasParaGestionarEjecucion($parametros);

        if (isset($arrayTareas['resultado'][0])) {
            echo json_encode(
                array('success' => true, 'campos' => $arrayTareas['resultado'])
            );
        }
    }

    function obtenerTareasDeUnProyectoOPlantillaAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idproyecto = $this->_request->getPost('idproyecto');

        $objDiagramaPert = new CmpDiagramaPertModel();
        $arrayTareas = $objDiagramaPert->obtenerTareasDeUnProyectoOPlantilla($parametros);

        if (isset($arrayTareas['resultado'][0])) {
            echo json_encode(
                array('success' => true, 'campos' => $arrayTareas['resultado'])
            );
        }
    }

    function obtenerHitosDadoProyectoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idproyecto = $this->_request->getPost('idproyecto');
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;


        if (!empty($parametros->idproyecto)) {
            $objDiagramaPert = new CmpDiagramaPertModel();
            $arrayHitos = $objDiagramaPert->obtenerHitosDadoElemento($parametros);
            if (isset($arrayHitos[0])) {
                echo json_encode(
                    array('success' => true, 'data' => $arrayHitos)
                );
            }
        } else {
            echo json_encode(
                array('success' => true, 'data' => array())
            );
        }


    }

    function obtenerPlanesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $params->idusuario = $this->global->Perfil->idusuario;
        $params->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $params->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;

        $cmpDiagramaPertModel = new CmpDiagramaPertModel();
        $arrayplanes = $cmpDiagramaPertModel->obtenerPlanes($params);
        if (isset($arrayplanes[0])) {
            echo json_encode(
                array('success' => true, 'data' => $arrayplanes)
            );
        } else {
            echo json_encode(
                array('success' => true, 'data' => array())
            );
        }
    }

}

