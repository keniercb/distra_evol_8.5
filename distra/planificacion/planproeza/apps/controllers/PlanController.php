<?php

class PlanController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function planAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    //Lista los ejercicios de la planificacion
    public function cargarEjerciciosAction() {
        $idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        $ejercicios = $this->pIntegrator->planmeta->obtenerEjercicios();
        $data->data = $ejercicios;
        $data->idejercicioactual = $idejercicioactual;
        echo json_encode($data);
    }

    //Lista los indicadores de Plan, según el comportamiento (tipo)
    public function listarPlanProduccionAction() {
        $params = array();
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['tipo'] = $this->_request->getPost('tipo');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        
        $data = DatProduccionModel::listarPlanProduccion($params);
        echo json_encode(array('total' => $data[0]['total'], 'data' => $data));
    }

    //Lista los indicadores de Plan desagregados por talleres, según el comportamiento proveedor (tipo = 2)
    public function listarPlanProduccionDesagregadoAction() {
        $params = array();
        $params['iddemanda'] = $this->_request->getPost('iddemanda');
        $params['tipo'] = $this->_request->getPost('tipo');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = DatProduccionModel::listarPlanProduccionDesagregado($params);
        echo json_encode(array('total' => $data[0]['total'], 'data' => $data));
    }
////No se esta usando en ningun fichero
//    public function listarIndicadoresPlanEjecucionAction() {
//        $ejercicios = $this->pIntegrator->planmeta->obtenerEjercicios();
//        echo json_encode($ejercicios);
//    }
////No se esta usando en ningun fichero
//    public function listarIndicadoresPlanEjecucionTallerAction() {
//        $ejercicios = $this->pIntegrator->planmeta->obtenerEjercicios();
//        echo json_encode($ejercicios);
//    }

    public function guardarPlanProduccionTalleresAction() {
        $params = array();
        $object = new DatProduccionModel();
        $params['demandatiempo'] = json_decode(stripslashes($this->_request->getPost('demandatiempo')));
        $data = $object->guardarPlanProduccionTalleres($params);
        echo json_encode(array('codMsg' => $data));
    }
////No se esta usando en ningun fichero
//    public function getProgramasAction() {
//        $params = array();
//        $object = new DatProduccionModel();
//        $data = $object->listarProgramas($params);
//        echo json_encode(array('data' => $data));
//    }
////No se esta usando en ningun fichero
//    public function listarIndicadoresPlanProductorAction() {
//        $params = array();
//        $object = new DatProduccionModel();
//        $data = $object->listarProgramas($params);
//        echo json_encode(array('data' => $data));
//    }
////No se esta usando en ningun fichero
//    public function getClientesAction() {
//        $params = array();
//        $object = new DatProduccionModel();
//        $data = $object->listarClientes($params, $this->integrator);
//        echo json_encode(array('data' => $data));
//    }
////No se esta usando en ningun fichero
//    public function getClientesByEntidadAction() {
//        $params = array();
//        $object = new DatProduccionModel();
//        $params['identidadselected'] = $this->_request->getParam('identidadselected');
//        $data = $object->listarProductores($params, $this->integrator);
//        echo json_encode(array('data' => $data));
//    }
////No se esta usando en ningun fichero
//    public function getMesesAction() {
//        $params = array();
//        $object = new DatProduccionModel();
//        $data = $object->listarMeses($params);
//        echo json_encode(array('data' => $data));
//    }

    public function cargarUnidadMedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function cargarUsuariosAction() {
        $data = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $data));
    }

    public function cargarProgramasAction() {
        $data = DemandaproduccionModel::cargarProgramas();
        echo json_encode(array('data' => $data));
    }

    public function cargarDestinosAction() {
        $data = DemandaproduccionModel::cargarDestinos();
        echo json_encode(array('data' => $data));
    }

    public function comportEntidadLogAction() {
        $params['identidad'] = $this->global->Estructura->idestructura;
        $comportamiento = array();
        $obj = DatEntidaddatosnomenclador::getComport($params['identidad']);
        $ejecutor = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "ejecutor");
        $organoempresarial = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "organoempresarial");
        $organorector = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "rectorbalance");
        $pos = 0;
        foreach ($obj as $key => $value) {
            if ($value['iddatosnomenclador'] == $ejecutor[0]['iddatosnomenclador']) {
                $comportamiento[$pos]['idtipocomportamiento'] = 1;
                $pos++;
            } else
            if ($value['iddatosnomenclador'] == $organoempresarial[0]['iddatosnomenclador']) {
                $comportamiento[$pos]['idtipocomportamiento'] = 2;
                $pos++;
            } else
            if ($value['iddatosnomenclador'] == $organorector[0]['iddatosnomenclador']) {
                $comportamiento[$pos]['idtipocomportamiento'] = 3;
                $pos++;
            }
        }
        echo json_encode(array('data' => $comportamiento));
    }

    public function obtenerComportamientoEjecutorProductorAction() {
        try {
            $params['identidad'] = $this->_request->getPost('identidad');
            $obj = DatDemandatiempoModel::obtenerComportamientoEjecutorProductor($params);
            echo json_encode(array('data' => $obj));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function obtenerComportamientoPorEntidadAction() {
        try {
            $params['identidad'] = $this->_request->getPost('identidad');
            $codMsgN = 0;
            $obj = DatEntidaddatosnomenclador::getComport($params['identidad']);
            $ejecutor = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "ejecutor");
            $organoempresarial = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "organoempresarial");
            $organorector = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "rectorbalance");

            foreach ($obj as $key => $value) {
                if ($value['iddatosnomenclador'] == $ejecutor[0]['iddatosnomenclador'] || $value['iddatosnomenclador'] == $organoempresarial[0]['iddatosnomenclador']) {
                    $codMsgN = 1;
                    break;
                }
                if ($value['iddatosnomenclador'] == $organorector[0]['iddatosnomenclador']) {
                    $codMsgN = 2;
                    break;
                }
            }
            echo json_encode(array('codMsgN' => $codMsgN));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function aprobarDesaprobarPlanAction() {
        try {
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $params['demandas'] = json_decode(stripslashes($this->_request->getPost('demandas')));
            $params['accion'] = $this->_request->getPost('accion');
            $params['idaprobacion'] = $this->_request->getPost('idaprobacion');
            $params['rol'] = $this->_request->getPost('rol');
            $params['valorAComprobar'] = $this->_request->getPost('valorAComprobar');
            $data = DatDemandatiempoModel::aprobarDesaprobarPlan($params);
            echo json_encode(array('codMsgN' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

//    public function listarEntidadesAction() {
//        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
//        $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura[0]['identidad'], true);
//        echo json_encode(array("data" => $entidades));
//    }

    public function listarEntidadesEjecutorasAction() {
        $res = array();
        $pos = 0;
        $params['iddemanda'] = $this->_request->getPost('iddemanda');
        $params['identidad'] = $this->_request->getPost('identidad');
        $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad'], true);
        $arrayidentidad = array();
        foreach ($entidades as $key => $entidad) {
            array_push($arrayidentidad, $entidad['idestructura']);
        }
        $implodeentidades = implode(',', $arrayidentidad);
        $params['entidades'] = $implodeentidades;
        $data = DatDemandatiempoModel::listarEntidadesEjecutoras($params);
        foreach ($data as $key => $identidad) {
            $datoestructura = $this->integrator->metadatos->DameEstructura($identidad['identidad']);
            $res[$pos]['denominacion'] = $datoestructura[0]->denominacion;
            $res[$pos]['idestructura'] = $datoestructura[0]->idestructura;
            $pos++;
        }
        echo json_encode(array('data' => $res));
    }

    public function adicionarDesagAction() {
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $params['iddemanda'] = $this->_request->getPost('iddemanda');
        $params['identidades'] = json_decode(stripslashes($this->_request->getPost('identidad')));
        $data = DatDemandatiempoModel::adicionarDesag($params);
        echo json_encode(array('codMsgN' => $data));
    }

    public function eliminarDesagAction() {
        $params['iddesag'] = json_decode(stripslashes($this->_request->getPost('iddemandatiempo')));
        $data = DatDemandatiempoModel::eliminarDesag($params);
        echo json_encode(array('codMsgN' => $data));
    }

    public function exportarPlanAction() {
        try {
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['denoentidad'] = $this->_request->getParam('denoentidad');
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['denoejercicio'] = $this->_request->getParam('denoejercicio');
            $params['tipo'] = $this->_request->getParam('tipo');
            $params['denotipo'] = $this->_request->getParam('denotipo');
            $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
            $params['um'] = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
            $params['entidades'] = $this->integrator->metadatos->getEstructurasHijasById(0, $idEstructura[0]['identidad']);
      
            DatProduccionModel::exportarPlan($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }
    public function exportarDesagregacionPlanAction() {
        try {
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['denoentidad'] = $this->_request->getParam('denoentidad');
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['denoejercicio'] = $this->_request->getParam('denoejercicio');
            $params['tipo'] = $this->_request->getParam('tipo');
            $params['denotipo'] = $this->_request->getParam('denotipo');
            $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
            $params['iddemanda'] = $this->_request->getParam('iddemanda');
            $params['denomindicador'] = $this->_request->getParam('denomindicador');
            $params['codindicador'] = $this->_request->getParam('codindicador');
             $params['cantidadconfirmada'] = $this->_request->getParam('cantidadconfirmada');
            $params['entidades'] = $this->integrator->metadatos->getEstructurasHijasById(0, $params['identidad']);
            $params['usuarios'] = $this->integrator->seguridad->getAllUsers();
           // $params['um'] = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            DatProduccionModel::exportarDesagregacionPlan($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarEntidadesDadoCompAction() {
        $params['comp'] = $this->_request->getPost('comp');
        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $entidadesdenom = array();
        $entidades = $this->integrator->metadatos->getEstructurasHijasById(0, $idEstructura[0]['identidad']);
        $cadenaidentidades = $entidades[0]['id'];
        foreach ($entidades as $key => $value) {
            if ($key != 0)
                $cadenaidentidades.="," . $value['id'];
            $entidadesdenom[$value['id']] = $value['text'];
        }
        $identidades = DatEntidaddatosnomenclador::obtenerEntDadoCompArrayEnt($cadenaidentidades, $params['comp']);
        $result = array();
        foreach ($identidades as $k => $v) {
            $result[$k]['idestructura'] = $v;
            $result[$k]['denominacion'] = $entidadesdenom[$v];
        }
        echo json_encode(array("data" => $result));
    }
    
     public function listarEntidadesProductorasAction() {
        //$params['integrator'] = $this->integrator;
        $data = DemandaproduccionModel::listarEntidadesProductoras($params);
        echo json_encode(array('data' => $data));
    }

}
