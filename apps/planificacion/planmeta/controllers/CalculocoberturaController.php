<?php

class CalculocoberturaController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function calculocoberturaAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function cargaInicialAction() {
        //servicio para obtener el id de la entidad que esta logueada
        $identidad = $this->global->Estructura->idestructura;
        $denoEntidad = $this->global->Estructura->denominacion;
        $compEntidad = DatEntidaddatosnomenclador::getComportamientoDadoEntidad($identidad);
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

    public function ListarCombEntidadesAction() {
        $idcentrobalance = 1; //numero fijo en la BD para Nomdatosnomenclador
        $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);
        foreach ($centrobalance as $k => $valor) {
            $dat [$k] ['identidad'] = $valor ['identidad'];
            $datosentidad = $this->integrator->metadatos->DameEstructura($valor ['identidad']);
            $dat [$k] ['denominacion'] = $datosentidad [0]->denominacion;
            $dat [$k] ['identidaddatosnomenclador'] = $valor ['identidaddatosnomenclador'];
        }
        echo json_encode(array('data' => $dat));
    }

    public function listarindicadoresAction() {
        $parametros = Array();
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');

        if ($this->_request->getPost('identL')) {
            $parametros['entidad'] = $this->_request->getPost('identL');
        } else {
            $parametros['entidad'] = $this->global->Estructura->idestructura;
        }

        $model = new CentrodebalanceModel();
        $parametros['filtros'] = $model->ordenarFiltrosListarExportar($this->_request->getPost('filtros'));

        if ($this->_request->getPost('identL') == "") {
            $result->datos = Array();
            $result->total = 0;
            echo json_encode($result);
        } else {
            $parametros['contar'] = true;
            $parametros['listar'] = true;
            $result = $model->listarIndCTEyOtros($parametros);
            if ($result[0] == null) {
                $result[0] = array();
            }
            echo json_encode(
                    array('data' => $result[0], 'total' => $result[1])
            );
        }
    }

    function exportarAction() {
        $parametros = Array();
        $parametros['entidad'] = $this->_request->getParam('identsel');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['nomsel'] = $this->_request->getParam('nomsel');

        $parametros['filt'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        CentrodebalanceModel::exportarExistenciasEntidades($parametros);
    }

    public function calcularCTEAction() {
        $parametros = Array();
        $parametros['arrayind'] = json_decode(stripslashes($this->_request->getPost('array')));
        $model = new CentrodebalanceModel();
        $result = $model->ActualizarCamposAjusteEntidad($parametros);

        if ($result == 3) {
            echo("{'codMsgL':23 }");
        } else {
            if ($result == 1) {
                echo("{'codMsgL':24 }");
            } else {
                if ($result == 2) {
                    echo("{'codMsgL':25 }");
                }
            }
        }
    }

    function actualizarCTEAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $params['identidad'] = array($this->_request->getParam('identidad'));
        $params['is_leaf'] = $this->_request->getParam('is_leaf');
        if ($params['is_leaf'] == 'false') {
            //buscar los hijos
            $arrayEnts = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad'][0]);
            $arrayEnts[] = $params['identidad'][0];
            $params['identidad'] = $arrayEnts;
        }
        echo json_encode(
                array('codMsg' => CentrodebalanceModel::actualizarExistencias($params))
        );
    }

    function actualizarDesdePlanAction() {
        ini_set("max_execution_time", 7200); //600:10min 3600:1hora 7200:2horas
        echo json_encode(
                array('codMsg' => CentrodebalanceModel::actualizarExistenciasPorPlan())
        );
    }

    function listarIndCCAction() {
        $parametros['start'] = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['hoja'] = $this->_request->getPost('hoja');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        if ($parametros['hoja'] == 'false') {
            $parametros['entidadeshijas'] = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros['identidad']);
        }
        ini_set("max_execution_time", 7200);

        $parametros['idcentrobalance'] = DatEntidaddatosnomenclador::getIdentidaddatosnomenclador(
                        $parametros['identidad']
        );
        $parametros['idcentrobalance'] = $parametros['idcentrobalance'][0]['identidaddatosnomenclador'];


        //pregunto por los filtos y si biene alguno lo agrego a la busqueda
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $key => $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['filtros']['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'cantidad'
                ) {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['cantidad_condicion1'] = array('cantidad' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['cantidad_condicion2'] = array('cantidad' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['cantidad_condicion3'] = array('cantidad' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'numeropieza') {
                    $parametros ['filtros']['numeropieza'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'idumedida'
                ) {
                    $parametros ['filtros']['idumedida'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'plan'
                ) {
                    $parametros ['filtros']['idmodelo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'importe'
                ) {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['importe_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['importe_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['importe_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                }
            }
        }
        $data = DatPlanModel::getIndCC($parametros);
        foreach ($data->data as $key => $value) {
            $UM = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($value['idumedida'])
            );
            $data->data[$key]['idumedida'] = $UM->denominacion;
        }
        echo json_encode($data);
    }

    function adicionarIndCCAction() {
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idindicador'] = json_decode(stripslashes($this->_request->getPost('idindicadores')));
        $entro = false;
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');

        foreach ($parametros['idindicador'] as $value) {
            $obj = new DatAjusteexistencia();
            $obj->idejercicio = $parametros['idejercicio'];
            $obj->identidad = $parametros['identidad'];
            $obj->idindicador = $value->idindicador;
            $obj->idaprobacion = 1;
            $obj->generadoconmat = 0;
            $res = DatAjusteexistenciaModel::insertardatAjusteexistencia_cc($obj);
            if ($res == 0) {
                $entro = true;
            } else {
                if ($res == 21) {
                    DatAjusteexistenciaModel::adicionardatAjusteexistencia_cc($obj);
                }
            }
        }
        if ($entro) {
            echo json_encode(array('codMsg' => '1'));
        } else {
            echo json_encode(array('codMsg' => $res));
        }
    }

    function eliminarIndCCAction() {
        $parametros['idajusteexistencia'] = $this->_request->getPost('idajusteexistencia');
        $obj = Doctrine::getTable('DatAjusteexistencia')->find($parametros['idajusteexistencia']);
        $obj->delete();
        echo json_encode(array('codMsg' => '21'));
    }

    public function listarModelosAction() {
        $global = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $global->Estructura->idestructura;
        $data->data = DatEntidadmodelo::servBP_getModeloAsocEntidad(
                        $idEstructura
        );
        $data->data[] = array('idmodelo' => '-', 'denominacion' => '-');
        echo json_encode($data);
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
        echo json_encode(array('data' => $modelActEnt->gestPermisos($params)));
    }

    public function getEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicio(); //$modelActEnt->listarEjercicios();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

}
