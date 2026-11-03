<?php

class BpcalculoController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function bpcalculoAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function listarCalculosAction() {
        try {
            ini_set("max_execution_time", 600); //10min
            $params = array();
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['glob'] = $this->_request->getPost('glob');
            $params['tipocalc'] = $this->_request->getPost('tipocalc');
            $params['hoja'] = $this->_request->getPost('hoja');
            //este es el modelo que se va a actualizar solo cuando se selecciona en el arbol de planes
            $params['idmodelo'] = $this->_request->getPost('idmodelo');
           
            $data = DatBasescalculoModel::listar($params);
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function exportarAction() {
        ini_set("max_execution_time", 600); //10min
        $params = array();
        $params['integrator'] = $this->integrator;
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['text'] = $this->_request->getParam('text');
        $params['is_leaf'] = $this->_request->getParam('is_leaf');
        $params['glob'] = $this->_request->getParam('glob');
        $params['tipocalc'] = $this->_request->getParam('idtipocalc');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        $params['hoja'] = $this->_request->getParam('hoja');
        $params['idmodelo'] = $this->_request->getParam('idmodelo');
        $modelCalc = new DatBasescalculoModel();
        $modelCalc->exportarAExcel($params);
    }

//actualizar o eliminar cálculos o salidas
    public function operacionesBasesDeCalculoAction() {
        try {
            $identidad = $this->_request->getPost('identidad');
            $operacion = $this->_request->getPost('operacion');
            $idejercicio = $this->_request->getPost('idejercicio');
            $idtipocalc = $this->_request->getPost('idtipocalc'); //1 normas 2 salidas
            $modelBasesCalculo = new DatBasescalculoModel();
            if ($operacion == 'actualizar') {
                ini_set("max_execution_time", 600); //10min
                $idusuario = $this->global->Perfil->idusuario;
                $dominioEntidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($identidad);
                $arrayParaleloEntEsp = DatBasescalculoModel::getArrayEspecialidades($dominioEntidades, '3');
                if ($modelBasesCalculo->generarBaseDeCalculoDeUnaEntidad($arrayParaleloEntEsp, $idtipocalc, $idejercicio,$idusuario)) {
                    echo json_encode(array('codMsgN' => 1));
                } else {
                    echo json_encode(array('codMsgN' => 0));
                }
            } elseif ($operacion == 'eliminar') {
                $modelBasesCalculo->eliminarBaseDeCalculoDeUnaEntidad($identidad, $idtipocalc, $idejercicio);
                echo json_encode(array('codMsgN' => 1));
            } else {
                echo json_encode(array('codMsgN' => 0));
            }
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

//listar arbol de planes que se pueden actualizar
    public function listarplanmodeloAction() {
        try {
            ini_set("max_execution_time", 600); //10min
            $identidad = $this->_request->getPost('idesctructura');
            $tipo = $this->_request->getPost('tipo');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['tipocalc'] = $this->_request->getPost('tipocalc');
            $node = $this->_request->getPost('node');
            $limpiar = $this->_request->getPost('limpiar');
            $data = array();
            if ($limpiar == 0) {
                $model = new DatPlanModel();
                $data = $model->listarArbolPlanesBaseCalculo($identidad, $tipo, $node, $params['idejercicio'], $params['tipocalc']);
            }
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function actualizarplanesAction() {
        try {
            ini_set("max_execution_time", 6400); //600:10min 6400:2horas
            $idmodelo = $this->_request->getPost('idmodelo');
            $idestructura = $this->_request->getPost('idestructura');
            $idespecialidad = $this->integrator->metadatos->DameEstructura($idestructura);
            $idespecialidad = $idespecialidad[0]->idespecialidad;
            $idejercicio = $this->_request->getPost('idejercicio');
            $idtipocalc = $this->_request->getPost('idtipocalc');
             $idusuario = $this->global->Perfil->idusuario;
            $model = new DatBasescalculoModel();
            $result = $model->actualizarPlanes($idmodelo, $idestructura, $idespecialidad, $idejercicio, $idtipocalc,$idusuario);
            echo json_encode(array('cod' => $result));
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    /* metodos auxiliares */

    public function entidadODAction() {
        try {
            $identidad = $this->_request->getPost('identidad');
            $obj = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($identidad);
            if ($obj[0])
                echo json_encode(1);
            else
                echo json_encode(0);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Ejercicio actual y la lista de ejecicios     
    public function getEjerciciosAction() {
        try {
            $data = null;
            $data->data = $this->pIntegrator->planmeta->obtenerEjercicios();
            $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarNaturalezaAction() {
        try {
            $naturaleza = DatBasescalculoModel::obtenerNaturalezas();
            echo json_encode(array('data' => $naturaleza));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarPaisesAction() {
        try {
            $this->nomenclador = new ZendExt_Nomencladores_ADT();
            $pais = $this->nomenclador->selectParam('nom_pais', array('idpais', 'nombrepais'));
            foreach ($pais as $k => $valor) {
                unset($pais [$k]['nombrepais']);
                $pais [$k] ['denominacion'] = $valor ['nombrepais'];
            }
            echo json_encode(array('data' => $pais));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarViaAdquisicionAction() {
        try {
            echo json_encode(NomViaadquisicionModel::listarViaAdq());
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarOrganoSatisfaceAction() {
        try {
            $data = NomIndicadorModel::listarnombresorganoSatisface();
            $data->data[] = array('idorganosatisface' => '-', 'denominacion' => '-', 'descripcion' => '-', 'color' => '-', 'uriorganosatisface' => '-', 'idpadre' => '-', 'nivelarbol' => '-', 'ordender' => '-', 'ordenizq' => '-', 'idarbol' => '-');
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarCentroBalanceAction() {
        try {
            $idcentrobalance = 1;
            $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);
            foreach ($centrobalance as $k => $valor) {
                $dat[$k]['idcentrobalance'] = $valor['identidaddatosnomenclador'];
                $datosentidad = $this->integrator->metadatos->DameEstructura($valor['identidad']);
                $dat[$k]['centrobalance'] = $datosentidad[0]->denominacion;
            }
            echo json_encode(array('data' => $dat));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function cargarunidadmedidaAction() {
        try {
            $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            echo json_encode(array('data' => $unidades));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarModelosAction() {
        try {
            $idEstructura = $this->_request->getParam('identidad');
            if ($idEstructura == null) {
                $global = ZendExt_GlobalConcept::getInstance();
                $idEstructura = $global->Estructura->idestructura;
            }
            $data->data = DatEntidadmodelo::servBP_getModeloAsocEntidad($idEstructura);
            $data->data[] = array('idmodelo' => '-', 'denominacion' => '-');
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

}
