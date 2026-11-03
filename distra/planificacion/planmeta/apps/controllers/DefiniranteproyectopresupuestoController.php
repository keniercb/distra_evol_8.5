<?php

$dirWww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirRelMt = "/";
//Direccion absoluta del marco de trabajo
$dirAbsMt = str_replace("//", "/", dirname($dirWww . "..") . "/" . $dirRelMt);
$config["include_path"] = get_include_path();

$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
        . 'apps/planificacion/planmeta/comun/lib/tcpdf/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
        . 'apps/planificacion/planmeta/comun/lib/tcpdf/config/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
        . 'apps/planificacion/planmeta/comun/lib/tcpdf/fonts/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
        . 'apps/planificacion/planmeta/comun/lib/tcpdf/include/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
        . 'apps/planificacion/planmeta/comun/lib/tcpdf/tools/';
set_include_path($config["include_path"]);

/**
 * Recuperaciones para planificacion
 * Controlador para el control del a ejecucion
 *
 * @ author Javier Lamas Collejo
 * @ package Planificacion
 * @ subpackage Planificacion material
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class DefiniranteproyectopresupuestoController extends ZendExt_Controller_Secure {

    /**
     * funcion init()
     * Para inicializar el modulo
     * */
    function init() {
        parent::init();
    }

    public function getEjerciciosAction() {
        $data = null;
        $data->data = $this->pIntegrator->planmeta->obtenerEjercicios();
        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        echo json_encode($data);
    }

    public function definiranteproyectopresupuestoAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarEntidadesAction() {
        $idEstructura = ($this->_request->getPost('node')) ? $this->_request->getPost('node') : 0;
        $valor = ($this->_request->getPost('valor')) ? $this->_request->getPost(
                        'valor'
                ) : null;
        $iddominio = $this->global->Perfil->iddominio;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
                $iddominio, $idEstructura, 0, 0, 3
        );
        $idEstructuraPadre = $this->_request->getPost('idEstructuraPadre');
        $idejercicio = $this->_request->getPost('idejercicio');

        if ($idEstructuraPadre == 'undefined' && $idEstructura != '0') {
            $idEstructuraPadre = $idEstructura;
        }
        $result = array();
        foreach ($dominios as $key => $val) {
            $result[$key] = $val;
            $result[$key]['idEstructuraPadre'] = $idEstructuraPadre;
            $result[$key]['entidades_productoras'] = "";
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
        $resultt = array();

        foreach ($result as $key => $value) {
            $resultt[$key]['id'] = $value['id'];
            $resultt[$key]['tipo'] = $value['tipo'];
            $resultt[$key]['icon'] = $value['icon'];
            $resultt[$key]['unchecked'] = $value['unchecked'];
            $resultt[$key]['_parent'] = $value['_parent'];
            $resultt[$key]['leaf'] = $value['leaf'];
            if ($idejercicio) {
                if (DatAnteproyecto::buscarAnteproyectoDadoIdEntidad(
                                $value['id'], 4, $idejercicio
                        )
                ) {
                    $resultt[$key]['text'] = $value['text'];
                } else {
                    $resultt[$key]['text'] = "<b>" . $value['text'] . "</b>";
                }
            } else {
                $idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();

                if (DatAnteproyecto::buscarAnteproyectoDadoIdEntidad(
                                $value['id'], 4, $idejercicioactual['idejercicio']
                        )
                ) {
                    $resultt[$key]['text'] = $value['text'];
                } else {
                    $resultt[$key]['text'] = "<b>" . $value['text'] . "</b>";
                }
            }


            $resultt[$key]['idEstructuraPadre'] = $value['idEstructuraPadre'];
            $resultt[$key]['entidades_productoras'] = $value['entidades_productoras'];
        }
        // echo json_encode($result);
        echo json_encode($resultt);
    }

    public function listarnaeasociadosAction() {

        $identidad = $this->_request->getPost('identidad');
        $idestructuracomun = $this->global->Estructura->idestructura;
        $parametros->idejercicio = $this->_request->getPost('idejercicio');
        $parametros->identidadRector = $this->_request->getPost(
                'identidadRector'
        );
        $parametros->start = $this->_request->getPost('start');
        $parametros->limit = $this->_request->getPost('limit');
        $filters = $this->_request->getPost('filtros');
        if ($parametros->identidadRector != null) {
            $entidadesHijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
            $naes = NomNae::obtenerTodasNaes();
            $total = NomNae::obtenerTotalNAE($filters);
            $arrayAsocNaeEntidad = [];
            foreach ($naes as $key => $valuenae) {
                if (DatPlanificacionnae::tieneDocumento(
                                $valuenae['idnae'], $identidad, $parametros
                        )
                ) {
                    $naes [$key] ['tienedoc'] = 1;
                } else {
                    $naes [$key] ['tienedoc'] = 0;
                }
                $resultado = DatPlanificacionnae::getEntidadesPorNae(
                                $valuenae['idnae'], $parametros
                );
                if ($resultado[0] == null) {
                    $arrayAsocNaeEntidad[$key + 1][0] = 0;
                } else {
                    foreach ($resultado as $key1 => $value) {
                        $arrayAsocNaeEntidad[$key + 1][$key1] = $value['identidad'];
                    }
                }
            }

            foreach ($arrayAsocNaeEntidad as $key => $valueEn) {
                $existe = true;
                foreach ($valueEn as $v) {
                    $resultado = DatPlanificacionnae::comprobarNaeAsociadosEnUnaEntidad(
                                    $v, $key, 1, $parametros
                    );
                    if ($resultado[0] == null) {
                        $existe = false;
                        break;
                    }
                }
                if ($existe) {
                    $naes [$key - 1] ['asociado'] = 1;
                } else {
                    $naes [$key - 1] ['asociado'] = 0;
                }
            }
        } else {
            $result = DatPlanificacionnae::verNAEasociados(
                            $identidad, false, $parametros
            );

            $naes = NomNae::obtenerNAE(
                            $filters, false, $parametros->start, $parametros->limit
            );

            $total = NomNae::obtenerTotalNAE($filters);
            /* $naes
              = $this->integrator->contabilidad_costos->obtenerNivelesActividadEconomica(
              $idestructuracomun
              ); */
            foreach ($naes as $key => $value) {
                if (DatPlanificacionnae::tieneDocumento(
                                $value['idnae'], $identidad, $parametros
                        )
                ) {
                    $naes [$key] ['tienedoc'] = 1;
                } else {
                    $naes [$key] ['tienedoc'] = 0;
                }

                if (count($result) == 0) {
                    $naes [$key] ['asociado'] = 0;
                } else {
                    foreach ($result as $val) {
                        if ($value ['idnae'] == $val ['idnae']) {
                            $naes [$key] ['asociado'] = 1;
                            break;
                        } else {
                            $naes [$key] ['asociado'] = 0;
                        }
                    }
                }
            }
        }
        if (!empty($filters)) {
            foreach ($filters as $filter) {
                if ($filter ['data'] ['type'] == 'boolean') {
                    if ($filter ['field'] == 'asociado') {
                        $naefil = array();

                        if ($filter ['data'] ['value'] == 'false') {
                            foreach ($naes as $key => $value) {
                                /* if ($naes [$key] ['asociado'] == 1) {
                                  unset($naes[$key]);
                                  } */
                                if ($naes [$key] ['asociado'] == 0)
                                    $naefil[] = $naes [$key];
                            }
                        } else {
                            foreach ($naes as $key => $value) {
                                /* if ($naes [$key] ['asociado'] == 0) {
                                  unset($naes[$key]);} */
                                if ($naes [$key] ['asociado'] == 1)
                                    $naefil[] = $naes [$key];
                            }
                        }
                    }
                }
            }
            echo json_encode(array('data' => $naefil, 'total' => $total));
        }
        //$total = count($naes);
        else
            echo json_encode(array('data' => $naes, 'total' => $total));
    }

    public function generardoc21Action() {
        $identidad = $this->_request->getPost('identidad');
        $parametros->identidad = $identidad;
        $datosEntidad = $this->integrator->metadatos->DameEstructura($identidad);
        $idespecialidad = $datosEntidad [0]->idespecialidad;
        $actualizar = $this->_request->getPost('actualizar');
        $parametros->idejercicio = $this->_request->getPost('idejercicio');
        $idnaes = json_decode(stripslashes($this->_request->getPost('idnaes')));
        $idusuario = $this->global->Perfil->idusuario;
        $result = array();
        if ($actualizar) {
            foreach ($idnaes as $idnae) {
                $doc = DatPlanificacionnae::obtenerDocdadoNAE(
                                $idnae, $parametros
                );

                if ($doc[0]['idaprobacion'] == 1) {

                    $anteproyecto = DatPlanificacionnae::duplicarAnteproyecto(
                                    $doc, $idusuario, $actualizar
                    );
                    array_push(
                            $result, DatPlanificacionnae::generardoc21(
                                    $identidad, $idnae, $anteproyecto, false, $idespecialidad, $parametros
                    ));

                    DatAnteproyectoModel::eliminarAnteproyectosDadoIds(
                            $doc[0]['idanteproyecto']
                    );
                } else if ($doc[0]['idaprobacion'] == 4) {
                    $parametros->version = $doc[0]['version'] + 1;
                    $anteproyecto = DatPlanificacionnae::crearanteproyecto(
                                    $identidad, $idusuario, 1, $parametros
                    );
                    array_push(
                            $result, DatPlanificacionnae::generardoc21(
                                    $identidad, $idnae, $anteproyecto, false, $idespecialidad, $parametros
                            )
                    );
                }
            }
        } else {
            foreach ($idnaes as $idnae) {
                $parametros->version = 1;
                $anteproyecto = DatPlanificacionnae::crearanteproyecto(
                                $identidad, $idusuario, 1, $parametros
                );
                array_push(
                        $result, DatPlanificacionnae::generardoc21(
                                $identidad, $idnae, $anteproyecto, false, $idespecialidad, $parametros
                        )
                );
            }
        }
        echo json_encode($result);
    }

    public function generardoc2Action() {
        $identidad = $this->_request->getPost('identidad');
        $actualizar = $this->_request->getPost('actualizar');
        $datosEntidad = $this->integrator->metadatos->DameEstructura(
                $identidad
        );
        $idespecialidad = $datosEntidad [0]->idespecialidad;
        $idusuario = $this->global->Perfil->idusuario;
        $parametros->idejercicio = $this->_request->getPost('idejercicio');
        $entidadeshijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
        $ids = array();
        if ($entidadeshijas [0] != null) {
            foreach ($entidadeshijas as $valorIdentidad) {
                array_push(
                        $ids, $valorIdentidad['identidad']
                );
            }
        }

        $generarDoc = true;
        if ($datosEntidad[0]->idestructura == $datosEntidad[0]->idpadre) { //para la entidad Direccion de Economia
            foreach ($entidadeshijas as $entidad) {
                if ($entidad['identidad'] != $datosEntidad[0]->idestructura) {
                    $resultado = DatAnteproyecto::buscarAnteproyectoDadoIdEntidad(
                                    $entidad['identidad']
                                    /* $entidad */, 4, $parametros->idejercicio
                    );
                    if (count($resultado) == 0) {
                        $generarDoc = false;
                        break;
                    }
                }
            }

            if ($generarDoc) {
                $seguir = true;
                $naesAsoc = DatPlanificacionnae::getNaesAsociadas(
                                $parametros, 1
                );

                foreach ($naesAsoc as $value) {
                    $res = DatPlanificacionnae::comprobarNaeAsociadosEnUnaEntidad(
                                    $identidad, $value['idnae'], 1, $parametros
                    );
                    if ($res[0] == null) {
                        $seguir = false;
                        break;
                    }
                }
                if ($seguir) {
                    $result = 0;
                    $identidades = array();
                    $docPDos = DatPlanificacionnae::existeP2(
                                    $identidad, 4, $parametros
                    );

                    if (empty($docPDos)) {
                        $asociados = DatPlanificacionnae::verNAEasociadosEconomia(
                                        $identidad, $parametros
                        );

                        array_push($identidades, $identidad);
                        $anteproyecto = DatPlanificacionnae::crearanteproyecto(
                                        $identidad, $idusuario, 4, $parametros
                        );

                        foreach ($asociados as $nae) {
                            $result = DatPlanificacionnae::generardoc21(
                                            $identidad, $nae ['idnae'], $anteproyecto, $ids, $idespecialidad, $parametros
                            );
                        }
                    } else {
                        $result = 5;
                    }
                    $result = 8;
                    echo json_encode(
                            array('cod' => $result, 'entidades' => $identidades)
                    );
                } else {
                    $mensaje = 7;
                    echo json_encode(array('cod' => $mensaje));
                }
            } else {
                $mensaje = 6;
                echo json_encode(array('cod' => $mensaje));
            }
        } else { //para las entidades hijas
            $d = true;
            $identidades = array();
            if ($ids[0] != "") {
                foreach ($ids as $value) {
                    $as = DatPlanificacionnae::verNAEasociados(
                                    $value, array(), $parametros
                    );

                    $r = DatPlanificacionnae::verificarNaeEntidad(
                                    $value, $as, $parametros
                    );

                    if (!$r) {
                        array_push($identidades, $value);
                        $d = false;
                    }
                }
            } else {
                $as = DatPlanificacionnae::verNAEasociados(
                                $identidad, array(), $parametros
                );
                $r = DatPlanificacionnae::verificarNaeEntidad(
                                $identidad, $as, $parametros
                );
                if (!$r) {
                    $d = false;
                }
            }

            $result = -1;
            if ($d) {
                $ids = implode(",", $ids);
                $result = 0;

                $docPDos = DatPlanificacionnae::existeP2(
                                $identidad, 4, $parametros
                );

                if (empty($docPDos)) {

                    if ($ids[0] != "") {
                        $asociados = DatPlanificacionnae::verNAEasociados(
                                        $identidad, $ids, $parametros
                        );
                    } else {
                        $asociados = DatPlanificacionnae::verNAEasociados(
                                        $identidad, array(), $parametros
                        );
                    }

                    $anteproyecto = DatPlanificacionnae::crearanteproyecto(
                                    $identidad, $idusuario, 4, $parametros
                    );

                    foreach ($asociados as $nae) {
                        $result = DatPlanificacionnae::generardoc21(
                                        $identidad, $nae ['idnae'], $anteproyecto, $ids, $idespecialidad, $parametros
                        );
                    }
                }/* else  {
                  //$result = 5;
                  } */
            }
            echo json_encode(
                    array('cod' => $result, 'entidades' => $identidades)
            );
        }
    }

    public function cargardocumentosAction() {
        $start = $this->_request->getPost('start');
        $identidad = $this->_request->getPost('identidad');
        $limit = $this->_request->getPost('limit');
        $filters = $this->_request->getPost('filtros');
        $parametros->idejercicio = $this->_request->getPost('idejercicio');
        $parametros->integrator = $this->integrator;
        $result = DatAnteproyecto::listarTodos(
                        $parametros, $identidad, $start, $limit, $filters
        );
        $total = DatAnteproyecto::obtenerTotal($parametros, $identidad);
        echo json_encode(array('data' => $result, 'total' => $total));
    }

    public function cargarfiltroejercicioAction() {
        $result = NomEjercicioplanificacion::listarOrdenado();
        echo json_encode(array('data' => $result));
    }

    public function cargarfiltrotipoanteproyectoAction() {
        $result = NomTipoanteproyecto::listarTodos();
        echo json_encode(array('data' => $result));
    }

    public function cargarfiltroconceptoAction() {
        $result = DatAnteproyecto::obtenerConceptos();
        echo json_encode(array('data' => $result));
    }

    public function cargarfiltroentidadAction() {
        $estrucutras = $this->integrator->metadatos->ListadoEstructuras();
        echo json_encode(array('data' => $estrucutras));
    }

    public function cargarfiltronaeAction() {
        $naes = NomNae::obtenerNAE(false, array());
        echo json_encode(array('data' => $naes));
    }

    public function cargarnrecursosfinacierosAction() {
        $rf = NomRecursofinanciero::obtenerRF();
        echo json_encode(array('data' => $rf));
    }

    public function cargarfiltrousuarioAction() {
        $idsusers = DatAnteproyecto::obtenerIdUsuaios();
        $arrayresult = array();
        foreach ($idsusers as $value) {
            $obj = new stdClass();
            $obj->idusuario = $idsusers[0]['idusuario'];
            $denominacion = $this->integrator->seguridad->nombreUsuario(
                    $idsusers[0]['idusuario']
            );
            $obj->denominacion = $denominacion;
            array_push($arrayresult, $obj);
        }
        echo json_encode(array('data' => $arrayresult));
    }

    public function listaringresosdocAction() {
        $iddoc = $this->_request->getPost('idanteproyecto');
        $idnae = $this->_request->getPost('idnae');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $result = DatAnteproyectonae::obtenerIngresosDoc(
                        $iddoc, $idnae, $start, $limit
        );
        $total = DatAnteproyectonae::obtenerCantIngresosDoc($iddoc, $idnae);

        foreach ($result as $key => $value) {
            $objgasto = NomRecursofinanciero::obtenerRFDadoId(
                            $result [$key] ['idingreso']
            );

            $result [$key] ['codigoingreso'] = $objgasto [0] ['codigo'];
            $result [$key] ['denominacioningreso'] = $objgasto [0] ['denominacion'];
        }
        echo json_encode(array('data' => $result, 'total' => $total));
    }

    public function listargastosdocAction() {
        $iddoc = $this->_request->getPost('idanteproyecto');
        $idnae = $this->_request->getPost('idnae');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $result = DatAnteproyectonae::obtenerGastosDoc(
                        $iddoc, $idnae, $start, $limit
        );

        $total = DatAnteproyectonae::obtenerCantGastosDoc($iddoc, $idnae);
        foreach ($result as $key => $value) {
            $objgasto = NomObjetogasto::obtenerOGPlanif(
                            $value ['idobjetogasto']
            );
            $result [$key] ['codigoobjetogasto'] = $objgasto [0] ['codigo'];
            $result [$key] ['denominacionobjgasto'] = $objgasto [0] ['denominacion'];
        }
        echo json_encode(array('data' => $result, 'total' => $total));
    }

    public function verdocp21ogAction() {
        $identidad = $this->_request->getPost('identidad');
        $idnae = $this->_request->getPost('idnae');
        $resultado = DatPlanificacionnae::consolidarOG(
                        $identidad, $idnae, false
        );
        $naes = NomNae::obtenerNAE($idnae);
        $naes = $naes [0] ['denominacion'];
        foreach ($resultado as $key => $value) {
            $resultado [$key] ['denominacionnae'] = $naes;
            $objetosdegasto = NomObjetogasto::obtenerOG(
                            $value ['idobjetogasto']
            );
            $resultado [$key] ['denominacionog'] = $objetosdegasto [0] ['denominacion'];
        }
        echo json_encode(array('data' => $resultado));
    }

    public function verdocp21rfAction() {
        $identidad = $this->_request->getPost('identidad');
        $idnae = $this->_request->getPost('idnae');
        $resultado = DatPlanificacionnae::consolidarRF(
                        $identidad, $idnae, false
        );
        $naes = NomNae::obtenerNAE($idnae);
        $naes = $naes [0] ['denominacion'];
        foreach ($resultado as $key => $value) {
            $resultado [$key] ['denominacionnae'] = $naes;
            $recursofinanciero = NomRecursofinanciero::obtenerRF(
                            $value ['idrecursofinanciero']
            );
            $resultado [$key] ['denominacionrf'] = $recursofinanciero [0] ['denominacion'];
        }
        echo json_encode(array('data' => $resultado));
    }

    public function eliminardocsAction() {
        $idsdocs = json_decode(
                stripslashes($this->_request->getPost('idsdocs'))
        );
        $result = DatAnteproyectoModel::eliminarAnteproyectosDadoIds($idsdocs);
        echo json_encode($result);
    }

    public function listarnaesdocAction() {
        $iddoc = $this->_request->getPost('idanteproyecto');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $apn = DatAnteproyectonae::obtenerIdsNaesDadoIdDoc(
                        $iddoc, $start, $limit
        );
        $total = DatAnteproyectonae::obtenerCantIdsNaesDadoIdDoc($iddoc);

        $ids = array();
        foreach ($apn as $value) {
            array_push($ids, $value ['idnae']);
        }

        $result = NomNae::obtenerNAEsDadoIds($ids);
        foreach ($result as $key => $value) {
            $og = DatAnteproyectonae::obtenerGastosDocconsolidados(
                            $iddoc, $value ['idnae'], $start, $limit
            );
            $rf = DatAnteproyectonae::obtenerIngresosDocconsolidados(
                            $iddoc, $value ['idnae'], $start, $limit
            );
            $result[$key]['totalog'] = $og[0]['SUM'];
            $result[$key]['totalrf'] = $rf[0]['SUM'];
        }
        echo json_encode(array('data' => $result, 'total' => $total));
    }

    public function cargardatosdocAction() {
        $identidad = $this->_request->getPost('identidad');
        $estructura = $this->integrator->metadatos->DameEstructura($identidad);
        $codigo = $estructura [0]->codigo;
        $denominacion = $estructura [0]->denominacion;
        $respuesta['codigo'] = $codigo;
        $respuesta['denominacion'] = $denominacion;
        echo json_encode($respuesta);
    }

    public function modificardocAction() {
        $duplicar = $this->_request->getPost('duplicar');
        $gastosmodificados = json_decode(
                stripslashes($this->_request->getPost('gastosmodificados'))
        );
        $ingresosmodificados = json_decode(
                stripslashes($this->_request->getPost('ingresosmodificados'))
        );
        $idanteproyecto = $this->_request->getPost('idanteproyecto');
        $idusuario = $this->global->Perfil->idusuario;
        $result = DatPlanificacionnae::duplicarModificarDocumento(
                        $idanteproyecto, $idusuario, $ingresosmodificados, $gastosmodificados, $duplicar
        );
        echo json_encode($result);
    }

    public function aprobardesabropardocAction() {
        $idsdocs = json_decode(
                stripslashes($this->_request->getPost('idsanteproyectos'))
        );
        $rector = $this->_request->getPost('rector');
        $aprobar = $this->_request->getPost('aprobar');
        $reslut = DatAnteproyectoModel::aprobarDesaprobarDocumentos(
                        $idsdocs, $aprobar, $rector
        );
        echo json_encode($reslut);
    }

    public function cargarconceptosAction() {
        $identidad = $this->global->Estructura->idestructura;
        $response = NomConcepto::listarDadoIdEntidad($identidad);
        echo json_encode($response);
    }

    public function exportarAction() {

        $iddoc = $this->_request->getParam('idanteproyecto');
        $numero = $this->_request->getParam('numero');
        $version = $this->_request->getParam('version');
        $fecha = $this->_request->getParam('fecha');
        $tipo = $this->_request->getParam('tipo');
        $especialidad = $this->_request->getParam('esp');
        $esp = explode(':', $especialidad);
        $codigo = $this->_request->getParam('cod');
        $cod = explode(':', $codigo);
        $aprobacion = $this->_request->getParam('idaprobacion');
        if ($aprobacion == 3)
            $estado = 'Aprobado especialista';
        else if ($aprobacion == 4)
            $estado = 'Aprobado rector';
        else if ($aprobacion == 2)
            $estado = 'Preparacion';
        else
            $estado = 'Desaprobado';

        $start = 0;
        $limit = 20;
        $apn = DatAnteproyectonae::obtenerIdsNaesDadoIdDoc(
                        $iddoc, $start, $limit
        );
        $total = DatAnteproyectonae::obtenerCantIdsNaesDadoIdDoc($iddoc);
        $ids = array();
        foreach ($apn as $value) {
            array_push($ids, $value ['idnae']);
        }
        $resultNae = NomNae::obtenerNAEsDadoIds($ids);


        foreach ($resultNae as $key => $value) {
            $og = DatAnteproyectonae::obtenerGastosDocconsolidados(
                            $iddoc, $value ['idnae'], $start, $limit
            );
            $rf = DatAnteproyectonae::obtenerIngresosDocconsolidados(
                            $iddoc, $value ['idnae'], $start, $limit
            );
            $resultNae[$key]['totalog'] = $og[0]['SUM'];
            $resultNae[$key]['totalrf'] = $rf[0]['SUM'];
        }


        $resultGastos = DatAnteproyectonae::obtenerGastosDoc(
                        $iddoc, $idnae, $start, $limit
        );
        $total = DatAnteproyectonae::obtenerCantGastosDoc($iddoc, $idnae);
        foreach ($resultGastos as $key => $value) {
            $objgasto = NomObjetogasto::obtenerOG(
                            $resultGastos [$key] ['idobjetogasto']
            );
            $resultGastos [$key] ['codigoobjetogasto'] = $objgasto [0] ['codigo'];
            $resultGastos [$key] ['denominacionobjgasto'] = $objgasto [0] ['denominacion'];
        }


        $resultIngresos = DatAnteproyectonae::obtenerIngresosDoc(
                        $iddoc, $idnae, $start, $limit
        );
        $total = DatAnteproyectonae::obtenerCantIngresosDoc($iddoc, $idnae);
        foreach ($resultIngresos as $key => $value) {
            $objgasto = NomRecursofinanciero::obtenerRFDadoId(
                            $resultIngresos [$key] ['idingreso']
            );
            $resultIngresos [$key] ['codigoingreso'] = $objgasto [0] ['codigo'];
            $resultIngresos [$key] ['denominacioningreso'] = $objgasto [0] ['denominacion'];
        }
        $tabla = '<table border="1">
            <thead>
                <tr></tr>
                <tr>
                    <td colspan="11"><b>Codigo: </b> ' . $cod[1]
                . ' &nbsp;&nbsp;&nbsp; <b>Tipo: </b> ' . $tipo
                . ' &nbsp;&nbsp;&nbsp;<b>Especialidad: </b> ' . $esp[1]
                . ' &nbsp;&nbsp;&nbsp; <b>Numero: </b> ' . $numero
                . '&nbsp;&nbsp;&nbsp; <b>Version: </b> ' . $version
                . ' &nbsp;&nbsp;&nbsp; <b>Fecha: </b> ' . $fecha
                . '&nbsp;&nbsp;&nbsp; <b>Estado: </b> ' . $estado . ' <br></td>
                </tr>
                <tr></tr>
                <tr></tr>
            </thead>
            <tbody>
            <td <b>NAE</b></td>
                <tr>
                    <th>C&oacute;digo</th>
                    <th>Denominaci&oacute;n</th>
                    <th>Total OG</th>
                    <th>Total RF</th>
                </tr>';
        foreach ($resultNae as $key => $valueNae) {

            $valueNae['totalog'] = number_format(
                    $valueNae['totalog'], '3', '.', ','
            );
            $valueNae['totalrf'] = number_format(
                    $valueNae['totalrf'], '3', '.', ','
            );
            $tabla
                    .= '<tr>
                                <td>' . $valueNae['codigo'] . '</td>
                                <td>' . $valueNae['denominacion'] . '</td>
                                <td>' . $valueNae['totalog'] . '</td>
                                <td>' . $valueNae['totalrf'] . '</td>
                           </tr>';
        }
        $tabla
                .= '<tr>
                <td <b>Ingresos</b></td>
                <tr>
                    <th>C&oacute;digo</th>
                    <th>Denominaci&oacute;n</th>
                    <th>NAE</th>
                    <th>Entidad</th>
                    <th>Ejecuci&oacute;n a&ntilde;o anterior</th>
                    <th>Presupuesto a&ntilde;o actual</th>
                    <th>Estimado a&ntilde;o actual</th>
                    <th>Solicitud Ejercicio de Planificaci&oacute;n</th>
                </tr>';
        foreach ($resultIngresos as $key => $valueIngresos) {
            $valueIngresos['ejecucionanterior'] = number_format(
                    $valueIngresos['ejecucionanterior'], '3', '.', ','
            );
            $valueIngresos['presupuestoactual'] = number_format(
                    $valueIngresos['presupuestoactual'], '3', '.', ','
            );
            $valueIngresos['estimadoactual'] = number_format(
                    $valueIngresos['estimadoactual'], '3', '.', ','
            );
            $valueIngresos['planificacion'] = number_format(
                    $valueIngresos['planificacion'], '3', '.', ','
            );
            $denominacionNae = NomNae::obtenerNAEsDadoIds(
                            $valueIngresos['DatAnteproyectonae']['idnae']
            );

            $estructura = $datosEntidad = $this->integrator->metadatos->DameEstructura(
                    $valueIngresos['DatAnteproyectonae']['DatAnteproyecto']['identidad']
            );

            $tabla
                    .= '<tr>

                                    <td>' . $valueIngresos['codigoingreso'] . '</td>
                                    <td>'
                    . $valueIngresos['denominacioningreso'] . '</td>
                <td>' . $denominacionNae[0]['denominacion'] . '</td>
                 <td>' . $estructura[0]->denominacion . '</td>
                                    <td>' . $valueIngresos['ejecucionanterior']
                    . '</td>
                                    <td>' . $valueIngresos['presupuestoactual']
                    . '</td>
                                    <td>' . $valueIngresos['estimadoactual'] . '</td>
                                    <td>' . $valueIngresos['planificacion'] . '</td>
                               </tr>';
        }
        $tabla
                .= '<tr>
                    <td <b>Gastos</b></td>
                <tr>
                    <th>Objeto de gastos</th>
                    <th>Denominaci&oacute;n</th>
                    <th>NAE</th>
                    <th>Entidad</th>
                    <th>Ejecuci&oacute;n a&ntilde;o anterior</th>
                    <th>Presupuesto a&ntilde;o actual</th>
                    <th>Estimado a&ntilde;o actual</th>
                    <th>Solicitud Ejercicio de Planificaci&oacute;n</th>
                </tr>';

        foreach ($resultGastos as $key => $valueGastos) {

            $valueGastos['ejecucionanterior'] = number_format(
                    $valueGastos['ejecucionanterior'], '3', '.', ','
            );
            $valueGastos['presupuestoactual'] = number_format(
                    $valueGastos['presupuestoactual'], '3', '.', ','
            );
            $valueGastos['estimadoactual'] = number_format(
                    $valueGastos['estimadoactual'], '3', '.', ','
            );
            $valueGastos['planificacion'] = number_format(
                    $valueGastos['planificacion'], '3', '.', ','
            );

            $denominacionNae = NomNae::obtenerNAEsDadoIds(
                            $valueGastos['DatAnteproyectonae']['idnae']
            );
            $estructura = $datosEntidad = $this->integrator->metadatos->DameEstructura(
                    $valueIngresos['DatAnteproyectonae']['DatAnteproyecto']['identidad']
            );
            $tabla
                    .= '<tr>
                                    <td>' . $valueGastos['codigoobjetogasto'] . '</td>
                                    <td>'
                    . $valueGastos['denominacionobjgasto'] . '</td>
                <td>' . $denominacionNae[0]['denominacion'] . '</td>
                <td>' . $estructura[0]->denominacion . '</td>
                                    <td>' . $valueGastos['ejecucionanterior'] . '</td>
                                    <td>' . $valueGastos['presupuestoactual'] . '</td>
                                    <td>' . $valueGastos['estimadoactual'] . '</td>
                                    <td>' . $valueGastos['planificacion'] . '</td>
                               </tr>';
        }
        $tabla
                .= '
            </tbody>
        </table>';
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=documentos.xls");
        header("Content-Transfer-Encoding: binary ");
        echo $tabla;
    }

    public function guardarconceptodocAction() {
        $iddocumento = $this->_request->getPost('iddocumento');
        $idconcepto = $this->_request->getPost('idconcepto');
        $identidad = $this->global->Estructura->idestructura;
        $doc = DatAnteproyecto::obtenerAnteproyectoDadoId($iddocumento);
        $conceptoespecialidad = DatConceptoespecialidad::obtenerConceptoEspecialidadDadoIdConceptoIdEntidad(
                        $idconcepto, $identidad
        );
        $doc->idconceptoespecialidad = $conceptoespecialidad[0]['idconceptoespecialidad'];
        $doc = DatAnteproyectoModel::insertardatAnteproyecto($doc);
        echo json_encode($doc->idanteproyecto);
    }

    public function exportarPresupuestoAction() {
        $parametros->idreporte = $this->_request->getParam('tipoReporte');
        $parametros->identidad = $this->_request->getParam('identidad');
        $parametros->denomentidad = $this->_request->getParam('denomentidad');
        $idnae = $this->_request->getParam('idNae');
        $parametros->partidas = $this->_request->getParam('partidas');
        $parametros->resumen = $this->_request->getParam('resumen');
        $parametros->general = $this->_request->getParam('general');
        $parametros->recursos = $this->_request->getParam('recursos');
        $parametros->gastos = $this->_request->getParam('gastos');
        $parametros->idejercicio = $this->_request->getParam('idejercicio');
        $parametros->denomejercicio = $this->_request->getParam(
                'denomejercicio'
        );

        $parametros->entidades = DatActividadentidad::auxObtenerEntidadesHijasComun(
                        $parametros->identidad
        );
        $parametros->entidadesSeparadas = implode(',', $parametros->entidades);


        if ($idnae == "") {
            $idnaes = NomNae::obtenerTodasNaes();
            foreach ($idnaes as $valor) {
                $parametros->naes[] = $valor['idnae'];
            }
            $parametros->idnae = implode(',', $parametros->naes);
        } else {
            $parametros->idnae = $idnae;
            $parametros->naes = explode(',', $idnae);
        }

        if ($parametros->partidas == "" && $parametros->recursos == "") {
            //$idgastos = NomObjetogasto::obtenerTodosObjetosGastos();
            $idgastos = NomObjetogasto::obtenerObjetosDeGastos();
            foreach ($idgastos as $valor) {
                $parametros->idgastos[] = $valor['idobjetogasto'];
            }
            $parametros->idgasto = implode(',', $parametros->idgastos);

            $idrecursos = NomRecursofinanciero::obtenerTodosRecursosFinancieros();
            foreach ($idrecursos as $valor) {
                $parametros->idrecursos[] = $valor['idrecursofinanciero'];
            }
            $parametros->idrecurso = implode(',', $parametros->idrecursos);
        } else if ($parametros->partidas != "" && $parametros->recursos == "") {
            $cont = 0;
            $partidas = explode(",", $parametros->partidas);
            foreach ($partidas as $valor1) {
                $result = NomObjetogasto::obtenerObjetosGastosDadoPadre($valor1);
                foreach ($result as $valor2) {
                    $resultGastos[$cont] = $valor2['idobjetogasto'];
                    $cont++;
                }
            }
            $parametros->idgasto = implode(',', $resultGastos);
        } else if ($parametros->partidas == "" && $parametros->recursos != "") {
            $parametros->idrecurso = $parametros->recursos;
        }


        $objDatAntPro = new DatAnteproyectoModel();
        $objDatAntPro->exportarPorPartidas($parametros);
    }

    public function listarTodasNaeAction() {
        $datosnaes->data = NomNae::obtenerTodasNaes();
        foreach ($datosnaes->data as $key => $value) {
            $datosnaes->data[$key]['denominacion'] = $value['codigo'] . ' '
                    . $value['denominacion'];
        }
        echo json_encode($datosnaes);
    }

    public function listarTodosRecursosFinanAction() {
        $datosrecursos->data = NomRecursofinanciero::obtenerTodosRecursosFinancieros();
        foreach ($datosrecursos->data as $key => $value) {
            $datosrecursos->data[$key]['denominacion'] = $value['codigo'] . ' '
                    . $value['denominacion'];
        }
        echo json_encode($datosrecursos);
    }

    public function listarTodosObjetosGastosAction() {
        $partidas = json_decode(stripslashes($this->_request->getPost('partidas')));
        $arrayPartidas = explode(',', $partidas);
        if ($partidas != null) {
            $datosgastos->data = NomObjetogasto::obtenerObjetosGastosDadoPadre($partidas);
            foreach ($datosgastos->data as $key => $value) {
                $datosgastos->data[$key]['denominacion'] = $value['codigo'] . ' ' . $value['denominacion'];
            }
        } else {
            //$datosgastos->data = NomObjetogasto::obtenerTodosObjetosGastos();
            $datosgastos->data = NomObjetogasto::obtenerObjetosDeGastos();
            foreach ($datosgastos->data as $key => $value) {
                $datosgastos->data[$key]['denominacion'] = $value['codigo'] . ' ' . $value['denominacion'];
            }
        }

        echo json_encode($datosgastos);
    }

    public function listarTodasLasPartidasPadresAction() {
        $objModel = new DatAnteproyectoModel();
        $resultado = $objModel->listarTodasLasPartidasPadresGastos($mostrarCodigo = false);

        echo json_encode($resultado);
    }

    public function comprobarDatosAction() {
        $parametros->identidad = $this->_request->getParam('identidad');
        $idnae = $this->_request->getParam('idNae');
        $parametros->partidas = $this->_request->getParam('partidas');
        $parametros->recursos = $this->_request->getParam('recursos');
        $parametros->idejercicio = $this->_request->getParam('idejercicio');
        $parametros->resumen = $this->_request->getParam('resumen');
        $parametros->gastos = $this->_request->getParam('gastos');
        $parametros->entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros->identidad);
        $parametros->entidadesSeparadas = implode(',', $parametros->entidades);

        if ($idnae == "") {
            $idnaes = NomNae::obtenerTodasNaes();
            foreach ($idnaes as $valor) {
                $parametros->naes[] = $valor['idnae'];
            }
            $parametros->idnae = implode(',', $parametros->naes);
        } else {
            $parametros->idnae = $idnae;
            $parametros->naes = explode(',', $idnae);
        }

        if ($parametros->partidas == "" && $parametros->recursos == "") {
            //$idgastos = NomObjetogasto::obtenerTodosObjetosGastos();
            $idgastos = NomObjetogasto::obtenerObjetosDeGastos();
            foreach ($idgastos as $valor) {
                $parametros->idgastos[] = $valor['idobjetogasto'];
            }
            $parametros->idgasto = implode(',', $parametros->idgastos);

            $idrecursos = NomRecursofinanciero::obtenerTodosRecursosFinancieros();
            foreach ($idrecursos as $valor) {
                $parametros->idrecursos[] = $valor['idrecursofinanciero'];
            }
            $parametros->idrecurso = implode(',', $parametros->idrecursos);

            $datosPintarGasto = DatAnteproyecto::obtenerObjGastoParaPintar($parametros);

            $datosPintarRecurso = DatAnteproyecto::obtenerObjRecursoParaPintar($parametros);

            if (count($datosPintarGasto) == 0 && count($datosPintarRecurso) == 0) {
                echo json_encode(array('result' => 1));
            } else {
                echo json_encode(array('result' => 2));
            }
        } else if ($parametros->partidas != "" && $parametros->recursos == "") {
            $cont = 0;
            $partidas = explode(",", $parametros->partidas);
            foreach ($partidas as $valor1) {
                $result = NomObjetogasto::obtenerObjetosGastosDadoPadre($valor1);
                foreach ($result as $valor2) {
                    $resultGastos[$cont] = $valor2['idobjetogasto'];
                    $cont++;
                }
            }

            $parametros->idgasto = implode(',', $resultGastos);

            $datosPintarGasto = DatAnteproyecto::obtenerObjGastoParaPintar($parametros);

            if (count($datosPintarGasto) == 0) {
                echo json_encode(array('result' => 1));
            } else {
                echo json_encode(array('result' => 2));
            }
        } else if ($parametros->partidas == "" && $parametros->recursos != "") {
            $parametros->idrecurso = $parametros->recursos;

            $datosPintarRecurso = DatAnteproyecto::obtenerObjRecursoParaPintar($parametros);

            if (count($datosPintarRecurso) == 0) {
                echo json_encode(array('result' => 1));
            } else {
                echo json_encode(array('result' => 2));
            }
        }
    }

    public function exportarIngresosPlanificadosRealAction() {
        $parametros->identidad = $this->_request->getParam('identidad');
        $parametros->idejercicio = $this->_request->getParam('idejercicio');
        $parametros->entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros->identidad);
        $parametros->entidadesseparadas = implode(",", $parametros->entidades);

        $objPdf = new GenerarPdfIngresosPlanificadosReal($parametros);
        $objPdf->export();
    }

}
