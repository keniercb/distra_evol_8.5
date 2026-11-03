<?php

class AnalisisplanificacionController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function analisisplanificacionAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    //Carga los ejercicios del sistema
    public function listarEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    //Carga los CB
    public function listarArbolEntidadesCBAction() {
        $global = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $global->Estructura->idestructura;
        $rector = $this->_request->getPost('rector');
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        $data = $modelAnalisisplanificacion->listarEntidades($idEstructura, $rector);
        echo json_encode(array('data' => $data));
    }

    //Carga codigos de los indicadores
    public function listarCodigoIndAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        $data = $modelAnalisisplanificacion->listarCodigoInd($this->_request->getPost());
        echo json_encode(array('data' => $data->data, 'total' => $data->total));
    }

    //Datos para graficar el tab Act-Niveles de actividad
    public function graficarActNivelesActividadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->actNivelesActividad($this->_request->getPost()));
    }

    //Datos para graficar el tab Niveles de actividad
    public function graficarNivelesActividadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->nivelesActividad($this->_request->getPost()));
    }

    //Datos para graficar Calculo. Relación ingresos-gastos
    public function graficarCalculoRIngresoAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->CalculoRIngreso($this->_request->getPost()));
    }

    //Datos para graficar Calculo. Relación ingresos-gastos XETID [Encadenamiento]
    public function graficarCalculoEncadenamientoAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->CalculoEncadenamiento($this->_request->getPost()));
    }

    //Datos para graficar Calculo. Planes por entidad
    public function graficarCalculoPlanesPorEntidadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->graficarCalculoPlanesPorEntidad($this->_request->getPost()));
    }

    //Datos para graficar el tab Plan - Normalizados y directos
    public function graficarPlanNormalizadosDirectosAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->PlanNormalizadosDirectos($this->_request->getPost()));
    }

    //Datos para graficar el tab Plan - Balance financiero
    public function graficarPlanBalanceFinancieroAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->PlanBalanceFinanciero($this->_request->getPost()));
    }

    //Datos para graficar el tab Plan - Mas demandados
    public function graficarPlanMasdemandadosAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->PlanMasdemandados($this->_request->getPost()));
    }

    //Datos para graficar el tab Plan - Mas valiosos
    public function graficarPlanMasvaliososAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->PlanMasvaliosos($this->_request->getPost()));
    }

    //Datos para graficar el tab Plan - Resumen por Entidad
    public function graficarPlanResumenEntidadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->PlanResumenEntidad($this->_request->getPost()));
    }

    //Datos para graficar el tab Plan - Resumen por cb
    public function graficarPlanResumenCBAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->PlanResumenCB($this->_request->getPost()));
    }

    //Datos para graficar el tab Calculo de carga-capacidad
    public function calcularCargaCapacidadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->calcularCargaCapacidad($this->_request->getPost()));
    }

    //Datos para graficar el tab BM - CTE-necesidad
    public function graficarBMCTENecesidadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->BMCTENecesidad($this->_request->getPost()));
    }

    //Datos para graficar el tab BM - CPE-demanda
    public function graficarBMCPEDemandaAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->BMCPEDemanda($this->_request->getPost()));
    }

    //Datos para graficar el tab CEPlan - global * entidad
    public function graficarCEPlanglobalentidadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->graficaEjecucionglobalxentidad($this->_request->getPost()));
    }

    //Datos para graficar el tab CEPlan - global * entidad * plan
    public function graficarCEPlanglobalentidadplanAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->CEPlanglobalentidadplan($this->_request->getPost()));
    }

    //Datos para graficar el tab CEPlan - trimestre
    public function graficarCEPlantrimestreAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->CEPTrimestre($this->_request->getPost()));
    }

    //Datos para graficar el tab CEPlan - mes
    public function graficarCEPlanmesAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->CEPMes($this->_request->getPost()));
    }

    //Datos para graficar el tab CEPlan - mas valiosos
    public function graficarCEPlanmasValiososAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->CEPlanmasValiosos($this->_request->getPost()));
    }

    //Datos para graficar el tab CEPlan - mas valiosos fuera de plan
    public function graficarCEPlanmasValiososFueraPlanAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->graficarCEPlanmasValiososFuera($this->_request->getPost()));
    }

    //Datos para graficar el tab CEPlan - mas y menos ejecutados
    public function graficarCEPlanmasymenosejecutadosAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->CEPlanmasMenosEjecutados($this->_request->getPost()));
    }

    //Datos para graficar el tab CEPlan - ejecutados * VA
    public function graficarCEPlanejecutadosVAAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->graficarCEPlanejecutadosVA($this->_request->getPost()));
    }

    //Datos para graficar el tab CE - NA - global * entidad
    public function graficarCENAglobalEntidadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->graficarCENAglobalEntidad($this->_request->getPost()));
    }

    //Datos para graficar el tab CE - NA - mes
    public function graficarCENAMesAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->CENAMes($this->_request->getPost()));
    }

    //Datos para graficar el tab CE - NA - mas valiosas
    public function graficarCENAMasValiosasAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->CENAmasValiosos($this->_request->getPost()));
    }

    //Datos para graficar el tab CE - NA - mas ejecutadas
    public function graficarCENAMasEjecutadasAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->CENAmasMenosEjecutados($this->_request->getPost()));
    }

    //Datos para graficar el tab CE - NA - total * entidad
    public function graficarCENAtotalEntidadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->graficarCENATotal($this->_request->getPost()));
    }

    //Datos para graficar linea de tiempo actividades LT
    public function graficarLineaTiempoAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->LineaTiempo($this->_request->getPost()));
    }

    //Datos para graficar Histograma
    public function graficarHistogramaAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->Histograma($this->_request->getPost()));
    }

    //Datos para graficar el tab Residuos
    public function graficarResiduosAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode($modelAnalisisplanificacion->residuos($this->_request->getPost()));
    }

    //Listar planes filtro
    public function listarPlanesAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode(array('data' => $modelAnalisisplanificacion->listarPlanes($this->_request->getPost())));
    }

    //Listar CB filtro
    public function listarCBAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode(array('data' => $modelAnalisisplanificacion->listarCB($this->_request->getPost())));
    }

    //Listar VA filtro
    public function listarViasAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode(array('data' => $modelAnalisisplanificacion->listarVias()));
    }

    //Listar OS filtro
    public function listarOrganosAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionModel();
        echo json_encode(array('data' => $modelAnalisisplanificacion->listarOrganos()));
    }

    //Listar UM filtro
    public function listarUMAction() {
        $data = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $data));
    }

    //Listar Esp filtro    
    public function listarEspecialidadesAction() {
        $especialidades = DatActividadentidad::obtenerEspecialidadesAct();
        $arrayFormatoMaxnivel = NomActividad::obtener_ConfFormato_UltimoNivel();
        echo json_encode(
                array('data' => $especialidades,
                    'ultimonivel' => $arrayFormatoMaxnivel[1])
        );
    }

}
