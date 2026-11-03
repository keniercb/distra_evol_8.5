<?php

/**
 * CalculoracionesController
 * Controlador para gestionar las bases para un plan
 *
 * @ author Pedro Enrique Rojas Aguilar
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 1.0-0
 * */
class CalculoracionesController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar el componente
     * */
    public function init() {
        parent::init();
    }

    /**
     * gestActividades
     * Renderizar la vista
     * */
    public function calculoracionesAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    /**
     * gestActividades
     * Renderizar la vista
     * */
    //adicionar Tipo de balance
    public function adicionarTipobalanceAction() {
        //Definir el objeto Tipo de balance
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        $idtipobalance = $this->_request->getPost('idtipobalance');
        $idconftiponomesp = $this->_request->getPost(
                'idconftiponomesp'
        ); //nuevo parametro PENDIENTE A INCLUSION
        //Instancear el modelo de tipo de balance
        //Si me envian un idtipobalance es para modificar
        if ($idtipobalance) {
            $tb = Doctrine::getTable('NomTipobalance')->find($idtipobalance);
            $mensaje = "mod";
        } else {
            $tb = new NomTipobalance();
            $mensaje = "add";
        }
        $existencia = NomTipobalanceModel::existencia(
                        $denominacion, $idtipobalance
        );

        if ($existencia == "") {
            //seteo parámetros
            if ($denominacion) {
                $tb->denominacion = trim(strtoupper($denominacion));
            }
            if ($descripcion) {
                $tb->descripcion = trim(strtoupper($descripcion));
            }
            if ($idconftiponomesp) {
                $tb->idconftiponomesp = $idconftiponomesp;
            }
            echo json_encode(array('codMsgA' => 1, 'mensaje' => $mensaje));
        } else {
            $mensaje = "Verifique,la denominacion ya existe";
            echo json_encode(array('codMsgA' => 29, 'mensaje' => $mensaje));
        }
    }

    //adicionar Subtipo de balance
    public function adicionarSubtipbalanceAction() {
        //Definir el objeto Subtipo de balance
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        $idtipobalance = $this->_request->getPost('idtipobalance');
        $idsubtipobalance = $this->_request->getPost('idsubtipobalance');

        //Instancear el modelo de subtipo de balance
        //Si me envian un idsubtipobalance es para modificar

        if ($idsubtipobalance) {
            $stb = Doctrine::getTable('NomSubtipobalance')->find(
                    $idsubtipobalance
            );
            $mensaje = "mod";
        } else {
            $stb = new NomSubtipobalance();
            $mensaje = "add";
        }
        $existedeno = NomSubtipobalanceModel::existenciasub(
                        $denominacion, $idsubtipobalance
        );
        if (!$existedeno) {
            //seteo parámetros
            if ($idtipobalance) {
                $stb->idtipobalance = $idtipobalance;
            }
            if ($denominacion) {
                $stb->denominacion = trim(strtoupper($denominacion));
            }
            if ($descripcion) {
                $stb->descripcion = trim(strtoupper($descripcion));
            }

            echo json_encode(array('codMsgA' => 1, 'mensaje' => $mensaje));
        } else {
            $mensaje = "Verifique,la denominacion ya existe";
            echo json_encode(array('codMsgA' => 29, 'mensaje' => $mensaje));
        }
    }

    //asociar balance idem a planminfar
    public function asociarBalanceAction() {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $cantidad = $this->_request->getPost('total');
        $idEstructura = $this->_request->getPost('identidad');
        $dominios = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura);
        $coeficiente = $this->_request->getPost('coeficiente');
        $idsubtipobalance = $this->_request->getPost('idsubtipobalance');
        $idbalance = json_decode(
                stripslashes($this->_request->getPost('idbalance'))
        );
        $data = json_decode(stripslashes($this->_request->getPost('data')));
        $model = new NomBalanceModel();
        $idejercicio = $this->_request->getPost('idejercicio');
        if (($idsubtipobalance && $idbalance) || $data) {

            $model->asociar(
                    $idbalance, $idsubtipobalance, $coeficiente, $cantidad, $data, $dominios, $idEstructura, $idejercicio
            );
            echo("{'codMsgA':1 }");
        } else {
            echo("{'codMsgA':3 }");
        }
    }


    public function desasociarBalanceAction() {
        $idsubtipobalance = $this->_request->getPost('idsubtipobalance');
        $idbalance = json_decode(
                stripslashes($this->_request->getPost('idbalance'))
        );

        $model = new NomBalanceModel();
        if ($idsubtipobalance && $idbalance) {
            if ($model->desasociar($idbalance, $idsubtipobalance)) {
                echo("{'codMsgD':1 }");
            } else {
                echo("{'codMsgD':3 }");
            }
        } else {
            echo("{'codMsgD':3 }");
        }
    }

    //adicionar balance
    public function adicionarBalanceAction() {
        //Definir el objeto balance
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        $idbalance = $this->_request->getPost('idbalance');
        $idconftiponomesp = $this->_request->getPost(
                'idconftiponomesp'
        ); //nuevo parametro PENDIENTE A INCLUSION
        //Instancear el modelo de balance
        //Si me envian un idsubtipobalance es para modificar
        if ($idbalance) {
            $b = Doctrine::getTable('NomBalance')->find($idbalance);
            $mensaje = "mod";
        } else {
            $b = new NomBalance();
            $mensaje = "add";
        }
        $existe = NomBalanceModel::existenciabal($denominacion, $idbalance);

        if (!$existe) {
            if ($denominacion) {
                $b->denominacion = trim(strtoupper($denominacion));
            }
            if ($descripcion) {
                $b->descripcion = trim(strtoupper($descripcion));
            }
            if ($idconftiponomesp) {
                $b->idconftiponomesp = $idconftiponomesp;
            }

            echo json_encode(array('codMsgA' => 1, 'mensaje' => $mensaje));
        } else {
            $mensaje = "Verifique,la denominacion ya existe";
            echo json_encode(array('codMsgA' => 29, 'mensaje' => $mensaje));
        }
    }

    public function eliminarAction() {
        $idsubtipobalance = $this->_request->getPost('idsubtipobalance');
        $idtipobalance = $this->_request->getPost('idtipobalance');
        $idbalance = $this->_request->getPost('idbalance');
        $model = new NomSubtipobalanceModel();

        if ($idsubtipobalance) {
            $id = $idsubtipobalance;
            $tipo = "subtipobalance";
        }
        if ($idtipobalance) {
            $tipo = "tipobalance";
            $id = $idtipobalance;
        }
        if ($idbalance) {
            $tipo = "balance";
            $id = $idbalance;
        }

        if ($model->eliminarrelaciones($id, $tipo) == 1) {
            echo("{'codMsgE':1 }"); //se ha eliminado satisfactoriamente
        } else {
            if ($model->eliminarrelaciones($id, $tipo) == 3) {
                echo("{'codMsgE':3 }");
            } else {
                echo("{'codMsgE':27 }");
            }
        } //tiene relaciones
    }

    public function listarRacionesAction() {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $hoja = $this->_request->getPost('hoja');
        $idEstructura = $this->_request->getPost('identidad');
        $idejercicio = $this->_request->getPost('idejercicio');
        $idsubtipobalance = $this->_request->getPost('idsubtipobalance');
        $idconftiponomesp = $this->_request->getPost('idconftiponomesp');
        $idconftiponomesp = (integer) $idconftiponomesp;
        $todos = $this->_request->getPost('todos');
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $key => $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    } elseif ($datos['field'] == 'total') {
                        if ($datos['data']['comparison'] == "gt") {
                            $parametros ['total_mayorq'] = array('total' => $datos['data']['value'],
                                'condicion' => ">");
                        } elseif ($datos['data']['comparison'] == "lt") {
                            $parametros ['total_menorq'] = array('total' => $datos['data']['value'],
                                'condicion' => "<");
                        } else {
                            $parametros ['total_iguala'] = array('total' => $datos['data']['value'],
                                'condicion' => "=");
                        }
                    } elseif ($datos['field'] == 'coeficiente') {
                        if ($datos['data']['comparison'] == "gt") {
                            $parametros ['coeficiente_mayorq'] = array('coeficiente' => $datos['data']['value'],
                                'condicion' => ">");
                        } elseif ($datos['data']['comparison'] == "lt") {
                            $parametros ['coeficiente_menorq'] = array('coeficiente' => $datos['data']['value'],
                                'condicion' => "<");
                        } else {
                            $parametros ['coeficiente_iguala'] = array('coeficiente' => $datos['data']['value'],
                                'condicion' => "=");
                        }
                    } elseif ($datos['field'] == 'racion') {
                        if ($datos['data']['comparison'] == "gt") {
                            $parametros ['racion_mayorq'] = array('racion' => $datos['data']['value'],
                                'condicion' => ">");
                        } elseif ($datos['data']['comparison'] == "lt") {
                            $parametros ['racion_menorq'] = array('racion' => $datos['data']['value'],
                                'condicion' => "<");
                        } else {
                            $parametros ['racion_iguala'] = array('racion' => $datos['data']['value'],
                                'condicion' => "=");
                        }
                    }
                }
            }
        }
        //SE VALIDA QUE LOS DATOS LLEGUEN CORRECTAMENTE
        if ($idsubtipobalance != "" && $idejercicio != "" && $idEstructura != ""
        ) {
            if ($hoja == 'true') {
                $data->data = DatRacionesModel::listarBalance(
                                $idEstructura, $idsubtipobalance, 'false', $idconftiponomesp, $start, $limit, $parametros, $idejercicio
                );
                $data->totales = DatRacionesModel::listarTotalesBalance(
                                $idEstructura, $idsubtipobalance, 'false', $idconftiponomesp, $parametros, $idejercicio
                );
                $totalParcial = DatRacionesModel::totalParcial(
                                $idEstructura, $idsubtipobalance, $todos, $idconftiponomesp, $idejercicio, $parametros
                );
                $totalGeneral = NomBalance::totalGeneralNiveles(
                                $idEstructura, $idejercicio
                );

                foreach ($data->data as $key => $value) {
                    $data->data[$key]['totalparcial'] = $totalParcial;
                    $data->data[$key]['totalgeneral'] = $totalGeneral;
                    $data->data[$key]['idsubtipobalancebalance'] = $value['DatSubtipobalancebalance'][0]['idsubtipobalancebalance'];
                    $data->data[$key]['total'] = $value['DatSubtipobalancebalance'][0]['total'];
                    $data->data[$key]['coeficiente'] = $value['DatSubtipobalancebalance'][0]['coeficiente'];
                    $data->data[$key]['racion'] = number_format(
                            $value['DatSubtipobalancebalance'][0]['racion'], '3', '.', ','
                    );
                }
            } else {

              
                $hijas = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura);


                $totalParcial = DatRacionesModel::totalParcial(
                                $idEstructura, $idsubtipobalance, $todos, $idconftiponomesp, $parametros, $idejercicio, $hijas
                );


                $totalGeneral = NomBalance::totalGeneralNiveles(
                                $idEstructura, $idejercicio, $hijas
                );
                if ($todos == 'false') {
                    $data->data = DatRacionesModel::consolidar(
                                    $idsubtipobalance, $idconftiponomesp, $parametros
                    );
                    foreach ($data->data as $key => $value) {
                        $data->data[$key]['totalparcial'] = $totalParcial;
                        $data->data[$key]['totalgeneral'] = $totalGeneral;
                    }
                } else {
                    $data->data = DatRacionesModel::listarBalance(
                                    $idEstructura, $idsubtipobalance, $todos, $idconftiponomesp, $start, $limit, $parametros, $idejercicio
                    );
                    $data->totales = DatRacionesModel::listarTotalesBalance(
                                    $idEstructura, $idsubtipobalance, $todos, $idconftiponomesp, $parametros, $idejercicio
                    );

                    foreach ($data->data as $key => $value) {
                        $data->data[$key]['idsubtipobalancebalance'] = $value['DatSubtipobalancebalance'][0]['idsubtipobalancebalance'];
                        $data->data[$key]['total'] = 0;
                        $data->data[$key]['coeficiente'] = 0;
                        $data->data[$key]['racion'] = 0;
                    }
                }
            }
        } else {
            $array = array();
            $data->data = $array;
            $data->totales = $array;
        }


        echo json_encode($data);
    }

    public function cargartbcombotipobalanceAction() {
        $idconftiponomesp = $this->_request->getPost('idconftiponomesp');
        $activof = $this->_request->getPost('activof');
        $tipoaf = $this->_request->getPost('tipoaf');
        $array = array();
        $arra = array();
        $arrayT = NomTipobalance::listarnomencladorTipo();
        if ($activof == 1) {
            foreach ($arrayT as $key => $dat) {
                $array[] = $dat["idtiponomencladoraft"];
            }
            $datos = $this->integrator->datosmaestros->getDatosFromNomencladoresDinamicos(
                    $array
            );

            foreach ($datos[$tipoaf] as $key => $dat) {
                $arra[$key]["idtipobalance"] = $dat["id"];
                $arra[$key]["denominacion"] = $dat["denominacion"];
            }
            $data->data = $arra;
            echo json_encode($data);
        } else {
            $data->data = DatRacionesModel::listarTipoBalance(
                            $idconftiponomesp
            );
            echo json_encode($data);
        }
    }

//fin de la función cargartbcomboestados

    public function cargartbcombosubtipobalanceAction() {

        $idtipobalance = $this->_request->getPost('idtipobalance');
        $activof = $this->_request->getPost('activof');
        $tipoaf = $this->_request->getPost('tipoaf');
        $array = array();
        $arra = array();
        $cont = 0;
        $activof = $this->_request->getPost('activof');
        $tipoaf = $this->_request->getPost('tipoaf');
        $subaf = $this->_request->getPost('subaf');
        $arrayS = NomTipobalance::listarnomencladorSubtipo();
        if ($activof == 1) {
            foreach ($arrayS as $key => $dat) {
                $array[] = $dat["idtiponomencladoraft"];
            }
            $datos = $this->integrator->datosmaestros->getDatosFromNomencladoresDinamicos(
                    $array
            );
            foreach ($datos[$subaf] as $key => $dat) {
                if ($dat["id"] != $idtipobalance) {
                    $arra[$cont]["idsubtipobalance"] = $dat["id"];
                    $arra[$cont]["denominacion"] = $dat["denominacion"];
                    $cont = $cont + 1;
                }
            }
            $data->data = $arra;
            echo json_encode($data);
        } else {
            $data->data = DatRacionesModel::listarSubTipoBalance(
                            $idtipobalance
            );
            echo json_encode($data);
        }
    }

    public function listarTipobalanceAction() {
        $idconftiponomesp = $this->_request->getPost('idconftiponomesp');
        $parametros = array();
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    }
                }
            }
        }
        $data->data = NomTipobalance::listartodosTipoBalance(
                        $start, $limit, $parametros, $idconftiponomesp
        );
        $data->total = NomTipobalance::totalTipoBalance(
                        $idconftiponomesp, $parametros
        );
        if ($data) {
            echo json_encode($data);
        } else {
            echo json_encode(array('codMsg' => 3));
        }
    }

    public function listarSubtipobalanceAction() {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $idbalance = $this->_request->getPost('idbalance');
        $parametros = array();
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    }
                }
                //falta filtrado por tipo de balance  
            }
        }
        $data->data = NomSubtipobalance::listartodosSubTipoBalance(
                        $start, $limit, $idbalance
        );
        $data->total = NomSubtipobalance::totalSubTipoBalance(
                        $parametros, $idbalance
        );
        echo json_encode($data);
    }

    public function listarBalanceAction() {
        $idconftiponomesp = $this->_request->getPost('idconftiponomesp');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $parametros = array();
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    }
                }
                //falta filtrado por tipo de balance  
            }
        }
        $data->data = NomBalance::listartodosBalance(
                        $start, $limit, $parametros, $idconftiponomesp
        );
        $data->total = NomBalance::totalBalance($idconftiponomesp, $parametros);
        echo json_encode($data);
    }

    public function cargarCombocompAction() {
        $identidad = $this->global->Estructura->idestructura;
        $a = $this->integrator->metadatos->DameEstructura($identidad);
        $idesp = $a[0]->idespecialidad;
        $comportamientos->data = NomTiponomencladorModel::listarNomCalculoNiveles();
        foreach ($comportamientos->data as $key => $value) {

            $comportamientos->data[$key]['idconftiponomesp'] = $value['DatConftiponomesp'][0]['idconftiponomesp'];
        }
        echo json_encode($comportamientos);
    }

    function exportarAction() {
        $parametros = Array();
        //recibo el parametro componente
        $parametros['componente'] = $this->_request->getParam('componente');
        //recibo el parametro TipoBalance
        $parametros['tipobalance'] = $this->_request->getParam('tipobalance');
        //recibo el parametro SubTipoBalance
        $parametros['idsubtipobalance'] = $this->_request->getParam(
                'subtipobalance'
        );
        //recibo el parametro idSubTipoBalance
        $parametros['subtipobalance'] = $this->_request->getParam(
                'idsubtipobalance'
        );
        //recibo el parametro Entidad
        $parametros['entidad'] = $this->_request->getParam('entidad');
        //recibo el parametro idEntidad
        $parametros['idEstructura'] = $this->_request->getParam('identidad');
        $parametros['idconftiponomesp'] = $this->_request->getParam(
                'idconftiponomesp'
        );
        $parametros['todos'] = $this->_request->getParam('todos');
        $parametros['hoja'] = $this->_request->getParam('hoja');
        //pido el arreglo de filtros que viene desde el json.
        $p = $this->_request->getParam('filtros');
        $p = json_decode(stripcslashes($p));
        if (is_array($p)) {
            foreach ($p as $datos) {
                if ($datos->field == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos->data->value;
                } elseif ($datos->field == 'descipcion') {
                    $parametros ['filtros']['descipcion'] = $datos->data->value;
                }
            }
        }

        CalculoracionesModel::exportarBalances($parametros);
    }

    //listar actividades para asociar al calculo de niveles lo que se muestra en el grid de asociar act
    public function listarActAAsociarAction() {
        $identidad = $this->_request->getPost('identidad');
        $todasact = $this->_request->getPost('todasact');
        $idejercicio = $this->_request->getPost('idejercicio');
        $idsubtipobalancebalance = $this->_request->getPost(
                'idsubtipobalancebalance'
        );
        $params['filtros'] = $this->_request->getPost('filtros');
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $params ['filtros']['codigo'] = $datos ['data'] ['value'];
                } else {
                    if ($datos ['field'] == 'denominacion') {
                        $params ['filtros']['denominacion'] = $datos ['data'] ['value'];
                    } else {
                        if ($datos ['field'] == 'descripcion') {
                            $parametros ['filtros']['descripcion'] = $datos ['data'] ['value'];
                        } else {
                            if ($datos ['field'] == 'nivelactividadmanual') {
                                $parametros ['filtros']['nivelactividadmanual'] = $datos ['data'] ['value'];
                            }
                        }
                    }
                }
            }
        }
        if ($todasact == 'false') {
            $data->data = CalculoracionesModel::obtenerListadoAsociaciones(
                            $params, $identidad, $idsubtipobalancebalance, $idejercicio
            );
        } else {
            $data->data = CalculoracionesModel::obtenerListadoTodasAct(
                            $params, $identidad, $idejercicio
            );
        }
        echo json_encode(
                array('data' => array_slice(
                            $data->data, $this->_request->getPost('start'), $this->_request->getPost('limit')
                    ),
                    'total' => count($data->data))
        );
    }

    //cuando clic en el boton asociar calculo de niveles
    public function asociarCNAction() {
        $params['actividades'] = json_decode(
                stripslashes($this->_request->getPost('actividades'))
        );
        $params['idsubtipobalancebalance'] = $this->_request->getPost(
                'idsubtipobalancebalance'
        );
        $params['racion'] = $this->_request->getPost('racion');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['todos'] = $this->_request->getPost('todos');
        $params['idEjercicio'] = $this->_request->getPost('idEjercicio');
        $model = new CalculoracionesModel();
        if ($params['idsubtipobalancebalance'] != '') {

            $model->asociarActividades($params);
            echo("{'codMsgA':1 }");
        } else {
            echo("{'codMsgA':3 }");
        }
    }

    //cuando clic en el boton desasociar calculo de niveles
    public function desasociarCNAction() {
        $params['actividades'] = json_decode(
                stripslashes($this->_request->getPost('actividades'))
        );
        $params['idsubtipobalancebalance'] = $this->_request->getPost(
                'idsubtipobalancebalance'
        );
        $params['racion'] = $this->_request->getPost('racion');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['todos'] = $this->_request->getPost('todos');
        $params['idEjercicio'] = $this->_request->getPost('idEjercicio');
        $model = new CalculoracionesModel();
        if ($params['idsubtipobalancebalance']) {
            if ($model->desasociarActividades($params)) {
                echo("{'codMsgD':1 }");
            } else {
                echo("{'codMsgD':3 }");
            }
        } else {
            echo("{'codMsgD':3 }");
        }
    }

    public function guardarTSAction() {
        $params['sub'] = $this->_request->getPost('idsubtipobalance');
        $params['tipo'] = $this->_request->getPost('idtipobalhojaance');
        $params['identidad'] = $this->_request->getPost('identidad');
        $model = new CalculoracionesModel();
        if ($model->guardarTS($params)) {
            echo("{'codMsgD':1 }");
        } else {
            echo("{'codMsgD':3 }");
        }
    }

//Gestionar combo ejercicios de planificacion
    public function gestEjerciciosAction() {
        $data = CalculoracionesModel::obtenerEjercicios();
        echo json_encode($data);
    }

    public function cargartbcombosubtipobalanceAFAction() {
        $id = $this->_request->getPost('idetapa');
        $array = array();
        $cont = 0;
        $datos = $this->integrator->datosmaestros->getNomencladoresDinamicos();
        foreach ($datos as $value) {
            if ($id != $value['idtabla']) {
                $array[$cont]['denominacion'] = $value['text'];
                $array[$cont]['idtabla'] = $value['idtabla'];
                $cont++;
            }
        }
        echo json_encode(array('data' => $array));
    }

}
