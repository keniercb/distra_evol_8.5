<?php

class DesgloseporviaadquisicionController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar el componente
     * */
    public function init() {


        parent::init();
    }

    public function desgloseporviaadquisicionAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    function exportarAction() {
        if ($this->_request->getParam('identidad')) {
            $parametros['idcb'] = $this->_request->getParam('identidad');
        } else {
            $parametros['idcb'] = $this->global->Estructura->idestructura;
        }
        $parametros['idmodelo'] = $this->_request->getParam('id_plan');
        $parametros['entidad'] = $this->_request->getParam('entidad');
        $parametros['plan'] = $this->_request->getParam('plan');
        $parametros['masunavia'] = $this->_request->getParam('cheq');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['filt'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        $dvamodel = new DesgloseporviaadquisicionModel();
        $dvamodel->exportar($parametros);
    }

    public function cargaInicialAction() {
        //servicio para obtener el id de la entidad que esta logueada
        $identidad = $this->global->Estructura->idestructura;

        $denoEntidad = $this->global->Estructura->denominacion;
        $compEntidad = DatEntidaddatosnomenclador::getComportamientoDadoEntidad(
                        $identidad
        );
        $entidadCB = NomIndicador::entidadEsCB($identidad);
        $entidadOD = NomIndicador::entidadEsOD($identidad);
        $formato = $this->integrator->datosmaestros->listarFormatos();
        foreach ($formato as $valor) {
            if ($valor->nombre == 'Indicadores') {
                $idformatoInd = $valor->idformato;
                $nombreFormatoInd = "Indicadores";
            }
        }
        if ($idformatoInd == '') {
            echo("{'codMsg':21 }");
        } else {
            echo json_encode(
                    array('identidad' => $identidad,
                        'idformatoInd' => $idformatoInd,
                        'nombreFormatoInd' => $nombreFormatoInd,
                        'entidadCB' => $entidadCB,
                        'entidadOD' => $entidadOD,
                        'denoEntidad' => $denoEntidad,
                        'compEntidad' => $compEntidad[0][identidaddatosnomenclador])
            );
        }
    }

    public function listarComboPlanesAction() {
        $identidad = $this->_request->getPost('identidad');
        $cbmodel = new CentrodebalanceModel();
        $data = $cbmodel->listarModelosAsociados($identidad);
        echo json_encode(array('data' => $data));
    }

    public function gestPermisosAction() {
        $arrayReferenciaDesglosada = array();
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['identidad'] = $this->global->Estructura->idestructura;
        $params['idfuncionalidad'] = $_SERVER['REQUEST_URI'];

        $arrayReferenciaDesglosada = explode("/", $params['idfuncionalidad']);
        $params['idfuncionalidad'] = $arrayReferenciaDesglosada[1];
        for ($i = 2; $i < count($arrayReferenciaDesglosada) - 1; $i++) {
            $params['idfuncionalidad'] .= '/' . $arrayReferenciaDesglosada[$i];
        }
        $params['idfuncionalidad'] .= '/' . $arrayReferenciaDesglosada[count(
                        $arrayReferenciaDesglosada
                ) - 2];

        $modelActEnt = new DatActividadentidadModel();
        echo json_encode($modelActEnt->gestPermisos($params));
    }

    public function listarComboModelosAction() {
        ini_set("max_execution_time", 3600); //1hora        
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['idcb'] = $this->_request->getPost('identidad');
        $parametros['esrector'] = $this->_request->getPost('esrector');
        $parametros['hijosentidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                        $parametros['identidad']
        );
        $parametros['cb'] = $this->_request->getPost('cb');
        $parametros['check'] = $this->_request->getPost('check');
        $cbmodel = new DatPlanModel();
        $data = $cbmodel->obtenerPlanesEntidad($parametros);
        echo json_encode(array('data' => $data));
    }

    public function cargarEntidadesCBAction() {
        $entidadlogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;
        if ($this->_request->getPost('node')) {
            $idEstructura = $this->_request->getPost('node');
        } else {
            $idEstructura = $entidadlogueada;
        }

        $iddominio = $this->global->Perfil->iddominio;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
                $iddominio, $idEstructura, 0, 0, 3
        );

        $result = array();
        $len = count($dominios);
        $datosentidad = $this->integrator->metadatos->DameEstructura(
                $idEstructura
        );
        $dominios[$len]['id'] = $idEstructura;
        $dominios[$len]['text'] = $datosentidad [0]->denominacion;
        foreach ($dominios as $key => $val) {
            if (NomIndicador::entidadEsCB($val['id'])) {
                $result[$key] = $val;
                $result[$key]['qtip'] = $val['text'];
                $result[$key]['leaf'] = true;
            }
        }
        $result = array_values($result);
        echo json_encode($result);
    }

    public function listarindicadoresAction() {
        $start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros = Array();

        if ($this->_request->getPost('identidad')) {
            $parametros['idcb'] = $this->_request->getPost('identidad');
        } else {
            $parametros['idcb'] = $this->global->Estructura->idestructura;
        }
        $parametros['idmodelo'] = $this->_request->getPost('idmodel');
        $parametros['masunavia'] = $this->_request->getPost('cheq');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $model = new CentrodebalanceModel();
        $parametros['filtros'] = $model->ordenarFiltrosListarExportarDesgVA($this->_request->getPost('filtros'));

        //Creo el objeto de mi tabla principal
        $cbmodel = new CentrodebalanceModel();
        //Almaceno en data todos los indicadores a mostrar para eso empleo el metodo siguiente
        if ($parametros['idmodelo'] != "") {
            $parametros['listar'] = true;
            $parametros['contar'] = true;
            $data = $cbmodel->listarIndicadoresVia($start, $limit, $parametros);

            if ($data->codMsg != null) {
                $array->data = Array();
                $array->total = 0;
                $array->importetotal = 0;

                echo json_encode($array);
            } else {
                echo json_encode($data);
            }
        } else {
            $array->data = Array();
            $array->total = 0;
            $array->importetotal = 0;

            echo json_encode($array);
        }
    }

    public function listarViasOrganoAction() {
        $params = Array();
        $params['idindicador'] = $this->_request->getPost('idindicador');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $params['filtros'] = $this->_request->getPost('filtros');

        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $dvamodel = new DesgloseporviaadquisicionModel();
        $params['listar'] = true;
        $params['contar'] = true;
        $data = $dvamodel->listarDesglosePorViaYOrgano($params, $start, $limit);
        echo json_encode($data);
    }

    public function gestionarAprobacionAction() {
        $parametros = Array();
        $parametros['idindicador'] = $this->_request->getPost('idindicador');
    }

    public function desglosarDemandaAction() {
        $parametros = Array();
        $parametros['idindicador'] = $this->_request->getPost('idindicador');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['arraydesglose'] = json_decode(
                stripslashes($this->_request->getPost('desglose'))
        );
        $parametros['demanda'] = $this->_request->getPost('demanda');

        $model = new DesgloseporviaadquisicionModel();
        $data = $model->desglosar($parametros);
        echo json_encode(array('codMsg' => $data));
    }

    public function aprobarDesaprobarAction() {
        $params['idajusteexistenciacb'] = $this->_request->getPost(
                'idajusteexistenciacb'
        );
        $params['valor'] = $this->_request->getPost('idaprobacion');
        $params['desgloses'] = json_decode(
                stripslashes($this->_request->getPost('desgloses'))
        );
        $params['idindicador'] = $this->_request->getPost('idindicador');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $cbmodel = new CentrodebalanceModel();
        $data = $cbmodel->aprobarDesaprobarDesglose($params);
        echo json_encode(array('codMsg' => $data));
    }

    public function eliminarDesglosesViaAction() {
        $params['idindicador'] = $this->_request->getPost('idindicador');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $params['desgloses'] = json_decode(
                stripslashes($this->_request->getPost('desgloses'))
        );
        $dvamodel = new DesgloseporviaadquisicionModel();
        $res = $dvamodel->eliminarDesglose($params);
        echo json_encode(array('codMsg' => $res));
    }

    public function listarCentroBalanceViaAction() {
        $idcentrobalance = 1; //numero fijo en la BD para Nomdatosnomenclador
        $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(
                        $idcentrobalance
        );
        foreach ($centrobalance as $k => $valor) {
            $dat [$k] ['idcentrobalance'] = $valor ['identidad'];
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $valor ['identidad']
            );
            $dat [$k] ['centrobalance'] = $datosentidad [0]->denominacion;
            $dat [$k] ['identidaddatosnomenclador'] = $valor ['identidaddatosnomenclador'];
        }
        echo json_encode(array('data' => $dat));
    }

    public function listarViaAdquisicionAction() {
        $id = $this->_request->getPost('idindicador');

        $viamodel = new DatIndicadorviaadquisicion();
        $data->data = $viamodel->ObtenerViasAdquisIndicadorAsociado($id);
        foreach ($data->data as $indice => $valor) {
            unset($data->data[$indice]);
            $data->data[$indice]['idviaadquisicion'] = $valor['idviaadquisicion'];
            $data->data[$indice]['denominacion'] = $valor['NomViaadquisicion']['denominacion'];
        }
        echo json_encode($data);
    }

    public function listarOrgSatisfaceAction() {
        $id = $this->_request->getPost('idindicador');
        $orgmodel = new DatIndicadorviaadquisicionorganosatisface();
        $data->data = $orgmodel->obtenerOrganoSatisfIndicadorAsociado($id);
        foreach ($data->data as $indice => $valor) {
            unset($data->data[$indice]);
            $data->data[$indice]['idorganosatisface'] = $valor['idorganosatisface'];
            $data->data[$indice]['denominacion'] = $valor['NomOrganosatisface']['denominacion'];
        }

        echo json_encode($data);
    }

    public function listarTodosOSAction() {
        $orgmodel = new NomOrganosatisface();
        $dat = $orgmodel->obtenerOrgSatisface();
        echo json_encode(array('data' => $dat));
    }

    public function listarTodasViaAction() {
        //$id = $this->_request->getPost('idindicador');
        $orgmodel = new NomOrganosatisface();
        $dat = $orgmodel->obtenerOrgSatisface();
        echo json_encode(array('data' => $dat));
    }

    public function listarViasAction() {
        $data->data = DatIndicadorviaadquisicion::listarTodasLasVias();
        foreach ($data->data as $indice => $valor) {
            unset($data->data[$indice]);
            $data->data[$indice]['idvia'] = $valor['idviaadquisicion'];
            $data->data[$indice]['denominacion'] = $valor['denominacion'];
        }
        echo json_encode($data);
    }

    public function listarOSNivel1Action() {
        $dvamodel = new DesgloseporviaadquisicionModel();
        echo json_encode($dvamodel->listarOS_XPorNivel(1));
    }

}
