<?php

/**
 * Centrodebalance
 * Controlador para gestionar los elementos de centro de balance
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificacion
 * @ subpackage Planificacion
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class CentrodebalanceController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function centrodebalanceAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

//CARGA ATRIBUTOS QUE SE NECESITAN PARA REALIZAR EL BALANCE
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

//LISTA LOS MODELOS QUE TIENEN ELEMENTOS PLANIFICADOES U SON DEL TIPO PLAN MATERIAL
    public function listarComboModelosAction() {
        ini_set("max_execution_time", 3600); //1hora
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        if ($this->_request->getPost('idcb')) {
            $parametros['idcb'] = $this->_request->getPost('idcb');
        } else {
            $parametros['idcb'] = $this->_request->getPost('identidad');
        }
        $parametros['esrector'] = $this->_request->getPost('esrector');
        $parametros['cb'] = $this->_request->getPost('cb');
        $parametros['check'] = $this->_request->getPost('check');
        $parametros['hijosentidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros['identidad']);
        array_push($parametros['hijosentidad'], $parametros['identidad']);
        $cbmodel = new DatPlanModel();
        $data = $cbmodel->obtenerPlanesEntidad($parametros);
        echo json_encode(array('data' => $data));
    }

//LISTA LAS ENTIDADES QUE ESTAN DEMANDANDO ALGUN INDICADOR A ALGUN CENTRO DE BALANCE, Y ESTAS
//SON HIJAS DIRECTAS DEL RECTOR DEL BALANCE (ECONOMIA)


    public function ListarEntidadesAction() {
        $idEstructura = ($this->_request->getPost('node')) ? $this->_request->getPost('node') : 0;
        $valor = ($this->_request->getPost('valor')) ? $this->_request->getPost(
                        'valor'
                ) : null;

        $idEstructuraPadre = $this->_request->getPost('idEstructuraPadre');

        if ($idEstructuraPadre == 'undefined' && $idEstructura != '900000235') {
            $idEstructuraPadre = $idEstructura;
        }
        $iddominio = $this->global->Perfil->iddominio;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
                $iddominio, $idEstructura, 0, 0, 3
        );
        $result = array();
        foreach ($dominios as $key => $val) {
            $result[$key] = $val;
            $result[$key]['idEstructuraPadre'] = $idEstructuraPadre;
            $result[$key]['entidades_productoras'] = "";
            $result[$key]['qtip'] = $val['text'];
        }

        if ($valor != null) {
            foreach ($result as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($result[$key]);
                }
            }

            $res = array();
            $i = 0;
            foreach ($result as $key => $val) {
                $res[$i++] = $val;
            }
        }
        if ($res != null) {
            $result = $res;
        }

        echo json_encode($result);
    }

//LISTA LAS ENTIDADES DEL DOMINIO POR EL QUE SE ESTA LOGUEADO
    public function listarArbolEntidadesAction() {
        /*
          si tipo == 0 : devuelvo los datos de la entidad que esta logueada
          si tipo == 1 : devuelvo los organos demandantes del CB señalado
         */
        $parametros = Array();
        $parametros['node'] = $this->_request->getPost('node');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $parametros['idmodelo'] = $this->_request->getPost('idmode');
        $parametros['orgrecto'] = $this->_request->getPost('rector');
        $parametros['soyCB'] = $this->_request->getPost('cb');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['ordem'] = $this->_request->getPost('ordem');
        $parametros['valor'] = ($this->_request->getPost('valor')) ? $this->_request->getPost('valor') : null;
        $cbmodel = new CentrodebalanceModel();
        echo json_encode($cbmodel->listarEntidades($parametros));
    }

//LISTA LOS CENTROS DE BALANCE EN DEPENDENCIA DE LA ENTIDAD LOGUEADA
    public function ListarComboCentroBalanceAction() {
        $rector = $this->_request->getPost('rect');
        $cb = $this->_request->getPost('soyCB');
        $od = $this->_request->getPost('soyDem');
        $identidad = $this->_request->getPost('ident');
        $cbmodel = new CentrodebalanceModel();
        $data = $cbmodel->listarCentrosBalance($rector, $cb, $od, $identidad);

        if ($data == 1) {
            echo("{'codMsg':22 }");
        } else {
            echo json_encode(array('data' => $data));
        }
    }

//ESTO ES PARA EL COMBO DE LOS FILTROS
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

//LISTA TODOS LOS INDICADORES QUE EXISTEN EN UN PLAN CUYA NECESIDAD ES >0 EN DEPENDENCIA
//DEL COMPORTAMIENTO QUE SE LE ESPECIFIQUE    
    public function listarIndicadoresEntidadAction() {

        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');

        $parametros = Array();
        //idejercicio
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        //Recibo el identidad del OD
        $parametros['identidadOD'] = $this->_request->getPost('ident');
        //recibo el identidadmodelo, es decir el id de la entidad y el modelo al que pertenecen los indicadores a listar
        $parametros['idmodelo'] = $this->_request->getPost('idmodel');
        //Recibo el id del CB al que se le demnadan los indicadores
        $parametros['idcb'] = $this->_request->getPost('identiCB');
        //Recibo el id de la entidad que esta logueada
        if ($this->_request->getPost('identiLG')) {
            $parametros['identidadlogueada'] = $this->_request->getPost(
                    'identiLG'
            );
        } else {
            $parametros['identidadlogueada'] = $this->global->Estructura->idestructura;
        }
        //Recibo el comportamiento de la entidad loguada
        $parametros['identidadarbol'] = $this->_request->getPost('ident');
        $parametros['rector'] = $this->_request->getPost('rector');
        $parametros['CB'] = $this->_request->getPost('CB');
        $parametros['OD'] = $this->_request->getPost('OD');
        //Para saver si se va a ajustar el centro de balance
        $parametros['ajusteCB'] = $this->_request->getPost('ajusteCB');
        $parametros['consolidado'] = $this->_request->getPost('consolidado');
        $parametros['todosCB'] = $this->_request->getPost('todosCB');
        $parametros['hoja'] = $this->_request->getPost('hoja');
        $parametros['glob'] = $this->_request->getPost('glob');
        //pregunto por los filtos y si biene alguno lo agrego a la busqueda
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['filtros']['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos ['data'] ['value'];
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
                } elseif ($datos ['field'] == 'numeropieza') {
                    $parametros ['filtros']['numeropieza'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacioncb'
                ) {
                    $parametros ['filtros']['denominacioncb'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'necesidad'
                ) {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['necesidad_condicion1'] = array('necesidad' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['necesidad_condicion2'] = array('necesidad' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['necesidad_condicion3'] = array('necesidad' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'necesidad') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['necesidad_condicion1'] = array('necesidad' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['necesidad_condicion2'] = array('necesidad' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['necesidad_condicion3'] = array('necesidad' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'coberturaparcialestimada') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['coberturaparcialestimada_condicion1'] = array('coberturaparcialestimada' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['coberturaparcialestimada_condicion2'] = array('coberturaparcialestimada' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['coberturaparcialestimada_condicion3'] = array('coberturaparcialestimada' => $datos ['data'] ['value'],
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
                } elseif ($datos ['field'] == 'importemlc') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['importemlc_condicion1'] = array('importemlc' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['importemlc_condicion2'] = array('importemlc' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['importemlc_condicion3'] = array('importemlc' => $datos ['data'] ['value'],
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
                } elseif ($datos ['field'] == 'idaprobacion') {
                    if ($datos ['data'] ['value'] == 'SI') {
                        $parametros ['filtros']['idaprobacionsi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'NO') {
                        $parametros ['filtros']['idaprobacionno'] = '0';
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
                } elseif ($datos ['field'] == 'viaadquisicion') {
                    $parametros ['filtros']['denomviaadquisicion'] = $datos['data']['value'];
                } elseif ($datos ['field'] == 'organosatisface') {
                    $parametros ['filtros']['denomorganosatisface'] = $datos['data']['value'];
                } elseif ($datos ['field'] == 'naturaleza') {
                    $parametros ['filtros']['naturaleza'] = $datos['data']['value'];
                } elseif ($datos ['field'] == 'unidadmedida') {
                    $parametros ['filtros']['unidadmedida'] = $datos['data']['value'];
                }
            }
        }

        //Creo el objeto de mi tabla principal
        $cbmodel = new CentrodebalanceModel();
        $arrayIdejercicio = $parametros['idejercicio'];
        $parametros['idejercicio'] = ($parametros['idejercicio']) ? $parametros['idejercicio'] : $arrayIdejercicio[0]['idejercicio'];
        unset($arrayIdejercicio);
        if ($parametros['idmodelo'] != "") {
            //obteniendo entidades hijas OD
            if ($this->_request->getPost('glob') == 'false') {
                $parametros['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($parametros['identidadOD']);
                $parametros['identidadOD'] = $parametros['identidad'][0];
                $parametros['entidades'] = $parametros['identidadOD'];
            } else {
                $idestructura = $this->integrator->metadatos->DameEstructura($parametros['identidadOD']);
                $parametros['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($idestructura[0]->idestructura);
                array_push($parametros['entidades'], $idestructura[0]->idestructura);
                $var = implode(',', $parametros['entidades']);
                $parametros['entidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
                $parametros['entidades'] = implode(',', $parametros['entidades']);
            }

            if ($parametros['entidades'])
                $data = $cbmodel->listarIndicadoresBalance(
                        $start, $limit, $parametros
                );
            else {
                $data->codMsg = 15;
            }

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

//FUNCION QUE SE ENCARGA DE ASIGNAR LAS COBERTURAS CUANDO ESTAS SE REALIZAN DE MANERA MANUAL    
    public function ActualizarCamposAction() {
        ini_set("max_execution_time", 3600); //1hora
        $parametros = Array();
        $parametros['arrayind'] = json_decode(
                stripslashes($this->_request->getPost('array'))
        );
        $parametros['od'] = $this->_request->getPost('od');
        $parametros['cb'] = $this->_request->getPost('cb');
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        if ($this->_request->getPost('identiLG')) {
            $parametros['entidadloguada'] = $this->_request->getPost(
                    'identiLG'
            );
        } else {
            $parametros['entidadloguada'] = $this->global->Estructura->idestructura;
        }


        $cbmodel = new CentrodebalanceModel();
        $data = $cbmodel->ActualizarCampos($parametros);

        if ($data == 1) {
            echo("{'codMsg':21 }");
        } else {
            if ($data == 2) {
                echo("{'codMsg':23 }");
            } else {
                if ($data == 3) {
                    echo("{'codMsg':29 }");
                } else {
                    if ($data == 4) {
                        echo("{'codMsg':30 }");
                    } else {
                        if ($data == 5) {
                            echo("{'codMsg':31 }");
                        } else {
                            if ($data == 6) {
                                echo("{'codMsg':32 }");
                            } else {
                                if ($data == 7) {
                                    echo("{'codMsg':34 }");
                                } else {
                                    echo json_encode(array('data' => $data));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public function ActualizarCamposAjusteEntidadAction() {
        $idajusteentidad = $this->_request->getPost('idajusteent');
        $campo = $this->_request->getPost('campobd');
        $valor = $this->_request->getPost('valorbd');
        $idindicador = $this->_request->getPost('idindicador');
        $idcentrobalance = $this->_request->getPost('idcentrobalance');
        $paraCB = $this->_request->getPost('paraCB');
        $identidad = $this->_request->getPost('identidad');
        ;

        $cbmodel = new CentrodebalanceModel();
        $data = $cbmodel->ActualizarCamposAjusteEntidad(
                $idajusteentidad, $campo, $valor, $idindicador, $idcentrobalance, $paraCB, $identidad
        );
        echo json_encode(array('data' => $data));
    }

    public function listarIndCTEAction() {

        $identCB = $this->_request->getPost('identCB');
        $identOD = $this->_request->getPost('identOD');
        $idmodelo = $this->_request->getPost('idmodelo');
        $identiL = $this->_request->getPost('identL');
        $rector = $this->_request->getPost('Rector');
        $CB = $this->_request->getPost('Cb');
        $OD = $this->_request->getPost('Od');
        $soyODyCB = $this->_request->getPost('soyODyCB');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $cbmodel = new CentrodebalanceModel();
        $data = $cbmodel->listarIndCTEyOtros(
                $identCB, $identOD, $CB, $rector, $idmodelo, $limit, $start, $soyODyCB, $OD, $identiL
        );
        echo json_encode(array('data' => $data[0], 'total' => $data[1][0]));
    }

    public function listarIndCbAjustesyCTEAction() {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $identidad = $this->global->Estructura->idestructura;

        $cbmodel = new CentrodebalanceModel();
        $data = $cbmodel->listarIndCbAjustesyCTE($start, $limit, $identidad);
        echo json_encode($data);
    }

//FUNCION QUE SE ENCARGA DE LA APROBACION DE LOS ELEMENTOS DEL BALANCE, SIEMRPE TENIENDO EN CUENTA
//EL MODELO QUE SE DESEA APROBAR , YA SEAN APROBAR O DESAPROBAR TODOS LOS ELEMENTOS DEL MODELO
//O SOLO ALGUNOS ELEMENTOS, Y TIENE ENCUENTA EL COMPORTAMIENTO PARA EL NIVEL DE LA APROBACION
    public function AprobarDesaprobarDemandaPorIndicadorAction() {

        $parametros = Array();
        $parametros['orgrector'] = $this->_request->getPost('rector');
        $parametros['od'] = $this->_request->getPost('od');
        $parametros['cb'] = $this->_request->getPost('cb');
        $parametros['arrayind'] = json_decode(
                stripslashes($this->_request->getPost('ind'))
        );
        $parametros['idmodelo'] = $this->_request->getPost('idmodel');
        $parametros['aprobado'] = $this->_request->getPost('aprobado');
        $parametros['idaprobacion'] = $this->_request->getPost('idaprobacion');
        $parametros['identidadcb'] = $this->_request->getPost('idcmbCB');
        $parametros['todos'] = ($this->_request->getPost('todos')) ? $this->_request->getPost('todos') : 0;

        if ($parametros['orgrector'] != 1) {
            if ($this->_request->getPost('ajustar') == 'true') {
                $parametros['identidadlogueada'] = $this->global->Estructura->idestructura;
            } else {
                $parametros['identidadlogueada'] = $this->_request->getPost(
                        'identidadsel'
                );
            } //seleccionada en la IU
            $parametros['hijosentidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $parametros['identidadlogueada']
            );
        } else {
            if ($parametros['od'] == 1) {
                $parametros['identidadlogueada'] = $this->_request->getPost(
                        'identidadsel'
                );
                $parametros['hijosentidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $parametros['identidadlogueada']
                );
            } else {
                if ($parametros['cb'] == 1) {
                    $parametros['identidadlogueada'] = $parametros['identidadcb'];
                    $parametros['hijosentidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                    $parametros['identidadlogueada']
                    );
                }
            }
        }
        $cbmodel = new CentrodebalanceModel();
        $data = $cbmodel->AprobarDesaprobarDemandaPorIndicador($parametros);
        if ($data == 1) {
            echo("{'codMsg':24 }");
        } else {
            echo("{'codMsg':25 }");
        }
    }

//SE ENCARGA DE EXPORTAR LOS ELEMENTOS QUE SE VISUALIZAN EN EL BALANCE EN DEPENDENCIA DEL COMPORTAMIENTO
// Y TAMBIEN DE LOS FILTROS QUE SE ESPESIFIQUEN    
    function exportarAction() {
        ini_set("max_execution_time", 3600); //1 hora

        $parametros = Array();
        //Recibo el identidad del OD
        $parametros['identidadOD'] = $this->_request->getParam('ident');
        //recibo el identidadmodelo, es decir el id de la entidad y el modelo al que pertenecen los indicadores a listar
        $parametros['idmodelo'] = $this->_request->getParam('idmodel');
        //Nombre del Plan seleccionado
        $parametros['plan'] = $this->_request->getParam('plan');
        //Recibo el id del CB al que se le demnadan los indicadores
        $parametros['idcb'] = $this->_request->getParam('identiCB');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        //Recibo el id de la entidad que esta logueada
        if ($this->_request->getParam('identiLG')) {
            $parametros['identidadlogueada'] = $this->_request->getParam(
                    'identiLG'
            );
        } else {
            $parametros['identidadlogueada'] = $this->global->Estructura->idestructura;
        }
        //Recibo el comportamiento de la entidad loguada
        $parametros['identidadarbol'] = $this->_request->getParam('ident');
        $parametros['rector'] = $this->_request->getParam('rector');
        $parametros['CB'] = $this->_request->getParam('CB');
        $parametros['OD'] = $this->_request->getParam('OD');
        //Para saver si se va a ajustar el centro de balance
        $parametros['ajusteCB'] = $this->_request->getParam('ajusteCB');
        $parametros['todosCB'] = $this->_request->getParam('todosCB');
        $p = $this->_request->getParam('filtros');
        $p = json_decode(stripslashes($p));

        //obteniendo entidades hijas OD
        if ($this->_request->getPost('glob') == 'false') {
            $parametros['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($parametros['identidadOD']);
            $parametros['identidadOD'] = $parametros['identidad'][0];
            $parametros['entidades'] = $parametros['identidadOD'];
        } else {
            $idestructura = $this->integrator->metadatos->DameEstructura(
                    $parametros['identidadOD']
            );
            $parametros['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $idestructura[0]->idestructura
            );
            array_push($parametros['entidades'], $idestructura[0]->idestructura);
            $var = implode(',', $parametros['entidades']);
            $parametros['entidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
            $parametros['entidades'] = implode(',', $parametros['entidades']);
        }

        if ($p) {
            foreach ($p as $datos) {
                if ($datos->field == 'codigo') {
                    $parametros ['filtros']['codigo'] = $datos->data->value;
                } elseif ($datos->field == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos->data->value;
                } elseif ($datos->field == 'precio') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['precio_condicion1'] = array('precio' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['precio_condicion2'] = array('precio' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['precio_condicion3'] = array('precio' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'numeropieza') {
                    $parametros ['filtros']['numeropieza'] = $datos->data->value;
                } elseif ($datos->field == 'naturaleza') {
                    $parametros ['filtros']['naturaleza'] = $datos->data->value;
                } elseif ($datos->field == 'unidadmedida') {
                    $parametros ['filtros']['unidadmedida'] = $datos->data->value;
                } elseif ($datos->field == 'viaadquisicion'
                ) {
                    $parametros ['filtros']['denomviaadquisicion'] = $datos->data->value;
                } elseif ($datos->field == 'organosatisface'
                ) {
                    $parametros ['filtros']['denomorganosatisface'] = $datos->data->value;
                } elseif ($datos->field == 'denominacioncb'
                ) {
                    $parametros ['filtros']['denominacioncb'] = $datos->data->value;
                } elseif ($datos->field == 'necesidad'
                ) {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['necesidad_condicion1'] = array('necesidad' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['necesidad_condicion2'] = array('necesidad' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['necesidad_condicion3'] = array('necesidad' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'necesidad') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['necesidad_condicion1'] = array('necesidad' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['necesidad_condicion2'] = array('necesidad' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['necesidad_condicion3'] = array('necesidad' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'coberturaparcialestimada') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['coberturaparcialestimada_condicion1'] = array('coberturaparcialestimada' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['coberturaparcialestimada_condicion2'] = array('coberturaparcialestimada' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['coberturaparcialestimada_condicion3'] = array('coberturaparcialestimada' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'coberturatotalestimada') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['coberturatotalestimada_condicion1'] = array('coberturatotalestimada' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['coberturatotalestimada_condicion2'] = array('coberturatotalestimada' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['coberturatotalestimada_condicion3'] = array('coberturatotalestimada' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'importe') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['importe_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['importe_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['importe_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'importemlc') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['importemlc_condicion1'] = array('importemlc' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['importemlc_condicion2'] = array('importemlc' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['importemlc_condicion3'] = array('importemlc' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'flete') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['flete_condicion1'] = array('flete' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['flete_condicion2'] = array('flete' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['flete_condicion3'] = array('flete' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'contingencia') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['contingencia_condicion1'] = array('contingencia' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['contingencia_condicion2'] = array('contingencia' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['contingencia_condicion3'] = array('contingencia' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'importefila') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['importefila_condicion1'] = array('importefila' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['importefila_condicion2'] = array('importefila' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['importefila_condicion3'] = array('importefila' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'idaprobacion') {
                    if ($datos->data->value == 'SI') {
                        $parametros ['filtros']['idaprobacionsi'] = '1';
                    }
                    if ($datos->data->value == 'NO') {
                        $parametros ['filtros']['idaprobacionno'] = '0';
                    }
                } elseif ($datos->field == 'demanda') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['filtros']['demanda_condicion1'] = array('demanda' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['filtros']['demanda_condicion2'] = array('demanda' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['demanda_condicion3'] = array('demanda' => $datos->data->value,
                            'condicion' => "=");
                    }
                }
            }
        }

        CentrodebalanceModel::exportarIndicadoresCB($parametros);
    }

    //funcionalidad para obtener los planes de una entidad ordenados por prioridad(Haciendo ajuste como Organo
    // Demandante)
    public function ajustarPlanesOrdenPrioridadAction() {

        $parametros = Array();
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['comportamiento'] = $this->_request->getPost(
                'comportamiento'
        );
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $cbmodel = new CentrodebalanceModel();
        $res = $cbmodel->obtPlanesPriaridad($parametros);
        echo("{'codMsg': $res }");
    }

//FUNCION QUE SE ENCARGA DEL AJUSTE AUTOMATICO DEL BALANCE MATERIAL LLAMANDO A UNA FUNCION
//DE LA BD 
    public function actualizarCalculosDemandaHijosAction() {
        $parametros = Array();
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['comportamiento'] = $this->_request->getPost(
                'comportamiento'
        );

        $cbmodel = new CentrodebalanceModel();
        $res = $cbmodel->actualizarCalculosDemandaHijos($parametros);
        echo("{'codMsg': $res }");
    }

//METODO RECURSIVO QUE SE ENCARGA DE PONER EN UN ARREGLO TODAS LOS ID DE LAS ENTIDADES HIJAS
//DE LA ENTIDAD PASADA POR PARAMETROS EN PROFUNDIDAD
    //SE USA EN OTROS COMPONENTES, CUIDADO AL MODIFICAR (EN PLAN POR EJEMPLO)
 
    public function cargarviaadquisionAction() {
        $datos = DatPlanificacionModel::cargarTodasViaAdquision();
        echo json_encode(array('data' => $datos->data));
    }

    public function cargarorganosatisfaceAction() {
        $datos = DatPlanificacionModel::cargarTodosOrganoSatisface();
        echo json_encode(array('data' => $datos));
    }

    public function listarNaturalezaAction() {
        $naturaleza = DatBasescalculoModel::obtenerNaturalezas();
        echo json_encode(array('data' => $naturaleza));
    }

    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas(
        );
        echo json_encode(array('data' => $unidades));
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

//fin de la clase CentrodebalanceController
