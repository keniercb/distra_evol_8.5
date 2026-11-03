<?php

class BpdesgloseController extends ZendExt_Controller_Secure {

    public function init() {
        $this->objModel = new MultientidadModel();
        parent::init();
    }

    public function bpdesgloseAction() {
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function obtenerGripDesgloseNivActIUAction() {
        $orden = $this->_request->getPost('orden');
        $ident = $this->_request->getPost('ident');
        $tipo = $this->_request->getPost('tipo'); /* tipo = 3 Integracion con plan */
        $arrayParametrosColumna = split("_", $this->_request->getPost('columna'));
        $_columna = $arrayParametrosColumna[1];
        $idpadrerama = str_replace(',', 's', $arrayParametrosColumna[2]); //convertir a formato #s#s#
        $modelDatosNomActEnt = new DatDesgloseentidadModel();
        if ($tipo != 3) {
            $arrayColumnas = $modelDatosNomActEnt->GetGridInterfaces(
                    $ident, $orden, $idpadrerama
            );
        } else {
            /* Entidad logueada */
            $identidad = $this->global->Estructura->idestructura;
            $arrayColumnas = $modelDatosNomActEnt->GetGridInterfazIntegracionConPlan($ident);
        }
        echo json_encode($arrayColumnas);
    }

    public function listarDesgloseNivelesActividadAction() {
        ini_set("max_execution_time", 3600); //600 = 10 min de conexion    3600 = 1hora
        $params = array();
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $data->data = array();
        $data->total = 0;
        if ($params['identidad'] != null && $params['identidad'] != 'undefined') {
            $params['ident'] = $this->_request->getPost('ident');
            $params['filtros'] = json_decode(stripslashes($this->_request->getPost('fxc')));
            $params['tipo'] = $this->_request->getPost('tipo');
            $params['orden'] = $this->_request->getPost('orden');
            $params['limit'] = ($this->_request->getPost('limit') == null) ? 20 : $this->_request->getPost('limit');
            $params['start'] = ($this->_request->getPost('start') == null) ? 0 : $this->_request->getPost('start');
            $arrayParametrosColumna = split("_", $this->_request->getPost('columna'));
            $params['columna'] = $arrayParametrosColumna[1];
            $params['idpadrerama'] = str_replace('s', ',', $arrayParametrosColumna[2]);
            $params['is_leaf'] = $this->_request->getPost('is_leaf');
            if ($this->_request->getPost('idespecialidad') != null) {
                $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
                $params['idespecialidad_filtros'] = $params['idespecialidad'];
            } else {
                $entidades[] = $this->integrator->metadatos->DameEstructura($params['identidad']);
                $params['idespecialidad'] = $entidades [0][0]->idespecialidad;
            }
            $modelDatosNomActEnt = new DatDesgloseentidadModel();
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();

            $params ['nivel'] = $arrayResFormatoUltimonivel[1];
            if ($params['tipo'] == 3) {
                $params['idmodelo'] = $this->_request->getPost('idmodelointegracion');
                $params['idtipomodelo'] = $this->_request->getPost('idtipomodelointegracion');
                $data = $modelDatosNomActEnt->listarDesglosesNivActIntegracionPlan($params);
            } else {
                if ($params['is_leaf'] == 'true') {
                    $data = $modelDatosNomActEnt->listarDesgloseNivelesActividad($params);
                } else {
                    $security = ZendExt_Aspect_Security_Sgis::getInstance();
                    $modeloActEnt = new DatActividadentidad();
                    $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
                    $params['id_especialidades'] = array();
                    $tempEspecialidades["id_" . $params['idespecialidad']] = $params['idespecialidad'];
                    $tempEspecialidades = array();
                    $cont = 0;
                    foreach ($params['entidades'] as $valorIdentidad) {
                        $entidades[] = $this->integrator->metadatos->DameEstructura($valorIdentidad);
                        $_idespecialidad = $entidades [$cont++][0]->idespecialidad;
                        $tempEspecialidades["id_" . $_idespecialidad] = $_idespecialidad;
                    }
                    foreach ($tempEspecialidades as $valorIdesp) {
                        $params['id_especialidades'] [] = $valorIdesp;
                    }
                    $data = $modelDatosNomActEnt->listarDesgloseNivelesActividadConsolidados($params);
                }
            }
        }

        $data->ordenactual = $params['orden'];
        $data->columna = $this->_request->getPost('columna');
        echo json_encode($data);
    }

    public function adicionarDesglosesNivelesActividadAction() {
        $nivelesActividadDesglosados = json_decode(stripslashes($this->_request->getPost('niveles_actividad_desglosados')));
        $ident = $this->_request->getPost('ident');
        $orden = $this->_request->getPost('orden');
        $idejercicio = $this->_request->getPost('idejercicio');
        $identidad = $this->_request->getPost('identidad');
        $arrayParametrosColumna = split("_", $this->_request->getPost('_iddn_idpadrerama'));
        $_columna = $arrayParametrosColumna[1];
        $idpadrerama = str_replace('s', ',', $arrayParametrosColumna[2]);
        $modelDatosNomActEnt = new DatDesgloseentidadModel();
        $modelDatosNomActEnt->gestionarDesglose($identidad, $ident, $orden, $nivelesActividadDesglosados, $idejercicio);
        echo json_encode(array('codMsg' => 21));
    }

    public function listarComboNivelesParaDesgloseAction() {
        /* Obtener el formato de las actividades guardadas en la Base de Datos */
        $idformato = NomActividad::formato($this->integrator);
        //Obtener la configuración por nodos de un formato
        $resultparcial = array();
        $ultimonivel = 0;
        if ($idformato != null) {
            $resultparcial = $this->integrator->datosmaestros->buscarParteFormato($idformato);
            foreach ($resultparcial as $value) {
                if ($value->nivel > $ultimonivel) {
                    $ultimonivel = $value->nivel;
                }
            }
        }
        $result = array();
        if ($resultparcial[1] != null) {
            foreach ($resultparcial as $indice => $valor) {
                if ($valor->nivel < $ultimonivel) {
                    $result[$indice] = $valor;
                }
            }
        }
        $result = array_merge(array(array('nombre' => "< ... >", 'nivel' => "0")), $result);
        echo json_encode(array('ultimonivel' => $ultimonivel, 'data' => $result));
    }

    public function listarConfigDesgloseAction() {
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['descripcion'] = $this->_request->getPost('descripcion');
        $data = DatDesglose::listar($params);
        echo json_encode($data);
    }

    public function listarDatosNomConfigDesgloseAction() {
        $params['limit'] = ($this->_request->getPost('limit') == null) ? 20 : $this->_request->getPost('limit');
        $params['start'] = ($this->_request->getPost('start') == null) ? 0 : $this->_request->getPost('start');
        $params['iddesglose'] = $this->_request->getPost('iddesglose');
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['descripcion'] = $this->_request->getPost('descripcion');
        $data = DatDesglosetiponomenclador::listar($params);
        echo json_encode($data);
    }

    public function adicionarConfigDesgloseAction() {
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['descripcion'] = $this->_request->getPost('descripcion');
        $params ['tiponomencladores_orden'] = json_decode(stripslashes($this->_request->getPost('tiponomencladores_orden')));
        DatDesgloseModel::adicionarConfigDesglose($params);
        echo json_encode(array('codMsg' => 1));
    }

    public function eliminarConfigDesgloseAction() {
        $confDesgloses = json_decode(stripslashes($this->_request->getPost('conf_desgloses')));
        $modelConfigDesg = new DatDesgloseModel();
        $modelConfigDesg->eliminarConfigDesglose($confDesgloses);
        echo json_encode(array('codMsg' => 1));
    }

    public function cargarTreePanelConfDesgloseAction() {
        $params = array();
        $params['iddesglose'] = $this->_request->getPost('ident');
        $params ['orden'] = $this->_request->getPost('orden');
        $arrayParametrosColumna = split("_", $this->_request->getPost('columna'));
        $params['_columna'] = $arrayParametrosColumna[1];
        $params['idpadrerama'] = str_replace('s', ',', $arrayParametrosColumna[2]);
        $params['identidad'] = $this->_request->getPost('identidad');
        if ($this->_request->getPost('idespecialidad')) {
            $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
        } else {
            $entidades[] = $this->integrator->metadatos->DameEstructura($params['identidad']);
            $params['idespecialidad'] = $entidades [0][0]->idespecialidad;
        }
        if ($params['identidad'] != null && $params['identidad'] != 'undefined' && $params ['orden'] != 'undefined') {
            $modelDesgloseTN = new DatDesglosetiponomencladorModel();
            $data = $modelDesgloseTN->listar($params);
        } else {
            $data->data = array();
        }
        echo json_encode($data->data);
    }

    public function listarEspecialidadesAction() {
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $especialidades = $this->nomenclador->selectParam('nom_especialidad', array('idespecialidad', 'denespecialidad'));
        echo json_encode(array('data' => $especialidades));
    }

    public function listarTipoNomencladorAction() {
        /* temporal listar solo los nomncladores relacionados con el componente actividad */
        $modelTipoNom = new NomTiponomencladorModel();
        $idtipocomponente = 9; //en BD desarrollo
        /* Nro ESTATICO del componente Actividad en la Base Datos de prueba */
        $data->data = $modelTipoNom->listar($idtipocomponente);
        echo json_encode($data);
    }

    public function eliminarDesglocesAction() {
        $params = array();
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['iddesglose'] = $this->_request->getPost('iddesglose');
        $params['iddesglosetiponomenclador'] = $this->_request->getPost('iddesglosetiponomenclador');
        $params['orden'] = $this->_request->getPost('orden');
        if ($this->_request->getPost('is_leaf') == 'true') {
            $model = new DatDesgloseentidadModel();
            $model->eliminarDesgloces($params);
        }
        echo json_encode(array('codMsg' => 1));
    }

    public function listarModelosAction() {
        $global = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $global->Estructura->idestructura;
        $data->data = DatEntidadmodelo::servBP_getModeloAsocEntidad($idEstructura);
        echo json_encode($data);
    }

    public function listarPlanModeloAction() {
        $identidad = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        if ($identidad != 'undefined') {
            $tipo = $this->_request->getPost('tipo');
            $node = $this->_request->getPost('node');
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];
            $entidades[] = $this->integrator->metadatos->DameEstructura($identidad);
            $params['idespecialidad'] = $entidades [0][0]->idespecialidad;
            $model = new DatPlanModel();
            $elementos = $model->ListarPlanesDesglose($identidad, $tipo, $node, $params);
            $arrayIdentmod = array();
            foreach ($elementos as $key => $valor) {
                $arrayIdentmod[] = $valor['DatEntidadmodelo'][0]['identidadmodelo'];
            }
            $arrayRes = DatEntidadmodelo::tieneIndPlanifEjer($arrayIdentmod, $params['idejercicio']);
            $arrayIdentmod = array();
            foreach ($arrayRes as $valor) {
                $arrayIdentmod['idem' . $valor['identidadmodelo']] = 'ok';
            }
            foreach ($elementos as $key => $valor) {
                if ($arrayIdentmod['idem' . $valor['DatEntidadmodelo'][0]['identidadmodelo']] == 'ok') {
                    $elementos[$key]['text'] = "<b> " . $valor['text'] . "</b>";
                }
            }
            echo json_encode($elementos);
        } else {
            echo json_encode(array());
        }
    }

    public function actualizarPlanAction() {
        $params = array();
        ini_set("max_execution_time", 3600); //600 = 10 min de conexion    3600 = 1hora
        $params['idEstructura'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['iddesglose'] = $this->_request->getPost('iddesglose');
        if ($params['idEstructura'] != 'undefined') {
            $entidades[] = $this->integrator->metadatos->DameEstructura($params['idEstructura']);
            $params['idespecialidad'] = $entidades [0][0]->idespecialidad;
            $params['idmodelo'] = $this->_request->getPost('idmodelo');
            $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
            $modelDesgloseEnt = new DatDesgloseentidadModel();
            $result = $modelDesgloseEnt->actualizarPlan($params);
            echo json_encode(array('codMsg' => $result));
        } else {
            echo json_encode(array('codMsg' => 3));
        }
    }

    public function ObtenerConfVistaPreviaPlanIUAction() {
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        $modelDatosNomActEnt = new DatDesgloseentidadModel();
        echo json_encode($modelDatosNomActEnt->GetGridInterfazVistaPreviaPlan($idtipomodelo));
    }

    public function listarIndicadoresVistaPreviaPlanAction() {
        $params = array();
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idstiponom'] = json_decode(stripslashes($this->_request->getPost('idstiponom')));
        if ($params['identidad'] != null && $params['identidad'] != 'undefined' && $params['idstiponom'][0] != null) {
            $params['limit'] = $this->_request->getPost('limit');
            $params['start'] = $this->_request->getPost('start');
            $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
            $params['idmodelo'] = $this->_request->getPost('idmodelo');
            $filtros = json_decode(stripslashes($this->_request->getPost('filtrosxcolumnas')));
            if ($filtros) {
                foreach ($filtros as $key => $datos) {
                    $params['filtros'][$key]['field'] = $datos->field;
                    if (is_array($datos->data->value)) {
                        $params[$datos->field] = $datos->data->value[0];
                    } else {
                        if ($datos->field == 'precio' || $datos->field == 'necesidad' || $datos->field == 'importe'
                        ) {
                            $params[$datos->field . "_" . $datos->data->comparison] = $datos->data->value;
                        } else {
                            $params[$datos->field] = $datos->data->value;
                        }
                    }
                }
            }
            $filtros = null;
            $entidades[] = $this->integrator->metadatos->DameEstructura($params['identidad']);
            $params['idespecialidad'] = $entidades [0][0]->idespecialidad;
            $modelDatosNomActEnt = new DatDesgloseentidadModel();
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];
            echo json_encode($modelDatosNomActEnt->listarIndicadoresVistaPreviaPlan($params));
        } else {
            $data->data = array();
            $data->total = 0;
            echo json_encode($data);
        }
    }

    public function cargarumedidasAction() {
        echo json_encode(array('data' => $this->integrator->datosmaestros->listarUnidadesMedidaTodas()));
    }

    public function cargarcentrobalanceAction() {
        $idcentrobalance = 1; //temporal numero fijo en la BD para Nomdatosnomenclador
        $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);
        $data = array();
        foreach ($centrobalance as $indice => $valor) {
            $data [$indice] ['idcentrobalance'] = $valor ['identidaddatosnomenclador'];
            $datosentidad = $this->integrator->metadatos->DameEstructura($valor ['identidad']);
            $data [$indice] ['centrobalance'] = $datosentidad [0]->denominacion;
        }
        echo json_encode(array('data' => $data));
    }

    public function cargarnaturalezasAction() {
        $idnaturaleza = 2; //poner fijo los tipos de nomencladores o buscar por denominacion, en este caso 'Naturaleza'
        $natura = NomDatosnomenclador::ObtenerDatosNomenclador($idnaturaleza);
        $naturaleza = array();
        foreach ($natura as $indice => $valor) {
            $naturaleza [$indice] ['idnaturaleza'] = $valor ['iddatosnomenclador'];
            $naturaleza [$indice] ['naturaleza'] = $valor ['denominacion'];
        }
        echo json_encode(array('data' => $naturaleza));
    }

    public function exportarAction() {
        $params['filtros'] = json_decode(stripslashes($this->_request->getParam('fxc')));
        $params['ident'] = $this->_request->getParam('ident');
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['is_leaf'] = $this->_request->getParam('is_leaf');
        $params['orden'] = $this->_request->getParam('orden');
        $params['text_ent'] = $this->_request->getParam('text_ent');
        $params['text_conf'] = $this->_request->getParam('text_conf');
        $params['idmodelo'] = $this->_request->getParam('idmodelo');
        $params['idtipomodelo'] = $this->_request->getParam('idtipomodelo');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['tipo'] = $this->_request->getParam('tipo');
        $arrayParametrosColumna = split("_", $this->_request->getParam('columna'));
        $params['columna'] = $arrayParametrosColumna[1];
        $params['idpadrerama'] = str_replace('s', ',', $arrayParametrosColumna[2]);
        $entidades[] = $this->integrator->metadatos->DameEstructura($params['identidad']);
        $params['idespecialidad'] = $entidades [0][0]->idespecialidad;
        $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
        $params ['nivel'] = $arrayResFormatoUltimonivel[1];
        $model = new DatDesgloseentidadModel();
        $model->exportarAExcel($params);
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
        $params['idfuncionalidad'] .= '/' . $arrayReferenciaDesglosada[count($arrayReferenciaDesglosada) - 2];
        $modelActEnt = new DatActividadentidadModel();
        echo json_encode($modelActEnt->gestPermisos($params));
    }

}
