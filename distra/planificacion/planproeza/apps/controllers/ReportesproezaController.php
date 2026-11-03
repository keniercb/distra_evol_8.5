<?php

class ReportesproezaController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function reportesproezaAction() {
        $this->render();
    }

    public function cargarEjerciciosAction() {
        $data = null;
        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        $ejercicios = $this->pIntegrator->planmeta->obtenerEjercicios();
        foreach ($ejercicios as $key => $ejercicio) {
            $ejercicios[$key]['denominacion'] = $ejercicio['ejercicio'] . ' (' . $ejercicio['denomestado'] . ')';
        }
        $data->data = $ejercicios;
        echo json_encode($data);
    }

    public function cargarUnidaddeMedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function cargarPeriodosAction() {
        $data = NomDatosnomenclador::getDatosNomPorUriTipoNom("Períodos", false, "-");
        echo json_encode(array('data' => $data));
    }

    public function cargarColumnasPorPeriodoAction() {
        $params['uridatosnomenclador'] = $this->_request->getParam('uridatosnomenclador');
        $data = ReportesproezaModel::cargarColumnasPorPeriodo($params);
        echo json_encode(array('data' => $data));
    }

    public function cargarProgramasAction() {
        $data = NomDatosnomenclador::getDatosNomPorUriTipoNom("Programa", false);
        echo json_encode(array('data' => $data));
    }

    public function cargarDestinosAction() {
        $data = NomDatosnomenclador::getDatosNomPorUriTipoNom("Destino", false, "-");
        echo json_encode(array('data' => $data));
    }

    public function cargarEntidadesUIMAction() {
        $identidad=$this->global->Estructura->idestructura;
        
        $data = ReportesproezaModel::cargarEntidadesUIM($identidad);
        echo json_encode(array('data' => $data));
    }

    public function cargarEntidadesClientesAction() {
        $data = ReportesproezaModel::obtenerEntidadesDemandantes();
        echo json_encode(array('data' => $data));
    }

    public function listarIndicadoresControladosAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function exportarReporteAction() {
        try {
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['denoejercicio'] = $this->_request->getParam('denoejercicio');
            $params['idperiodo'] = $this->_request->getParam('idperiodo');
            $params['uriperiodo'] = $this->_request->getParam('uriperiodo');
            $params['denoperiodo'] = $this->_request->getParam('denoperiodo');
            $params['idcumplimiento'] = $this->_request->getParam('idcumplimiento');           
            $params['columnas'] = json_decode(stripslashes($this->_request->getParam('columnas')));
            $params['entidadesUIM'] = $this->_request->getParam('entidadesUIM');
            $params['clientes'] = $this->_request->getParam('clientes');
            $params['programas'] = json_decode(stripslashes($this->_request->getParam('programas')));
            $params['destinos'] = json_decode(stripslashes($this->_request->getParam('destinos')));
            $params['idindicadores'] = $this->_request->getParam('idindicadores');
            $params['um'] = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
         
            ReportesproezaModel::exportarReportes($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

   

}
