<?php

require_once __DIR__ . '/../../../../lib/Adapters/PHPExcel/1.8.2/Classes/PHPExcel.php';

class ControldemandaController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function controldemandaAction() {
        $this->render();
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function listarEjerciciosAction() {
        try {
            $data->data = NomEjercicioplanificacion::servicioObtenerEjercicioActualYAnteriores();
            $data->idejercicioejecucion = NomEjercicioplanificacion::listarEjercicioEjecucion();
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarunidadesmedidaAction() {
        try {
            $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            echo json_encode(array('data' => $unidades));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarEntidadesDominioAction() {
        try {
            $identidadLogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;
            $params['configuracion'] = $this->_request->getPost('configuracion');
            if ($params['configuracion'] == 'true') {
                //listar los CB respetando el dominio
                echo json_encode(ControldemandaModel::listarCentrosBalanceDominio($identidadLogueada));
            } else {
                if ($params['configuracion'] == 'false') {
                    //listar hijos de economia respetando el dominio
                    echo json_encode(ControldemandaModel::listarOrganosDemandantesDominio($identidadLogueada));
                }
            }
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarMesesAction() {
        try {
            $meses = NomDatosnomenclador::servicioObtenerDatosnom('mes', true, '-');
            echo json_encode(array('data' => $meses));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarViaAdquisicionAction() {
        try {
            $params['combo'] = $this->_request->getPost('combo');
            $vias = NomViaadquisicionModel::listarViaAdq();
            if ($params['combo'] == 'true') {
                $p = count($vias->data);
                $vias->data[$p]['denominacion'] = "Todas";
                $vias->data[$p]['idviaadquisicion'] = -1;
                $vias->data[$p]['uriviaadquisicion'] = "todas";
            }
            echo json_encode($vias);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarOrganoSatisfaceAction() {
        try {
            $data->data = NomOrganosatisface::obtenerOS();
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function cargarPlanAprobadoAction() {
        try {
            $params['configuracion'] = $this->_request->getPost('configuracion');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['identidades'] = json_decode(stripslashes($this->_request->getPost('identidades')));
            $params['idcentrosbalance'] = json_decode(stripslashes($this->_request->getPost('idcentrosbalance')));
            $params['idusuario'] = $this->global->Perfil->idusuario;
            ControldemandaModel::cargarPlanAprobado($params);
            echo json_encode(array('codMsgN' => 1));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarControlDemandaAction() {
        try {
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idmes'] = $this->_request->getPost('idmes');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['ejercicio'] = $this->_request->getPost('ejercicio');
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['cbCant'] = $this->_request->getPost('cbCant');
            $params['cbVal'] = $this->_request->getPost('cbVal');
            $params['cbVA'] = $this->_request->getPost('cbVA');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['delimitar'] = true;
            $params['fecha'] = null;            
            echo json_encode(ControldemandaModel::listarControlDemanda($params));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function exportarAction() {
        try {
            $params['configuracion'] = $this->_request->getParam('configuracion');
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['denomentidad'] = $this->_request->getParam('denomentidad');
            $params['idmes'] = $this->_request->getParam('idmes');
            $params['denommes'] = $this->_request->getParam('denommes');
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['ejercicio'] = $this->_request->getParam('ejercicio');
            $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
            $params['cbCant'] = $this->_request->getParam('cbCant');
            $params['cbVal'] = $this->_request->getParam('cbVal');
            $params['cbVA'] = $this->_request->getParam('cbVA');
            $params['delimitar'] = false;
            $params['fecha'] = null;
            echo json_encode(ControldemandaModel::exportar($params));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarControlDemandaAction() {
        try {
            $params['tuplasaguardar'] = json_decode(stripslashes($this->_request->getPost('tuplasaguardar')));
            $params['idmes'] = $this->_request->getPost('idmes');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            echo json_encode(array('codMsgN' => ControldemandaModel::guardarControlDemanda($params)));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function aprobarControlDemandaAction() {
        try {
            $params['tuplasaguardar'] = json_decode(stripslashes($this->_request->getPost('tuplasaguardar')));
            $params['idaprobacion'] = $this->_request->getParam('idaprobacion');
            echo json_encode(array('codMsgN' => ControldemandaModel::aprobarControlDemanda($params)));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarIndicadoresAddAction() {
        try {
            $params['configuracion'] = $this->_request->getPost('configuracion');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            echo json_encode(ControldemandaModel::listarIndicadoresAdd($params));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function adicionarControlDemandaAction() {
        try {
            $params['tuplasaguardar'] = json_decode(stripslashes($this->_request->getPost('tuplasaguardar')));
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['identidad'] = $this->_request->getPost('identidad');
             $params['idusuario'] = $this->global->Perfil->idusuario;
            echo json_encode(array('codMsgN' => ControldemandaModel::adicionarControlDemanda($params)));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function eliminarControlDemandaAction() {
        try {
            $params['tuplasaeliminar'] = json_decode(stripslashes($this->_request->getPost('tuplasaeliminar')));
            echo json_encode(array('codMsgN' => ControldemandaModel::eliminarControlDemanda($params)));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function aprobarEjecucionAction() {
        try {
            $params['tuplasaguardar'] = json_decode(stripslashes($this->_request->getPost('tuplasaguardar')));
            $params['idaprobacion'] = $this->_request->getParam('idaprobacion');
            echo json_encode(array('codMsgN' => ControldemandaModel::aprobarEjecucion($params)));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function exportarEjecucionAcumuladaMesAction() {
        try {
            ini_set("max_execution_time", 600);
            $params['idcentros'] = json_decode(stripslashes($this->_request->getParam('idcentros')));
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['ejercicio'] = $this->_request->getParam('ejercicio');
            $params['idmes'] = $this->_request->getParam('idmes');
            $params['denommes'] = $this->_request->getParam('denommes');
            $params['cbVA'] = $this->_request->getParam('cbVA');
            $params['cbVADenom'] = $this->_request->getParam('cbVADenom');
            $params['identidad'] = $this->_request->getParam('identidad');
            echo json_encode(ControldemandaModel::exportarEjecucionAcumuladaMes($params));
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

    public function exportarEjecucionOSDEAction() {
        try {
            ini_set("max_execution_time", 600);
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['ejercicio'] = $this->_request->getParam('ejercicio');
            $params['tipo'] = $this->_request->getParam('tipo');
            $params['cbVA'] = $this->_request->getParam('cbVA');
            $params['cbVADenom'] = $this->_request->getParam('cbVADenom');
            $params['idcentros'] = json_decode(stripslashes($this->_request->getParam('idcentros')));
            echo json_encode(ControldemandaModel::exportarEjecucionOSDE($params));
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

    public function verCompImportesAction() {
        try {
            ini_set("max_execution_time", 600);
            $params['idcb'] = json_decode(stripslashes($this->_request->getParam('idcb')));
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['ejercicio'] = $this->_request->getParam('ejercicio');
            $params['cbVA'] = $this->_request->getParam('cbVA');
            $params['cbVADenom'] = $this->_request->getParam('cbVADenom');
            echo json_encode(ControldemandaModel::verCompImportes($params));
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

}
