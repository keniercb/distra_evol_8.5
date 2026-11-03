<?php

class RedistribucionController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar el componente
     * */
    function init() {
        parent::init();
    }

    /**
     * redistribucion
     * Renderizar la vista
     * */
    public function redistribucionAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function listarComboCentroBalanceAction() {
        ini_set("max_execution_time", 3600); //1hora
        $idcentrobalance = 1;
        $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(
                        $idcentrobalance
        );

        foreach ($centrobalance as $k => $valor) {
            $dat[$k]['idcentrobalance'] = $valor['identidaddatosnomenclador'];
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $valor['identidad']
            );
            $dat[$k]['centrobalance'] = $datosentidad[0]->denominacion;
        }
        echo json_encode(array('data' => $dat));
    }

    public function listarIndocadoresConDemandaAction() {
        ini_set("max_execution_time", 3600); //1hora
        $parametros['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $parametros['idcentrobalance'] = $this->_request->getPost(
                        'idcentrobalance'
                ) ? $this->_request->getPost(
                        'idcentrobalance'
                ) : -1;
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');

        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['filtros']['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'umedida'
                ) {
                    $parametros ['filtros']['umedida'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'precio'
                ) {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['precio_condicion1'] = array('precio' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['precio_condicion2'] = array('precio' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['precio_condicion3'] = array('precio' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'preciomlc') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['preciomlc_condicion1'] = array('preciomlc' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['preciomlc_condicion2'] = array('preciomlc' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['preciomlc_condicion3'] = array('preciomlc' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'numeropieza') {
                    $parametros ['filtros']['numeropieza'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacioncb'
                ) {
                    $parametros ['filtros']['denominacioncb'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'satisfecha'
                ) {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['satisfecha_condicion1'] = array('satisfecha' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['satisfecha_condicion2'] = array('satisfecha' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['satisfecha_condicion3'] = array('satisfecha' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'esd') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['esd_condicion1'] = array('esd' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['esd_condicion2'] = array('esd' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['esd_condicion3'] = array('esd' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'porciento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['porciento_condicion1'] = array('porciento' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['porciento_condicion2'] = array('porciento' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['porciento_condicion3'] = array('porciento' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'dns') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['dns_condicion1'] = array('dns' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['dns_condicion2'] = array('dns' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['dns_condicion3'] = array('dns' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'importe') {
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
                } elseif ($datos ['field'] == 'importedns') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['importedns_condicion1'] = array('importedns' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['importedns_condicion2'] = array('importedns' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['importedns_condicion3'] = array('importedns' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'importesatisfecha') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['importesatisfecha_condicion1'] = array('importesatisfecha' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['importesatisfecha_condicion2'] = array('importesatisfecha' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['importesatisfecha_condicion3'] = array('importesatisfecha' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'flete') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['flete_condicion1'] = array('flete' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['flete_condicion2'] = array('flete' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['flete_condicion3'] = array('flete' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'contingencia') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['contingencia_condicion1'] = array('contingencia' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['contingencia_condicion2'] = array('contingencia' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['contingencia_condicion3'] = array('contingencia' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'importefila') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['importefila_condicion1'] = array('importefila' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['importefila_condicion2'] = array('importefila' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['importefila_condicion3'] = array('importefila' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'demanda') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['demanda_condicion1'] = array('demanda' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['demanda_condicion2'] = array('demanda' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['demanda_condicion3'] = array('demanda' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                }
            }
        }


        $rdmodel = new RedistribucionModel();
        if ($parametros['idcentrobalance'] == -1) {
            $array->datos = Array();
            $array->total = 0;
            $array->importetotal = 0;
            $array->importesatisfecha = 0;
            $array->importedns = 0;
            echo json_encode($array);
        } else {
            $datos = $rdmodel->listarIndicadoresDemandados(
                    $parametros['start'], $parametros['limit'], $parametros
            );
            echo json_encode($datos);
        }
    }

    public function ejecutarRedistribucionAction() {
        ini_set("max_execution_time", 3600); //1hora
        $params['idcentrobalance'] = $this->_request->getPost(
                'idcentrobalance'
        );
        $rdmodel = new RedistribucionModel();
        $datos->codMsg = $rdmodel->redistribuirExcedente($params);
        echo json_encode($datos);
    }

    public function listarEspAbastecedorasAction() {
        ini_set("max_execution_time", 3600); //1hora
        $params['idcentrobalance'] = $this->_request->getPost('idcentrobalance') ? $this->_request->getPost('idcentrobalance') : -1;
        $params['idindicador'] = $this->_request->getPost('idindicador');
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['filtros'] = $this->_request->getPost('filtros');
        $rdmodel = new RedistribucionModel();
        if ($params['idcentrobalance'] == -1) {
            $array->datos = Array();
            $array->total = 0;
            echo json_encode($array);
        } else {
            $data = $rdmodel->listarRedistribucion($params);
            echo json_encode($data);
        }
    }

    public function cargarUMAction() {
        ini_set("max_execution_time", 3600); //1hora
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas(
        );
        foreach ($unidades as $key => $value) {
            $unidades[$key]['denominacionunidadmedida'] = strtoupper(
                    $value['denominacionunidadmedida']
            );
        }
        echo json_encode(array('data' => $unidades));
    }

    public function listarComboEspAction() {
        ini_set("max_execution_time", 3600); //1hora
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $especialidades = $this->nomenclador->selectParam(
                'nom_especialidad', array('idespecialidad', 'denespecialidad')
        );
        echo json_encode(array('data' => $especialidades));
    }

    public function exportarAction() {
        ini_set("max_execution_time", 3600); //1hora
        $params = array();
        $params['idcentrobalance'] = $this->_request->getParam(
                        'idcentrobalance'
                ) ? $this->_request->getParam(
                        'idcentrobalance'
                ) : -1;
        $params['filtros'] = stripslashes($this->_request->getParam('filtros'));
        $rdmodel = new RedistribucionModel();
        $rdmodel->exportar($params);
    }

    public function listarProdPorEspAction() {
        ini_set("max_execution_time", 3600); //1hora
        $params['idindicador'] = $this->_request->getPost('idindicador');
        $params['idespecialidadsisplan'] = $this->_request->getPost(
                'idespecialidad'
        );
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        $rdmodel = new RedistribucionModel();
        $data = $rdmodel->listarProdPorEsp($params);
        echo json_encode($data);
    }

    public function listarProductosAction() {
        ini_set("max_execution_time", 3600); //1hora
        $parametros['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['hoja'] = $this->_request->getPost('hoja');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');

        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['filtros']['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'numeropieza') {
                    $parametros ['filtros']['numeropieza'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacioncb') {
                    $parametros ['filtros']['denominacioncb'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'demanda') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['demanda_condicion1'] = array('demanda' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['demanda_condicion2'] = array('demanda' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['demanda_condicion3'] = array('demanda' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'coberturatotalestimada') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['coberturatotalestimada_condicion1'] = array('coberturatotalestimada' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['coberturatotalestimada_condicion2'] = array('coberturatotalestimada' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['coberturatotalestimada_condicion3'] = array('coberturatotalestimada' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'unidadmedida') {
                    $parametros ['filtros']['unidadmedida'] = $datos ['data'] ['value'];
                } elseif ($datos['field'] == 'situacion') {
                    $parametros ['filtros']['situacion'] = $datos ['data'] ['value'];
                }
            }
        }
        $rdmodel = new RedistribucionModel();
        if ($parametros['hoja'] == "true") {
            $result = $rdmodel->ListarProductPadres($parametros);
        } else {
            $result = $rdmodel->ListarProductHijas($parametros);
        }

        echo json_encode($result);
    }

    public function exportarReportesAction() {
        ini_set("max_execution_time", 3600); //1hora
        $params = array();
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $filtros = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );

        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos->field == 'codigo') {
                    $params ['filtros']['codigo'] = $datos->data->value;
                } elseif ($datos->field == 'denominacion') {
                    $params ['filtros']['denominacion'] = $datos->data->value;
                } elseif ($datos->field == 'numeropieza') {
                    $params ['filtros']['numeropieza'] = $datos->data->value;
                } elseif ($datos->field == 'unidadmedida') {
                    $params ['filtros']['unidadmedida'] = $datos->data->value;
                } elseif ($datos->field == 'denominacioncb') {
                    $params ['filtros']['denominacioncb'] = $datos->data->value;
                } elseif ($datos->field == 'coberturatotalestimada') {
                    if ($datos->data->comparison == "gt") {
                        $params ['filtros']['coberturatotalestimada_condicion1'] = array('coberturatotalestimada' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $params ['filtros']['coberturatotalestimada_condicion2'] = array('coberturatotalestimada' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $params['filtros'] ['coberturatotalestimada_condicion3'] = array('coberturatotalestimada' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'demanda') {
                    if ($datos->data->comparison == "gt") {
                        $params ['filtros']['demanda_condicion1'] = array('demanda' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $params ['filtros']['demanda_condicion2'] = array('demanda' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $params['filtros'] ['demanda_condicion3'] = array('demanda' => $datos->data->value,
                            'condicion' => "=");
                    }
                }
            }
        }
        $rdmodel = new RedistribucionModel();
        $rdmodel->exportarReportes($params);
    }

    public function listarCentroBalanceAction() {
        $idpadre = $this->_request->getPost('idpadre');
        $idindicador = $this->_request->getPost('idindicador');
        $integrator = $this->integrator;
        echo json_encode(
                array('data' => NomIndicadorModel::listarCentroBalance(
                            $integrator, $idpadre, $idindicador
                    ))
        );
    }

}
