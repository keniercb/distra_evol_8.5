<?php

//aqui abel 33 xxxx sss
class BpgestnivelesactividadController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function bpgestnivelesactividadAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function listarActsNivActAction() {
        ini_set("max_execution_time", 600);
        $params = array();
        $params['esrector'] = $this->_request->getPost('esrector');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['columnasamostrar'] = json_decode(stripslashes($this->_request->getPost('columnsToShow')));
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $params ['idaprobacion_actividad'] = array(3, 4);
        $params ['idEstructuraPadre'] = $this->_request->getPost('idEstructuraPadre');
        $params ['calcularrestoxdistrib'] = $this->_request->getPost('calcularrestoxdistrib');
        $global = ZendExt_GlobalConcept::getInstance();
        if ($this->_request->getPost('idespecialidad') != '') {
            $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
        } else {
            $params['idespecialidad'] = $global->Estructura->idespecialidad;
        }

        $params['identidad'] = $this->_request->getPost('identidad');
        if ($params ['idEstructuraPadre'] == 'undefined') {
            $params ['idEstructuraPadre'] = $params['identidad'];
        }
        /* aki se guarda si se manda o no a calcular el importe */
        $params ['calcularimporte'] = $this->_request->getPost('calcularimporte');

        if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0') {
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];

            if ($this->_request->getPost('codigo') != '') {
                $params ['codigo'] = $this->_request->getPost('codigo');
            }
            if ($this->_request->getPost('denominacion') != '') {
                $params ['denominacion'] = $this->_request->getPost('denominacion');
            }
            if ($this->_request->getPost('calcularimporte') != '') {
                $params ['calcularimporte'] = $this->_request->getPost('calcularimporte');
            }
            if ($this->_request->getPost('idaprobacion') != '') {
                $params ['idaprobacion'] = $this->_request->getPost('idaprobacion');
            }


            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;


            $modelActEnt = new DatActividadentidadModel();
            $params['entidades_productoras'] = array('-1');
            $security = ZendExt_Aspect_Security_Sgis::getInstance();
            if ($params ['calcularrestoxdistrib'] == 'true') {
                $params['entidades_productoras'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params ['idEstructuraPadre']);
            }

            if ($this->_request->getPost('glob') == 'false') {
                $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($params['identidad']);



                if ($params['identidad'][0] == null || $params['identidad'][0] == '' || !$params['identidad'][0]) {
                    $data->data = array();
                    $data->data[0]['idactividadentidad'] = -1;
                    echo json_encode($data);
                } else {
                    $params['identidad'] = $params['identidad'][0];
                    $params['entidades'] = array('0' => $params['identidad']);
                    $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
                    $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;
                    if ($params['esrector'] == 'true') {
                        $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
                    }

                    $result = $modelActEnt->listarActsNivActPorEntidad($params);
                    if ($result == -1) {
                        $data->data = array();
                        echo json_encode($data);
                    } else {
                        echo json_encode($result);
                    }
                }
            } else {
                /* Consolidar niveles de actividad */
                $idestructura = $this->integrator->metadatos->DameEstructura($params['identidad']);
                $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($idestructura[0]->idestructura);
                $var = implode(',', $params['entidades']);
                $params['entidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);

                if ($params['entidades'] [0] != null) {
                    $params['id_especialidades'] = array();
                    foreach ($params['entidades'] as $key => $valorIdentidad) {
                        $tempEspecialidades = 0;
                        $entidades[] = $this->integrator->metadatos->DameEstructura($valorIdentidad);
                        foreach ($params['id_especialidades'] as $esp) {
                            if ($esp == $entidades [$key][0]->idespecialidad) {
                                $tempEspecialidades = 1;
                            }
                        }
                        if ($tempEspecialidades == 0) {
                            $params['id_especialidades'] [] = $entidades [$key][0]->idespecialidad;
                        }
                    }

                    $result = $modelActEnt->listarActsNivActPorEntidad($params);
                    if ($result == -1) {
                        $data->data = array();
                        echo json_encode($data);
                    } else {
                        echo json_encode($result);
                    }
                } else {
                    $data->data = array();
                    $data->total = 0;
                    echo json_encode($data);
                }
            }
        } else {
            if ($params['identidad'] == '0' || $params['identidad'] == null) {

                $data->total = 0;
                echo json_encode($data);
            } else {
                echo json_encode(
                        array('codMsg' => 3,
                            'mensaje' => 'Su secci&oacute;n ha expirado, por favor reinicie el sistema. ')
                );
            }
        }
    }

//fin de la función listar

    /**
     * actualizarNivActividad
     *
     * @param '$idEstructura'- identificador de la entidad logueada
     * @param 'actividades'- arreglo de activividades con sus respectivos niveles de actividad
     *
     * @return array, devuelve un mensaje si se adiciona o modifica correctamente la actividad y los niveles
     * de actividad actulizados
     * */
    public function actualizarNivActividadAction() {
        ini_set("max_execution_time", 600);
        $params['actividades'] = json_decode(
                stripslashes($this->_request->getPost('niveles'))
        );
        $idEstructuraPadre = $this->_request->getPost('idEstructuraPadre');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $var = $params['actividades'][0]->identidad;
        $datosentidad = $this->integrator->metadatos->DameEstructura($var);
        $params['espcomp'] = $datosentidad[0]->idespecialidad;
        $model = new DatActividadentidadModel();
        if ($params['actividades'][0] != null) {
            $model->modificarNivelesActividad($params);
        }
        echo json_encode(array('codMsgE' => 1));
    }

//fin de la función cargarEntidades

    /**
     * listarEspecialidades
     * Lista todas las especilidades existentes en el nomenclador de especialidades
     *
     * @return array, devuelve array con el listado de especialidades
     * */
    public function listarEspecialidadesAction() {
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $data->data = $this->nomenclador->selectParam(
                'nom_especialidad', array('idespecialidad', 'denespecialidad')
        );
        echo json_encode($data);
    }

    /**
     * aprobarDesaprobarNivelActividad
     * Cambia la aprobacion de un nivel de actividad (aprobada o desaprobada)
     *
     * @param 'idaprobacion'- idaprobacion contrario a el que va a tomar de la actividad
     * @param 'idactividad'- identificador de la actitividad
     * @param 'idactividadentidad'- identificador de la actitividad
     *
     * @return array, devuelve un mensaje con el estado de la actividad (aprobada o desaprobada)
     * */
    public function aprobarDesaprobarNivelActividadAction() {
        $idejercicio = $this->_request->getPost('idejercicio');
        $actividades = json_decode(
                stripslashes($this->_request->getPost('actividades'))
        );
        $identidad = $this->_request->getPost('identidad');
        $idaprobacion = $this->_request->getPost('idaprobacion');
        $ajusteAD = $this->_request->getPost('aprobarOdesaprobarA');
        $isLeaf = $this->_request->getPost('is_leaf');
        $aprobarDesaprobarTodosNivAct = $this->_request->getPost('todos');
        $esrector = ($this->_request->getPost('es_rector') == 'true') ? true : false;
        $aux = "false";
        if ($ajusteAD == "") {
            $aux = "true";
        }
        $modelActEnt = new DatActividadentidadModel();
        if ($aprobarDesaprobarTodosNivAct == 'true') {
            if ($isLeaf == 'true') {
                $datosentidad = $this->integrator->metadatos->DameEstructura($identidad);
                $idespecialidades[0] = $datosentidad[0]->idespecialidad;

                $modelActEnt->aprobar_desaprobarTodosNivelesActividad(
                        $identidad, $idejercicio, $idaprobacion, null, $esrector, $aux, $idespecialidades
                );
                echo json_encode(
                        array('codMsgE' => 1,
                            'mensaje' => (($idaprobacion == '3' || $idaprobacion == '4') ? 'aprobada' : 'desaprobada'),
                            'idaprobacion' => $idaprobacion)
                );
            } else {

                $security = ZendExt_Aspect_Security_Sgis::getInstance();
                $modeloActEnt = new DatActividadentidad();

                $entidadesHijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
                $idespecialidades = array();
                foreach ($entidadesHijas as $key => $valorIdentidad) {
                    $tempEspecialidades = 0;
                    $entidades[] = $this->integrator->metadatos->DameEstructura($valorIdentidad);

                    foreach ($idespecialidades as $esp) {
                        if ($esp == $entidades [$key][0]->idespecialidad) {
                            $tempEspecialidades = 1;
                        }
                    }
                    if ($tempEspecialidades == 0) {
                        $idespecialidades [] = $entidades [$key][0]->idespecialidad;
                    }
                }

                $modelActEnt->aprobar_desaprobarTodosNivelesActividad(
                        $identidad, $idejercicio, $idaprobacion, $entidadesHijas, $esrector, $aux = true, $idespecialidades
                );
                echo json_encode(
                        array('codMsgE' => 1,
                            'mensaje' => (($idaprobacion == '3' || $idaprobacion == '4') ? 'aprobada' : 'desaprobada'),
                            'idaprobacion' => $idaprobacion)
                );
            }
        } elseif ($modelActEnt->aprobarDesaprobarNivelAct(
                        array('actividades' => $actividades, 'identidad' => $identidad,
                            'idejercicio' => $idejercicio,
                            'idaprobacion' => $idaprobacion,
                            'esrector' => $esrector)
                )
        ) {
            echo json_encode(
                    array('codMsgE' => 1,
                        'mensaje' => (($idaprobacion == '3' || $idaprobacion == '4' || $idaprobacion == '5') ? 'aprobada' : 'desaprobada'),
                        'idaprobacion' => $idaprobacion)
            );
        } else {
            echo("{'codMsgE':3 }"); // código de error*/
        }
    }

//fin de la función aprobar desaprobar

    /**
     * listarModelos
     * Lista todos los modelos
     *
     * @return array, devuelve la lista de modelos
     * */
    public function listarModelosAction() {
        $data->data = DatEntidadmodelo::servBP_getModeloAsocEntidad(
        );
        $data->data [] = array('idmodelo' => '-', 'denominacion' => '-');
        echo json_encode($data);
    }

//fin de la funcion listarModelos

    /**
     * aprobarDesaprobarNivelActividad
     * Cambia la aprobacion de un nivel de actividad (aprobada o desaprobada)
     *
     * @param 'idaprobacion'- idaprobacion contrario a el que va a tomar de la actividad
     * @param 'idactividad'- identificador de la actitividad
     * @param 'idactividadentidad'- identificador de la actitividad
     *
     * @return array, devuelve un mensaje con el estado de la actividad (aprobada o desaprobada)
     * */
    public function copiarpegarnivelesAction() {
        try {
            $params['identidadorigen'] = $this->_request->getPost(
                    'identidadorigen'
            );
            $params['identidaddestino'] = $this->_request->getPost(
                    'identidaddestino'
            );
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $datosEntidad = $this->integrator->metadatos->DameEstructura(
                    $params['identidadorigen']
            );
            $params['idesp_ident_origen'] = $datosEntidad [0]->idespecialidad;
            $datosEntidad = $this->integrator->metadatos->DameEstructura(
                    $params['identidaddestino']
            );
            $params['idesp_ident_destino'] = $datosEntidad [0]->idespecialidad;
            $objActEntModel = new DatActividadentidadModel();
            echo json_encode(
                    array('codMsg' => $objActEntModel->copiarPegarNiveles($params))
            );
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

//fin de la funcion copiarpegarniveles

    /**
     * exportarNivelesActvAExcel
     * Exporta los niveles de actividad a un documento excel
     *
     * @return array, devuelve un flujo binario de un fichero excel
     * */
    public function exportarNivelesActvAExcelAction() {
        ini_set("max_execution_time", 600);
        $params = array();
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['text'] = $this->_request->getParam('text');
        $params['is_leaf'] = $this->_request->getParam('is_leaf');
        $params['glob'] = $this->_request->getParam('glob');
        $params['esrector'] = $this->_request->getParam('esrector');
        $params ['idEstructuraPadre'] = $this->_request->getParam('idEstructuraPadre');
        $params ['calcularrestoxdistrib'] = $this->_request->getParam('calcularrestoxdistrib');
        $params ['calcularimporte'] = 'true';

        //para el exportar de niveels con desgloses
        $params['idmodelo'] = $this->_request->getParam('idmodelo');
        $params['tipoExportar'] = $this->_request->getParam('tipo');

        $params['columnasamostrar'] = array(
            0 => 'importe',
            1 => 'importeajustado',
            2 => 'importefinal'
        );
        $global = ZendExt_GlobalConcept::getInstance();
        if ($this->_request->getParam('idespecialidad') != '') {
            //temporal falta enviarlo en el GET
            $params['idespecialidad'] = $this->_request->getParam('idespecialidad');
        } else {
            $params['idespecialidad'] = $global->Estructura->idespecialidad;
        }

        if ($params ['idEstructuraPadre'] == 'undefined') {
            $params ['idEstructuraPadre'] = $params['identidad'];
        }

        if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0'
        ) {
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];

            if (is_array(json_decode(stripslashes($this->_request->getParam('filtros'))))) {
                foreach (json_decode(stripslashes($this->_request->getParam('filtros'))) as $key => $datos) {
                    if ($datos->field == 'codigo' || $datos->field == 'denominacion' || $datos->field == 'denespecialidad' || $datos->field == 'descripcion' || $datos->field == 'idaprobacion' || $datos->field == 'denmodelo' || $datos->field == 'comportamiento') {
                        $params['filtros'][$key]['field'] = $datos->field;
                    } elseif ($datos->field == 'nivelactividadautomatico' || $datos->field == 'nivelactividadmanual' || $datos->field == 'nivelactividadproduccion' || $datos->field == 'nivelactividad' || $datos->field == 'restoxdistrib' || $datos->field == 'ajuste' || $datos->field == 'nivelactividadajuste' || $datos->field == 'importe' || $datos->field == 'importeajustado' || $datos->field == 'importefinal') {
                        $params['filtros'][$key]['field'] = $datos->field;
                        $params['filtros'][$key]['data']['comparison'] = $datos->data->comparison;
                    }
                    if (is_array($datos->data->value)) {
                        $params['filtros'][$key]['data']['value'] = $datos->data->value[0];
                    } else {
                        $params['filtros'][$key]['data']['value'] = $datos->data->value;
                    }
                }
            }

            $params['entidades_productoras'] = array('-1');
            $security = ZendExt_Aspect_Security_Sgis::getInstance();
            if ($params ['calcularrestoxdistrib'] == 'true') {
                $params['entidades_productoras'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params ['idEstructuraPadre']);
            }
            $modelActEnt = new DatActividadentidadModel();
            if ($params['tipoExportar'] == 1) {
                $modelActEnt->exportarAExcel($params);
            } else if ($params['tipoExportar'] == 2) {
                $modelActEnt->exportarAExcelConDesgloses($params);
            }
        }
    }

    public function getEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicio(); //$modelActEnt->listarEjercicios();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
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

        $modelActEntidad = new DatActividadentidadModel();
        $data = $modelActEntidad->gestPermisos($params);
        echo json_encode(array('data' => $data));
    }

    public function cargarImporteInicialAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['arrayidactividad'] = json_decode(
                stripslashes($this->_request->getParam('arrayidactividad'))
        );

        $modelActEnt = new DatActividadentidadModel();
        $resultado = $modelActEnt->cargarImporteInicial($parametros);
        $resultadoDos = number_format($resultado, '3', '.', ',');
        echo json_encode(
                array('importe' => $resultado, 'importeformato' => $resultadoDos)
        );
    }

    public function calcularAjusteAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['arrayidactividad'] = json_decode(
                stripslashes($this->_request->getParam('arrayidactividad'))
        );
        $parametros['porcientoajuste'] = $this->_request->getParam('porciento');
        $modelActEnt = new DatActividadentidadModel();
        $resultado = $modelActEnt->calcularAjuste($parametros);
        $resultadoDos = number_format($resultado, '3', '.', ',');
        echo json_encode(
                array('importe' => $resultado, 'importeformato' => $resultadoDos)
        );
    }

    public function eliminarAjustesAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['arrayidactividad'] = json_decode(
                stripslashes($this->_request->getParam('arrayidactividad'))
        );
        $modelActEnt = new DatActividadentidadModel();
        $resultado = $modelActEnt->eliminarAjustes($parametros);
        echo $resultado;
    }

    public function insertarAjusteNivelAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['arrayidactividad'] = json_decode(
                stripslashes($this->_request->getParam('arrayidactividad'))
        );

        $modelActEnt = new DatActividadentidadModel();
        $modelActEnt->insertarAjusteNivel($parametros);
        echo '1';
    }

//ImporteFinal
    public function ImporteFinalAction() {
        $parametros['importeAjustado'] = $this->_request->getParam(
                'importeAjustado'
        );
        $parametros['importeInicial'] = $this->_request->getParam(
                'importeInicial'
        );
        $calculo = $parametros['importeInicial'] + $parametros['importeAjustado'];
        $importeFinal = number_format($calculo, '3', '.', ',');
        echo json_encode(array('importeformato' => $importeFinal));
    }

    public function buscarColumnasAction() {
        $idmodelo = $this->_request->getParam('idmodelo');
        $obmodel = new DatDesgloseModel();
        $datos = $obmodel->obtenerDatosDesglose($idmodelo);
        echo json_encode(array('datos' => array_reverse($datos)));
    }

    public function guardarDesglosesAction() {
        $parametros['nivelactividad'] = $this->_request->getParam('nivelactividad');
        $parametros['idactividad'] = $this->_request->getParam('idactividad');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['desglose'] = json_decode(stripslashes($this->_request->getPost('desglose')));
        $parametros['columnas'] = json_decode(stripslashes($this->_request->getPost('columnas')));

        try {
            $message = "";
            $obmodel = new DatDesgloseModel();
            $data = $obmodel->desglosar($parametros);
        } catch (Exception $e) {
            $message = $e->getMessage();
            $data = "Error";
        }
        echo json_encode(array('codMsg' => $data, 'message' => $message));
    }

    public function listarDesgloseNivelesActividadAction() {
        try {
            $parametros['idactividad'] = $this->_request->getParam('idactividad');
            $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
            $parametros['identidad'] = $this->_request->getParam('identidad');
            $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $parametros['filtros'] = $this->_request->getPost('filtros');
            $obmodel = new DatDesgloseModel();
            $data = $obmodel->listarDesgloseNivelesActividad($parametros);
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function eliminarDesgloseAction() {
        $parametros['idactividad'] = $this->_request->getParam('idactividad');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['iddesglose'] = implode(",", json_decode(stripslashes($this->_request->getPost('iddesglose'))));
        $obmodel = new DatDesgloseModel();
        $data = $obmodel->eliminarDesglose($parametros);
        echo json_encode(array('codMsgE' => $data));
    }

    public function listarPlanModeloAction() {
        $identidad = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        if ($identidad != 'undefined') {
            $tipo = $this->_request->getPost('tipo');
            $node = $this->_request->getPost('node');
            $model = new DatPlanModel();
            $elementos = $model->Listar($identidad, $tipo, $node, $params['idejercicio'], $identidad, true);
            echo json_encode($elementos);
        } else {
            echo json_encode(array());
        }
    }

    public function actualizarPlanAction() {
        try {
            $params = array();
            ini_set(
                    "max_execution_time", 3600
            ); //600 = 10 min de conexion    3600 = 1hora

            $params['idEstructura'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['tipoplan'] = $this->_request->getPost('tipoplan');
            $entidades[] = $this->integrator->metadatos->DameEstructura($params['idEstructura']
            );
            $params['idespecialidad'] = $entidades [0][0]->idespecialidad;
            $params['idmodelo'] = $this->_request->getPost('idmodelo');
            $iddesglose = DatDesglose::getAsociado($params['idmodelo']);
            $params['iddesglose'] = $iddesglose[0];
            $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
            $modelDesgloseEnt = new DatDesgloseentidadModel();
            $result = $modelDesgloseEnt->actualizarPlan($params);
            echo json_encode(array('codMsgA' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarNormasAction() {

        $params = array();
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['integrator'] = $this->integrator;

        $data = DatNorma::listarNormasPorActividad($params);

        echo json_encode($data);
    }

    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function listarCentroBalanceAction() {
        $idcentrobalance = 1; //temporal numero fijo en la BD para Nomdatosnomenclador
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

    public function listarCompartidaAction() {
        $params['idactividad'] = $this->_request->getParam('idactividad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $modelActEnt = new NomActividadModel();
        $result = $modelActEnt->listarCompartida($params);
        echo json_encode($result);
    }

    public function listarDemandadaAction() {
        $params['idactividad'] = $this->_request->getParam('idactividad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $modelActEnt = new NomActividadModel();
        $result = $modelActEnt->listarDemandada($params);
        echo json_encode($result);
    }

    public function cargarEntidadescomboAction() {
        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $result = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura[0]['identidad']);

        echo json_encode(array('data' => $result));
    }

    public function cargarEntidadesPadreAction() {
        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $datosentidad = $this->integrator->metadatos->DameEstructura(
                $idEstructura[0]['identidad']
        );
        $entrectora = Array();
        $entrectora[0]['id'] = $idEstructura[0]['identidad'];
        $entrectora[0]['text'] = $datosentidad[0]->denominacion;
        $result = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura[0]['identidad']);
        $result = array_merge($result, $entrectora);
        echo json_encode(array('data' => $result));
    }

    public function entidadODAction() {
        $identidad = $this->_request->getPost('identidad');
        $obj = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($identidad);
        if ($obj[0])
            echo json_encode(1);
        else
            echo json_encode(0);
    }

    public function exportarCalculoNivelesActvAExcelAction() {
        ini_set("max_execution_time", 600); //setear el tiempo de ejecucion a 10 min
        $params = array();
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['global'] = $this->_request->getParam('glob');
        $params['idactividad'] = json_decode(stripslashes($this->_request->getParam('idactividades')));
        $modelActEnt = new DatActividadentidadModel ();
        $modelActEnt->exportarCalculoAExcel($params);
    }

    public function listarModeloEntidadAction() {
        $params['identidad'] = $this->_request->getParam('identidad');
        $result = DatEntidadmodeloModel::getModeloEntidad($params['identidad']);
        echo json_encode($result);
    }

    /* Este metodo lista los Sectores - Rama para el desglose multiple */

    public function listarSRAction() {
        $idtiponom = NomTiponomenclador::obtenerDatosNomenclador("SectorRama");
        $result = NomDatosnomenclador::getDatosNomPorIdTipoNom($idtiponom[0]['idtiponomenclador']);
        echo json_encode(array('data' => $result));
    }

    /* Este metodo lista los Destinos para el desglose multiple */

    public function listarDAction() {
        $idtiponom = NomTiponomenclador::obtenerDatosNomenclador("Destino");
        $result = NomDatosnomenclador::getDatosNomPorIdTipoNom($idtiponom[0]['idtiponomenclador']);
        echo json_encode(array('data' => $result));
    }

    public function validarTipoModeloConColumnNomencladasAction() {
        try {
            $params['idactividad'] = $this->_request->getPost('idactividad');
            $data = NomActividadModel::validarTipoModeloConColumnNomencladas($params);
            echo json_encode($data[0]);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Importar fichero
    function importarFicheroAction() {
        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;
        $data = DatActividadentidadModel::importarFichero($idusuario);
        echo json_encode($data);
    }

    //validar datos a importar
    public function importarDatosRelacionadosAction() {
        try {
            //obteniendo los parametros
            $relaciones = json_decode(stripslashes($this->_request->getPost('relaciones')));
            $identidad = $this->_request->getPost('identidad');
            $idejercicio = $this->_request->getPost('idejercicio');
            $idespecialidad = $this->integrator->metadatos->DameEstructura($identidad);
            $idespecialidad = $idespecialidad[0]->idespecialidad;
            //obteniendo el id del usuario logueado
            $idusuario = $this->global->Perfil->idusuario;
            DatActividadentidadModel::importarDatosRelacionados($relaciones, $identidad, $idejercicio, $idespecialidad, $idusuario);
            echo json_encode(array('campos' => 1));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //listar datos validados a importar
    public function listarDatosValidadosAction() {
        try {
            //obteniendo el id del usuario logueado
            $idusuario = $this->global->Perfil->idusuario;
            $start = ($this->_request->getPost('start') != null) ? $this->_request->getParam('start') : 0;
            $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getParam('limit') : 20;
            $filtros = $this->_request->getPost('filtros');
            $data = DatActividadentidad::listarDatosValidados($idusuario, $start, $limit, $filtros);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //inserta todos los datos validados correctamente
    public function insertarDatosImportarAction() {
        try {
            ini_set("max_execution_time", 60000);
            //obteniendo los parametros
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $idespecialidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
            $idespecialidad = $idespecialidad[0]->idespecialidad;
            //obteniendo el id del usuario logueado
            $idusuario = $this->global->Perfil->idusuario;
            DatActividadentidadModel::insertarDatosImportar($params, $idespecialidad, $idusuario);

            echo json_encode(array('codMsgN' => 1));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

}
