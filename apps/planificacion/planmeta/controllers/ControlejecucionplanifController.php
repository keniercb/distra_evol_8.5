<?php

class ControlejecucionplanifController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function controlejecucionplanifAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    //Lista los ejercicios de la planificacion
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
        if ($this->_request->getPost('glob') == 'false') {
            $parametros['hijosentidad'][] = $parametros['identidad'];
        } else {
            if ($this->_request->getPost('glob') == 'true') {
                $parametros['hijosentidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros['identidad']);
            }
        }
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
        $params ['idEstructuraPadre'] = $this->_request->getPost('idEstructuraPadre');
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
        $isLeaf = $this->_request->getPost('is_leaf');
        if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0') {
            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
            $params ['nivel'] = $arrayResFormatoUltimonivel[1];
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;

            $modelContEjecPlan = new ControlejecucionplanifModel();
            $security = ZendExt_Aspect_Security_Sgis::getInstance();

            if ($this->_request->getPost('glob') == 'false') {
                $params['entidades'] = array('0' => $params['identidad']);
                $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
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
                $idestructura = $this->integrator->metadatos->DameEstructura($params['identidad']);
                $modeloActEnt = new DatActividadentidad();
                $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($idestructura[0]->idestructura);
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
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $identidad = $this->_request->getPost('identidad');
        $parametros['glob'] = $this->_request->getPost('glob');
        $parametros['hoja'] = $this->_request->getPost('hoja');
        if ($parametros['glob'] == 'false') {
            $parametros['entidades'] [] = $identidad;
            $parametros['consolidar'] = 0;
        } else {
            if ($parametros['glob'] == 'true') {
                $parametros['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
                $parametros['consolidar'] = 1;
            }
        }

        if ($parametros['idmodelo'] != null || $parametros['idmodelo'] != '') {
            $datos = ControlejecucionplanifModel::listarIndEjec($parametros);
            foreach ($datos->data as $k => $d) {
                //obtiene la unidad de medida
                $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($d['idunidadmedida']));
                $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
            }
            echo json_encode($datos);
        } else {
            echo json_encode(array('data' => [], 'total' => 0));
        }
    }

    //Lista la cantidad real de la ejecución dado un idplanificación
    public function listarEjecucionPlanAction() {
        $parametros['idplanificacion'] = $this->_request->getPost('idplanif');
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $datos = ControlejecucionplanifModel::listarEjecucionPlan($parametros);
        echo json_encode($datos);
    }

    //Lista la cantidad real de la ejecución dado un idactividadentidad
    public function listarEjecucionNivelesAction() {
        $parametros['idactividad'] = $this->_request->getPost('idactividad');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $modeloActEnt = new DatActividadentidad();
        $parametros['idactividadentidad'] = DatActividadentidad::BuscarIdactividadEntidades1(
                        $parametros['identidad'], $parametros['idactividad'], $parametros['idejercicio']
        );
        $parametros['idactividadentidad'] = $parametros['idactividadentidad'][0]['idactividadentidad'];
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $datos = ControlejecucionplanifModel::listarEjecucionNiveles($parametros);
        echo json_encode($datos);
    }

    //Lista la desviación de la ejecución dado un idplanificación
    public function listarDesvPlanAction() {
        $parametros['idplanificacion'] = json_decode(stripslashes($this->_request->getPost('idplanif')));
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['filtros'] = $this->_request->getPost('filtros');

        $datos = ControlejecucionplanifModel::listarDesvPlan($parametros);
        foreach ($datos->data as $k => $d) {
            //obtiene la unidad de medida
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($d['idumedida']));
            $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
        }
        echo json_encode($datos);
    }

    //Lista la cantidad real de la ejecución dado un idactividadentidad
    public function listarDesvNivelesAction() {
        $parametros['idactividades'] = json_decode(stripslashes($this->_request->getPost('idactividades')));
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $datos = ControlejecucionplanifModel::listarDesvNiveles($parametros);
        echo json_encode($datos);
    }

    //Lista las actividades para adicionar una desviacion
    public function listarActAddDesviacionAction() {
        $parametros['idactividades'] = json_decode(stripslashes($this->_request->getPost('idactividades')));
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $datosentidad = $this->integrator->metadatos->DameEstructura($parametros['identidad']);
        $parametros['idespecialidad'] = $datosentidad[0]->idespecialidad;
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $model = new ControlejecucionplanifModel();
        echo json_encode($model->listarActAddDesviacionModel($parametros));
    }

    //Lista las actividades desviadas por el concepto de adición
    public function listarActDesviacionAdicionAction() {
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $model = new ControlejecucionplanifModel();
        echo json_encode($model->listarAdicNivelesModel($parametros));
    }

    //Inserta la cantidad real de la ejecución dado un idplanificación
    public function insertarEjecPlanAction() {
        $params['idplanificacion'] = $this->_request->getPost('idplanificacion');
        $params['ejec'] = json_decode(stripslashes($this->_request->getPost('ejec')));
        $params['eliminar'] = json_decode(stripslashes($this->_request->getPost('eliminar')));
        $params['idusuario'] = $this->global->Perfil->idusuario;
        echo json_encode(ControlejecucionplanifModel::insertarEjecPlan($params));
    }

    //Inserta la cantidad real de la ejecución dado un idactividadentidad
    public function insertarEjecNivAction() {
        $params['ejec'] = json_decode(stripslashes($this->_request->getPost('ejec')));

        $params['eliminar'] = json_decode(stripslashes($this->_request->getPost('eliminar')));
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $modeloActEnt = new DatActividadentidad();
        $params['idactividadentidad'] = DatActividadentidad::BuscarIdactividadEntidades1(
                        $params['identidad'], $params['idactividad'], $params['idejercicio']
        );
        $params['idactividadentidad'] = $params['idactividadentidad'][0]['idactividadentidad'];
        $params['idusuario'] = $this->global->Perfil->idusuario;
        echo json_encode(ControlejecucionplanifModel::insertarEjecNiv($params));
    }

    //Inserta la desviacion de la ejecución dado un idplanificación
    public function insertarDesvPlanAction() {
        $params['ejec'] = json_decode(stripslashes($this->_request->getPost('ejec')));
        $params['eliminar'] = json_decode(stripslashes($this->_request->getPost('eliminar')));
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['adicion'] = $this->_request->getPost('adicion');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        echo json_encode(ControlejecucionplanifModel::insertarDesvPlanSust($params));
    }

    //Inserta la desviacion real de la ejecución dado un idactividadentidad
    public function insertarDesvNivAction() {
        $params['ejec'] = json_decode(stripslashes($this->_request->getPost('ejec')));
        $params['eliminar'] = json_decode(stripslashes($this->_request->getPost('eliminar')));
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['identidad'] = $this->_request->getPost('identidad');
        $datosentidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
        $params['espcomp'] = $datosentidad[0]->idespecialidad;
        $params['idusuario'] = $this->global->Perfil->idusuario;
        echo json_encode(ControlejecucionplanifModel::insertarDesvNiv($params));
    }

    //Lista los indicadores para adicionar una desviación
    public function listarIndAddDesviacionAction() {
        $parametros['idindicadores'] = json_decode(stripslashes($this->_request->getPost('idindicadores')));
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $datos = ControlejecucionplanifModel::listarIndAddDesviacion($parametros);
        foreach ($datos->data as $k => $d) {
            //obtiene la unidad de medida
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($d['idumedida']));
            $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
        }
        echo json_encode($datos);
    }

    //Lista los indicadores para adicionar una desviacion por adicion
    public function listarIndAddDesviacionAdicionAction() {
        $parametros['idindicadores'] = json_decode(stripslashes($this->_request->getPost('idindicadores')));
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['filtros'] = json_decode(stripslashes($this->_request->getPost('filtrosD')));
        $datos = ControlejecucionplanifModel::listarIndAddDesviacionAdicion($parametros);
        foreach ($datos->data as $k => $d) {
            //obtiene la unidad de medida
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($d['idumedida']));
            $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
        }
        echo json_encode($datos);
    }

    //Lista las desviacion por adicion
    public function listarDesvAdicionesPlanAction() {
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        if ($parametros['idmodelo'] != null || $parametros['idmodelo'] != '') {
            $datos = ControlejecucionplanifModel::listarDesvAdicionesPlan($parametros);
            foreach ($datos->data as $k => $d) {
                //obtiene la unidad de medida
                $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($d['idumedida']));
                $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
            }
            echo json_encode($datos);
        } else {
            echo json_encode(array('data' => [], 'total' => 0));
        }
    }

    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

}
