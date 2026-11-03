<?php

class GestestadostransicionesController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function gestestadostransicionesAction() {
//        $jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    //----------------------Estados -----------------------------
    public function listarEstadosAction() {
        $objEstado = new NomEstadosftModel();
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $result = $objEstado->cargarEstados($parametros);
        echo json_encode($result);
    }

    public function adicionarEstadoAction() {
        $objEstado = new NomEstadosftModel();
        $parametros = $this->_request->getPost();
        $result = NomEstadosft::existeEstado($parametros['denominacion'], $parametros['descripcion']);
        if (!$result) {
            $objEstado->salvarEstados($parametros);
            echo json_encode(array('codMsgg' => 1));
        } else {
            echo json_encode(array('codMsg' => 0));
        }
    }

    public function modificarEstadoAction() {
        $objEstado = new NomEstadosftModel();
        $parametros = $this->_request->getPost();
        $result = NomEstadosft::existeEstadoModificar($parametros['denominacion'], $parametros['descripcion']);
        if (!$result) {
            $objEstado->setEstados($parametros);
            echo json_encode(array('codMsgg' => 1));
        } else {
            echo json_encode(array('codMsg' => 0));
        }
    }

    public function eliminarEstadoAction() {
        $objEstado = new NomEstadosftModel();
        $idestado = json_decode(stripslashes($this->_request->getPost('idestado')));
        $objEstado->eliminarEstados($idestado);
        echo json_encode(array('codMsgg' => 1));
    }

    //----------------------Flujo de Trabajo -----------------------------


    public function listarFlujoTrabajoAction() {
        $objFlujo = new DatFlujotrabajoModel();
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $result = $objFlujo->cargarFlujos($parametros);
        $resultado->data = $result['data'];
        $resultado->cant = $result['cant'];

        foreach ($resultado->data as $k => $d) {
            if (DatEtapa::flujoEnUso($d['idflujotrabajo'])) {
                $resultado->data[$k]['uso'] = 1;
            } else {
                $resultado->data[$k]['uso'] = 0;
            }
        }

        echo json_encode($resultado);
    }

    public function adicionarFlujoTrabajoAction() {
        $objFlujo = new DatFlujotrabajoModel();
        $parametros = $this->_request->getPost();
        $result = DatFlujotrabajo::existeFlujo($parametros['denominacion']);
        if (!$result) {
            $objFlujo->salvarFlujo($parametros);
            echo json_encode(array('codMsgg' => 1));
        } else {
            echo json_encode(array('codMsg' => 0));
        }
    }

    public function modificarFlujoTrabajoAction() {
        $objFlujo = new DatFlujotrabajoModel();
        $parametros = $this->_request->getPost();
        $result = DatFlujotrabajo::existeFlujo($parametros['denominacion']);
        if (!$result) {
            $objFlujo->setFlujos($parametros);
            echo json_encode(array('codMsgg' => 1));
        } else {
            echo json_encode(array('codMsg' => 0));
        }
    }

    public function eliminarFlujoTrabajoAction() {
        $objFlujo = new DatFlujotrabajoModel();
        $parametros = json_decode(stripslashes($this->_request->getPost('idflujo')));
        $resultado = $objFlujo->eliminarFlujos($parametros);
        if ($resultado) {
            echo json_encode(array('codMsgg' => 1));
        } else {
            echo json_encode(array('codMsg' => 0));
        }
    }

    //---------------------- Transiciones -----------------------------
    public function listarTransicionesAction() {
        $objTransicion = new DatTransicionModel();
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $idflujo = $this->_request->getPost('idflujo');
        $result = $objTransicion->cargarTransicion($parametros['filtros'], $idflujo);
        echo json_encode($result);
    }

    public function adicionarTransicionAction() {
        $objTransicion = new DatTransicionModel();
        $parametros = $this->_request->getPost();
        $parametros['userAto'] = json_decode(stripslashes($this->_request->getPost('userAto')));
        if (!is_int($parametros['idestadoinic'])) {
            $parametros['idestadoinic'] = DatTransicion::devolverIdDadoNombre($parametros['idestadoinic']);
        }
        if (!is_int($parametros['idestadofinal'])) {
            $parametros['idestadofinal'] = DatTransicion::devolverIdDadoNombre($parametros['idestadofinal']);
        }

        $transicioninicial = DatTransicion::existeTransInicial($parametros['idflujo']);

        $result = DatTransicion::existeTransicionn($parametros['idflujo'], $parametros['idestadoinic'], $parametros['idestadofinal']);
        if ($parametros['idestadoinic'] != $parametros['idestadofinal']) {
            if (!$result) {
                if ($parametros['inicial'] == 1 && !isset($parametros['actualizar'])) {
                    if ($transicioninicial) {
                        echo json_encode(array('codMsgggg' => 3));
                    } else {
                        $objTransicion->salvarTransicion($parametros);
                        echo json_encode(array('codMsgg' => 1));
                    }
                } else if ($parametros['inicial'] == 1 && isset($parametros['actualizar'])) {
                    if ($parametros['actualizar'] == 1) {
                        DatTransicion::setTransicionInicial($parametros['idflujo']);
                        $objTransicion->salvarTransicion($parametros);
                        echo json_encode(array('codMsgg' => 1));
                    } else {
                        $objTransicion->salvarTransicion($parametros);
                        echo json_encode(array('codMsgg' => 1));
                    }
                } else {
                    $objTransicion->salvarTransicion($parametros);
                    echo json_encode(array('codMsgg' => 1));
                }
            } else {
                echo json_encode(array('codMsg' => 0));
            }
        } else {
            echo json_encode(array('codMsggg' => 2));
        }
    }

    public function modificarTransicionAction() {
        $objTransicion = new DatTransicionModel();
        $parametros = $this->_request->getPost();
        if (!is_int($parametros['idestadoinic'])) {
            $parametros['idestadoinic'] = DatTransicion::devolverIdDadoNombre($parametros['idestadoinic']);
        }
        if (!is_int($parametros['idestadofinal'])) {
            $parametros['idestadofinal'] = DatTransicion::devolverIdDadoNombre($parametros['idestadofinal']);
        }

        $transicioninicial = DatTransicion::existeTransInicial($parametros['idflujo']);

        $result = DatTransicion::existeTransicionn($parametros['idflujo'], $parametros['idestadoinic'], $parametros['idestadofinal']);
        if ($parametros['idestadoinic'] != $parametros['idestadofinal']) {
            if (!$result) {
                if ($parametros['inicial'] == 1 && !isset($parametros['actualizar'])) {
                    if ($transicioninicial) {
                        echo json_encode(array('codMsgggg' => 3));
                    } else {
                        $objTransicion->setTransiciones($parametros, json_decode(stripslashes($this->_request->getPost('userIniciales'))), json_decode(stripslashes($this->_request->getPost('users'))));
                        echo json_encode(array('codMsgg' => 1));
                    }
                } else if ($parametros['inicial'] == 1 && isset($parametros['actualizar'])) {
                    if ($parametros['actualizar'] == 1) {
                        DatTransicion::setTransicionInicial($parametros['idflujo']);
                        $objTransicion->setTransiciones($parametros, json_decode(stripslashes($this->_request->getPost('userIniciales'))), json_decode(stripslashes($this->_request->getPost('users'))));
                        echo json_encode(array('codMsgg' => 1));
                    } else {
                        $objTransicion->setTransiciones($parametros, json_decode(stripslashes($this->_request->getPost('userIniciales'))), json_decode(stripslashes($this->_request->getPost('users'))));
                        echo json_encode(array('codMsgg' => 1));
                    }
                } else {
                    $objTransicion->setTransiciones($parametros, json_decode(stripslashes($this->_request->getPost('users'))));
                    echo json_encode(array('codMsgg' => 1));
                }
            } else {
                echo json_encode(array('codMsg' => 0));
            }
        } else {
            echo json_encode(array('codMsggg' => 2));
        }
    }

    public function eliminarTransicionAction() {
        $objTransicion = new DatTransicionModel();
        $idflujo = $this->_request->getPost('idflujo');
        $idtrans = json_decode(stripslashes($this->_request->getPost('idtrans')));
        $result = DatTransicion::esTransicionInicial($idtrans[0]->idtrans);
        if ($result) {
            echo json_encode(array('codMsgg' => 0));
        } else {
            $objTransicion->eliminarTransiciones($idflujo, $idtrans);
            echo json_encode(array('codMsggg' => 1));
        }
    }

    public function listarEstadosInicialesAction() {
        $idflujo = $this->_request->getPost('idflujo');
        $result = DatTransicion::getEstadosIniciales($idflujo);
        echo json_encode($result);
    }

    public function listarEstadosFinalesAction() {
        $idestadoinic = NomEstadosft::getIdDadoDenom($this->_request->getPost('denominacion'));
        $idflujo = $this->_request->getPost('idflujo');
        $result = DatTransicion::getEstadosFinales($idestadoinic[0]['idestadosft'], $idflujo);
        echo json_encode($result);
    }

    public function listarTodosUserAction() {
        $model = new DatUsuariotransicionModel();
        $resp = $model->getAllUser();
        echo json_encode(array('data' => $resp, 'cant' => count($resp)));
    }

    public function listarUserAutAction() {
        $model = new DatUsuariotransicionModel();
        $resp = $model->getUserByidtransicion($this->_request->getPost());
        echo json_encode(array('data' => $resp, 'cant' => count($resp)));
    }

}
