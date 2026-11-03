<?php

class DemandadeproduccionController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function demandadeproduccionAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function cargarEjerciciosAction() {
        try {
            $data = null;
            $ejercicios = $this->pIntegrator->planmeta->obtenerEjercicios();
            foreach ($ejercicios as $key => $ejercicio) {
                $ejercicios[$key]['ejercicio'] = $ejercicio['ejercicio'] . ' (' . $ejercicio['denomestado'] . ')';
            }
            $data->data = $ejercicios;
            $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarIndicadoresEmpresaAddDemandaAction() {
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = DemandaproduccionModel::listarIndicadoresEmpresaAddDemanda($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function listarNaturalezasAction() {
        $naturaleza = DemandaproduccionModel::obtenerNaturalezas();
        echo json_encode(array('data' => $naturaleza));
    }

    public function cargarUnidadMedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function listarObservacionesAction() {
        $params['iddemanda'] = $this->_request->getPost('iddemanda');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $observaciones = DemandaproduccionModel::listarObservaciones($params);
        echo json_encode(array('data' => $observaciones, 'total' => $observaciones[0]['total']));
    }

    public function guardarObservacionAction() {

        $params['iddemanda'] = $this->_request->getPost('iddemanda');
        $params['observacion'] = $this->_request->getPost('observacion');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $result = DemandaproduccionModel::guardarObservacion($params);
        echo json_encode(array('codMsg' => $result));
    }

    public function listarDemandasAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['tipo'] = $this->_request->getPost('tipo');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = DemandaproduccionModel::listarDemandas($params);        
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

//    public function listarEntidadesAction() {
//        $identidad = DatEntidaddatosnomenclador::obtenerEntidadRectora();
//
//        $entidades = $this->integrator->metadatos->getEstructurasHijasById($identidad['identidad'], $identidad['identidad']);
//
//        foreach ($entidades as $key => $value) {
//            $res[$key]['denominacion'] = strtoupper($value['text']);
//            $res[$key]['idestructura'] = $value['id'];
//        }
//        echo json_encode(array('data' => $res));
//    }
//   lo quite provisionalmente para usar el de control
//    public function listarEntidadesDadoCompAction() {
//        $params['comp'] = $this->_request->getPost('comp');
//        $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
//
//        $entidadesdenom = array();
//        //$entidades = $this->integrator->metadatos->getEstructurasHijasById(0, $idEstructura[0]['identidad']);
//        $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura[0]['identidad'],true);
//       // print_r($entidades);die;
//        $cadenaidentidades = $entidades[0]['idestructura'];
//        foreach ($entidades as $key => $value) {
//            if ($key != 0)
//                $cadenaidentidades.="," . $value['idestructura'];
//            $entidadesdenom[$value['idestructura']] = $value['denominacion'];
//        }
//        $identidades = DatEntidaddatosnomenclador::obtenerEntDadoCompArrayEnt($cadenaidentidades, $params['comp']);
//        $result = array();
//        foreach ($identidades as $k => $v) {
//            $result[$k]['idestructura'] = $v;
//            $result[$k]['denominacion'] = $entidadesdenom[$v];
//        }
//        echo json_encode(array("data" => $result));
//    }
    //Lista las entidades que tienen el comportamiento dado
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

    public function adicionarDemandaAction() {
        try {
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['cant'] = $this->_request->getPost('cant');
            $params['idindicador'] = $this->_request->getPost('idindicador');
            $params['idcliente'] = $this->_request->getPost('idcliente');
            $params['fechalimite'] = $this->_request->getPost('fechalimite');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            //esta es la entidad productora
            $params['identidadorganosatisface'] = $this->_request->getPost('identidadorganosatisface');
            $result = DemandaproduccionModel::adicionarDemanda($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function eliminarDemandaAction() {
        try {
            $params['demandas'] = json_decode(stripslashes($this->_request->getPost('demandas')));
            $data = DemandaproduccionModel::eliminarDemanda($params);
            echo json_encode(array('codMsgN' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarDemandaAction() {
        try {
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $params['demandas'] = json_decode(stripslashes($this->_request->getPost('demandas')));
            $data = DemandaproduccionModel::guardarDemanda($params);
            echo json_encode(array('codMsgN' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function cargarUsuariosAction() {
        $data = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $data));
    }

    public function comportEntidadLogAction() {
        $params['identidad'] = $this->global->Estructura->idestructura;
        $obj = DemandaproduccionModel::obtenerComportamientoClienteProductor($params);
        echo json_encode(array("data" => $obj));
    }

    public function obtenerComportamientoClienteProductorAction() {
        try {
            $params['identidad'] = $this->_request->getPost('identidad');
            $obj = DemandaproduccionModel::obtenerComportamientoClienteProductor($params);
            echo json_encode(array('data' => $obj));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function obtenerComportamientoPorEntidadAction() {
        try {
            $params['identidad'] = $this->_request->getPost('identidad');
            $obj = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($params['identidad']);
            $rector = DatEntidaddatosnomenclador::getComportamientoRector($params['identidad']);
            if ($obj[0]) {
                echo json_encode(array('codMsgN' => 1));
            } else if ($rector[0]) {
                echo json_encode(array('codMsgN' => 2));
            } else
                echo json_encode(array('codMsgN' => 0));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarEntidadesProductorasAction() {
        //$params['integrator'] = $this->integrator;
        $data = DemandaproduccionModel::listarEntidadesProductoras($params);
        echo json_encode(array('data' => $data));
    }

    public function cargarProgramasAction() {
        $data = DemandaproduccionModel::cargarProgramas();
        echo json_encode(array('data' => $data));
    }

    public function cargarDestinosAction() {
        $data = DemandaproduccionModel::cargarDestinos();
        echo json_encode(array('data' => $data));
    }

    public function aprobarDesaprobarDemandaAction() {
        try {
            $params['accion'] = $this->_request->getPost('accion');
            $params['idaprobacion'] = $this->_request->getPost('idaprobacion');
            $params['rol'] = $this->_request->getPost('rol');
            $params['valorAComprobar'] = $this->_request->getPost('valorAComprobar');
            $params['demandas'] = json_decode(stripslashes($this->_request->getPost('demandas')));
            $params['idusuario'] = $this->global->Perfil->idusuario;

            if ($params['demandas'][0]->iddemanda != null) {
                $result = DemandaproduccionModel::aprobarDesaprobarDemanda($params);
            }
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function exportarDemandasAction() {
        try {
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['denoentidad'] = $this->_request->getParam('denoentidad');
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['denoejercicio'] = $this->_request->getParam('denoejercicio');
            $params['tipo'] = $this->_request->getParam('tipo');
            $params['denotipo'] = $this->_request->getParam('denotipo');
            $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
            $idEstructura = DatEntidaddatosnomenclador::obtenerEntidadRectora();
            $params['entidades'] = $this->integrator->metadatos->getEstructurasHijasById(0, $idEstructura[0]['identidad']);
            $params['um'] = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            DemandaproduccionModel::exportarDemandas($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarEntidadesProductorasIndicadorAction() {
        $params['idindicador'] = $this->_request->getParam('idindicador');
        $data = DemandaproduccionModel::listarEntidadesProductorasIndicador($params);
        echo json_encode(array('data' => $data));
    }

    //IMPORTAR
    //IMPORTAR demanda de produccion
    function importarFicheroDemandaAction() {
        try {
            ini_set("max_execution_time", 60000);
            //leyendo el excel
            $filename = $_FILES['file']['tmp_name'];
            $file = $filename;
            $ruta = '/ReaderModel.php';

            include_once(dirname(__FILE__) . $ruta);
            $data = new ReaderModel();
            $data->setOutputEncoding('CP1251');
            //print_r($data);die();
            $data->read($file);

            $params['data'] = $data->sheets[0]['cells'];
            $params['idusuario'] = $this->global->Perfil->idusuario;

            $result = ImportardemandaModel::importarFicheroDemanda($params);

            echo json_encode(array('columnas' => $result->columnas, 'columnasExcel' => $result->columnasExcel));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

//validar datos a importar
    function importarDatosRelacionadosDemandaAction() {
        try {
            ini_set("max_execution_time", 60000);

            $params['relaciones'] = json_decode(stripslashes($this->_request->getPost('relaciones')));
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['tipo'] = $this->_request->getPost('tipo');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['idusuario'] = $this->global->Perfil->idusuario;

            $result = ImportardemandaModel::importarDatosRelacionadosDemanda($params);

            echo json_encode(array('result' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

//listar datos validados a importar
    function listarDatosValidadosDemandaAction() {
        try {
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['idusuario'] = $this->global->Perfil->idusuario;

            $data = ImportardemandaModel::listarDatosValidadosDemanda($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

//inserta todos los datos validados correctamente
    function insertarDatosImportarDemandaAction() {
        try {
            ini_set("max_execution_time", 60000);

            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['tipo'] = $this->_request->getPost('tipo');
            $params['idusuario'] = $this->global->Perfil->idusuario;

            $result = ImportardemandaModel::insertarDatosImportarDemanda($params);

            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

}
