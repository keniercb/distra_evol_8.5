<?php

$dirWww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirRelMt = "/";
//Direccion absoluta del marco de trabajo
$dirAbsMt = str_replace(
        "//", "/", dirname($dirWww . "..") . "/" . $dirRelMt
);
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
 * Created by PhpStorm.
 * User: madrid
 * Date: 15/01/2016
 * Time: 10:27
 */
class ControlejecuciondemandaController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function controlejecuciondemandaAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function cargarEntidadesAction() {
        $valor = $this->_request->getParam('valor');
        $cbmodel = new DatDocumentoaprobacioModel();
        $data = $cbmodel->listarAprobaciones();

        if ($valor != null) {
            foreach ($data as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($data[$key]);
                }
            }
            $res = array();
            $i = 0;
            foreach ($data as $key => $val) {
                $res[$i++] = $val;
            }
        }
        if ($res != null) {
            $data = $res;
        }

        echo json_encode($data);
    }

    //Lista los ejercicios de la planificación
    public function getEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    //Lista los planes por los que un arreglo de entidades tiene indicadores planificados en un ejercicio
    public function listarComboModelosAction() {
        ini_set("max_execution_time", 3600);
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        // if ($this->_request->getPost('isLeaf') == 1) {
        //    $parametros['hijosentidad'][] = $parametros['identidad'];
        // } else {
        //    if ($this->_request->getPost('isLeaf') == 0) {
        $parametros['hijosentidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros['identidad']);
        //    }
        //  }
        $parametros['uri'] = $this->_request->getPost('uri');

        $cbmodel = new DatPlanModel();
        $data = $cbmodel->obtenerPlanesEntidadPlanif($parametros);
        echo json_encode(array('data' => $data));
    }

    //Lista los niveles de actividad mayores que cero dada una entidad y un ejercicio
    public function listarNivelesActAction() {
        ini_set("max_execution_time", 600);
        $params = array();
        $params['esrector'] = $this->_request->getPost('esrector');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params ['idEstructuraPadre'] = $this->_request->getPost(
                'idEstructuraPadre'
        );
        $global = ZendExt_GlobalConcept::getInstance();
        if ($this->_request->getPost('idespecialidad') != '') {
            $params['idespecialidad'] = $this->_request->getPost(
                    'idespecialidad'
            );
        } else {
            $params['idespecialidad'] = $global->Estructura->idespecialidad;
        }
        $params['identidad'] = $this->_request->getPost('identidad');
        if ($params ['idEstructuraPadre'] == 'undefined') {
            $params ['idEstructuraPadre'] = $params['identidad'];
        }
        $isLeaf = $this->_request->getPost('is_leaf');
        if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0'
        ) {
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = $this->_request->getPost('start');
            $params['limit'] = $this->_request->getPost('limit');

            $modelContEjecPlan = new ControlejecuciondemandaModel();
            $security = ZendExt_Aspect_Security_Sgis::getInstance();

            if ($isLeaf == 1) {
                $params['entidades'] = array('0' => $params['identidad']);
                $datosEntidad = $this->integrator->metadatos->DameEstructura(
                        $params['identidad']
                );
                $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;
                if ($params['esrector'] == 'true') {
                    $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
                }
                $result = $modelContEjecPlan->listarNivelesAct($params);
                if ($result == -1) {
                    $data->data = array();
                    echo json_encode($data);
                } else {
                    echo json_encode($result);
                }
            } else {
                $idestructura = $this->integrator->metadatos->DameEstructura(
                        $params['identidad']
                );
                $modeloActEnt = new DatActividadentidad();
                $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $idestructura[0]->idestructura
                );
                if ($params['entidades'] [0] != null) {
                    $params['id_especialidades'] = array();
                    foreach ($params['entidades'] as $key => $valorIdentidad) {
                        $tempEspecialidades = 0;
                        $entidades[] = $this->integrator->metadatos->DameEstructura(
                                $valorIdentidad
                        );
                        foreach ($params['id_especialidades'] as $esp) {
                            if ($esp == $entidades [$key][0]->idespecialidad) {
                                $tempEspecialidades = 1;
                            }
                        }
                        if ($tempEspecialidades == 0) {
                            $params['id_especialidades'] [] = $entidades [$key][0]->idespecialidad;
                        }
                    }
                    $result = $modelContEjecPlan->listarNivelesAct($params);
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
                            'mensaje' => 'Su secci&oacute;n ha expirado, por favor reinicie el sistema.')
                );
            }
        }
    }

    //Lista los indicadores con cantidad mayor que cero dada una entidad, un plan y un ejercicio
    public function listarIndicadoresAction() {
        ini_set("max_execution_time", 600); //10min de conexion
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['codigo'] = $this->_request->getPost('codigo');

        switch ($parametros['codigo']) {
            case 1:
                //Listar los indicadores planificados
                $datos = ControlejecuciondemandaModel::listarIndEjec($parametros);

                foreach ($datos->data as $k => $d) {
                    //obtiene la unidad de medida
                    $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                            Array($d['idunidadmedida'])
                    );
                    $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
                }
                break;
            case 2:
                //Listar los indicadores fuera de plan
                $datos = ControlejecuciondemandaModel::listarDesvAdicionesPlan(
                                $parametros
                );

                foreach ($datos->data as $k => $d) {
                    //obtiene la unidad de medida
                    $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                            Array($d['idumedida'])
                    );
                    $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
                    $datos->data[$k]['importeejecutado'] = round($datos->data[$k]['importeejecutado'], 2);
                    $datos->data[$k]['precioejecutado'] = round($datos->data[$k]['precioejecutado'], 2);
                }
                break;
            case 3:
                // Listar las desviaciones
                $datos = ControlejecuciondemandaModel::listarDesvPlan($parametros);



                foreach ($datos->data as $k => $d) {
                    //obtiene la unidad de medida
                    $industituidos = DatDesviacionplanDemanda::listarindSust($d['idplanificacion']);
                    $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                            Array($d['idumedida'])
                    );
                    $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
                    $datos->data[$k]['sustituidos'] = $industituidos;
                    $datos->data[$k]['importeejecutado'] = round($datos->data[$k]['importeejecutado'], 2);
                    $datos->data[$k]['precioejecutado'] = round($datos->data[$k]['precioejecutado'], 2);
                }
                break;
        }



        echo json_encode($datos);
    }

    //Lista la cantidad real de la ejecución dado un idplanificación
    public function listarEjecucionPlanAction() {
        $parametros['idplanificacion'] = $this->_request->getPost('idplanif');
        $parametros['idindicador'] = $this->_request->getPost('idindicador');
        $parametros['iddesviacionplandemanda'] = $this->_request->getPost('iddesviacionplandemanda');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['codigo'] = $this->_request->getPost('codigo');

        switch ($parametros['codigo']) {
            case 1:
                $datos = ControlejecuciondemandaModel::listarEjecucionPlan($parametros);

                break;
            case 2:
                $datos = ControlejecuciondemandaModel::listarEjecucionAdicion($parametros);
                break;
            case 3:
                $datos = ControlejecuciondemandaModel::listarEjecucionDesviacion($parametros);
                break;
        }
        echo json_encode($datos);
    }

    //Lista la cantidad real de la ejecución dado un idactividadentidad
    public function listarEjecucionNivelesAction() {
        $parametros['idactividad'] = $this->_request->getPost(
                'idactividad'
        );
        $parametros['identidad'] = $this->_request->getPost(
                'identidad'
        );
        $parametros['idejercicio'] = $this->_request->getPost(
                'idejercicio'
        );
        $modeloActEnt = new DatActividadentidad();
        $parametros['idactividadentidad'] = DatActividadentidad::BuscarIdactividadEntidades1(
                        $parametros['identidad'], $parametros['idactividad'], $parametros['idejercicio']
        );
        $parametros['idactividadentidad'] = $parametros['idactividadentidad'][0]['idactividadentidad'];

        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['filtros'] = $this->_request->getPost('filtros');

        $datos = ControlejecuciondemandaModel::listarEjecucionNiveles(
                        $parametros
        );

        echo json_encode($datos);
    }

    //Lista la desviación de la ejecución dado un idplanificación
    public function listarDesvPlanAction() {
        $parametros['idplanificacion'] = json_decode(
                stripslashes($this->_request->getPost('idplanif'))
        );
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['filtros'] = $this->_request->getPost('filtros');

        $datos = ControlejecuciondemandaModel::listarDesvPlan($parametros);

        foreach ($datos->data as $k => $d) {
            //obtiene la unidad de medida
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($d['idumedida'])
            );
            $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
            $datos->data[$k]['importeejecutado'] = round($datos->data[$k]['importeejecutado'], 2);
            $datos->data[$k]['precioejecutado'] = round($datos->data[$k]['precioejecutado'], 2);
        }
        echo json_encode($datos);
    }

    //Lista la cantidad real de la ejecución dado un idactividadentidad
    public function listarDesvNivelesAction() {
        $parametros['idactividades'] = json_decode(
                stripslashes($this->_request->getPost('idactividades'))
        );

        $parametros['identidad'] = $this->_request->getPost(
                'identidad'
        );

        $parametros['idejercicio'] = $this->_request->getPost(
                'idejercicio'
        );

        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['filtros'] = $this->_request->getPost('filtros');

        $datos = ControlejecuciondemandaModel::listarDesvNiveles($parametros);

        echo json_encode($datos);
    }

    //Lista las actividades para adicionar una desviacion
    public function listarActAddDesviacionAction() {
        $parametros['idactividades'] = json_decode(
                stripslashes($this->_request->getPost('idactividades'))
        );

        $parametros['identidad'] = $this->_request->getPost(
                'identidad'
        );

        $parametros['idejercicio'] = $this->_request->getPost(
                'idejercicio'
        );

        $parametros['filtros'] = $this->_request->getPost(
                'filtros'
        );
        $datosentidad = $this->integrator->metadatos->DameEstructura(
                $parametros['identidad']
        );
        $parametros['idespecialidad'] = $datosentidad[0]->idespecialidad;

        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');

        $model = new ControlejecuciondemandaModel();

        echo json_encode(
                $model->listarActAddDesviacionModel($parametros)
        );
    }

    //Lista las actividades desviadas por el concepto de adición
    public function listarActDesviacionAdicionAction() {
        $parametros['idejercicio'] = $this->_request->getPost(
                'idejercicio'
        );

        $parametros['identidad'] = $this->_request->getPost(
                'identidad'
        );

        $parametros['start'] = $this->_request->getPost(
                'start'
        );

        $parametros['limit'] = $this->_request->getPost(
                'limit'
        );

        $parametros['filtros'] = $this->_request->getPost(
                'filtros'
        );

        $model = new ControlejecuciondemandaModel();
        echo json_encode(
                $model->listarAdicNivelesModel($parametros)
        );
    }

    //Inserta la cantidad real de la ejecución dado un idplanificación
    public function insertarEjecPlanAction() {
        $params['idplanificacion'] = $this->_request->getPost(
                'idplanificacion'
        );
        $params['ejec'] = json_decode(
                stripslashes($this->_request->getPost('ejec'))
        );

        $params['eliminar'] = json_decode(
                stripslashes($this->_request->getPost('eliminar'))
        );

        $params['idusuario'] = $this->global->Perfil->idusuario;


        $params['iddesviacionplandemanda'] = $this->_request->getPost('iddesviacionplandemanda');
        $params['codigo'] = $this->_request->getPost('codigo');

        switch ($params['codigo']) {
            case 1:
                $datos = ControlejecuciondemandaModel::insertarEjecPlan($params);

                break;
            case 2:
                //Listar los indicadores fuera de plan
                $datos = ControlejecuciondemandaModel::insertarEjecfueradePlanyDesv(
                                $params
                );


                break;
            case 3:
                // Listar las desviaciones
                $datos = ControlejecuciondemandaModel::insertarEjecfueradePlanyDesv($params);

                break;
        }

        echo json_encode($datos);
    }

    //Insertar la contratacion de los indicadores
    public function insertarContratacionAction() {

        $params['modificados'] = json_decode(
                stripslashes($this->_request->getPost('modificados'))
        );
        $params['codigo'] = $this->_request->getPost('codigo');
        $result = ControlejecuciondemandaModel::insertarContratacion($params);
        /* switch ($params['codigo']) {
          case 1:
          $result=  ControlejecuciondemandaModel::insertarContratacion($params);
          break;
          case 2:

          $result=  ControlejecuciondemandaModel::insertarContPlandirecto($params);

          break;
          case 3:
          $datos = listarDesviacion();
          break;

          } */


        echo json_encode($result);
    }

    //Inserta la cantidad real de la ejecución dado un idactividadentidad
    public function insertarEjecNivAction() {
        $params['ejec'] = json_decode(
                stripslashes($this->_request->getPost('ejec'))
        );

        $params['eliminar'] = json_decode(
                stripslashes($this->_request->getPost('eliminar'))
        );
        $params['idactividad'] = $this->_request->getPost(
                'idactividad'
        );
        $params['identidad'] = $this->_request->getPost(
                'identidad'
        );
        $params['idejercicio'] = $this->_request->getPost(
                'idejercicio'
        );
        $modeloActEnt = new DatActividadentidad();
        $params['idactividadentidad'] = DatActividadentidad::BuscarIdactividadEntidades1(
                        $params['identidad'], $params['idactividad'], $params['idejercicio']
        );
        $params['idactividadentidad'] = $params['idactividadentidad'][0]['idactividadentidad'];
        $params['idusuario'] = $this->global->Perfil->idusuario;

        echo json_encode(
                ControlejecuciondemandaModel::insertarEjecNiv($params)
        );
    }

    //Inserta la desviacion de la ejecución dado un idplanificación
    public function insertarDesvPlanAction() {
        $params['ejec'] = json_decode(
                stripslashes($this->_request->getPost('ejec'))
        );
        $params['eliminar'] = json_decode(
                stripslashes($this->_request->getPost('eliminar'))
        );
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['adicion'] = $this->_request->getPost('adicion');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        echo json_encode(
                ControlejecuciondemandaModel::insertarDesvPlanSust($params)
        );
    }

    public function insertarFueradePlanAction() {
        $params['indicadores'] = json_decode(
                stripslashes($this->_request->getPost('indicadores'))
        );
        $params['idsplanificacion'] = json_decode(
                stripslashes($this->_request->getPost('idsplanificacion'))
        );
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $params['codigo'] = $this->_request->getPost('codigo');
        echo json_encode(
                ControlejecuciondemandaModel::insertarFueradePlan($params)
        );
    }

    //Inserta la desviacion real de la ejecución dado un idactividadentidad
    public function insertarDesvNivAction() {
        $params['ejec'] = json_decode(
                stripslashes($this->_request->getPost('ejec'))
        );

        $params['eliminar'] = json_decode(
                stripslashes($this->_request->getPost('eliminar'))
        );
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['identidad'] = $this->_request->getPost('identidad');
        $datosentidad = $this->integrator->metadatos->DameEstructura(
                $params['identidad']
        );

        $params['espcomp'] = $datosentidad[0]->idespecialidad;
        $params['idusuario'] = $this->global->Perfil->idusuario;
        echo json_encode(ControlejecuciondemandaModel::insertarDesvNiv($params));
    }

    //Lista los indicadores para adicionar una desviación
    public function listarIndAddDesviacionAction() {
        $parametros['idindicadores'] = json_decode(
                stripslashes($this->_request->getPost('idindicadores'))
        );
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['filtros'] = $this->_request->getPost('filtros');

        $datos = ControlejecuciondemandaModel::listarIndAddDesviacion(
                        $parametros
        );

        foreach ($datos->data as $k => $d) {
            //obtiene la unidad de medida
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($d['idumedida'])
            );
            $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
        }

        echo json_encode($datos);
    }

    //Lista los indicadores para adicionar una desviacion por adicion
    public function listarIndAddDesviacionAdicionAction() {
        $parametros['idindicadores'] = json_decode(
                stripslashes($this->_request->getPost('idindicadores'))
        );
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['filtros'] = json_decode(
                stripslashes($this->_request->getPost('filtrosD'))
        );
        $datos = ControlejecuciondemandaModel::listarIndAddDesviacionAdicion(
                        $parametros
        );

        foreach ($datos->data as $k => $d) {
            //obtiene la unidad de medida
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($d['idumedida'])
            );
            $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
        }

        echo json_encode($datos);
    }

    //Lista las desviacion por adicion
    public function listarDesvAdicionesPlanAction() {
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['filtros'] = $this->_request->getPost('filtros');

        $datos = ControlejecuciondemandaModel::listarDesvAdicionesPlan(
                        $parametros
        );

        foreach ($datos->data as $k => $d) {
            //obtiene la unidad de medida
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($d['idumedida'])
            );
            $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
            $datos->data[$k]['importeejecutado'] = round($datos->data[$k]['importeejecutado'], 2);
            $datos->data[$k]['precioejecutado'] = round($datos->data[$k]['precioejecutado'], 2);
        }
        echo json_encode($datos);
    }

    //Gráfica ejecución global x entidad
    public function graficaEjecucionglobalxentidadAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'] [] = $identidad;
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
            }
        }
        $data = ControlejecuciondemandaModel::graficaEjecucionglobalxentidad(
                        $parametros
        );
        if ($parametros['tipo'] == 'plan') {
            $datos = array();
            $datos[] = (double) $data[0]['importeplan'];
            $datos[] = (double) $data[0]['importeejecutado'];
            $datos[] = (double) $data[0]['importependiente'];
        } else {
            if ($parametros['tipo'] == 'activ') {
                $datos = array();
                $datos[] = (double) $data[0]['nivel'];
                $datos[] = (double) $data[0]['nivelejecutado'];
                $datos[] = (double) $data[0]['pendiente'];
            }
        }
        $categorias = array();
        $categorias[] = 'Planificado';
        $categorias[] = 'Ejecutado';
        $categorias[] = 'Pendiente';

        echo json_encode(array('data' => $datos, 'categorias' => $categorias));
    }

    //Gráfica ejecución global x entidad (Ingreso/Gasto)
    public function graficaEjecucionglobalxentidadIngresoGastoAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'] [] = $identidad;
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
            }
        }
        $data = ControlejecuciondemandaModel::graficaEjecucionglobalxentidadIngresoGasto(
                        $parametros
        );

        $datos = array();
        $datos[] = (double) $data[0]['ingreso'];
        $datos[] = (double) $data[0]['gastos'];
        $datos[] = (double) $data[0]['diferencia'];

        $categorias = array();
        $categorias[] = 'Ingresos';
        $categorias[] = 'Gastos';
        $categorias[] = 'Diferencia';

        echo json_encode(array('data' => $datos, 'categorias' => $categorias));
    }

    //Gráfica ejecución global x entidad x plan
    public function graficaEjecucionglobalxentidadxplanAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $idsmodelos = $this->_request->getPost('idsmodelos');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'] [] = $identidad;
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
            }
        }
        if ($idsmodelos != null && $idsmodelos != '') {
            $parametros['addcondicion'] = "AND em.idmodelo IN($idsmodelos)";
        } else {
            $parametros['addcondicion'] = "";
        }
        $data = ControlejecuciondemandaModel::graficaEjecucionglobalxentidadxplan(
                        $parametros
        );
        $datos = array();
        $datos[] = (double) $data[0]['importeplan'];
        $datos[] = (double) $data[0]['importeejecutado'];
        $datos[] = (double) $data[0]['importesustitucion'];
        $datos[] = (double) $data[0]['importeadicion'];
        $datos[] = (double) $data[0]['importetotalejecutado'];

        $categorias = array();
        $categorias[] = 'Planificado';
        $categorias[] = 'Ejecutado por plan';
        $categorias[] = 'Ejecutado por sustitución';
        $categorias[] = 'Ejecutado por adición';
        $categorias[] = 'Total ejecutado';

        echo json_encode(array('data' => $datos, 'categorias' => $categorias));
    }

    //Gráfica ejecución global x entidad x clasificación del plan
    public function graficaEjecucionglobalxentidadxClasifplanAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'] [] = $identidad;
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
            }
        }
        $parametros['uri'] = $this->_request->getPost('uri');

        $result = ControlejecuciondemandaModel::graficaEjecucionglobalxentidadxClasifplan(
                        $parametros
        );

        echo json_encode(
                array('data' => $result[0], 'categorias' => $result[1])
        );
    }

    //Gráfica ejecución x entidad x trimestres
    public function graficaEjecucionglobalxentidadxtrimestreAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        $parametros['tipo'] = $this->_request->getPost('tipo');

        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'] [] = $identidad;
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
            }
        }
        $parametros['addcondicion'] = '';

        $result = ControlejecuciondemandaModel::graficaEjecucionglobalxentidadxtrimestre(
                        $parametros
        );

        echo json_encode(
                array('data' => $result[0], 'categorias' => $result[1])
        );
    }

    //Gráfica ejecución x entidad x plan x trimestres
    public function graficaEjecucionglobalxentidadxplanxtrimestreAction() {
        $identidad = $this->_request->getPost('identidad');
        $idsmodelos = $this->_request->getPost('idsmodelos');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        $parametros['tipo'] = 'plan';

        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'] [] = $identidad;
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
            }
        }
        if ($idsmodelos != null && $idsmodelos != '') {
            $parametros['addcondicion'] = "AND em.idmodelo IN($idsmodelos)";
        } else {
            $parametros['addcondicion'] = "";
        }

        $parametros['uri'] = $this->_request->getPost('uri');

        $result = ControlejecuciondemandaModel::graficaEjecucionglobalxentidadxtrimestre(
                        $parametros
        );

        echo json_encode(
                array('data' => $result[0], 'categorias' => $result[1])
        );
    }

    //Gráfica ejecución x entidad x meses
    public function graficaEjecucionglobalxentidadxplanxmesesAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $parametros['uri'] = $this->_request->getPost('uri');

        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'][] = $identidad;
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
            }
        }


        $result = ControlejecuciondemandaModel::graficaEjecucionglobalxentidadxmeses(
                        $parametros
        );

        echo json_encode(
                array('data' => $result[0], 'categorias' => $result[1])
        );
    }

    //Gráfica ejecución de indicadores más valiosos
    public function graficaEjecucionMasValiososAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $parametros['uri'] = $this->_request->getPost('uri');
        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'] [] = $identidad;
            if ($parametros['tipo'] == 'activ') {

                $aux = $this->integrator->metadatos->DameEstructura(
                        $identidad
                );
                $parametros['id_especialidades'] [] = $aux[0]->idespecialidad;
            }
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
                if ($parametros['tipo'] == 'activ') {
                    $parametros['id_especialidades'] = array();
                    foreach (
                    $parametros['identidad'] as $key => $valorIdentidad
                    ) {
                        $tempEspecialidades = 0;
                        $entidades[] = $this->integrator->metadatos->DameEstructura(
                                $valorIdentidad
                        );
                        foreach ($parametros['id_especialidades'] as $esp) {
                            if ($esp == $entidades [$key][0]->idespecialidad) {
                                $tempEspecialidades = 1;
                            }
                        }
                        if ($tempEspecialidades == 0) {
                            $parametros['id_especialidades'] [] = $entidades [$key][0]->idespecialidad;
                        }
                    }
                    $arraysalida = array_filter(
                            $parametros['id_especialidades']
                    );
                    if (empty($arraysalida)) {
                        return -1;
                    }
                    $parametros['id_especialidades'] = $arraysalida;
                }
            }
        }
        $dat = ControlejecuciondemandaModel::graficaEjecucionMasValiosos(
                        $parametros
        );

        foreach ($dat as $key => $value) {
            $categorias[$key] = $value['denominacion'];
            $importeplan[$key] = (double) $value['importeplan'];
            $importeejecutado[$key] = (double) $value['importeejecutado'];
        }

        $data = Array(
            array(
                "name" => 'Plan',
                "data" => $importeplan
            ), array(
                "name" => 'Ejecución',
                "data" => $importeejecutado
            )
        );

        $result = Array($data, $categorias);

        echo json_encode(
                array('data' => $result[0], 'categorias' => $result[1])
        );
    }

    //Indicadores fuera de plan más valiosos(adiciones)
    public function graficaIndicadoresFueraPlanMasValiososAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        $parametros['uri'] = $this->_request->getPost('uri');
        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'][] = $identidad;
            if ($parametros['tipo'] == 'activ') {

                $aux = $this->integrator->metadatos->DameEstructura(
                        $identidad
                );
                $parametros['id_especialidades'] [] = $aux[0]->idespecialidad;
            }
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
                if ($parametros['tipo'] == 'activ') {
                    $parametros['id_especialidades'] = array();
                    foreach (
                    $parametros['identidad'] as $key => $valorIdentidad
                    ) {
                        $tempEspecialidades = 0;
                        $entidades[] = $this->integrator->metadatos->DameEstructura(
                                $valorIdentidad
                        );
                        foreach ($parametros['id_especialidades'] as $esp) {
                            if ($esp == $entidades [$key][0]->idespecialidad) {
                                $tempEspecialidades = 1;
                            }
                        }
                        if ($tempEspecialidades == 0) {
                            $parametros['id_especialidades'] [] = $entidades [$key][0]->idespecialidad;
                        }
                    }
                    $arraysalida = array_filter(
                            $parametros['id_especialidades']
                    );
                    if (empty($arraysalida)) {
                        return -1;
                    }
                    $parametros['id_especialidades'] = $arraysalida;
                }
            }
        }
        $dat = ControlejecuciondemandaModel::graficaIndicadoresFueraPlanMasValiosos(
                        $parametros
        );

        foreach ($dat as $key => $value) {
            $categorias[$key] = $value['denominacion'];
            $importeplan[$key] = (double) $value['adiciones'];
        }

        $data = Array(
            array(
                "name" => 'Ejecutado por adición',
                "data" => $importeplan
            )
        );

        $result = Array($data, $categorias);

        echo json_encode(
                array('data' => $result[0], 'categorias' => $result[1])
        );
    }

    //Indicadores ejecutados más valiosos
    public function graficaIndicadoresMasEjecutadosAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $parametros['uri'] = $this->_request->getPost('uri');

        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'] [] = $identidad;
            if ($parametros['tipo'] == 'activ') {

                $aux = $this->integrator->metadatos->DameEstructura(
                        $identidad
                );
                $parametros['id_especialidades'] [] = $aux[0]->idespecialidad;
            }
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
                if ($parametros['tipo'] == 'activ') {
                    $parametros['id_especialidades'] = array();
                    foreach (
                    $parametros['identidad'] as $key => $valorIdentidad
                    ) {
                        $tempEspecialidades = 0;
                        $entidades[] = $this->integrator->metadatos->DameEstructura(
                                $valorIdentidad
                        );
                        foreach ($parametros['id_especialidades'] as $esp) {
                            if ($esp == $entidades [$key][0]->idespecialidad) {
                                $tempEspecialidades = 1;
                            }
                        }
                        if ($tempEspecialidades == 0) {
                            $parametros['id_especialidades'] [] = $entidades [$key][0]->idespecialidad;
                        }
                    }
                    $arraysalida = array_filter(
                            $parametros['id_especialidades']
                    );
                    if (empty($arraysalida)) {
                        return -1;
                    }
                    $parametros['id_especialidades'] = $arraysalida;
                }
            }
        }
        $parametros['orden'] = $this->_request->getPost('orden');

        if ($parametros['orden'] == 1) {
            $parametros['orden'] = 'DESC';
        } else {
            $parametros['orden'] = '';
        }

        $dat = ControlejecuciondemandaModel::graficaIndicadoresMasEjecutados(
                        $parametros
        );

        foreach ($dat as $key => $value) {
            $categorias[$key] = $value['denominacion'];
            $importeplan[$key] = (double) $value['plan'];
            $importeejec[$key] = (double) $value['ejecutado'];
        }

        $data = Array(
            array(
                "name" => 'Planificado',
                "data" => $importeplan
            ), array(
                "name" => 'Ejecutado',
                "data" => $importeejec
            )
        );

        $result = Array($data, $categorias);

        echo json_encode(
                array('data' => $result[0], 'categorias' => $result[1])
        );
    }

    //Gráfica ejecución x entidad x vías de adquisición
    public function graficaEjecucionglobalxentidadxVAAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['esHoja'] = $this->_request->getPost('esHoja');
        $parametros['tipo'] = $this->_request->getPost('tipo');

        if ($parametros['esHoja'] == 1) {
            $parametros['identidad'] [] = $identidad;
        } else {
            if ($parametros['esHoja'] == 0) {
                $parametros['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
            }
        }

        $result = ControlejecuciondemandaModel::graficaEjecucionglobalxentidadxVA($parametros);

        echo json_encode(
                array('data' => $result[0], 'categorias' => $result[1])
        );
    }

    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas(
        );
        echo json_encode(array('data' => $unidades));
    }

    public function listarOrganosAction() {
        $obj = new NomOrganosatisface();
        $result = $obj->obtenerOS();

        echo json_encode(array('data' => $result));
    }

    public function listarCentroBalanceAction() {
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
            $dat[$k]['identidad'] = $datosentidad[0]->idfila;
        }

        echo json_encode(array('data' => $dat));
    }

    public function reporteEjecucionAction() {

        //$parametros['nupieza'] = $this->_request->getParam('nupieza');
        //$parametros['denominacion'] = $this->_request->getParam('denominacion');
        $parametros['numero'] = $this->_request->getParam('numero');
        $parametros['cbname'] = $this->_request->getParam('cbname');
        $parametros['idorgano'] = $this->_request->getParam('idorgano');
        $parametros['organo'] = $this->_request->getParam('organo');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        //  $parametros['mes'] = $this->_request->getParam('mes');
        //  $parametros['mesname'] = $this->_request->getParam('mesname');
        $parametros['centrobalance'] = $this->_request->getParam(
                'centrobalance'
        );
        $integra = $this->integrator;
        // $parametros['reporte'] = $this->_request->getParam('reporte');

        $obj = new GenerarPdfEjecucion($parametros, $integra);
        $obj->export();
    }

}
