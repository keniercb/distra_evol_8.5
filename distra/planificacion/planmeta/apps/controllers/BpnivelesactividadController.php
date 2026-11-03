<?php

class BpnivelesactividadController extends ZendExt_Controller_Secure {

    public function init() {
        $this->model = new BpnivelesactividadModel();
        $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }

    public function bpnivelesactividadAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    // METODOS DE CARGA Y CONFIGURACION 
    public function cargarEjerciciosAction() {
        try {
            $data = null;
            $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
            $ejercicios = $this->pIntegrator->planmeta->obtenerEjercicios();
            foreach ($ejercicios as $key => $ejercicio) {
                $ejercicios[$key]['denominacion'] = $ejercicio['ejercicio'] . ' (' . $ejercicio['denomestado'] . ')';
            }
            $data->data = $ejercicios;
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function cargarEspecialidadesTodasAction() {
        try {
            echo json_encode(array('data' => NomActividad::obtenerEspecialidadesTodas(null, false)));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarModelosAction() {
        try {
            $data->data = DatEntidadmodelo::servBP_getModeloAsocEntidad();
            $data->data [] = array('idmodelo' => '-', 'denominacion' => '-');
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function cargarComportamientosAction() {
        try {
            $data->data = NomDatosnomenclador::getDatosNomPorUriTipoNom('comportamientodeactividades');
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function entidadODAction() {
        try {
            $identidad = $this->_request->getPost('identidad');
            $obj = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($identidad);
            if ($obj[0]) {
                echo json_encode(1);
            } else {
                echo json_encode(0);
            }
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    // FIN METODOS DE CARGA Y CONFIGURACION 

    public function listarNivelesActividadAction() {
        try {
            ini_set("max_execution_time", 600);
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['glob'] = $this->_request->getPost('glob');
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['hoja'] = $this->_request->getPost('hoja');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['idmodelo'] = $this->_request->getPost('idmodelo');
            echo json_encode(BpnivelesactividadModel::listarNivelesActividad($params));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function actualizarNivActividadAction() {
        try {
            ini_set("max_execution_time", 600);
            $params['actividades'] = json_decode(stripslashes($this->_request->getPost('niveles')));
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['identidad'] = $this->_request->getPost('identidad');
            $datosentidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
            $params['espcomp'] = $datosentidad[0]->idespecialidad;
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $model = new BpnivelesactividadModel();
            $model->modificarNivelesActividad($params);
            echo json_encode(array('codMsgE' => 1));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function exportarAction() {
        try {
            ini_set("max_execution_time", 600); //10min
            $params = array();
            $params['integrator'] = $this->integrator;
            $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['glob'] = $this->_request->getParam('glob');
            $params['hoja'] = $this->_request->getParam('hoja');
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['idmodelo'] = $this->_request->getParam('idmodelo');
            $params['modelo'] = $this->_request->getParam('modelo');
            $params['text'] = $this->_request->getParam('text');
            //indica si se van a exportar niveles (1) o niveles con desglose (2)
            $params['tipo'] = $this->_request->getParam('tipo');
            $modelNA = new BpnivelesactividadModel();
            $modelNA->exportarAExcel($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //obtiene los modelos asociados a una entidad
    public function listarModeloEntidadAction() {
        try {
            $params['identidad'] = $this->_request->getParam('identidad');
            $result = DatEntidadmodeloModel::getModeloEntidad($params['identidad']);
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    /*
     * Cambia la aprobacion de uno o varios nivel de actividad (aprobada o desaprobada)    
     * @return array, devuelve un mensaje con el estado de la actividad (aprobada o desaprobada)
     */

    public function aprobarDesaprobarNivelActividadAction() {
        try {
            $params = array();
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['actividades'] = json_decode(stripslashes($this->_request->getPost('actividades')));
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idaprobacion'] = $this->_request->getPost('idaprobacion');
            $modelActEnt = new BpnivelesactividadModel();
            if ($modelActEnt->aprobarDesaprobarNivel($params)) {
                echo json_encode(array('codMsgE' => 1, 'mensaje' => (($params['idaprobacion'] == '3' || $params['idaprobacion'] == '4' || $params['idaprobacion'] == '5') ? 'aprobada' : 'desaprobada'),
                    'idaprobacion' => $params['idaprobacion']));
            } else {
                echo("{'codMsgE':3 }"); // codigo de error*/
            }
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function aprobarDesaprobarNivelTodosAction() {
        try {
            $params = array();
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['hoja'] = $this->_request->getPost('hoja');
            $params['esrector'] = $this->_request->getPost('esrector');
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idaprobacion'] = $this->_request->getPost('idaprobacion');
            $modelActEnt = new BpnivelesactividadModel();
            if ($modelActEnt->aprobarDesaprobarNivelTodos($params) == 1) {
                echo json_encode(array('codMsgE' => 1, 'mensaje' => (($params['idaprobacion'] == '3' || $params['idaprobacion'] == '4' || $params['idaprobacion'] == '5') ? 'aprobada' : 'desaprobada'),
                    'idaprobacion' => $params['idaprobacion']));
            } else {
                echo("{'codMsgE':2 }"); // codigo de error*/
            }
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function verDetallesAction() {
        try {
            ini_set("max_execution_time", 600); //10min
            $params = array();
            $params['integrator'] = $this->integrator;
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['idactividad'] = $this->_request->getParam('idactividad');
            $params['actividad'] = $this->_request->getParam('actividad');
            $params['text'] = $this->_request->getParam('text');
            $modelNA = new BpnivelesactividadModel();
            $modelNA->verDetalles($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function verCalculosySalidasAction() {
        try {
            ini_set("max_execution_time", 600); //setear el tiempo de ejecucion a 10 min
            $params = array();
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['text'] = $this->_request->getParam('text');
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['global'] = $this->_request->getParam('glob');
            $params['idactividad'] = json_decode(stripslashes($this->_request->getParam('idactividades')));
            $modelNA = new BpnivelesactividadModel ();
            $modelNA->verCalculosySalidas($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function copiarPegarNivelesAction() {
        try {
            $params['identidadorigen'] = $this->_request->getPost('identidadorigen');
            $params['identidaddestino'] = $this->_request->getPost('identidaddestino');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidadorigen']);
            $params['idesp_ident_origen'] = $datosEntidad [0]->idespecialidad;
            $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidaddestino']);
            $params['idesp_ident_destino'] = $datosEntidad [0]->idespecialidad;
            $objActEntModel = new BpnivelesactividadModel();
            echo json_encode(array('codMsg' => $objActEntModel->copiarPegarNiveles($params)));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    /* Metodos del ajustar multiple y todos */

    public function cargarImporteInicialAction() {
        try {
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['arrayidactividad'] = json_decode(stripslashes($this->_request->getParam('arrayidactividad')));
            $resultado = BpnivelesactividadModel::cargarImporteInicial($params);
            $resultadoDos = number_format($resultado, '3', '.', ',');
            echo json_encode(
                    array('importe' => $resultado, 'importeformato' => $resultadoDos)
            );
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function calcularAjusteAction() {
        try {
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['arrayidactividad'] = json_decode(stripslashes($this->_request->getParam('arrayidactividad')));
            $params['porcientoajuste'] = $this->_request->getParam('porciento');
            $resultado = BpnivelesactividadModel::calcularAjuste($params);
            $resultadoDos = number_format($resultado, '3', '.', ',');
            echo json_encode(
                    array('importe' => $resultado, 'importeformato' => $resultadoDos)
            );
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function importeFinalAction() {
        $params['importeAjustado'] = $this->_request->getParam('importeAjustado');
        $params['importeInicial'] = $this->_request->getParam('importeInicial');
        $calculo = $params['importeInicial'] + $params['importeAjustado'];
        $importeFinal = number_format($calculo, '3', '.', ',');
        echo json_encode(array('importeformato' => $importeFinal));
    }

    public function insertarAjusteNivelAction() {
        try {
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['arrayidactividad'] = json_decode(stripslashes($this->_request->getParam('arrayidactividad')));

            $resultado = BpnivelesactividadModel::insertarAjusteNivel($params);
            echo $resultado;
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    /* Metodos de desglose */

    public function obtenerColumnasDinamicasAction() {
        try {
            $idtipomodelo = $this->_request->getPost('idtipomodelo');
            $datos = BpnivelesactividadModel::obtenerColumnasDesglose($idtipomodelo);
            echo json_encode(array('datos' => array_reverse($datos)));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarDesgloseNivelesActividadAction() {
        try {
            $params['idactividad'] = $this->_request->getParam('idactividad');
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');
            $data = BpnivelesactividadModel::listarDesgloseNivelesActividad($params);
//            print_r($data);die;
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarDesglosesAction() {

        $params['idactividad'] = $this->_request->getParam('idactividad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['desglose'] = json_decode(stripslashes($this->_request->getPost('desglose')));
        $params['columnas'] = json_decode(stripslashes($this->_request->getPost('columnas')));
        $params['idusuario'] = $this->global->Perfil->idusuario;

        try {
            $message = "";
            $data = BpnivelesactividadModel::guardarDesgloses($params);
        } catch (Exception $e) {
            $message = $e->getMessage();
            $data = "Error";
        }
        echo json_encode(array('codMsg' => $data, 'message' => $message));
    }

    public function eliminarDesgloseAction() {
        try {
            $params['idactividad'] = $this->_request->getParam('idactividad');
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['iddesglose'] = implode(",", json_decode(stripslashes($this->_request->getPost('iddesglose'))));

            $data = BpnivelesactividadModel::eliminarDesglose($params);
            echo json_encode(array('codMsgE' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    /* Metodos de Actualizar plan */

    //listar arbol de planes que se pueden actualizar
    public function listarPlanModeloAction() {
        try {
            ini_set("max_execution_time", 600); //10min
            $identidad = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $tipo = $this->_request->getPost('tipo');
            $node = $this->_request->getPost('node');
            $limpiar = $this->_request->getPost('limpiar');
            $data = array();
            if ($limpiar == 0) {
                $data = DatPlanModel::listarArbolPlanesNivelesActividad($identidad, $tipo, $node, $params['idejercicio'], $params['tipocalc']);
            }
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function actualizarPlanesAction() {
        try {
            $params = array();
            ini_set("max_execution_time", 6400); //600:10min 6400:2horas
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['tipoplan'] = $this->_request->getPost('tipoplan');
            $params['idmodelo'] = $this->_request->getPost('idmodelo');
            $iddesglose = DatDesglose::getAsociado($params['idmodelo']);
            $params['iddesglose'] = $iddesglose[0];
            $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $result = BpnivelesactividadModel::actualizarPlan($params);
            echo json_encode(array('cod' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    /* Metodos de Importar niveles de actividad */

    //Importar fichero
    function importarFicheroAction() {
        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;
        $data = BpnivelesactividadModel::importarFichero($idusuario);
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
            BpnivelesactividadModel::importarDatosRelacionados($relaciones, $identidad, $idejercicio, $idespecialidad, $idusuario);
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
            BpnivelesactividadModel::insertarDatosImportar($params, $idespecialidad, $idusuario);

            echo json_encode(array('codMsgN' => 1));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

}
