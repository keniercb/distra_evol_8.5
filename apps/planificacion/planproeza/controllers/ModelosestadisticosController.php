<?php

class ModelosestadisticosController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function modelosestadisticosAction() {
        //aqui revisar si hace falta
        //$jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        //$this->view->jsestructura = $jsestructura;
        $this->render();
    }

    //Carga los ejercicios del sistema
    public function listarEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    public function listarProgramasAction() {
        $data = NomDatosnomenclador::getDatosNomPorUriTipoNom("Programa", false);
        echo json_encode(array('data' => $data));
    }

    public function listarPeriodosAction() {
        $data = NomDatosnomenclador::getDatosNomPorUriTipoNom("Períodos", false, "-");
        echo json_encode(array('data' => $data));
    }

    public function listarColumnasPorPeriodoAction() {
        $params['uridatosnomenclador'] = $this->_request->getParam('uridatosnomenclador');
        $data = ReportesproezaModel::cargarColumnasPorPeriodo($params);
        echo json_encode(array('data' => $data));
    }

    public function listarEntidadesClientesAction() {
        $data = ReportesproezaModel::obtenerEntidadesDemandantes();
        echo json_encode(array('data' => $data));
    }

    public function listarDestinosAction() {
        $data = NomDatosnomenclador::getDatosNomPorUriTipoNom("Destino", false, "-");
        echo json_encode(array('data' => $data));
    }

    public function listarEntidadesUIMAction() {
        $identidad = $this->global->Estructura->idestructura;

        $data = ReportesproezaModel::cargarEntidadesUIM($identidad);
        echo json_encode(array('data' => $data));
    }

    //1-Datos para graficar el tab InterEmiyEconomía
    public function graficarInterEmiyEconomiaAction() {

        $params['columnas'] = json_decode(stripslashes($this->_request->getPost('columnas')));
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['orden'] = $this->_request->getPost('orden');
        $params['clientes'] = $this->_request->getPost('clientes');
        $params['programas'] = $this->_request->getPost('programas');
        $params['destinos'] = $this->_request->getPost('destinos');
        $params['uriperiodo'] = $this->_request->getPost('uriperiodo');
        $integrator = ZendExt_IoC::getInstance();
        echo json_encode(ModelosestadisticosModel::interEmiyEconomia($params, $integrator));
    }

    //Datos para graficar el tab PlanInter-Emi 
    //2.1 Mayor Cantidad de demandas
    //2.2 Porciento de importe
    public function graficarPlanInterEmiAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['orden'] = $this->_request->getPost('orden');
        $params['proveedores'] = $this->_request->getPost('proveedores');
        $params['programas'] = $this->_request->getPost('programas');
        $params['destinos'] = $this->_request->getPost('destinos');
        $integrator = ZendExt_IoC::getInstance();
        echo json_encode(ModelosestadisticosModel::planInterEmi($params, $integrator));
    }

    //Datos para graficar el tab Plan de la economia
    //3.1 clientes importe 
    //3.2 clientes porciento
    public function graficarPlanEconomiaAction() {
        $params['columnas'] = json_decode(stripslashes($this->_request->getPost('columnas')));
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['orden'] = $this->_request->getPost('orden');
        $params['clientes'] = $this->_request->getPost('clientes');
        $params['programas'] = $this->_request->getPost('programas');
        $params['destinos'] = $this->_request->getPost('destinos');
        $params['uriperiodo'] = $this->_request->getPost('uriperiodo');
        $integrator = ZendExt_IoC::getInstance();
        echo json_encode(ModelosestadisticosModel::planEconomia($params, $integrator));
    }

    //Datos para graficar el tab Producciones Captadas 
    //4.1 Cantidad de demandas aprobadas contra las que no
    //4.2 Importe de demandas aprobadas contra las que no
    public function graficarProduccionesCaptadasAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        echo json_encode(ModelosestadisticosModel::produccionesCaptadas($params));
    }

    //5 y 6 Datos para graficar el tab Producciones atrasadas/sobrecumplimientos (Control) 
    public function graficarProduccionesAtrasadasSobrecumplimientosAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['orden'] = $this->_request->getPost('orden');
        $params['atraso'] = $this->_request->getPost('atraso');
        $params['programas'] = $this->_request->getPost('programas');
        $params['destinos'] = $this->_request->getPost('destinos');
        $integrator = ZendExt_IoC::getInstance();
        echo json_encode(ModelosestadisticosModel::produccionesAtrasadasSobrecumplimientos($params, $integrator));
    }

    //Datos para graficar el tab Plan Vs Real
    //7.1 Plan Vs Real Semestre
    //7.2 Plan Vs Real Trimestre
    //7.3 Plan Vs Real Mes
    public function graficarPlanVsRealAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['orden'] = $this->_request->getPost('orden');
        $params['clientes'] = $this->_request->getPost('clientes');
        $params['programas'] = $this->_request->getPost('programas');
        echo json_encode(ModelosestadisticosModel::planVsReal($params));
    }

    // Datos para graficar el tab Programas 
    // 8.1 % del total de demandas corresponde a cada programa 
    // 8.2 Importe que corresponde a cada programa
    // 9.1 % del total de demandas corresponde a cada Destino 
    // 9.2 Importe que corresponde a cada Destino

    public function graficarProgramasODestinosAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['orden'] = $this->_request->getPost('orden');
        $params['clasificacion'] = $this->_request->getPost('clasificacion');
        $params['programas'] = $this->_request->getPost('programas');
        $params['destinos'] = $this->_request->getPost('destinos');
        echo json_encode(ModelosestadisticosModel::programasODestinos($params));
    }

}
