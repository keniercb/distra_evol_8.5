<?php

/**
 * Created by PhpStorm.
 * User: madrid
 * Date: 21/03/2017
 * Time: 14:47
 */
class GestionarplanesController extends ZendExt_Controller_Secure {

    function init() {
        $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }

    /**
     * funcion gestplandiony()
     * Para renderizar la vista
     *
     * @author Dionisdel Ponce Santana
     * */
    public function gestionarplanesAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function listarPlanModeloAction() {
        if (!$this->_request->getPost('identidad')) {
            $identidad = $this->global->Estructura->idestructura;
        } else {
            $identidad = $this->_request->getPost('identidad');
        }
        $tipo = $this->_request->getPost('tipo');
        $node = $this->_request->getPost('node');

        $obj = new DatEntidadmodelo();
        $idejercicio = $this->_request->getPost('idejercicio');
        $arrenthijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
        $arrenthijas[] = $identidad;
        $arrenthijas = implode(',', $arrenthijas);

        $model = new DatPlanModel();
        $elementos = $model->Listar($identidad, $tipo, $node, $idejercicio, $arrenthijas);
        echo json_encode($elementos);
    }

    /* public function gestEjerciciosAction() {
      $data = CalculoracionesModel::obtenerEjercicios();
      echo json_encode($data);
      } */

    /*     * Ejercicio actual y la lista de ejecicios
     */

    public function getEjerciciosAction() {
        $data = null;
        $data->data = $this->pIntegrator->planmeta->obtenerEjercicios();
        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        echo json_encode($data);
    }

    public function getgridinterfacesAction() {
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        $idmodelo = $this->_request->getPost('idmodelo');
        if ($idtipomodelo) {
            $model = new DatPlanModel();
            $result = $model->GetGridInterfaces($idtipomodelo);
            echo json_encode($result);
        } else if ($idmodelo) {
            $idtipomodelo = DatModelo::ObtenerModelo($idmodelo);
            $model = new DatPlanModel();
            $result = $model->GetGridInterfaces($idtipomodelo[0]['idtipomodelo']);
            echo json_encode($result);
        }
    }

    public function listarIndModeloAction() {
        try {
            ini_set("max_execution_time", 600);
            $idmodelo = $this->_request->getPost('idmodelo');
            $limit = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
            $start = $this->_request->getPost('start');
            $filtros = json_decode(stripslashes($this->_request->getPost('filtrosD')));
            $columnasamostrar = json_decode(stripslashes($this->_request->getPost('columnsToShow')));
            $idejercicio = $this->_request->getPost('idejercicio');
            $identidad = $this->_request->getPost('identidad');
            $identidadmodelo = $this->_request->getPost('identidadmodelo');
            $global = $this->_request->getPost('glob');
            if ($global == 'true') {
                $ajustar = 1;
            } else {
                $ajustar = 0;
            }
            $tipomod = new NomTipomodelo();
            $tipomodelo = $tipomod->ObtenerIdTipoModelo($idmodelo);
            $x = $this->_meta->Metadata()->obtenerInfoTabla($tipomodelo[0]['idtabla']);

            $codigotm = $tipomodelo[0]['codigo'];
            $concat = $codigotm . '_id' . $codigotm;
            $llave = "mod_planificacionmeta_nom_$concat";
            $llaveprimaria = "mod_planificacionmeta_dat_$concat";
            if ($ajustar == 1) {           
                $arryhijos = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
                $var = implode(',', $arryhijos);
                $arryhijos = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
                if ($arryhijos[0] == null || $arryhijos[0] == '' || !$arryhijos[0]) {
                    $data->data = array();
                    $data->total = 0;
                    echo json_encode($data);
                    return;
                }
            } else { 
                $ident = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($identidad);
               
                if ($ident[0] == null || $ident[0] == '' || !$ident[0]) {
                    $data->data = array();
                    $data->total = 0;
                    echo json_encode($data);
                    return;
                }
            }
            $filt = DatModeloModel::auxConfigFiltros($filtros); 
            $parametros = $filt->parametros;
            $filtroDin = $filt->filtroDin;
            $datosf = DatPlanModel::getDatos($tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $identidadmodelo, $idejercicio, $parametros, $start, $limit, $ajustar, $arryhijos, $idmodelo, $filtroDin, $columnasamostrar);          
            $x = $this->_meta->Metadata()->obtenerInfoTabla($tipomodelo[0]['idtabla']);
            $importetotal = DatPlanModel::getDatosImporte($tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $identidadmodelo, $idejercicio, $parametros, $ajustar, $arryhijos, $filtroDin, $idmodelo);
            $x = $this->_meta->Metadata()->obtenerInfoTabla($tipomodelo[0]['idtabla']);
            $datosT = DatPlanModel::getDatosCount($tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $identidadmodelo, $idejercicio, $parametros, $start, $limit, $ajustar, $arryhijos, $idmodelo, $filtroDin, $columnasamostrar);
            $datostotal = count($datosT);

            $datos = Array();
            for ($index = 0; $index < count($datosf); $index++) {
                $datos[] = $datosf[$index];
                if (count($datos) == $limit) {
                    break;
                }
            }

            foreach ($datos as $k => $d) {
                $datos[$k]['centrobalance'] = $d['centrosbalance'];
                $existecom = DatComentario::verificarIdPlanificacion(
                                $datos[$k]['idplanificacion']
                );
                if ($existecom == 1) {
                    $datos[$k]['comentario'] = true;
                } else {
                    $datos[$k]['comentario'] = false;
                }
                $datos[$k]['flete'] = number_format($d['flete'], '3', '.', ',');
                $datos[$k]['contingencia'] = number_format(
                        $d['contingencia'], '3', '.', ','
                );
                $datos[$k]['importe'] = number_format($d['importe'], '3', '.', ',');
                $datos[$k]['importeajustado'] = number_format(
                        $d['importeajustado'], '3', '.', ','
                );
                $datos[$k]['importefinal'] = number_format(
                        $d['importefinal'], '3', '.', ','
                );
                $datos[$k]['importedivisa'] = number_format(
                        $d['importedivisa'], '3', '.', ','
                );

                $datos[$k]['importefila'] = number_format(
                        $d['importefila'], '3', '.', ','
                );
                $datos[$k]['cantidad'] = number_format(
                        $d['cantidad'], '6', '.', ','
                );
                $datos[$k]['cantidadfinal'] = number_format(
                        $d['cantidadfinal'], '6', '.', ','
                );

                $datos[$k]['ajuste'] = number_format(
                        $d['ajuste'], '6', '.', ','
                );
                //busco la denominacion del pais.
                $idpais = $d['idpais'];
                $this->nomenclador = new ZendExt_Nomencladores_ADT();
                $pais = $this->nomenclador->selectParam(
                        'nom_pais', array('nombrepais'), 0, 0, "idpais=$idpais"
                );
                $datos[$k] ['pais'] = $pais [0] ['nombrepais'];

                //busco la unidad de medida
                $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                        Array($d['idumedida'])
                );
                $datos[$k]['umedida'] = $unidades[0]['denominacionunidadmedida'];

                $datos[$k]['_is_leaf'] = true;
                $datos[$k]['_parent'] = null;
                $datos[$k]['llave'] = $llave;
                $datos[$k]['llaveprimaria'] = $llaveprimaria;
            }

            $importetotal[0]['importetotal'] = number_format(
                    $importetotal[0]['importetotal'], '3', '.', ','
            );
            $importetotal[0]['importedivisa'] = number_format(
                    $importetotal[0]['importedivisa'], '3', '.', ','
            );
            $importetotal[0]['importeflete'] = number_format(
                    $importetotal[0]['importeflete'], '3', '.', ','
            );
            $importetotal[0]['importecontingencia'] = number_format(
                    $importetotal[0]['importecontingencia'], '3', '.', ','
            );
            $importetotal[0]['importeajustado'] = number_format(
                    $importetotal[0]['importeajustado'], '3', '.', ','
            );
            $importetotal[0]['cantidadfinal'] = number_format(
                    $importetotal[0]['cantidadfinal'], '3', '.', ','
            );

            echo json_encode(
                    array('data' => $datos, 'total' => $datostotal,
                        'importetotal' => $importetotal[0]['importetotal'],
                        'importedivisatotal' => $importetotal[0]['importedivisa'],
                        'importeflete' => $importetotal[0]['importeflete'],
                        'importecontingencia' => $importetotal[0]['importecontingencia'],
                        'importeajustado' => $importetotal[0]['importeajustado'],
                        'importefinal' => $importetotal[0]['importefinal'],
                        'llave' => $llave, 'llaveprimaria' => $llaveprimaria, 'cantidadfinal' => $importetotal[0]['cantidadfinal'])
            );
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
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

        $j = DatDocumentoaprobacioModel::gestPermisos($params);

        echo json_encode($j);
    }

    public function adicionarModeloAction() {
        ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
        $idmodelo = $this->_request->getPost('idmodeloPlanes');
        $denominacion = $this->_request->getPost('denominacionPlanes');
        $descripcion = $this->_request->getPost('descripcionPlanes');
        $fechaentrega = $this->_request->getPost('fechaentrega');
        $rectora = $this->_request->getPost('rectora');
        $clasifmodelo = $this->_request->getPost('idclasif');
        $idejercicio = $this->_request->getPost('idejercicio');
        $clasifmodmatpre = $this->_request->getPost('idclasf');
        $tipoplan = $this->_request->getPost('tipoplan');
        $denomsRutas = $this->_request->getPost('tfclasificacionPlanes');
        $irBalanceMaterial = $this->_request->getPost('balancematerial');
        //$idaprobacion = 1;
        $version = 1;
        $idplan = $this->_request->getPost('idplan');
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        if ($this->_request->getPost('identidad')) {
            $identidad = $this->_request->getPost('identidad');
        } else {
            $identidad = $this->global->Estructura->idestructura;
        }
        $model = new DatModeloModel();
        //envia datos para adicionar el nuevo modelo
        $model->Insertar(
                $idmodelo, $denominacion, $descripcion, $fechaentrega, $version, $idplan, $idtipomodelo, $identidad, $clasifmodelo, $denomsRutas, $irBalanceMaterial, $tipoplan
        );

        // Devuelvo para la IU la confirmacion
        $dat->codMsgA = 1;
        if ($idmodelo) {
            $dat->mensaje = 'Mod';
        } else {
            $dat->mensaje = 'Add';
        }
        echo json_encode($dat);
    }

    public function cargarClasifModeloMatPresAction() {
        $data->data [] = array('idclasf' => 1, 'denominacion' => 'Material');
        $data->data [] = array('idclasf' => 2, 'denominacion' => 'Presupuesto');
        echo json_encode($data);
    }

    public function listarTiposModelosAprobadosAction() {
        $dat->data = NomTipomodelo::servicioObtenerTipoModelo(false, true);
        echo json_encode($dat);
    }

    public function cargarClasifPlanesAction() {
        $parametros = array();
        $parametros['nodo'] = $this->_request->getPost('iddatosnomenclador');
        $parametros['uri'] = $this->_request->getPost('uri');
        $parametros['ruta'] = $this->_request->getPost('ruta');

        $objPlan = new DatPlanModel();

        $datos = $objPlan->listarArbolTipoPlanes($parametros);

        echo json_encode($datos);
    }

    public function cargarEntidadesCompDemandanteAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $node = $this->_request->getPost('node');
        $filtro = $this->_request->getPost('filtros');
        if ($this->_request->getPost('identidad')) {
            $identidad = $this->_request->getPost('identidad');
        } else {
            $identidad = $this->global->Estructura->idestructura;
        }


        if ($node == 0) {

            // $entidades = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(2);
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
            $var = implode(',', $entidades);
            $entidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);

            foreach ($entidades as $value) {
                $datosentidad = $this->integrator->metadatos->DameEstructura(
                        $value
                );

                $tieneelmodelo = DatEntidadmodelo::existeModeloEnLaEntidad(
                                $idmodelo, $value
                );


                if ($tieneelmodelo == false) {

                    $data[] = array('id' => $value,
                        'tipo' => 1, 'draggable' => false,
                        'leaf' => false,
                        'text' => $datosentidad[0]->denominacion,
                        'checked' => false);
                }
            }

            if ($data == null) {
                $data = array();
            }

            if ($filtro[0] != null) {
                //$tem = '';
                foreach ($data as $key => $value) {

                    if (!stristr($value['text'], $filtro[0]['data']['value'])) {
                        unset($data[$key]);
                    }
                }

                $result = array();
                $i = 0;
                foreach ($data as $key => $val) {
                    $result[$i++] = $val;
                }
            }
            if ($result != null) {
                $data = $result;
            }

            echo json_encode($data);
        }
    }

    public function asociarModeloAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $entidades = json_decode(
                stripslashes($this->_request->getPost('entidades'))
        );
        $control = 0;
        foreach ($entidades as $value) {
            $tieneelmodelo = DatEntidadmodelo::existeModeloEnLaEntidad(
                            $idmodelo, $value
            );

            if ($tieneelmodelo == false) {
                $max = DatEntidadmodelo::ultimaPrioridad($value);
                $entidadmodelo = new DatEntidadmodelo();
                $entidadmodelo->identidad = $value;
                $entidadmodelo->idmodelo = $idmodelo;
                $entidadmodelo->prioridad = $max[0]['MAX'] + 1;
                $entidadmodelo->save();
                $control = 1;
            } else {
                $control = 2;
            }
        }
        if ($control == 1) {
            $dat->codMsgAs = 1;
        } elseif ($control == 2) {
            $dat->codMsgAs = 2;
        } else {
            $dat->codMsgAs = 3;
        }
        echo json_encode($dat);
    }

    public function desasociarModeloAction() {
        $entidades = json_decode(
                stripslashes($this->_request->getPost('entidades'))
        );
        $entidadmodelo = new DatEntidadmodeloModel();
        $data = $entidadmodelo->desasociarEntMod($entidades);
        if ($data == 1) {
            $dat->codMsg = 21;
        } elseif ($data == 2) {
            $dat->codMsg = 22;
        } elseif ($data == 4) {
            $dat->codMsg = 24;
        } else {
            $dat->codMsg = 3;
        }
        echo json_encode($dat);
    }

    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function cargarviaadquisionAction() {
        $datos = DatPlanificacionModel::cargarTodasViaAdquision();
        echo json_encode(array('data' => $datos->data));
    }

    public function cargarorganosatisfaceAction() {
        $datos = DatPlanificacionModel::cargarTodosOrganoSatisface();
        echo json_encode(array('data' => $datos));
    }

    public function listarpaisAction() {
        // $objeto = $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $pais = $this->nomenclador->selectParam(
                'nom_pais', array('idpais', 'nombrepais')
        );
        echo json_encode(array('data' => $pais));
    }

    public function listarCentroBalanceAction() {
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

    public function listarVerActXIndAction() {
        $data = DatPlanModel::listarVerActXInd($this->_request->getPost());
        echo json_encode(array('data' => $data->data, 'total' => $data->total));
    }

    public function cargarEntidadesDesasociarAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $filtro = $this->_request->getPost('filtros');
        $entidades = DatEntidadmodelo::getEntidades($idmodelo);
        foreach ($entidades as $value) {

            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $value['identidad']
            );
            $data[] = array(
                'id' => $value['identidad'],
                'identidadmodelo' => $value['identidadmodelo'],
                'tipo' => 1,
                'draggable' => false,
                'leaf' => false,
                'text' => $datosentidad[0]->denominacion,
                'checked' => false);
        }
        if ($data == null) {
            $data = array();
        }

        if ($filtro[0] != null) {
            // $tem = '';
            foreach ($data as $key => $value) {
                if (!stristr($value['text'], $filtro[0]['data']['value'])) {
                    unset($data[$key]);
                }
            }

            $result = array();
            $i = 0;
            foreach ($data as $key => $val) {
                $result[$i++] = $val;
            }
        }
        if ($result != null) {
            $data = $result;
        }

        echo json_encode($data);
    }

    public function aprobarDesaprobarAction() {
        $params['rectora'] = $this->_request->getPost('rectora');
        $params['arrayidplanificacion'] = json_decode(
                stripslashes($this->_request->getPost('arrayidplanificacion'))
        );
        $params['aprobado'] = $this->_request->getPost('aprobado');
        $modeloModel = new DatModeloModel();
        $params['security'] = ZendExt_Aspect_Security_Sgis::getInstance();
        $dat = $modeloModel->aprobarDesaprobarFamilia($params);
        echo json_encode($dat);
    }

    public function aprobarDesaprobarAjusteAction() {
        $params['idplanificacion'] = json_decode(
                stripslashes($this->_request->getPost('idplanificacion'))
        );
        $params['aprobado'] = $this->_request->getPost('aprobado');
        $modeloModel = new DatModeloModel();
        $params['security'] = ZendExt_Aspect_Security_Sgis::getInstance();
        $dat = $modeloModel->aprobarDesaprobarAjusteFamilia($params);
        echo json_encode($dat);
    }

    public function aprobarDesaprobarAjusteTodosAction() {
        $params['rectora'] = $this->_request->getPost('rectora');
        $params['aprobado'] = $this->_request->getPost('aprobado');
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['identmod'] = $this->_request->getPost('identidadmodelo');
        $params['glob'] = $this->_request->getPost('glob');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');

        $modeloModel = new DatModeloModel();
        $params['security'] = ZendExt_Aspect_Security_Sgis::getInstance();
        $dat = $modeloModel->aprobarDesaprobarAjusteTodosFamilia($params);

        echo json_encode($dat);
    }

    public function aprobarTodosAction() {
        $rectora = $this->_request->getPost('rectora');
        $aprobado = $this->_request->getPost('aprobado');
        $idmodelo = $this->_request->getPost('idmodelo');
        $identidad = $this->_request->getPost('identidad');
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $idejercicio = $this->_request->getPost('idejercicio');
        $glob = $this->_request->getPost('glob');

        $modeloModel = new DatModeloModel();
        $dat = $modeloModel->aprobarDesaprobarTodosFamilia($identidad, $idmodelo, $aprobado, $rectora, $idejercicio, $glob, $identidadmodelo);
        echo json_encode($dat);
    }

    public function adicionarPlanAction() {
        $idplan = $this->_request->getPost('idplanmPlanes');
        $rector = $this->_request->getPost('rector') ? 1 : 0;
        $codigo = $this->_request->getPost('codigoplanPlanes');
        $denominacion = $this->_request->getPost('denominacionpPlanes');
        $descripcion = $this->_request->getPost('descripcionpPlanes');
        $idejercicio = $this->_request->getPost('idejercicio');
        $node = $this->_request->getPost('node');
        if (!$this->_request->getPost('identidad')) {
            $identidad = $this->global->Estructura->idestructura;
        } else {
            $identidad = $this->_request->getPost('identidad');
        }
        $version = 1; //despues arreglar este cableado cuando se trate la concurrencia
        if ($idplan == ""
        ) { // si no se quiere modificar, o sea, lo que se quiere es adicionar, valido el codigo
            $existecodigo = DatPlan::validarCodigo($codigo);
            if ($existecodigo >= 1
            ) { //si existe el codigo, mostrar mensaje error
                $dat->codMsg = 21;
            } else { // si el codigo no existe se inserta
                $model = new DatPlanModel();
                //adiciona el plan

                $model->Insertar(
                        $idplan, $codigo, $denominacion, $descripcion, $version, $identidad
                );
                // Devuelvo para la IU la confirmacion
                $dat->mensaje = 'Add';
                $dat->codMsgA = 1;
            }
        } else { //si viene algo en idplan es q se quiere modificar
            $model = new DatPlanModel();
            //adiciona el plan

            $model->Insertar(
                    $idplan, $codigo, $denominacion, $descripcion, $version, $identidad
            );
            // Devuelvo para la IU la confirmacion
            $dat->mensaje = 'Mod';
            $dat->codMsgA = 1;
        }
        echo json_encode($dat);
    }

    public function eliminarAction() {
        if (!$this->_request->getPost('identidad')) {
            $identidad = $this->global->Estructura->idestructura;
        } else {
            $identidad = $this->_request->getPost('identidad');
        }
        $idplan = $this->_request->getPost('idplan');

        $model = new DatPlanModel();
        $dat = $model->Eliminar($idplan, $identidad);
        // Devuelvo para la IU la confirmacion

        echo json_encode($dat);
    }

    public function eliminarModeloAction() {
        ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
        if ($this->_request->getPost('identidad')) {
            $identidad = $this->_request->getPost('identidad');
        } else {
            $identidad = $this->global->Estructura->idestructura;
        }
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $idmodelo = $this->_request->getPost('idmodelo');
        $identidadcrea = $this->_request->getPost('identidadcrea');
        $model = new DatModeloModel();
        if ($identidad == $identidadcrea
        ) {
            //antes de eliminar el modelo hay que eliminar los desgloses 
            //de las actividades que tiene asociado el modelo
            DatModeloModel::eliminarDesgloses($idmodelo);
            $model->Eliminar($identidadmodelo, $idmodelo, $identidad);
            // Devuelvo para la IU la confirmacion
            $dat->codMsg = 1;
        } else {
            $dat->codMsg = 21;
        }

        echo json_encode($dat);
    }

    public function listarIndicadoresAction() {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $tipoplan = $this->_request->getPost('tipoplan');
        $filtros = $this->_request->getPost('filtros');

        $indicadores = NomIndicador::ListarIndNivelPlanif(
                        $filtros, $start, $limit, $tipoplan
        );

        $data = array();
        foreach ($indicadores->data as $k => $direction) {
            $data[$k]['codigo'] = $indicadores->data[$k]['codigo'];
            $data[$k]['estado'] = $indicadores->data[$k]['estado'];
            $data[$k]['idindicador'] = $indicadores->data[$k]['idindicador'];
            $data[$k]['idformato'] = $indicadores->data[$k]['idformato'];
            $data[$k]['viaadquisicion'] = $indicadores->data[$k]['viaadquisicion'];
            $data[$k]['denominacion'] = $indicadores->data[$k]['denominacion'];
            if ($tipoplan == 1)
                $data[$k]['precio'] = $indicadores->data[$k]['precioventa'];
            else
                $data[$k]['precio'] = $indicadores->data[$k]['precio'];

            $data[$k]['numeropieza'] = $indicadores->data[$k]['numeropieza'];
            $datosentidad = $this->integrator->metadatos->DameEstructura($indicadores->data[$k]['identidad']);
            $data[$k]['centrobalance'] = $datosentidad[0]->denominacion;
            //busco la unidad de medida por el idunidad
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($direction['idumedida']));
            $data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
        }

        echo json_encode(array('total' => $indicadores->total, 'data' => $data));
    }

    public function adicionarindicadoresAction() {
        ini_set("max_execution_time", 600); //10min
        $parametros = $this->_request->getParams();

        $idmodelo = $this->_request->getPost('idmodelo');
        $tipoplan = $this->_request->getPost('tipoplan');
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $idejercicio = $this->_request->getPost('idejercicio');
        $idusuario = $this->global->Perfil->idusuario;
        //recibo el arreglo de indicadores
        $idindicadores = json_decode(
                stripslashes($this->_request->getPost('indicadores'))
        );

        $model = new DatPlanModel();
        //mando los indicadores para el metodo de la model 
        //que es la que los adiciona al modelo como tal
        $model->AdicionarIndicadores(
                $idindicadores, $parametros, $identidadmodelo, $idejercicio, $idmodelo, $tipoplan, 0, $idusuario
        );

        // Devuelvo para la UI la confirmacion
        $dat->codMsg = 1;
        $dat->mensaje = ($idindicadores) ?
                'EL(los) indicador(es) ha(n) sido adicionado(s) satisfactoriamente.' : 'Mod';
        echo json_encode($dat);
    }

    public function exportarAction() {
        ini_set("max_execution_time", 3600); //600 = 10min  3600 = 1hora
        $params->entidad = $this->_request->getParam('entidad');
        $params->plan = $this->_request->getParam('plan');
        $params->idmodelo = $this->_request->getParam('idmodelo');
        //$params->limit = 100000;
        //$params->start = 0;
        $params->filtros = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        $params->global = $this->_request->getParam('glob');
        if ($params->global == 'true') {
            $params->ajustar = 1;
        } else {
            $params->ajustar = 0;
        }
        $params->identidad = $this->_request->getParam('identidad');
        $params->idejercicio = $this->_request->getParam('idejercicio');
        $params->identidadmodelo = $this->_request->getParam('identidadmodelo');
        $params->meta = $this->_meta;
        $params->integrator = $this->integrator;
        //  $ejercicio = $this->_request->getParam('idejercicio');
        $objModeloModel = new DatModeloModel();
        if ($params->idmodelo != "") {
            $objModeloModel->exportarIndicadoresPlan($params);
        } else {
            $objModeloModel->exportarIndicadoresParaEnmar($params);
        }
    }

    public function ListarComboCentroBalanceAction() {
        $rector = $this->_request->getPost('rector');
        //   $identidad = $this->_request->getPost('identidad');
        $idestructura = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;
        $cbmodel = new CentrodebalanceModel();
        $data = $cbmodel->listarCentrosBalance(
                $rector, true, null, $idestructura
        );
        if ($data == 1) {
            echo("{'codMsg':22 }");
        } else {
            echo json_encode(array('data' => $data));
        }
    }

    public function listarIndXCentroBalanceAction() {
        try {
            ini_set(
                    "max_execution_time", 3600
            ); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            //SOLUCION INICIAL
            $params['idcb'] = $this->_request->getPost('identiCB');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['identlog'] = $this->integrator->metadatos->DameEstructura(
                    ZendExt_GlobalConcept::
                    getInstance()->Estructura->idestructura
            );
            $params['idespecialidad'] = $params['identlog'][0]->idespecialidad;

            if ($params['idcb']) {
                $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') :
                        0;
                $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') :
                        20;
//            $params['filtros'] = $this->_request->getPost('filtros');
//            $filtros = $params['filtros'];
//            if ($filtros) {
//                foreach ($filtros as $datos) {
//                    if ($datos['field'] == 'codigo') {
//                        $params['codigo'] = $datos['data']['value'];
//                    }
//                }
//            }
                $model = new DatPlanificacionModel();
                $datos = $model->listarIndXCB($params);

                echo json_encode($datos);
            } else {
                echo json_encode(array('data' => array()));
            }
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function exportarDemandaAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params = array();
            //$params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));   
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['idcb'] = $this->_request->getParam('identiCB');
            $objModelo = new DatModeloModel();
            $objModelo->exportarDemanda($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function entidadODAction() {
        $identidad = $this->_request->getPost('identidad');
        $obj = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($identidad);
        if ($obj[0])
            echo json_encode(1);
        else
            echo json_encode(0);
    }

    public function adicionarIndicadorAction() {

        ini_set("max_execution_time", 600); //10min
        $parametros = $this->_request->getParams();

        $idmodelo = $this->_request->getPost('idmodelo');
        $idusuario = $this->global->Perfil->idusuario;
        // $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $model = new DatPlanModel();

        $model->adicionarvalores($parametros, $idmodelo, $idusuario);

        $dat->codMsgM = 20;
        $dat->msj = 'Mod';
        echo json_encode($dat);
    }

    public function listarNAEOGRFPlanesAction() {
        $parametros = array();
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['identidadmodelo'] = $this->_request->getPost(
                'identidadmodelo'
        );
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['filtros'] = json_decode(
                stripslashes($this->_request->getPost('filtros'))
        );
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['ajustar'] = $this->_request->getPost('hoja');
        $datos = $this->buscarPresupuestos($parametros);
        echo json_encode(array("data" => $datos->data, "total" => $datos->total));
    }

    private function buscarPresupuestos($parametros) {
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }

        if (!$parametros['limit']) {
            $parametros['limit'] = 20;
        }

        if ($parametros['ajustar'] == 'false') {

            $parametros['arryhijos'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $parametros['identidad']);
            array_push($parametros['arryhijos'], $parametros['identidad']);
        }

        $objPlan = new DatPlanModel();
        $tipomod = new NomTipomodelo();
        $tipomodelo = $tipomod->ObtenerIdTipoModelo($parametros['idmodelo']);
        //OBTIENE UN OBJETO ACTIVE RECORD CON TODA LA INFORMACION DE ESA TABLA PARA
        // TRABAJAR Y HACER MAS CONSULTAS CON ELLA
        $parametros['x'] = $this->_meta->Metadata()->obtenerInfoTabla(
                $tipomodelo[0]['idtabla']
        );

        $data = $objPlan->listarAsociados($parametros);
        // $parametros['x'] = $this->_meta->Metadata()->obtenerInfoTabla($tipomodelo[0]['idtabla']);
        //$data->total = $data->total;
        $data->tipomodelo = $tipomodelo;
        return $data;
    }

    public function validarasociacionAction() {
        $idplanificacion = $this->_request->getPost('idplanificacion');
        $result = DatPlanificacion::obtenerDatPlanificacionNAE(
                        $idplanificacion
        );
        echo json_encode($result);
    }

    public function cargarnaesAction() {
        $filters = $this->_request->getPost('filtros');
        $start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $naes = NomNae::obtenerNAE($filters, null, $start, $limit);
        $naesT = NomNae::obtenerTotalNAE();
        echo json_encode(array('data' => $naes, 'total' => $naesT));
    }

    public function cargarnrecursosfinacierosAction() {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $filters = $this->_request->getPost('filtros');
        $rf = NomRecursofinanciero::obtenerRF($start, $limit, $filters);
        $total = NomRecursofinanciero::obtenerRFtotal($start, $limit, $filters);
        echo json_encode(array('data' => $rf, 'total' => $total));
    }

    public function cargarobjetosgastoAction() {
        $start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $filters = $this->_request->getPost('filtros');
        $og = NomObjetogasto::obtenerOGLocal(null, $start, $limit, $filters);
        $total = NomObjetogasto::obtenerOGtotalLocal(null, $start, $limit, $filters);
        echo json_encode(array('data' => $og, 'total' => $total));
    }

    public function asociarmodeloaobjetogastoAction() {
        $del = $this->_request->getPost('del');
        $ejercicio = $this->_request->getPost('idejercicio');
        $idplanificaciones = json_decode(
                stripslashes($this->_request->getPost('idplanificaciones'))
        );
        $idnaes = json_decode(stripslashes($this->_request->getPost('idnaes')));
        $idobjetogasto = $this->_request->getPost('idobjgasto');
        if ($del != 0) {
            DatPlanificacionModel::elminarAsociaciones($idplanificaciones);
        }
        $idnaeobjetogasto = false;
        foreach ($idplanificaciones as $idplanificacion) {
            $idnaeobjetogasto = DatPlanificacionModel::asociarPlanificacionNaeOG(
                            $idplanificacion, $idnaes, $idobjetogasto, $ejercicio
            );
        }
        $response = array('cod' => 3);
        if (!empty($idnaeobjetogasto)) {
            $response['cod'] = 1;
        }
        echo json_encode($response);
    }

    public function asociarmodeloarecursofinacieroAction() {
        $ejercicio = $this->_request->getPost('idejercicio');
        $del = $this->_request->getPost('del');
        $idplanificaciones = json_decode(
                stripslashes($this->_request->getPost('idplanificaciones'))
        );
        $idnaes = json_decode(stripslashes($this->_request->getPost('idnaes')));
        $idingreso = $this->_request->getPost('idingreso');
        if ($del) {
            DatPlanificacionModel::elminarAsociaciones($idplanificaciones);
        }
        $idnaeingreso = false;
        foreach ($idplanificaciones as $idplanificacion) {
            $idnaeingreso = DatPlanificacionModel::asociarPlanificacionNaeRF(
                            $idplanificacion, $idnaes, $idingreso, $ejercicio
            );
        }
        $response = array('cod' => 3);
        if (!empty($idnaeingreso)) {
            $response['cod'] = 1;
        }
        echo json_encode($response);
    }

    public function eliminarasociacionesnaerecursosAction() {
        $idplanificaciones = json_decode(
                stripslashes($this->_request->getPost('idplanificaciones'))
        );
        $idnaes = json_decode(stripslashes($this->_request->getPost('idnaes')));
        foreach ($idplanificaciones as $idplanificacion) {
            foreach ($idnaes as $idnae) {
                DatPlanificacionModel::elminarAsociacion(
                        $idnae, $idplanificacion
                );
            }
        }
        echo json_encode(array('cod' => 1));
    }

    public function eliminarasociacionesnaeobjetogastoAction() {
        $idplanificaciones = json_decode(
                stripslashes($this->_request->getPost('idplanificaciones'))
        );
        $idnaes = json_decode(stripslashes($this->_request->getPost('idnaes')));
        foreach ($idplanificaciones as $idplanificacion) {
            foreach ($idnaes as $idnae) {
                DatPlanificacionModel::elminarAsociacion(
                        $idnae, $idplanificacion
                );
            }
        }
        echo json_encode(array('cod' => 1));
    }

    public function eliminarasociacionesAction() {
        $idplanificaciones = json_decode(
                stripslashes($this->_request->getPost('idplanificaciones'))
        );
        DatPlanificacionModel::elminarAsociaciones($idplanificaciones);
        echo json_encode(array('cod' => 1));
    }

    public function exportarpresupuestoAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['identidadmodelo'] = $this->_request->getParam(
                'identidadmodelo'
        );
        $parametros['idmodelo'] = $this->_request->getParam('idmodelo');
        $parametros['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        $parametros['limit'] = $this->_request->getParam('limit');
        $parametros['start'] = $this->_request->getParam('start');
        $parametros['ajustar'] = $this->_request->getParam('hoja');
        $entidad = $this->_request->getParam('entidad');
        $plan = $this->_request->getParam('plan');
        $arrayIdsDatosNomUno = array();
        $arrayIdsDatosNomDos = array();
        $data = $this->buscarPresupuestos($parametros);
        $datos = $data->data;
        $tipomodelo = $data->tipomodelo;
        unset($data);

        $arrayCampostab = DatPlanModel::camposdadoTabla(
                        $tipomodelo[0]['idtabla']
        );

        $arrayCampos = array();
        foreach ($arrayCampostab as $d) {
            $referencia[0] = "mod_planificacionmeta_nom_{$tipomodelo[0]['codigo']}_{$d['denomcampo']}";
            $referencia[1] = $d['denomcampo']; //n4 o n5
            $arrayCampos[] = $referencia;
        }
        unset($arrayCampostab);

        foreach ($datos as $k => $d) {

            foreach ($arrayCampos as $campoMeta) {
                $campoMeta = $campoMeta[0];
                if ($arrayIdsDatosNomUno['_' . $campoMeta] == null && $d[$campoMeta] != null
                ) {
                    $arrayIdsDatosNomDos[] = $d[$campoMeta];
                    $arrayIdsDatosNomUno['_' . $d[$campoMeta]] = 'ok';
                }
            }
        }

        $arrayIdsDatosNomDos = array_unique($arrayIdsDatosNomDos);
        unset($arrayIdsDatosNomUno);
        if ($arrayIdsDatosNomDos[0] != null) {
            $arrayColumnas = NomDatosnomenclador::ObtenerDatosDadoArrayIdDatosNom(
                            $arrayIdsDatosNomDos
            );
        }

        unset($arrayIdsDatosNomDos);
        if (is_array($arrayColumnas)) {
            foreach ($arrayColumnas as $key => $value) {
                unset($arrayColumnas[$key]);
                $arrayColumnas['_' . $value['iddatosnomenclador']] = $value['denominacion'];
            }
        }

        foreach ($datos as $k => $d) {
            foreach ($arrayCampos as $campoMeta) {
                $datos[$k]['deno_' . $campoMeta[1]] = $arrayColumnas['_'
                        . $d[$campoMeta[0]]];
            }
        }

        $arrayEtiquetas = DatPlanModel::getEtiquetasTabla(
                        $tipomodelo[0]['idtabla']
        );
        $tabla = '<table border="1">
            <thead>
                <tr></tr>
                <tr>
                    <td colspan="11"><b>Entidad: </b> ' . utf8_decode($entidad)
                .
                ' &nbsp;&nbsp;&nbsp; <b>Plan: </b> ' . utf8_decode($plan) . ' <br></td>
                </tr>
                <tr></tr>
                <tr></tr>
            </thead>
            <tbody>
                <tr>
                    <th>C&oacute;digo</th>
                    <th>Num. piezas</th>
                    <th>Denominaci&oacute;n</th>
					<th>Asociado</th>
                    <th>UM</th>
                    <th>Precio</th>
                    <th>Necesidad</th>
                    <th>Centro balance</th>
                    <th>Importe</th>
                ';
        foreach ($arrayEtiquetas as $ind => $etiq) {
            $tabla .= '<th>' . $etiq['etiqueta'] . '</th>';
        }
        $tabla .= ' </tr> ';
        for ($i = 0; $i < count($datos); $i++) {
            $numeropieza = $datos[$i]['numeropieza'] ? $datos[$i]['numeropieza'] : 0;
            $asociado = ($datos[$i]['idplanificacionnae']) ? 'Si' : 'No';
            $unidadmedida = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($datos[$i]['idumedida'])
            );
            $unidadmedida = $unidadmedida->abreviatura;

            $tabla .= '<tr>
                                        <td>' . $datos[$i]['codigo'] . '</td>
                                        <td>' . $numeropieza . '</td>
                                        <td>' . $datos[$i]['denominacion'] .
                    '</td>
										<td>' . $asociado . '</td>
                                        <td>' . $unidadmedida . '</td>
                                        <td>' . $datos[$i]['precio'] . '</td>
                                        <td>' . $datos[$i]['cantidad'] . '</td>
                                        <td>' . $datos[$i]['denocentrobalance']
                    .
                    '</td>
                                        <td>' . $datos[$i]['importe'] . '</td>
                                    ';
            foreach ($arrayEtiquetas as $ind => $etiq) {
                $tabla .= ' <td>' . $datos[$i]['deno_' . $etiq['denominacion']]
                        . '</td>';
            }
        }
        $tabla .= ' </tr>
            </tbody>
        </table>';

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=planes.xls");
        header("Content-Transfer-Encoding: binary ");

        echo $tabla;
    }

    public function listarCuentasAction() {
        $params['limit'] = $this->_request->getParam('limit');
        $params['start'] = $this->_request->getParam('start');
        $datos = "{'data':[{'codigo':'100000605','denominacion':'Centro de RRHH','tipo':'Gasto'},
                    {'codigo':'100000622','denominacion':'Centro de PLANIF','tipo':'Recurso'},
                    {'codigo':'100000722','denominacion':'Centro de PLANIF','tipo':'Recurso'},
                    {'codigo':'100000822','denominacion':'Centro de PLANIF','tipo':'Recurso'},
                    {'codigo':'100000322','denominacion':'Centro de PLANIF','tipo':'Recurso'}],'total':5}";

        echo $datos;
    }

    public function asociarCuentasAction() {
        
    }

    public function eliminarAsociacionCuentasAction() {
        
    }

    //Elimina un indicador de un modelo
    public function eliminarIndmodPlanAction() {
        ini_set("max_execution_time", 600); //10min
        //COJO EL ID DE PLANIFICACION
        $idplanificacion = json_decode(
                stripslashes($this->_request->getPost('idplanificacion'))
        );
        $idindicadores = json_decode(
                stripslashes($this->_request->getPost('idindicador'))
        );
        $idejercicioselect = json_decode(
                stripslashes($this->_request->getPost('idejercicio'))
        );
        // Devuelvo para la IU la confirmacion
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $identidad = $this->global->Estructura->idestructura;
        $arrayIndic = array();
        $idejercicio = null;
        foreach ($idplanificacion as $key => $i) {
            $aprobado = DatPlanificacion::demandaAprobacion($i);

            if ($aprobado == 1) {
                $noproceden[] = $i;
            } else {

                $objdatplanif = Doctrine::getTable('DatPlanificacion')->find($i);
                $arrayIndic[] = $objdatplanif->idindicador;
                $idejercicio = $objdatplanif->idejercicio;
                unset($objdatplanif);
                DatModeloModel::eliminarIndmodPlan(
                        $i, $identidad, $identidadmodelo
                );
            }
        }

        if ($noproceden) {
            $dat->codMsg = 21; //esta aprobado, no se puede eliminar
        } else {
            if ($idejercicio && $arrayIndic[0] != null) {
                $objdatplanif = Doctrine::getTable('DatPlanificacion')->find($indExistente->idplanificacion)->idindicador;
                $objentmod = Doctrine::getTable('DatEntidadmodelo')->find($identidadmodelo);

                /* $conn = Doctrine_Manager::connection();
                  $query = "select * from mod_planificacion.f_actualizar_balancematerial_eliminarplanif(?, ?, ?, ?, ?)";
                  $arrayIndic = implode(",", $arrayIndic);
                  $paramsQuery = array($objentmod->identidad,
                  $objentmod->idmodelo, $identidadmodelo,
                  $idejercicio,
                  "{" . $arrayIndic . "}");
                  $conn->execute($query, $paramsQuery)->fetchAll(); */
            }
            $dat->codMsgD = 1;
        }


        echo json_encode($dat);
    }

    // TODO ---> Aki va todo lo de pronostico */

    /**
     * La funcion se encarga de buscar todos los organos relacionados con un indicador
     *
     */
    public function getOrganosbyIndicadorAction() {

        $params['idIndicador'] = $this->_request->getPost('idIndicador');
        $params['idEntidad'] = $this->_request->getPost('idEntidad');
        $params['idEjercicio'] = $this->_request->getPost('idEjercicio'); //idTreePanel
        $params['idTreePanel'] = $this->_request->getPost('idTreePanel');
        $data = array();
        $object = new DatModeloModel();
        $data = $object->getOSbyIndicador($params);

        echo json_encode($data);
    }

    public function getMesesAction() {

        $data = array();
        $object = new DatModeloModel();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 12;
        $data = $object->getMeses($params);

        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function gestionarPronosticoAction() {

        $params = json_decode($this->_request->getPost('pronosticos'));
        $data = array();
        $object = new DatModeloModel();
        $data = $object->setPronosticos($params);
    }

    //importar datos al plan segun tipo de modelo	
    function importarficheroAction() {

        //obteniendo parametro
        $idtipomodelo = $this->_request->getPost('idtipomodelo');

        //buscando listado de columnas dinamicas segun Tipo de Modelo
        $coldinam = NomTipomodelocolumna::ListarColumnasImportarPlan($idtipomodelo);

        //creando el arreglo de las columnas fijas
        $colfijas = array();
        $colfijas[0][0] = "Código";
        $colfijas[0][1] = "Cadena de caracteres";
        $colfijas[0][2] = 0;
        $colfijas[0][3] = 0;
        $colfijas[0][4] = 0;
        $colfijas[1][0] = "Cantidad";
        $colfijas[1][1] = "Numérico";
        $colfijas[1][2] = 1;
        $colfijas[1][3] = 1;
        $colfijas[1][4] = 1;
        $colfijas[2][0] = "Ajuste";
        $colfijas[2][1] = "Numérico";
        $colfijas[2][2] = 2;
        $colfijas[2][3] = 2;
        $colfijas[2][4] = 2;
        $colfijas[3][0] = "Aprobado";
        $colfijas[3][1] = "Cadena de caracteres";
        $colfijas[3][2] = 3;
        $colfijas[3][3] = 3;
        $colfijas[3][4] = 3;

        //obteniendo arreglo con todas las columnas
        $columnas = array_merge($colfijas, $coldinam);

        //leyendo el excel
        $filename = $_FILES['file']['tmp_name'];
        $file = $filename;
        $ruta = '/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);
        $data = new ReaderModel();
        $data->setOutputEncoding('CP1251');
        $data->read($file);
        $dat = $data->sheets[0]['cells'];


        //obteniendo las columnas del excel
        $columnasExcel = array();
        foreach ($dat[0] as $k => $col) {
            $columnasExcel[$k][0] = $col;
            $columnasExcel[$k][1] = $k;
        }

        //convirtiendo el arreglo de datos en un text
        $datos = serialize($dat);

        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        //eliminando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarplanxls" . $idusuario);

        //creando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importarplanxls" . $idusuario . " (xls TEXT) WITH (oids = false)");

        //almacenando los datos en la BD para usarlos en la próxima petición         
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importarplanxls" . $idusuario . "(xls) VALUES ('" . $datos . "')");

        echo json_encode(
                array('columnas' => $columnas, 'columnasExcel' => $columnasExcel, 'columnasdinamicas' => $coldinam)
        );
    }

    //validar datos a importar al plan segun tipo de modelo
    function importarDatosRelacionadosAction() {
        try {



            //obteniendo los parametros
            $relaciones = json_decode(stripslashes($this->_request->getParam('relaciones')));
            $coldin = json_decode(stripslashes($this->_request->getParam('coldin')));
            $identidadmodelo = $this->_request->getPost('identidadmodelo');
            $idejercicio = $this->_request->getPost('idejercicio');
            $tipoplan = $this->_request->getPost('tipoplan');
            $idtipomodelo = $this->_request->getPost('idtipomodelo');

            //obteniendo el id del usuario logueado
            $idusuario = $this->global->Perfil->idusuario;

            //buscando nombre_tabla segun Tipo de Modelo
            $nombreTabla = NomTipomodelocolumna::ListarNombreTabla($idtipomodelo);

            //eliminando tabla temporal dinámica
            $conn = Doctrine_Manager::connection();
            $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_tipomodelo" . $idusuario);

            //obteniendo los datos del excel guardados en BD en la petición anterior(importarfichero)    
            $query = "SELECT  xls FROM  mod_planifimportacion.temp_importarplanxls" . $idusuario;
            $result = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
            $datos = unserialize($result[0]);

            //preparando datos para crear tabla dinamica
            //en esta variable se guarda, de las columnas segun tipo de modelo,
            //la posicion de su columna correspondiente en el excel
            $posiciones = array();

            //en esta variable se guardan los campos y tipos de datos 
            //con que se creara la tabla
            $cadenacampos = "";

            //en esta variable temporal se guardan las denominaciones 
            //de las columnas sin caracteres especiales
            $tempDenomCol = "";


            foreach ($relaciones as $rel) {
                if ($rel->denomcolumna == "Código") {
                    $posiciones['codigo'] = $rel->posicion;
                    continue;
                } else {
                    if ($rel->denomcolumna == "Cantidad") {
                        $posiciones['cantidad'] = $rel->posicion;
                        continue;
                    } else {
                        if ($rel->denomcolumna == "Ajuste") {
                            $posiciones['ajuste'] = $rel->posicion;
                            continue;
                        } else {
                            if ($rel->denomcolumna == "Aprobado") {
                                $posiciones['aprobado'] = $rel->posicion;
                                continue;
                            } //aqui solo entraria si es una columna dinamica
                            else {
                                $tempDenomCol = self::modificarCaracteresEspeciales($rel->denomcolumna);
                                $posiciones[$tempDenomCol] = $rel->posicion;
                                if ($rel->denomtipocolumna == "Nomenclador") {
                                    $cadenacampos .= " " . $tempDenomCol . "id" . " NUMERIC(19,0),";
                                    $cadenacampos .= " " . $tempDenomCol . " VARCHAR(255),";
                                } else {
                                    $cadenacampos .= " " . $tempDenomCol . " $rel->nombre,";
                                }
                            }
                        }
                    }
                }
            }

            //creando tabla temporal dinamica  
            $conn->execute("CREATE TABLE mod_planifimportacion.temp_tipomodelo" . $idusuario . " (
          idtabla serial,
          codigo VARCHAR(255) NOT NULL,
          idindicador NUMERIC(19,0),
          identidadmodelo NUMERIC(19,0),
          idejercicio NUMERIC(19,0) NOT NULL,
          precio NUMERIC(19,6)  DEFAULT 0 NOT NULL,
          idunidadmedida NUMERIC(19,0),
          idcentrobalance NUMERIC(19,0),
          cantidad NUMERIC(19,6) DEFAULT 0 NOT NULL,
          idaprobaciondemanda NUMERIC(19,0) DEFAULT 1 NOT NULL,
          preciodivisa NUMERIC(19,6) DEFAULT 0 NOT NULL,
          ajuste NUMERIC(19,6) DEFAULT 0 NOT NULL,
          centrosbalance VARCHAR,
          viasadquisicion VARCHAR,
          organossatisface VARCHAR, $cadenacampos
          iddatosnomenclador NUMERIC(19,0))");

            //variable que guarda la denominacion de los campos dinamicos
            $denomcampos = $coldin[0][2];

            //variable que guarda la denominacion de las columnas dinamicas
            //y su tipo de dato
            $denomcid = "";
            $denomc = "";
            $tipofilc = "";

            //en esta variable se guardan los campos
            //con que se insertara en la tabla
            $cadenacamposUpdate = "";

            //en esta variable se guardan el array de idaprobaciones
            $aprobaciones = NomAprobacion::getIdAprob();

            foreach ($datos as $j => $row) {

                //ignorando los datos del encabezado de la tabla
                if ($j == 0) {
                    continue;
                }

                //dando valor al codigo si viene vacio
                if ($row[$posiciones['codigo']]) {
                    $codigo = utf8_encode($row[$posiciones['codigo']]);
                } else {
                    $codigo = "-";
                }

                //dando valor a la aprobación si viene vacio o incorrecto
                $idaprobaciondemanda = self::getAprobacion(utf8_encode($row[$posiciones['aprobado']]), $aprobaciones);

                //dando valor a la cantidad si viene un dato incorrecto o vacio
                $cantidad = 0.0;
                if ($row[$posiciones['cantidad']]) {
                    $cant = self::validarNumericPositivo($row[$posiciones['cantidad']]);
                    if ($cant != 'no')
                        $cantidad = $cant;
                }

                //dando valor al ajuste si viene un dato incorrecto o vacio
                $ajuste = 0.0;
                if ($row[$posiciones['ajuste']]) {
                    $ajus = self::validarNumeric($row[$posiciones['ajuste']]);
                    if ($ajus != 'no')
                        $ajuste = $ajus;
                }

                //variable que guarda los datos dinamicos 
                //a insertar en la tabla temporal
                $dina = "";

                //variable para controlar el iddatosnom 
                //a insertar en la tabla temporal
                $booldatonom = 2;

                //en esta variable temporal se guardan las denominaciones 
                //de las columnas sin caracteres especiales
                $tempDenomCol = "";
                //en esta variable temporal se guardan los tipos 
                //de las columnas sin caracteres especiales
                $tempTipoCol = "";
                //en esta variable temporal se guardan las denominaciones
                //de los campos sin caracteres especiales
                $tempDenomCampo = "";

                foreach ($coldin as $i => $value) {
                    $tempDenomCol = self::modificarCaracteresEspeciales($value[0]);
                    $tempTipoCol = self::modificarCaracteresEspeciales($value[1]);
                    $tempDenomCampo = self::modificarCaracteresEspeciales($value[3]);

                    if ($j == 1) {
                        if ($i != 0) {
                            $denomcampos .= "," . $value[2];
                        }
                        $cadenacamposUpdate .= " " . $tempDenomCol . ",";
                    }

                    //dando valor a la fecha si viene un dato incorrecto o vacio                
                    if ($tempDenomCampo == "date") {
                        $fecha = Date('d/m/Y');
                        if ($row[$posiciones[$tempDenomCol]]) {
                            //saber si es una fecha
                            $fech_arr = explode('/', $row[$posiciones[$tempDenomCol]]);
                            if (count($fech_arr) == 3) {
                                if ($fech_arr[0] && $fech_arr[1] && $fech_arr[2]) {
                                    if (checkdate($fech_arr[1], $fech_arr[0], $fech_arr[2])) {
                                        $fecha = utf8_encode($row[$posiciones[$tempDenomCol]]);
                                    }
                                }
                            }
                        }
                        $dina .= " '" . $fecha . "',";
                    }

                    //dando valor al numerico si viene un dato incorrecto o vacio                
                    if ($tempDenomCampo == "numeric" && $value[1] != "Nomenclador") {
                        $num = 0.0;
                        if ($row[$posiciones[$tempDenomCol]]) {
                            $n = self::validarNumeric($row[$posiciones[$tempDenomCol]]);
                            if ($n != 'no')
                                $num = $n;
                        }
                        $dina .= " " . $num . ",";
                    }

                    //dando valor al string si viene un dato incorrecto o vacio     
                    if ($tempDenomCampo == "varchar" && $value[1] != "Nomenclador") {
                        if ($row[$posiciones[$tempDenomCol]]) {
                            $dina .= " '" . utf8_encode($row[$posiciones[$tempDenomCol]]) . "',";
                        } else {
                            $dina .= "'-',";
                        }
                    }

                    //dando valor al nomenclador si viene un dato incorrecto o vacio  
                    if ($value[1] == "Nomenclador") {
                        $nom = "-";
                        if ($row[$posiciones[$tempDenomCol]])
                            $nom = utf8_encode($row[$posiciones[$tempDenomCol]]);
                        $dina .= " '" . $nom . "',";
                    }

                    if ($value[1] == "Nomenclador") {
                        if ($j == 1) {
                            $denomc[] = $tempDenomCol;
                            if ($value[1] == "Nomenclador")
                                $tipofilc[] = "string";
                            else {
                                if ($tempDenomCampo == "varchar")
                                    $tipofilc[] = "string";
                                else {
                                    $tipofilc[] = $tempDenomCampo;
                                }
                            }
                            if ($i != 0) {
                                $denomcid .= "," . $tempDenomCol . "id" . "-" . $tempTipoCol;
                            } else {
                                $denomcid .= $tempDenomCol . "id" . "-" . $tempTipoCol;
                            }
                            $cadenacamposUpdate .= " " . $tempDenomCol . "id,";
                        }

                        //validando columnas dinamicas nomencladas
                        $d = NomDatosnomenclador::getIddatosnom($nom, str_replace("n", "", $value[2]));
                        if ($d[0]) {
                            $dina .= $d[0][0] . ",";
                        } else {
                            $dina .= 0 . ",";
                            $booldatonom = 3;
                        }
                    } else {
                        if ($j == 1) {
                            $denomc[] = $tempDenomCol;
                            if ($value[1] == "Nomenclador")
                                $tipofilc[] = "string";
                            else {
                                if ($tempDenomCampo == "varchar")
                                    $tipofilc[] = "string";
                                else {
                                    $tipofilc[] = $tempDenomCampo;
                                }
                            }
                            if ($i != 0) {
                                $denomcid .= "," . $tempDenomCol . "-" . $tempDenomCampo;
                            } else {
                                $denomcid .= $tempDenomCol . "-" . $tempDenomCampo;
                            }
                        }
                    }
                }

                if ($booldatonom == 2) {
                    $iddatonomenclador = 312;
                } else
                    $iddatonomenclador = 1086;

                //insertando los datos en la tabla temporal
                $conn->execute("INSERT INTO mod_planifimportacion.temp_tipomodelo" . $idusuario . "
                        (
                          codigo,
                          identidadmodelo,
                          idejercicio,
                          cantidad,
                          idaprobaciondemanda,
                          $cadenacamposUpdate
                          ajuste,
                          iddatosnomenclador
                        )
                        VALUES (
                          '$codigo',
                          $identidadmodelo,
                          $idejercicio,
                          $cantidad,
                          $idaprobaciondemanda,
                          $dina   
                          $ajuste,
                          $iddatonomenclador
                        )");
            }

            //ejecutando funcion de BD que valida todos los datos excepto los dinamicos 
            $paramsQuery = array($tipoplan, $idusuario);
            $query = "select * from mod_planifimportacion.f_importarplanificacionxls(?,?);";
            $result = $conn->execute($query, $paramsQuery);
            $result->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(
                    array('tabla' => $nombreTabla[0], 'campos' => $denomcampos, 'columnasdinamicas' => $denomcid, 'columnasdinamicasindex' => $denomc, 'tipofilc' => $tipofilc)
            );
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

    //listar datos validados a importar al plan segun tipo de modelo
    function listarDatosValidadosAction() {
        $coldin = json_decode(stripslashes($this->_request->getParam('coldin')));
        if ($coldin[0]) {
            $coldin = implode(',', $coldin);
            $coldin = ", " . $coldin;
        } else {
            $coldin = "";
        }
        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        $start = $this->_request->getParam('start');
        $limit = $this->_request->getParam('limit');
        $filtros = $this->_request->getPost('filtros');
        $addWhere = "where true";
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere .= " and codigo like '%" . $datos['data']['value'] . "%'";
                } else {
                    if ($datos['field'] == 'cantidad' || $datos['field'] == 'ajuste') {
                        $cond = "=";
                        if ($datos['data']['comparison'] == "gt") {
                            $cond = ">";
                        } elseif ($datos['data']['comparison'] == "lt") {
                            $cond = "<";
                        }
                        if ($datos['field'] == 'cantidad') {
                            $addWhere .= " and cantidad" . $cond . $datos['data']['value'];
                        } else {
                            $addWhere .= " and ajuste" . $cond . $datos['data']['value'];
                        }
                    } else {
                        if ($datos['field'] == 'idaprobaciondemanda') {
                            if ($datos['data']['value'] == "Sí") {
                                $idapr = 3;
                            } elseif ($datos['data']['value'] == "No") {
                                $idapr = 1;
                            } elseif ($datos['data']['value'] == "Rector") {
                                $idapr = 4;
                            } elseif ($datos['data']['value'] == "Ajuste") {
                                $idapr = 5;
                            }
                            $addWhere .= " and idaprobaciondemanda =" . $idapr;
                        } else {
                            if ($datos['data']['type'] == 'numeric') {
                                $cond = "=";
                                if ($datos['data']['comparison'] == "gt") {
                                    $cond = ">";
                                } elseif ($datos['data']['comparison'] == "lt") {
                                    $cond = "<";
                                }
                                $addWhere .= " and " . $datos['field'] . "" . $cond . $datos['data']['value'];
                            } else {
                                if ($datos['data']['type'] == 'string') {
                                    $addWhere .= " and upper(" . $datos['field'] . ") like '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                                } else {
                                    if ($datos['data']['type'] == 'date') {
                                        $value = split('/', $datos['data']['value']);
                                        $value = "'" . $value [1] . '/' . $value [0] . '/' . $value [2] . "'";
                                        $cond = "=";
                                        if ($datos['data']['comparison'] == "gt") {
                                            $cond = ">";
                                        } elseif ($datos['data']['comparison'] == "lt") {
                                            $cond = "<";
                                        }
                                        $addWhere .= " and " . $datos['field'] . "" . $cond . $value;
                                    } else {
                                        die;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT idtabla, codigo, cantidad, ajuste, idaprobaciondemanda, dn.denominacion as denominaciondato $coldin
FROM mod_planifimportacion.temp_tipomodelo" . $idusuario . " tm
     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = tm.iddatosnomenclador)
      $addWhere    OFFSET $start LIMIT $limit";
        $data->data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $query = "SELECT count(tm.idtabla)
FROM mod_planifimportacion.temp_tipomodelo" . $idusuario . " tm
     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = tm.iddatosnomenclador)
     $addWhere";
        $data->total = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $data->total = $data->total[0];
        echo json_encode($data);
    }

    //inserta todos los datos validados correctamente
    function insertarDatosImportarAction() {
        try {

            //obteniendo los parametros
            $tabla = $this->_request->getParam('tabla');
            $columnasdinamicas = $this->_request->getParam('columnasdinamicas');
            $campos = $this->_request->getParam('campos');

            //obteniendo el id del usuario logueado
            $idusuario = $this->global->Perfil->idusuario;

            //ejecutando funcion de BD que inserta todos los datos validados correctamente
            $conn = Doctrine_Manager::connection();
            $paramsQuery = array($tabla, $campos, $columnasdinamicas, $idusuario);
            $query = "select * from mod_planifimportacion.f_importarplanificacioninsertar(?,?,?,?);";
            $result = $conn->execute($query, $paramsQuery);
            $result->fetchAll(PDO::FETCH_ASSOC);

            //eliminando tabla donde se guardan los datos del excel
            $conn = Doctrine_Manager::connection();
            $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarplanxls" . $idusuario);

            //eliminando tabla temporal dinámica
            $conn = Doctrine_Manager::connection();
            $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_tipomodelo" . $idusuario);

            echo json_encode(1);
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

    public static function modificarCaracteresEspeciales($url) {
        $url = strtolower($url);
        //Reemplazamos caracteres especiales latinos 
        $find = array('á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'î', 'ô', 'û', 'ã', 'õ', 'ç', 'ñ');
        $repl = array('a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u', 'a', 'o', 'c', 'n');
        $url = str_replace($find, $repl, $url);
        //Añadimos los guiones 
        $find = array(' ', '&amp;', '\r\n', '\n', '+');
        $url = str_replace($find, '_', $url);
        //Eliminamos y Reemplazamos los demas caracteres especiales 
        $find = array('/[^a-z0-9\-&lt;&gt;]/', '/[\-]+/', '/&lt;{^&gt;*&gt;/');
        $repl = array('', '-', '');
        $url = preg_replace($find, $repl, $url);
        return $url;
    }

    private function validarNumeric($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor)) {
            return $valor;
        }
        return 'no';
    }

    private function validarNumericPositivo($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor) && $valor >= 0) {
            return $valor;
        }
        return 'no';
    }

    private function getAprobacion($val, $aprobaciones) {
        if ($val != null) {
            if ($val == 'Si' || $val == 'Sí' || $val == 'sí' || $val == 'si' || $val == 'SI' || $val == 'SÍ' || $val == 'Aprobado' || $val == 'APROBADO'
            ) {
                if ($aprobaciones['Aprobado'])
                    return $aprobaciones['Aprobado'];
            }
            if ($val == 'Rector' || $val == 'rector' || $val == 'RECTOR'
            ) {
                if ($aprobaciones['AprobadoR'])
                    return $aprobaciones['AprobadoR'];
            }
            if ($val == 'Ajuste' || $val == 'ajuste' || $val == 'ajustado'
            ) {
                if ($aprobaciones['Aprobado Ajuste'])
                    return $aprobaciones['Aprobado Ajuste'];
            }
        }
        if ($aprobaciones['Elaboración'])
            return $aprobaciones['Elaboración'];
        else
            return 1;
    }

    public function cargarImporteInicialAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidadmodelo'] = $this->_request->getParam(
                'identidadmodelo'
        );

        $parametros['arrayidplanificacion'] = json_decode(
                stripslashes(
                        $this->_request->getParam('arrayidplanificacion')
                )
        );

        $modelGesPlanes = new DatPlanModel();
        $resultado = $modelGesPlanes->cargarImporteInicial($parametros);
        $resultadoDos = number_format($resultado, '3', '.', ',');
        echo json_encode(
                array('importe' => $resultado, 'importeformato' => $resultadoDos)
        );
    }

    public function calcularAjusteAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidadmodelo'] = $this->_request->getParam(
                'identidadmodelo'
        );
        $parametros['porciento'] = $this->_request->getParam('porciento');
        $parametros['arrayidplanificacion'] = json_decode(
                stripslashes(
                        $this->_request->getParam('arrayidplanificacion')
                )
        );
        $modelGesPlanes = new DatPlanModel();
        $resultado = $modelGesPlanes->calcularAjuste($parametros);
        $resultadoDos = number_format($resultado, '3', '.', ',');
        echo json_encode(
                array('importe' => $resultado, 'importeformato' => $resultadoDos)
        );
    }

    public function insertarAjusteAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidadmodelo'] = $this->_request->getParam(
                'identidadmodelo'
        );
        $parametros['porciento'] = $this->_request->getParam('porciento');
        $parametros['arrayidplanificacion'] = json_decode(
                stripslashes(
                        $this->_request->getParam('arrayidplanificacion')
                )
        );
        $modelGesPlanes = new DatPlanModel();
        $resultado = $modelGesPlanes->insertarAjuste($parametros);
        echo $resultado;
    }

    /* Reporte resumen OACE y Organos demandantes */

    public function listarOACEAction() {
        $data = NomOrganosatisfaceModel::listarOACE();
        echo json_encode($data);
    }

    public function listarPlanReporteOACEAction() {
        $data = DatModeloModel::listarPlanReporteOACE();
        echo json_encode($data);
    }

    public function listarOrganosDemandantesAction() {
        $params['identidadlogueada'] = $this->global->Estructura->idestructura;
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $data = DatEntidaddatosnomencladorModel::listarOrganosDemandantes($params);
        echo json_encode($data);
    }

    public function exportarReporteResumenOACEAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            //manejo de parametros
            $params = array();
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['ejercicio'] = $this->_request->getParam('ejercicio');
            $params['idmodelo'] = $this->_request->getParam('idmodelo');
            $params['modelo'] = $this->_request->getParam('modelo');
            $params['idoace'] = $this->_request->getParam('idoace');
            $params['idorganosdemandantes'] = $this->_request->getParam('idorganosdemandantes');

            //obtener el tipo de modelo del plan seleccionado       
            $params['tipomodelo'] = NomTipomodelo::ObtenerIdTipoModelo($params['idmodelo']);

            //OBTIENE UN OBJETO ACTIVE RECORD CON TODA LA INFORMACION 
            //DE ESA TABLA PARA TRABAJAR Y HACER MAS CONSULTAS CON ELLA
            $params['x'] = $this->_meta->Metadata()->obtenerInfoTabla($params['tipomodelo'][0]['idtabla']);

            $data = DatModeloModel::exportarReporteResumenOACE($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    /* Fin Reporte resumen OACE y Organos demandantes */
}
