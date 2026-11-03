<?php

/**
 * GestmodeloController
 * Controlador para gestionar los modelos
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificación
 * @ subpackage Planificación
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class GestmodeloController extends ZendExt_Controller_Secure {

    /**
     * funcion init()
     * Para inicializar el modulo
     *
     * @author Dionisdel Ponce Santana
     * */
    function init() {
        $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }

    /**
     * funcion adicionarModelo()
     * Para adicionar o modificar un modelo
     *
     * @author Dionisdel Ponce Santana
     */
    public function gestmodeloAction() {
        
    }

    public function adicionarModeloAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        $fechaentrega = $this->_request->getPost('fechaentrega');
        $clasifmodelo = $this->_request->getPost('idclasif');
        $tipoplan = $this->_request->getPost('tipoplan');
        $denomsRutas = $this->_request->getPost('tfclasificacion');
        $irBalanceMaterial = $this->_request->getPost('balancematerial');
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

    /**
     * funcion cargarConfFormIndModelo()
     * Para configurar el formulario de gestion dinamicamente segun el tipo de modelo y sus atributos dinamicos
     *
     * @author Dionisdel Ponce Santana
     */
    public function cargarConfFormIndModeloAction() {
        // $idtipomodelo = $this->_request->getPost('idtipo');
        // Si tiene una configuracion asociada ()?true:false
        $dat->cf = true;
        // Obtengo la configuracion de cada campo como atributo para el tipo de modelo
        $dat->items [] = array('cantidad' => 3);
        $dat->items [] = array('xtype' => 'datefield', 'id' => 'fecha',
            'name' => 'fecha', 'regex' => '',
            'anchor' => '95%', 'allowBlank' => false,
            'readOnly' => true, 'fieldLabel' => 'Fecha');
        $dat->items [] = array('xtype' => 'textfield', 'id' => 'denom',
            'name' => 'denom', 'regex' => '',
            'anchor' => '95%', 'allowBlank' => 'false',
            'fieldLabel' => 'Denominacion');
        $dat->items [] = array('xtype' => 'hidden', 'id' => 'idindplan',
            'name' => 'idindplan');
        echo json_encode($dat);
    }

    /**
     * funcion cargarFormParaModificarIndModelo()
     * Para cargar los datos de un elemento a modificar
     *
     * @author Dionisdel Ponce Santana
     * @ Params:
     * @ idmodelo        identificador del modelo al que pertenece el elemento
     * @ idtipomodelo       identificador del tipo de modelo al que pertenece el modelo
     * @ idplanificacion    identificador del elemento del modelo que se va a modificar.
     */
    public function cargarFormParaModificarIndModeloAction() {
        //Recibo los elementos que me envian desde la IU.
        $idmodelo = $this->_request->getPost('idmodelo');
        $idplanificacion = $this->_request->getPost('idplanificacion');

        $tipomod = new NomTipomodelo();
        $tipomodelo = $tipomod->ObtenerIdTipoModelo($idmodelo);
        $datos = DatPlanModel::getDatosDeElementoPlanificado(
                        $tipomodelo['idtipomodelo'], $tipomodelo['idtabla'], $idmodelo, $idplanificacion
        );

        // Devuelvo para la IU el elemento
        $dat->totalRec = 1;
        $dat->datos = $datos;
        echo json_encode($dat);
    }

    public function listarpaisAction() {
        // $objeto = $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $pais = $this->nomenclador->selectParam(
                'nom_pais', array('idpais', 'nombrepais')
        );
        echo json_encode(array('data' => $pais));
    }

    //DEVUELVE UN ARRAY CON TODOS LOS CENTROS DE BALANCE
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

    /**
     * funcion listarIndModelo()
     * Lista los indicadores dentro de el modelo
     *
     * @author Dionisdel Ponce Santana
     */
    public function listarIndModeloAction() {

        ini_set("max_execution_time", 600); //10min de conexion
        $idmodelo = $this->_request->getPost('idmodelo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $filtros = json_decode(
                stripslashes($this->_request->getPost('filtrosD'))
        );
        $columnasamostrar = json_decode(
                stripslashes($this->_request->getPost('columnsToShow'))
        );
        //Por el momento se queda en cero esto es para la visat consolidad Robert*
        $idejercicio = $this->_request->getPost('idejercicio');
        $identidad = $this->_request->getPost('identidad');
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $global = $this->_request->getPost('glob');

        /* $datos = $this->pIntegrator->planmeta->listarDatosdePlan($identidad, $idmodelo, $start, $limit, $global);
           */

        if ($global == 'true') {
            $ajustar = 1;
        } else {
            $ajustar = 0;
        }
        $tipomod = new NomTipomodelo();
        $tipomodelo = $tipomod->ObtenerIdTipoModelo($idmodelo);
        //OBTIENE UN OBJETO ACTIVE RECORD CON TODA LA INFORMACION DE ESA TABLA PARA TRABAJAR Y HACER
        // MAS CONSULTAS CON ELLA
        $x = $this->_meta->Metadata()->obtenerInfoTabla($tipomodelo[0]['idtabla']);


        $codigotm = $tipomodelo[0]['codigo'];
        $concat = $codigotm . '_id' . $codigotm;
        $llave = "mod_planificacionmeta_nom_$concat";
        $llaveprimaria = "mod_planificacionmeta_dat_$concat";
        if ($ajustar == 1) {
            $arryhijos = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $identidad
            );
            array_push($arryhijos, $identidad);
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

        if ($filtros[0] != "") {
            foreach ($filtros as $datos) {
                if ($datos->field == 'codigo') {
                    $parametros ['codigo'] = $datos->data->value;
                } elseif ($datos->field == 'numeropieza') {
                    $parametros ['numeropieza'] = $datos->data->value;
                } elseif ($datos->field == 'centrobalance') {
                    $parametros ['centrobalance'] = $datos->data->value;
                } elseif ($datos->field == 'denominacion') {
                    $parametros ['denominacion'] = $datos->data->value;
                } elseif ($datos->field == 'descripcion') {
                    $parametros ['descripcion'] = $datos->data->value;
                } elseif ($datos->field == 'precio') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['precio_condicion1'] = array('precio' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['precio_condicion2'] = array('precio' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros ['precio_condicion3'] = array('precio' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'flete') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['flete_condicion1'] = array('flete' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['flete_condicion2'] = array('flete' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros ['flete_condicion3'] = array('flete' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'contingencia') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['contingencia_condicion1'] = array('contingencia' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['contingencia_condicion2'] = array('contingencia' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros ['contingencia_condicion3'] = array('contingencia' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'cantidad') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['cantidad_condicion1'] = array('cantidad' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['cantidad_condicion2'] = array('cantidad' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros ['cantidad_condicion3'] = array('cantidad' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'ajuste') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['ajuste_condicion1'] = array('ajuste' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['ajuste_condicion2'] = array('ajuste' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros ['ajuste_condicion3'] = array('ajuste' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'importeajustado') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['importeajustado_condicion1'] = array('importeajustado' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['importeajustado_condicion2'] = array('importeajustado' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros ['importeajustado_condicion3'] = array('importeajustado' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'importefinal') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['importefinal_condicion1'] = array('importefinal' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['importefinal_condicion2'] = array('importefinal' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros ['importefinal_condicion3'] = array('importefinal' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'cantidadfinal') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['cantidadfinal_condicion1'] = array('cantidadfinal' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['cantidadfinal_condicion2'] = array('cantidadfinal' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros ['cantidadfinal_condicion3'] = array('cantidadfinal' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'importe') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['importe_condicion1'] = array('importe' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['importe_condicion2'] = array('importe' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros ['importe_condicion3'] = array('importe' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'preciodivisa') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['preciodivisa1'] = array('preciodivisa' => $datos->data->value,
                            'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['preciodivisa2'] = array('preciodivisa' => $datos->data->value,
                            'condicion' => "<");
                    } else {
                        $parametros ['preciodivisa3'] = array('preciodivisa' => $datos->data->value,
                            'condicion' => "=");
                    }
                } elseif ($datos->field == 'generadobasesplan') {
                    if ($datos->data->value[0] == "Si") {
                        $parametros ['generadobasesplan'] = 1;
                    } elseif ($datos->data->value[0] == "No") {
                        $parametros ['generadobasesplan'] = 0;
                    } elseif ($datos->data->value[0] == "Afectada") {
                        $parametros ['generadobasesplan'] = 2;
                    }
                } elseif ($datos->field == 'idaprobaciondemanda') {

                    if ($datos->data->value[0] == "Si") {
                        $parametros ['idaprobaciondemanda'] = 2;
                    } elseif ($datos->data->value[0] == "No") {
                        $parametros ['idaprobaciondemanda'] = 1;
                    } elseif ($datos->data->value[0] == "Rector") {
                        $parametros ['idaprobaciondemanda'] = 4;
                    } elseif ($datos->data->value[0] == "Ajuste") {
                        $parametros ['idaprobaciondemanda'] = 5;
                    }
                } elseif ($datos->field == 'umedida') {
                    $parametros ['idumedida'] = $datos->data->value;
                } elseif ($datos->field == 'viaadquisicion') {
                    $parametros ['viaadquisicion'] = $datos->data->value;
                } elseif ($datos->field == 'organosatisface') {
                    $parametros ['organosatisface'] = $datos->data->value;
                } else {
                    if ($datos->field) {
                        $pos = strripos($datos->field, '_');
                        $denomCampo = substr(
                                $datos->field, $pos + 1, (strlen($datos->field)) - ($pos + 1)
                        );
                        //es un nomenclador
                        if ($datos->data->type == 'string' && is_numeric($datos->data->value)) {
                            $x->where("meta." . $denomCampo, $datos->data->value);
                        } else {
                            //es un numero
                            if ($datos->data->type == 'numeric') {
                                if ($datos->data->comparison == "gt") {
                                    $x->where("meta." . $denomCampo . ' >', $datos->data->value);
                                } elseif ($datos->data->comparison == "lt") {
                                    $x->where("meta." . $denomCampo . ' <', $datos->data->value);
                                } else {
                                    $x->where("meta." . $denomCampo . ' =', $datos->data->value);
                                }
                            }
                        }
                    }
                }
            }
        }



        $datosf = DatPlanModel::getDatos(
                        $tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $identidadmodelo, $idejercicio, $parametros, $start, $limit, $ajustar, $arryhijos, $idmodelo
                        , $columnasamostrar);


        $x = $this->_meta->Metadata()->obtenerInfoTabla(
                $tipomodelo[0]['idtabla']
        );

        $importetotal = DatPlanModel::getDatosImporte(
                        $tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $identidadmodelo, $idejercicio, $parametros, $ajustar, $arryhijos, $idmodelo
        );

        $x = $this->_meta->Metadata()->obtenerInfoTabla(
                $tipomodelo[0]['idtabla']
        );

        $datosT = DatPlanModel::getDatosCount(
                        $tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $identidadmodelo, $idejercicio, $parametros, $start, $limit, $ajustar, $arryhijos, $idmodelo
                        , $columnasamostrar);
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
            //$datos[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
            $datos[$k]['umedida'] = $unidades[0]['denominacionunidadmedida'];

            $datos[$k]['_is_leaf'] = true;
            $datos[$k]['_parent'] = null;

            //esto es pa el minfar
            $datos[$k]['llaveprimaria'] = $llaveprimaria;
            //hast aki
        }//die;

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
                    'llave' => $llave,
                    'llaveprimaria' => $llaveprimaria, 'cantidadfinal' => $importetotal[0]['cantidadfinal'])
        );
    }

    /**
     * funcion listarTiposModelosActivos()
     * Para cargar los tipos de modelos
     *
     */
    public function listarTiposModelosActivosAction() {
        //$identidad = $this->global->Estructura->idestructura;
        $dat->data = NomTipomodelo::servicioObtenerTipoModelo();
        echo json_encode($dat);
    }

    /**
     * funcion listarClasesModelosActivos()
     * Para cargar las clases modelos
     *
     * @author Yeliem Gutierrez Martinez
     */
    public function listarClasesModelosActivosAction() {
        $dat->data = NomClasifmodelo::obtenerCMCombo();
        echo json_encode($dat);
    }

    public function guardarAjusteAction($params) {
        $params['idplanificacion'] = $this->_request->getPost(
                'idplanificacion'
        );
        $params['ajuste'] = $this->_request->getPost('ajuste');
        $model = new DatPlanModel();
        $resp = $model->guardarAjuste($params);
        echo json_encode(array('cod' => $resp));
    }

    public function adicionarIndicadorAction() {
        /* Lo que esta comentariado en este metodo es pa el MINFAR */
        ini_set("max_execution_time", 600); //10min
        $parametros = $this->_request->getParams();

        $idmodelo = $this->_request->getPost('idmodelo');
        // $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $model = new DatPlanModel();
        $result = $model->adicionarvalores($parametros, $idmodelo);
        /* if($result > 0){
          $dat->codMsgM = 30;
          } else { */
        $dat->codMsgM = 20;
        $dat->msj = 'Mod';
        // }


        echo json_encode($dat);
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

    public function aprobarTodosAction() {
        $rectora = $this->_request->getPost('rectora');
        $aprobado = $this->_request->getPost('aprobado');
        $idmodelo = $this->_request->getPost('idmodelo');
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $idejercicio = $this->_request->getPost('idejercicio');
        $entidadmodelo = new DatEntidadmodelo();
        $identidad = $entidadmodelo->getIdentidad($identidadmodelo);
        $identidad = $identidad[0]['identidad'];
        $modeloModel = new DatModeloModel();
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $dat = $modeloModel->aprobarDesaprobarTodosFamilia(
                $identidad, $idmodelo, $security, $aprobado, $rectora, $idejercicio
        );
        echo json_encode($dat);
    }

    public function aprobarDesaprobarAjusteTodosAction() {
        $params['rectora'] = $this->_request->getPost('rectora');
        $params['aprobado'] = $this->_request->getPost('aprobado');
        $params['eshoja'] = $this->_request->getPost('hoja');
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['identidadmodelo'] = $this->_request->getPost(
                'identidadmodelo'
        );
        $entidadmodelo = new DatEntidadmodelo();
        $identidad = $entidadmodelo->getIdentidad($params['identidadmodelo']);
        $params['identidad'] = $identidad[0]['identidad'];

        $modeloModel = new DatModeloModel();
        $params['security'] = ZendExt_Aspect_Security_Sgis::getInstance();
        $dat = $modeloModel->aprobarDesaprobarAjusteTodosFamilia($params);

        echo json_encode($dat);
    }

    /**
     * funcion eliminar()
     * Para eliminar un modelo
     *
     * @author Yeliem Gutierrez Martinez
     */
    public function eliminarAction() {
        if ($this->_request->getPost('identidad')) {
            $identidad = $this->_request->getPost('identidad');
        } else {
            $identidad = $this->global->Estructura->idestructura;
        }
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $idmodelo = $this->_request->getPost('idmodelo');
        $model = new DatModeloModel();
        $modelo = Doctrine::getTable('DatModelo')->find($idmodelo);

        if ($identidad == $modelo['identidad']
        ) { //si la entidad logueada es la dueña del modelo
            //  $objmdatn = DatModelodatosnomenclador::eliminar($idmodelo);
            $model->Eliminar($identidadmodelo, $idmodelo, $identidad);
            // Devuelvo para la IU la confirmacion
            $dat->codMsg = 1;
        } else {
            $dat->codMsg = 21;
        }

        echo json_encode($dat);
    }

    /**
     * @function
     *  eliminarIndmodPlanAction
     *  para eliminar un indicador de un modelo planificado
     *
     * @params
     *  $idplanificacion    id del elemento planificado en el modelo, en este caso de la tabla dat_planificacion
     *
     * @return
     * */
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

                $objdatplanif = Doctrine::getTable('DatPlanificacion')->find(
                        $i
                );
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
                $objdatplanif = Doctrine::getTable('DatPlanificacion')->find(
                                $indExistente->idplanificacion
                        )->idindicador;
                $objentmod = Doctrine::getTable('DatEntidadmodelo')->find(
                        $identidadmodelo
                );

                /*$conn = Doctrine_Manager::connection();
                $query = "select * from mod_planificacion.f_actualizar_balancematerial_eliminarplanif(?, ?, ?, ?, ?)";
                $arrayIndic = implode(",", $arrayIndic);
                $paramsQuery = array($objentmod->identidad,
                    $objentmod->idmodelo, $identidadmodelo,
                    $idejercicio,
                    "{" . $arrayIndic . "}");
                $conn->execute($query, $paramsQuery)->fetchAll();*/
            }
            $dat->codMsgD = 1;
        }


        echo json_encode($dat);
    }

    //Carga los modelos que tienen igual tipo al modelo recibido
    public function CargarModeloDeIgualTipoAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $model = new DatModeloModel();
        $idmodelodenominacion = $model->CargarModeloDeIgualTipo($idmodelo);
        echo json_encode($idmodelodenominacion);
    }

    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas(
        );
        echo json_encode(array('data' => $unidades));
    }

//fin de la funcion cargar cargarunidadmedida

    public function cargarEntidadesCompDemandanteAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $node = $this->_request->getPost('node');
        $filtro = $this->_request->getPost('filtros');


        if ($node == 0) {

            $entidades = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(2);
            foreach ($entidades as $value) {
                $datosentidad = $this->integrator->metadatos->DameEstructura(
                        $value['identidad']
                );

                $tieneelmodelo = DatEntidadmodelo::existeModeloEnLaEntidad(
                                $idmodelo, $value['identidad']
                );


                if ($tieneelmodelo == false) {

                    $data[] = array('id' => $value['identidad'],
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

    public function cargarClasifModeloGastosAction() {
        $data->data [] = array('idclasif' => 1,
            'denominacion' => 'Gasto Capital');
        $data->data [] = array('idclasif' => 2,
            'denominacion' => 'Gasto Corriente');
        echo json_encode($data);
    }

    public function cargarClasifModeloMatPresAction() {
        $data->data [] = array('idclasf' => 1, 'denominacion' => 'Material');
        $data->data [] = array('idclasf' => 2, 'denominacion' => 'Presupuesto');
        echo json_encode($data);
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

    public function cargarClasifPlanesAction() {
        
    }

    public function cargarviaadquisionAction() {
        $datos = DatPlanificacionModel::cargarTodasViaAdquision();
        echo json_encode(array('data' => $datos->data));
    }

    public function cargarorganosatisfaceAction() {
        $datos = DatPlanificacionModel::cargarTodosOrganoSatisface();
        echo json_encode(array('data' => $datos));
    }

    public function listarVerActXIndAction() {
        $data = DatPlanModel::listarVerActXInd($this->_request->getPost());
        echo json_encode(array('data' => $data->data, 'total' => $data->total));
    }

}
