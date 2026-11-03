<?php

class EntregaextraplanesController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar el componente
     * */
    public function init() {
        parent::init();
    }

    //fin de la función init

    /**
     * gestActividades
     * Renderizar la vista
     * */
    public function entregaextraplanesAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
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

    public function listarindicadoresAction() {

        $parametros = Array();

        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        //esto es de la modelo
        if ($this->_request->getPost('identL')) {
            $parametros['entidad'] = $this->_request->getPost('identL');
        } else {
            $parametros['entidad'] = $this->global->Estructura->idestructura;
        }
        //pregunto por los filtos y si biene alguno lo agrego a la busqueda
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['filtros']['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'cteoriginal'
                ) {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['cteoriginal_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['cteoriginal_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['cteoriginal_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'numeropieza') {
                    $parametros ['filtros']['numeropieza'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'cantidadeninventario'
                ) {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['cantidadeninventario_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['cantidadeninventario_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['cantidadeninventario_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'mercanciaentransito') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['mercanciaentransito_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['mercanciaentransito_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['mercanciaentransito_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'cantidadcontratado') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['cantidadcontratado_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['cantidadcontratado_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['cantidadcontratado_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'necesidadannoactual') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['necesidadannoactual_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['necesidadannoactual_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['necesidadannoactual_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'coberturatotalestimada') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['coberturatotalestimada_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['coberturatotalestimada_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['coberturatotalestimada_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'economia') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['economia_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['economia_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['economia_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'RM') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['RM_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['RM_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['RM_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'conmat') {

                    if ($datos ['data'] ['value'] == 'Si') {
                        $parametros['filtros']['conmat'] = 1;
                    } elseif ($datos ['data'] ['value'] == 'No') {
                        $parametros['filtros']['conmat'] = 0;
                    }
                }
            }
        }
        $model = new NomEntregaextraplanesModel();

        if ($this->_request->getPost('identL') == "") {
            $result->datos = Array();
            $result->total = 0;
            echo json_encode($result);
        } else {

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
        $p = $this->_request->getParam('filtros');
        $p = json_decode(stripslashes($p));

        if (is_array($p)) {
            foreach ($p as $datos) {


                if ($datos->field == 'codigo') {
                    $parametros ['filtros']['codigo'] = $datos->data->value;
                } elseif ($datos->field == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos->data->value;
                } elseif ($datos->field == 'precio') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['precio_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['precio_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['precio_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'numeropieza') {
                    $parametros ['filtros']['numeropieza'] = $datos->data->value;
                } elseif ($datos->field == 'denominacioncb'
                ) {
                    $parametros ['filtros']['denominacioncb'] = $datos->data->value;
                } elseif ($datos->field == 'cantidadeninventario'
                ) {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['cantidadeninventario_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['cantidadeninventario_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['cantidadeninventario_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'cteoriginal') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['cteoriginal_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['cteoriginal_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['cteoriginal_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'mercanciaentransito') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['mercanciaentransito_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['mercanciaentransito_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['mercanciaentransito_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'cantidadcontratado') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['cantidadcontratado_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['cantidadcontratado_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['cantidadcontratado_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'necesidadannoactual') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['necesidadannoactual_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['necesidadannoactual_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['necesidadannoactual_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'coberturatotalestimada') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['coberturatotalestimada_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['coberturatotalestimada_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['coberturatotalestimada_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'economia') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['economia_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['economia_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['economia_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'RM') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['RM_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['RM_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['RM_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                }
            }
        }

        NomEntregaextraplanesModel::exportarExistenciasEntidades($parametros);
    }

    function listarIndCCAction() {
        $parametros['start'] = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['hoja'] = $this->_request->getPost('hoja');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        if ($parametros['hoja'] == 'false') {
            $parametros['entidadeshijas'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $parametros['identidad']
            );
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
                    Arry($value['idumedida'])
            );
            $data->data[$key]['idumedida'] = $UM->denominacion;
        }
        echo json_encode($data);
    }

    function adicionarIndCCAction() {

        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idindicador'] = json_decode(
                stripslashes($this->_request->getPost('idindicadores'))
        );
        $entro = false;
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');

        foreach ($parametros['idindicador'] as $value) {
            $obj = new DatAjusteexistencia();
            $obj->idejercicio = $parametros['idejercicio'];
            $obj->identidad = $parametros['identidad'];
            $obj->idindicador = $value->idindicador;
            $obj->idaprobacion = 1;
            $obj->generadoconmat = 0;
            $res = DatAjusteexistenciaModel::insertardatAjusteexistencia_cc(
                            $obj
            );
            if ($res == 0) {
                $entro = true;
            } else {
                if ($res == 21) {
                    DatAjusteexistenciaModel::adicionardatAjusteexistencia_cc(
                            $obj
                    );
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
        $parametros['idajusteexistencia'] = $this->_request->getPost(
                'idajusteexistencia'
        );
        $obj = Doctrine::getTable('DatAjusteexistencia')->find(
                $parametros['idajusteexistencia']
        );
        $obj->delete();
        echo json_encode(array('codMsg' => '21'));
    }

    /**
     * listarModelos
     * Lista todos los modelos
     *
     * @return array, devuelve la lista de modelos
     * */
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

///////////////////////////////////////////////////////Alimento///////////////////////////////

    public function listarDocumentoAction() {
        $parametros['identidad'] = array();
        $identidad = $this->_request->getPost('identidad');
        $parametros['identidad'][] = $identidad;
        $parametros['hoja'] = $this->_request->getPost('hoja');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['eliminado'] = $this->_request->getPost('eliminado');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['filtros'] = $this->_request->getPost('filtros');
        if ($parametros['hoja'] == 'false') {
            $idestructura = $this->integrator->metadatos->DameEstructura(
                    $identidad
            );
            $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $idestructura[0]->idestructura
            );
        }
        $data = EntregaextraplanesModel::listarDocumento($parametros);

        foreach ($data->data as $k => $valor) {
            $denom = NomEjercicioplanificacion::getAnno($valor ['idejercicio']);
            $dat [$k] ['ejercicio'] = $denom;
            $dat [$k] ['identidad'] = $valor ['identidad'];
            $dat [$k] ['iddocumento'] = $valor ['iddocumento'];
            $dat [$k] ['numero'] = $valor ['numero'];
            $dat [$k] ['aprobacion'] = $valor ['aprobacion'];

            $dat [$k] ['cantidadind'] = $valor ['cantidadind'];

            $dat [$k] ['idorganismo'] = $valor ['organismo'];
            $dat [$k] ['idelabora'] = $valor ['elabora'];
            $dat [$k] ['idaprueba'] = $valor ['aprueba'];

            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $valor ['organismo']
            );
            $dat [$k] ['organismo'] = $datosentidad [0]->denominacion;
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $valor ['elabora']
            );
            $dat [$k] ['elabora'] = $datosentidad [0]->denominacion;
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $valor ['aprueba']
            );
            $dat [$k] ['aprueba'] = $datosentidad [0]->denominacion;
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $valor ['identidad']
            );
            $dat [$k] ['entidad'] = $datosentidad [0]->denominacion;
        }
        $data->data = $dat;
        echo json_encode($data);
    }

    public function insertarDocumentoAction() {
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');

        $parametros['organismo'] = $this->_request->getPost('identidadpadre');

        $parametros['elabora'] = $this->global->Estructura->idestructura;

        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $parametros['aprueba'] = $idEstructura[0]['identidad'];

        $cbmodel = new EntregaextraplanesModel();
        $result = $cbmodel->obtenerNumeroDoc($parametros);
        if ($result['numero'] != null) {
            $parametros['numero'] = $result['numero'] + 1;
            $cbmodel->actualizarNumeroUltimoDoc($result['iddocumento']);
        } else {
            $parametros['numero'] = 1;
        }
        $cbmodel->insertarDocumento($parametros);

        echo json_encode(array('codMsg' => '21'));
    }

    function eliminarDocumentoAction() {
        $parametros['iddocumento'] = json_decode(
                stripslashes($this->_request->getPost('arrayiddocumentos'))
        );
        $cbmodel = new EntregaextraplanesModel();
        $cbmodel->eliminarDocumento($parametros);

        echo json_encode(array('codMsg' => '21'));
    }

    public function gestionarAprobacionAction() {
        $parametros['iddocumento'] = json_decode(
                stripslashes($this->_request->getPost('arrayiddocumentos'))
        );
        $parametros['idaprobacion'] = $this->_request->getPost('aprobacion');
        $cbmodel = new EntregaextraplanesModel();
        $data = $cbmodel->gestionarAprobacion($parametros);

        if (!$data) {
            echo("{'codMsgE':21 }");
        } else {
            echo("{'codMsgE':1 }");
        }
    }

    /*     * listarIndicadoresAddDocumento
     * Lista todos los indicadores
     *
     * @param 'start'- posicion inicial a listar
     * @param 'limit'- posicion final a listar
     *
     * @return array, devuelve la lista de indicadores
     * */

    public function listarIndAsociadosaDocAction() {
        $params = array();
        $params['iddocumento'] = $this->_request->getPost('iddocumento');
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['tipos'] = $this->_request->getPost('tipos');
        $params['filtros'] = $this->_request->getPost('filtros');
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $params['filtros'] ['codigo'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'denomviaadquisicion') {
                    $params['filtros'] ['denomviaadquisicion'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'plan') {
                    $params['filtros'] ['plan'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'denomorgansatisface') {
                    $params['filtros'] ['denomorgansatisface'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'numeropieza') {
                    $params['filtros'] ['numeropieza'] = $datos['data']['value'];
                } elseif ($datos['field'] == 'denominacion') {
                    $params['filtros'] ['denominacion'] = $datos['data']['value'];
                } elseif ($datos['field'] == 'necesidad') {
                    if ($datos['data']['comparison'] == "gt") {
                        $params['filtros'] ['necesidad_condicion1'] = array('necesidad' => $datos['data']['value'],
                            'condicion' => ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $params['filtros'] ['necesidad_condicion2'] = array('necesidad' => $datos['data']['value'],
                            'condicion' => "<");
                    } else {
                        $params['filtros'] ['necesidad_condicion3'] = array('necesidad' => $datos['data']['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos['field'] == 'importe') {
                    if ($datos['data']['comparison'] == "gt") {
                        $params['filtros'] ['importe_condicion1'] = array('importe' => $datos['data']['value'],
                            'condicion' => ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $params['filtros'] ['importe_condicion2'] = array('importe' => $datos['data']['value'],
                            'condicion' => "<");
                    } else {
                        $params['filtros'] ['importe_condicion3'] = array('importe' => $datos['data']['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos['field'] == 'denomorgansatisface') {
                    $params['filtros'] ['denomorgansatisface'] = $datos['data']['value'];
                }
            }
        }
        echo json_encode(
                EntregaextraplanesModel::listarIndAsociadosaDoc($params)
        );
    }

    public function addIndicadoresADocAction() {
        $parametros['idindicadores'] = json_decode(
                stripslashes($this->_request->getPost('idindicadores'))
        );
        $parametros['iddocumento'] = $this->_request->getPost('iddocumento');
        $parametros['cantidad'] = 0;

        $cbmodel = new EntregaextraplanesModel();
        $data = $cbmodel->addIndicadoresADoc($parametros);

        if (!$data) {
            echo("{'codMsgE':21 }");
        } else {
            echo("{'codMsgE':1 }");
        }
    }

    public function listarIndicadoresAddDocAction() {

        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $idejercicio = $this->_request->getPost('idejercicio');
        $iddocumento = $this->_request->getPost('iddocumento');
        $filtros = $this->_request->getPost('filtros');
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $parametros['codigo'] = $datos['data']['value'];
                }

                if ($datos['field'] == 'numeropieza') {
                    $parametros['numeropieza'] = $datos['data']['value'];
                } elseif ($datos['field'] == 'denominacion') {
                    $parametros['denominacion'] = $datos['data']['value'];
                } elseif ($datos['field'] == 'precio') {
                    if ($datos['data']['comparison'] == "gt") {
                        $parametros['precio_condicion1'] = array('precio' => $datos['data']['value'],
                            'condicion' => ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $parametros['precio_condicion2'] = array('precio' => $datos['data']['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['precio_condicion3'] = array('precio' => $datos['data']['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos['field'] == 'preciomlc') {
                    if ($datos['data']['comparison'] == "gt") {
                        $parametros['preciomlc_condicion1'] = array('preciomlc' => $datos['data']['value'],
                            'condicion' => ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $parametros['preciomlc_condicion2'] = array('preciomlc' => $datos['data']['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['preciomlc_condicion3'] = array('preciomlc' => $datos['data']['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos['field'] == 'umedida') {
                    $parametros['idumedida'] = $datos['data']['value'];
                } elseif ($datos['field'] == 'centrobalance') {
                    $parametros['identidaddatosnomenclador'] = $datos['data']['value'];
                }
            }
        }

        //Obtiene la lista de indicadores que cumplan las caracteristicas para ser mostrados en el grid, aprobacion,
        // etc dado un id padre o nodo

        $indicadores = NomIndicador::listarIndicadoresAddDoc(
                        $parametros, $idejercicio, $iddocumento, $start, $limit
        );
        $total = NomIndicador::listarTotalIndicadoresAddDoc(
                        $parametros, $iddocumento, $idejercicio, $iddocumento
        );

        $data = '';
        foreach ($indicadores as $k => $direction) {
            $data[$k]['codigo'] = $indicadores[$k]['codigo'];
            $data[$k]['estado'] = $indicadores[$k]['estado'];
            $data[$k]['idindicador'] = $indicadores[$k]['idindicador'];
            $data[$k]['denominacion'] = $indicadores[$k]['denominacion'];
            $data[$k]['descripcion'] = $indicadores[$k]['descripcion'];
            $data[$k]['precio'] = $indicadores[$k]['precio'];
            $data[$k]['preciomlc'] = $indicadores[$k]['preciodivisa'];
            $data[$k]['numeropieza'] = $indicadores[$k]['numeropieza'];
            //busco el identidad del centro de balance, dado el identidaddatosnomenclador, que es el que se almacena
            //en NomIndicador como idcentrobalance
            //busco la denominacion del centro de balance en EyC
            foreach ($direction['DatIndicadorcentrobalance'] as $d) {
                $datosentidad = $this->integrator->metadatos->DameEstructura(
                        900000251
                );
                $data[$k]['centrobalance'] = $datosentidad[0]->denominacion;
            }
            //busco la unidad de medida por el idunidad
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($direction['idumedida'])
            );
            $data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
        }

        echo json_encode(array('total' => $total, 'data' => $data));
    }

    //fin de la funcion listarIndicadoresAddDoc
    function eliminarIndicadorDocAction() {
        $parametros['idindicador'] = json_decode(
                stripslashes($this->_request->getPost('idindicador'))
        );
        $parametros['iddocumento'] = $this->_request->getPost('iddocumento');
        $cbmodel = new EntregaextraplanesModel();
        $cbmodel->eliminarIndicadorDoc($parametros);

        echo json_encode(array('codMsg' => '21'));
    }

    public function actualizarCantidadIndAction() {
        $parametros['indicadores'] = json_decode(
                stripslashes($this->_request->getPost('indicadores'))
        );
        $parametros['iddocumento'] = $this->_request->getPost('iddocumento');
        $cbmodel = new EntregaextraplanesModel();
        $data = $cbmodel->actualizarCantidadInd($parametros);

        if (!$data) {
            echo("{'codMsgE':3 }");
        } else {
            echo("{'codMsgE':1 }");
        }
    }

    public function listarViaAdqAction() {
        echo json_encode(NomViaadquisicionModel::listarViaAdq());
    }

    public function listarOrgSatAction() {
        echo json_encode(NomOrganosatisfaceModel::listarOrgSat());
    }

    public function listarModelosAction() {
        $data->data = DatEntidadmodelo::getModelosTodos();
        $data->data[] = array('idmodelo' => '-', 'denominacion' => '-');
        echo json_encode($data);
    }

    public function exportarDocumentoAction() {

        $params['tipos'] = $this->_request->getParam('tipos');
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['ejercicio'] = NomEjercicioplanificacion::getAnno(
                        $params['idejercicio']
        );
        $params['aprobacion'] = $this->_request->getParam('aprobacion');
        $params['iddocumento'] = $this->_request->getParam('iddocumento');
        $params['numero'] = $this->_request->getParam('numero');
        $params['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        $params['elabora'] = $this->_request->getParam('elabora');
        $params['aprueba'] = $this->_request->getParam('aprueba');
        $params['organismo'] = $this->_request->getParam('organismo');
        $params['nombrentidad'] = $this->_request->getParam('nombrentidad');
        if ($params['filtros']) {

            foreach ($params['filtros'] as $datos) {
                if ($datos->field == 'codigo') {
                    $params['filtros'] ['codigo'] = $datos->data->value;
                }
                if ($datos->field == 'denomviaadquisicion') {
                    $params['filtros'] ['denomviaadquisicion'] = $datos->data->value;
                }
                if ($datos->field == 'plan') {
                    $params['filtros'] ['plan'] = $datos->data->value;
                }
                if ($datos->field == 'denomorgansatisface') {
                    $params['filtros'] ['denomorgansatisface'] = $datos->data->value;
                }
                if ($datos->field == 'numeropieza') {
                    $params['filtros'] ['numeropieza'] = $datos->data->value;
                } elseif ($datos->field == 'denominacion') {
                    $params['filtros'] ['denominacion'] = $datos->data->value;
                } elseif ($datos->field == 'necesidad') {
                    if ($datos->data->comparison == "gt") {
                        $params['filtros'] ['necesidad_condicion1'] = array('necesidad' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $params['filtros'] ['necesidad_condicion2'] = array('necesidad' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $params['filtros'] ['necesidad_condicion3'] = array('necesidad' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'importe') {
                    if ($datos->data->comparison == "gt") {
                        $params['filtros'] ['importe_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $params['filtros'] ['importe_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $params['filtros'] ['importe_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'denomorgansatisface') {
                    $params['filtros'] ['denomorgansatisface'] = $datos->data->value;
                }
            }
        }

        $cbmodel = new EntregaextraplanesModel();
        $params['indicadores'] = EntregaextraplanesModel::listarIndAsociadosaDoc($params);

        $cbmodel->exportarDocumento($params);
    }

    public function cargarUMAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas(
        );
        foreach ($unidades as $key => $value) {
            $unidades[$key]->nombreum = strtoupper($value->nombreum);
        }
        echo json_encode(array('data' => $unidades));
    }

    public function listarEntidadesAction() {
        $entidades = $this->integrator->metadatos->ListadoEstructuras();

        foreach ($entidades as $key => $value) {
            $res[$key]['denominacion'] = strtoupper($value['denominacion']);
            $res[$key]['identidad'] = strtoupper($value['idestructura']);
        }
        echo json_encode(array('data' => $res));
    }

}
