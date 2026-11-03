<?php

/**
 * Recuperaciones para planificacion
 * Controlador para el control del a ejecucion
 *
 * @ author Javier Lamas Collejo
 * @ package Planificación
 * @ subpackage Planificacion material
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class ControldivisaController extends ZendExt_Controller_Secure {

    /**
     * funcion init()
     * Para inicializar el modulo
     * */
    public function init() {
        parent::init();
    }

    public function controldivisaAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarPlanesAction() {
        $identidad = $this->_request->getPost('identidad');
        if ($identidad != 'undefined') {
            $tipo = $this->_request->getPost('tipo');
            $node = $this->_request->getPost('node');
            $model = new DatPlanModel();
            $elementos = $model->in($identidad, $tipo, $node, $params);
            echo json_encode($elementos);
        } else {
            echo json_encode(array());
        }
    }

    //**********************************
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

    public function listarIndicadoresAction() {
        ini_set("max_execution_time", 600000);
        $nivelFiltrar = $this->_request->getPost('nivelfiltrar');
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas(
        );
        $integrator = $this->integrator;
        $centrobalances = DatControldivisaindicadorModel::listarCentroBalance(
                        $integrator, null, null
        );
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $listarplanificados = $this->_request->getPost('listarplanificados');
        $start = ($this->_request->getPost('start')) ? $this->_request->getPost(
                        'start'
                ) : 0;
        $limit = ($this->_request->getPost('limit')) ? $this->_request->getPost(
                        'limit'
                ) : 20;
        $idpadre = ($this->_request->getPost('idpadre')) ? $idpadre = $this->_request->getPost('idpadre') : $idpadre = $this->_request->getPost('anode');
        $idarbol = $this->_request->getPost('idarbol');
        $idejercicio = $this->_request->getPost('idejercicio');
        $idcentrobalance = $this->_request->getPost('idcentrobalance');
        if ($this->_request->getPost('formato')) {
            $parametros ['idformato'] = $this->_request->getPost('formato');
        }

        if ($this->_request->getPost('ordender')) {
            $parametros ['ordender'] = $this->_request->getPost('ordender');
        }
        if ($this->_request->getPost('ordenizq')) {
            $parametros ['ordenizq'] = $this->_request->getPost('ordenizq');
        }

        $parametros['aprobacion'] = $this->_request->getPost('aprobacion');
        $parametros ['nivelarbol'] = $this->_request->getPost('nivelarbol');
        if ($this->_request->getPost('codigo') != '') {
            $parametros ['codigo'] = $this->_request->getPost('codigo');
        }
        if ($this->_request->getPost('denominacion')) {
            $parametros ['denominacion'] = $this->_request->getPost(
                    'denominacion'
            );
        }
        if ($this->_request->getPost('numeropieza') != '') {
            $parametros ['numeropieza'] = $this->_request->getPost(
                    'numeropieza'
            );
        }
        if ($this->_request->getPost('idcentrobalance')) {
            $parametros ['identidaddatosnomenclador'] = $this->_request->getPost(
                    'idcentrobalance'
            );
        } //***ahora idcentrobalance es identidaddatosnomenclador en dat_indicadorcentrobalance */
        if ($this->_request->getPost('nivelplanif') != '') {
            $parametros ['nivel'] = $this->_request->getPost('nivelplanif');
        }
        if ($aprob != '') {
            if ($aprob == 'Si') {
                $parametros ['aprobacion'] = 4;
            } else {
                $parametros ['aprobacion'] = 1;
            }
        }
        if ($this->_request->getPost('rector') != 1) {
            $idEstructura = $this->global->Estructura->idestructura;
            $identidaddatosnomenclador = DatEntidaddatosnomenclador::obtenerEntidades($idEstructura);
            if ($identidaddatosnomenclador[0] != null) {

            }
        } else {
            $parametros ['identidaddatosnomenclador'] = 'rector';
        }
        if ($idcentrobalance) {
            $parametros ['identidaddatosnomenclador'] = $idcentrobalance;
        }
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['codigo'] = $datos ['data'] ['value'];
                    if (strlen($parametros ['codigo']) <= 3) {
                        $parametros ['nivel'] = 1;
                    } else {
                        if (strlen($parametros ['codigo']) == 4) {
                            $parametros ['nivel'] = 2;
                        } else {
                            if (strlen($parametros ['codigo']) == 5 || strlen(
                                            $parametros ['codigo']
                                    ) == 6
                            ) {
                                $parametros ['nivel'] = 3;
                            } else {
                                if (strlen($parametros ['codigo']) > 6) {
                                    $parametros ['nivel'] = 4;
                                }
                            }
                        }
                    }
                } else {
                    if ($datos ['field'] == 'numeropieza') {
                        $parametros ['numeropieza'] = $datos ['data'] ['value'];
                    } elseif ($datos ['field'] == 'idplanificado') {
                        if ($datos ['data'] ['value'] == 'true') {
                            $parametros ['idplanificado'] = 1;
                        } else {
                            $parametros ['idplanificado'] = 2;
                        }
                    } else {
                        if ($datos ['field'] == 'aprobadoasociacion') {
                            if ($datos ['data'] ['value'] == 'true') {
                                $parametros ['aprobadoasociacion'] = 4;
                            } else {
                                $parametros ['aprobadoasociacion'] = 1;
                            }
                        } else {
                            if ($datos ['field'] == 'codigocd') {
                                if ($datos ['data'] ['value'] == 'true') {
                                    $parametros ['codigocd'] = 1;
                                }
                                if ($datos ['data'] ['value'] == 'false') {
                                    $parametros ['codigocd'] = 2;
                                }
                            } elseif ($datos ['field'] == 'denominacion') {
                                $parametros ['denominacion'] = $datos ['data'] ['value'];
                            } elseif ($datos ['field'] == 'denoum') {
                                $parametros ['idumedida'] = $datos ['data'] ['value'];
                            } elseif ($datos ['field'] == 'denomviaadquisicion'
                            ) {
                                $parametros ['idviaadquisicion'] = $datos ['data'] ['value'];
                            } elseif ($datos ['field'] == 'denomorgansatisface'
                            ) {
                                $parametros ['idorganosatisface'] = $datos ['data'] ['value'];
                            } elseif ($datos ['field'] == 'precio') {
                                if ($datos ['data'] ['comparison'] == "gt") {
                                    $parametros ['precio_condicion1'] = array('precio' => $datos ['data'] ['value'],
                                        'condicion' => ">");
                                } elseif ($datos ['data'] ['comparison'] == "lt"
                                ) {
                                    $parametros ['precio_condicion2'] = array('precio' => $datos ['data'] ['value'],
                                        'condicion' => "<");
                                } else {
                                    $parametros ['precio_condicion3'] = array('precio' => $datos ['data'] ['value'],
                                        'condicion' => "=");
                                }
                            } elseif ($datos ['field'] == 'preciodivisa') {
                                if ($datos ['data'] ['comparison'] == "gt") {
                                    $parametros ['preciodivisa_condicion1'] = array('preciodivisa' => $datos ['data'] ['value'],
                                        'condicion' => ">");
                                } elseif ($datos ['data'] ['comparison'] == "lt"
                                ) {
                                    $parametros ['preciodivisa_condicion2'] = array('preciodivisa' => $datos ['data'] ['value'],
                                        'condicion' => "<");
                                } else {
                                    $parametros ['preciodivisa_condicion3'] = array('preciodivisa' => $datos ['data'] ['value'],
                                        'condicion' => "=");
                                }
                            } elseif ($datos ['field'] == 'denocentrobalance') {
                                $parametros ['identidaddatosnomenclador'] = $datos ['data'] ['value'];
                            } elseif ($datos ['field'] == 'asociado') {
                                if ($datos ['data'] ['value'] == 'true') {
                                    $parametros ['asociadosi'] = '1';
                                }
                                if ($datos ['data'] ['value'] == 'false') {
                                    $parametros ['asociadono'] = '0';
                                }
                            } elseif ($datos ['field'] == 'nivel') {
                                $parametros ['nivel'] = $datos ['data'] ['value'];
                            } elseif ($datos ['field'] == 'centrobalance') {
                                $parametros ['centrobalance'] = $datos ['data'] ['value'];
                            }
                        }
                    }
                }
            }
        }

        if ($nivelFiltrar != null) {
            $datos = NomIndicadorModel::listarIndicadores_Control_Divisa(
                            $parametros, $idpadre, $idarbol, $start, $limit, $idejercicio, $nivelFiltrar
            );
            $cont = 0;
            foreach ($datos->data as $k => $d) {
                if ($d['nivel'] == $nivelFiltrar) {
                    $datosentidad = $this->integrator->metadatos->DameEstructura(
                            $d['identidad']
                    );
                    $data->data[$cont] = $d;
                    $data->data[$cont]['centrobalance'] = $datosentidad[0]->denominacion;
                    $cont++;
                }
            }
        } else {
            $data = NomIndicadorModel::listarIndicadores_Control_Divisa(
                            $parametros, $idpadre, $idarbol, $start, $limit, $idejercicio, $nivelFiltrar
            );

            foreach ($data->data as $k => $d) {
                $datosentidad = $this->integrator->metadatos->DameEstructura(
                        $d['identidad']
                );
                $data->data[$k]['centrobalance'] = $datosentidad[0]->denominacion;
            }
        }
        echo json_encode($data);
    }

    function listarIndicadoresControlDivisaAction() {
        ini_set("max_execution_time", 600000);
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $rector = $this->_request->getPost('rector');
        $idejercicio = $this->_request->getPost('idejercicio');
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'estado') {
                    $parametros ['estado'] = $datos ['data'] ['value'];
                }
            }
        }
        $data = NomControldivisaModel::listarindicadoresCD(
                        $parametros, $start, $limit, $rector
        );
        echo json_encode($data);
    }

    function listarDestinoControlDivisaAction() {
        ini_set("max_execution_time", 600000);
        $parametros['start'] = $this->_request->getParam('start');
        $parametros['limit'] = $this->_request->getParam('limit');
        $idejercicio = $this->_request->getPost('idejercicio');
        $idindicador = json_decode(
                stripslashes($this->_request->getPost('idindicador'))
        );
        $idcontroldivisa = $this->_request->getParam('idcontroldivisa');
        $idEstructura = $this->global->Estructura->idestructura;
        $rector = $this->_request->getPost('rector');
        if ($rector == 1) {
            $parametros['rector'] = 1;
        }
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {

                if ($datos ['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                }
            }
        }
        if ($idindicador) {
            $parametros['indicadores'] = $idindicador;
        }
        $data = DatEntidadmodeloModel::listarDestinoControlDivisa(
                        $parametros, $idcontroldivisa, $idEstructura, $idejercicio
        );
        echo json_encode($data);
    }

    //**********************************Adicionar-Modificar********************************
    public function addmodificarIndCDAction() {
        $idcontroldivisa = $this->_request->getParam('idcontroldivisa');
        $denominacion = $this->_request->getParam('denominacion');
        $codigo = $this->_request->getParam('codigo');
        $descripcion = $this->_request->getParam('descripcion');
        $controldivisa = new NomControldivisaModel();
        $objCD = new NomControldivisa();
        if ($idcontroldivisa) {

            $objCD = Doctrine::getTable('NomControldivisa')->find(
                    $idcontroldivisa
            );
        }

        $result = $controldivisa->insertarnom_controldivisa(
                $objCD, $denominacion, $codigo, $descripcion
        );
        echo json_encode($result);
    }

    //******************************Eliminar**********************************************
    function eliminarIndCDAction() {
        $idcontroldivisa = json_decode(
                stripslashes($this->_request->getParam('todelete'))
        );
        try {
            NomControldivisaModel::eliminarIndCD(
                    $idcontroldivisa
            );
            echo json_encode(1);
        } catch (Exception $e) {
            echo json_encode(0);
        }
    }

    function listarAsociacionAction() {
        $idindicador = $this->_request->getPost('idindicador');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $data = NomControldivisaModel::listarAsociacion(
                        $idindicador, $start, $limit
        );
        echo json_encode($data);
    }

    function AsociarIndicadoresAction() {

        $idEstructura = $this->global->Estructura->idestructura;
        $identidad = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql("iddatosnomenclador = 1 and identidad=$idEstructura");

        $idindicador = json_decode(stripslashes($this->_request->getPost('idindicador')));
        $orden = json_decode(stripslashes($this->_request->getPost('orden')));
        $idejercicio = $this->_request->getPost('idejercicio');
        $idcontroldivisa = $this->_request->getPost('idcontroldivisa');
        $iddatosnomenclador = $this->_request->getPost('iddatosnomenclador');
        $data = DatControldivisaindicadorModel::Asociar(
                        $idcontroldivisa, $iddatosnomenclador, $orden, $identidad[0]->identidaddatosnomenclador, $idejercicio
        );
        echo json_encode($data);
    }

    function desasociarindicadoresAction() {
        $idindicador = json_decode(
                stripslashes($this->_request->getPost('idindicador'))
        );
        $orden = json_decode(stripslashes($this->_request->getPost('orden')));
        $idejercicio = $this->_request->getPost('idejercicio');
        $idcontroldivisa = $this->_request->getPost('idcontroldivisa');
        $iddatosnomenclador = $this->_request->getPost('iddatosnomenclador');
        $data = DatControldivisaindicadorModel::Desasociar(
                        $idcontroldivisa, $orden, $idejercicio
        );
        echo json_encode($data);
    }

    function AprobarDesaprobarAsociacionAction() {
        $aprobar = $this->_request->getPost('aprobar');
        $rector = $this->_request->getPost('rector');
        $idejercicio = $this->_request->getPost('idejercicio');
        $orden = json_decode(stripslashes($this->_request->getPost('orden')));
        $idcontroldivisaindicador = json_decode(
                stripslashes($this->_request->getPost('idcontroldivisaindicador'))
        );
        $data = DatControldivisaindicadorModel::AprobarDesaprobar(
                        $aprobar, $rector, $orden, $idejercicio
        );
        echo json_encode($data);
    }

    function CargarUmedidaAction() {
        $data = DatControldivisaindicador::listarUM();
        echo json_encode($data);
    }

    public function activarDesactivarEstadoAction() {
        $modeloNegocioNomControldivisa = new NomControldivisaModel();
        $idcontroldivisa = $this->_request->getPost('idcontroldivisa');
        $estado = $this->_request->getPost('estado');
        $result = $modeloNegocioNomControldivisa->modificarEstado(
                $idcontroldivisa, $estado
        );
        echo json_encode($result);
    }

    function cargarDatosAction() {
        $idcontroldivisa = $this->_request->getPost('idindicadorcd');
        $modeloNegocioNomControldivisa = new NomControldivisaModel();
        $data = $modeloNegocioNomControldivisa->cargarDatos($idcontroldivisa);
        echo json_encode(array('data' => $data, 'mensaje' => 1));
    }

    public function exportarCorrelacionadorIndAction() {
        $parametros;
        $parametros->idindicadoresdiv = json_decode(
                stripslashes($this->_request->getParam('indicadorescontdivisa'))
        );

        $parametros->idejercicio = $this->_request->getParam('idejercicio');
        $modeloNegocioDatControldivisa = new DatControldivisaindicadorModel();
        $modeloNegocioDatControldivisa->exportarCorrelacionador($parametros);
    }

}
