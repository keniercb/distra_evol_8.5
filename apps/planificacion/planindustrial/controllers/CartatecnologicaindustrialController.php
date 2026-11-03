<?php

class CartatecnologicaindustrialController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function cartatecnologicaindustrialAction() {
        $this->render();
    }

    public function listarCartatecnologicaAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');

            $data = CartatecnologicaindustrialModel::listarCartatecnologica($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function listarIndicadoresAdicionarCartatecnologicaAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');

            $data = CartatecnologicaindustrialModel::listarIndicadoresAdicionarCartatecnologica($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function adicionarCartatecnologicaAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params['idcartatecindustrial'] = $this->_request->getPost('idcartatecindustrial');
            $params['denominacion'] = $this->_request->getPost('denominacion');
            $params['descripcion'] = $this->_request->getPost('descripcion');
            $params['idindicador'] = $this->_request->getPost('idindicador');
            $params['cantidad'] = $this->_request->getPost('cantidad');

            $data = CartatecnologicaindustrialModel::adicionarCartatecnologica($params);
            echo json_encode(array('codMsg' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function eliminarCartatecnologicaAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas

            $params['idcartatecindustrial'] = json_decode(stripslashes($this->_request->getPost('idcartatecindustrial')));

            if ($params['idcartatecindustrial'][0] != null) {
                $data = CartatecnologicaindustrialModel::eliminarCartatecnologica($params);
            }
            echo json_encode(array('codMsg' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function aprobarCartatecnologicaAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas

            $params['idcartatecindustrial'] = json_decode(stripslashes($this->_request->getPost('idcartatecindustrial')));
            $params['idaprobacion'] = $this->_request->getPost('idaprobacion');

            if ($params['idcartatecindustrial'][0] != null) {
                $data = CartatecnologicaindustrialModel::aprobarCartatecnologica($params);
            }
            echo json_encode(array('codMsg' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function listarActividadesCartatecnologicaAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params['idcartatecindustrial'] = $this->_request->getPost('idcartatecindustrial');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');

            if ($params['idcartatecindustrial'])
                $data = CartatecnologicaindustrialModel::listarActividadesCartatecnologica($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function listarActividadesAdicionarActividadesCartatecnologicaAction() {
        try {
            ini_set("max_execution_time", 3600); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
            $params['idcartatecindustrial'] = $this->_request->getPost('idcartatecindustrial');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');

            $data = CartatecnologicaindustrialModel::listarActividadesAdicionarActividadesCartatecnologica($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function adicionarActividadesCartatecnologicaAction() {
        try {
            $params['idcartatecindustrial'] = $this->_request->getPost('idcartatecindustrial');
            $params['idactividades'] = json_decode(stripslashes($this->_request->getPost('idactividades')));

            $data = CartatecnologicaindustrialModel::adicionarActividadesCartatecnologica($params);
            echo json_encode(array('codMsg' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function eliminarActividadesCartatecnologicaAction() {
        try {
            $params['idcartatecindustrial'] = $this->_request->getPost('idcartatecindustrial');
            $params['idactividades'] = json_decode(stripslashes($this->_request->getPost('idactividades')));

            $data = CartatecnologicaindustrialModel::eliminarActividadesCartatecnologica($params);
            echo json_encode(array('codMsg' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function exportarCartatecnologicaAction() {
        try {
            $params['tipo'] = $this->_request->getParam('tipo');
            $params['idcartatecindustrial'] = json_decode($this->_request->getParam('idcartatecindustrial'));
            $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));

            $params['um'] = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            CartatecnologicaindustrialModel::exportarCartatecnologica($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function cargarunidadmedidaAction() {
        try {
            $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            echo json_encode(array('data' => $unidades));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function cargarUsuariosAction() {
        $datos = $this->integrator->seguridad->getAllUsers();
        $idusuario = $this->global->Perfil->idusuario;
        echo json_encode(array("data" => $datos, 'idusuarioLog' => $idusuario));
    }

}
