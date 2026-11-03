<?php

class PlanproduccionindustrialController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function planproduccionindustrialAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function listarProduccionesAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');

            $data = PlanproduccionindustrialModel::listarProducciones($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function listarCartatecnologicaAdicionarProduccionesAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');

            $data = PlanproduccionindustrialModel::listarCartatecnologicaAdicionarProducciones($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function adicionarProduccionesAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params['idproduccionindustrial'] = $this->_request->getPost('idproduccionindustrial');
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['denominacion'] = $this->_request->getPost('denominacion');
            $params['idcartatecindustrial'] = $this->_request->getPost('idcartatecindustrial');
            $params['cantidad'] = $this->_request->getPost('cantidad');

            $data = PlanproduccionindustrialModel::adicionarProducciones($params);
            echo json_encode(array('codMsg' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function eliminarProduccionesAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['idproduccionindustrial'] = json_decode(stripslashes($this->_request->getPost('idproduccionindustrial')));

            if ($params['idproduccionindustrial'][0] != null) {
                $data = PlanproduccionindustrialModel::eliminarProducciones($params);
            }
            echo json_encode(array('codMsg' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function aprobarProduccionesAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');

            $params['idaprobacion'] = $this->_request->getPost('idaprobacion');
            $params['rector'] = $this->_request->getPost('rector');
            $params['idproduccionindustrial'] = json_decode(stripslashes($this->_request->getPost('idproduccionindustrial')));

            if ($params['idproduccionindustrial'][0] != null) {
                $data = PlanproduccionindustrialModel::aprobarProducciones($params);
            }
            echo json_encode(array('codMsg' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function exportarProduccionesAction() {
        try {
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['denoentidad'] = $this->_request->getParam('denoentidad');
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['denoejercicio'] = $this->_request->getParam('denoejercicio');
            $params['filtros'] = $this->_request->getParam('filtros');
            $params['tipo'] = $this->_request->getParam('tipo');
            $params['idproduccionindustrial'] = $this->_request->getParam('idproduccionindustrial');
            $params['um'] = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            PlanproduccionindustrialModel::exportarProducciones($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    // METODOS DE CARGA Y CONFIGURACION
    public function cargarunidadmedidaAction() {
        try {
            $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            echo json_encode(array('data' => $unidades));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function cargarEjerciciosAction() {
        $data = null;
        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();

        $ejercicios = $this->pIntegrator->planmeta->obtenerEjercicios();
        $idejercicioanterior = $data->idejercicioactual;

        foreach ($ejercicios as $key => $ejercicio) {
            if ($data->idejercicioactual['idejercicio'] == $ejercicio['idejercicio']) {
                $idejercicioanterior = $ejercicios[$key - 1];
            }
            $ejercicios[$key]['denominacion'] = $ejercicio['ejercicio'] . ' (' . $ejercicio['denomestado'] . ')';
        }

        $data->data = $ejercicios;
        $data->idejercicioanterior = $idejercicioanterior;

        echo json_encode($data);
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

    public function cargarUsuariosAction() {
        $datos = $this->integrator->seguridad->getAllUsers();
        $idusuario = $this->global->Perfil->idusuario;
        echo json_encode(array("data" => $datos, 'idusuarioLog' => $idusuario));
    }

}
