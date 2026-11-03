<?php

class ConfigurarejercicioController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function configurarejercicioAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function obtenerNomencladorEstadoAction() {
        $parametros->idestado = $this->_request->getParam('idestado');
        $parametros->uri = 'estadosejercicio';
        $resultado = NomDatosnomenclador::getDatosNomPorUriTipoNomIdestado($parametros);
        echo json_encode(array('data' => $resultado));
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function getEjerciciosBaseTraspasarAction() {
        $resultado = NomEjercicioplanificacion::getEjerciciosBaseTraspasar();
        echo json_encode(array('data' => $resultado));
    }

    public function existeActualAction() {
        $actual = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("actual = 1");
        if ($actual[0]->idejercicio == null)
            echo json_encode(array('mensaje' => 0));
        else
            echo json_encode(array('mensaje' => 1));
    }

    public function listarEjerciciosAction() {
        $modeloNegocioEjercicio = new ConfigurarejercicioModel();
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        echo json_encode(ConfigurarejercicioModel::obtenerListadoEjercicios($parametros));
    }

    public function cambiarActualAction() {
        ini_set("max_execution_time", 36000); //10 horas
        try {
            $parametros->idejercicio = $this->_request->getParam('idejercicio');
            ConfigurarejercicioModel::cambiarEjercicioActual($parametros);
            echo json_encode(array('mensaje' => 1));
        } catch (Exception $e) {
            echo json_encode(array('mensaje' => 0));
        }
    }

    public function cambiarEstadoAction() {
        try {
            $parametros->iddatosnomenclador = $this->_request->getParam('iddatosnomenclador');
            $parametros->idejercicio = $this->_request->getParam('idejercicio');
            ConfigurarejercicioModel::cambiarEstado($parametros);
            echo json_encode(array('mensaje' => 1));
        } catch (Exception $e) {
            echo json_encode(array('mensaje' => 0));
        }
    }

    public function eliminarEjerciciosAction() {
        ini_set("max_execution_time", 36000); //10 horas        
        try {
            $idejercicio = json_decode(stripslashes($this->_request->getParam('idejercicio')));
            ConfigurarejercicioModel::eliminarEjercicio($idejercicio);
            echo json_encode(array('mensaje' => 1));
        } catch (Exception $e) {
            echo json_encode(array('mensaje' => 0));
        }
    }

    //listarEjerciciosParaAdicionar
    public function listarEjerciciosParaAdicionarAction() {
        $parametros['ejerciciocontable'] = $this->_request->getParam('ejerciciocontable');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['ejercicio'] = $this->_request->getParam('ejercicio');
        if ($parametros['ejerciciocontable'] == 1) {
            $data = NomEjercicioplanificacion::obtenerEjercicoDedatosMaestros($parametros['idejercicio']);
        } else {
            $data = ConfigurarejercicioModel::obtenerDenominacionEjercicoNoContable($parametros['idejercicio'], $parametros['ejercicio']);
        }
        echo json_encode(array("data" => $data));
    }

    public function validarExistenciaDatosAction() {
        $idejercicio = $this->_request->getParam('idejerciciotraspasar');
        $identidad = $this->_request->getParam('identidad');
        $result = ConfigurarejercicioModel::validarExistenciaDatos($idejercicio, $identidad);
        echo json_encode(array('resultado' => $result));
    }

    public function adicionarModificarEjercicioAction() {
        ini_set("max_execution_time", 36000); //10 horas
        try {
            $parametros->accion = $this->_request->getParam('accion');
            $parametros->cargainicialenergetica = $this->_request->getParam('cargainicialenergetica');           
            $parametros->denominacion = $this->_request->getParam('denominacion');
            $whereIdind = "";
            if ($parametros->accion == 'modificar') {
                $parametros->idejercicioplanificacion = $this->_request->getParam('idejercicioplanificacion');
                $whereIdind = " AND idejercicio<>$parametros->idejercicioplanificacion";
            }
            //si no existe ya la denominacion en la tabla
            $objejercicio = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = '$parametros->denominacion' $whereIdind");
            if ($objejercicio[0]->idejercicio == null) {
                //segun el ejercicio que se confuguro por seguridad 
                //pongo el idejerciciocontable en null o con su respectivo valor
                $parametros->ejerciciocontable = $this->_request->getParam('ejerciciocontable');
                if ($parametros->ejerciciocontable == 1)
                    $parametros->idejerciciodatosmaestros = $this->_request->getParam('idejerciciodatosmaestros');
                else
                    $parametros->idejerciciodatosmaestros = null;

                $parametros->ejercicioactual = $this->_request->getParam('ejercicioactual');
                //si no hay ejercicio actual aunque el user no quiera se lo pongo como actual
                if ($parametros->ejercicioactual == 0) {
                    $idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
                    if (!$idejercicioactual['idejercicio']) {
                        $parametros->ejercicioactual = 1;
                    }
                }
                if ($parametros->accion == 'adicionar') {
                    $estado = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadosejercicio', 'elaboracion');
                    $parametros->idestado = $estado[0]['iddatosnomenclador'];
                }
                $parametros->idusuario = $this->global->Perfil->idusuario;
                ConfigurarejercicioModel::adicionarModificarEjercicio($parametros);
                echo json_encode(array('mensaje' => 1));
            } else {
                //ya existe la denominacion
                echo json_encode(array('mensaje' => 2));
            }
        } catch (Exception $e) {
            echo json_encode(array('mensaje' => 0));
        }
    }

    public function traspasarInformacionEjercicioAction() {
        ini_set("max_execution_time", 36000); //10 horas
        try {
            $parametros->idejercicioDestino = $this->_request->getParam('idejercicioDestino');
            $parametros->idejercicioBase = $this->_request->getParam('idejercicioBase');
            $parametros->identidad = $this->_request->getParam('identidad');
            $parametros->porciento = $this->_request->getParam('porciento');
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros->identidad);
            $parametros->entidades = implode(',', $entidades);
            $parametros->planes = $this->_request->getParam('planes');
            $parametros->niveles = $this->_request->getParam('niveles');
            $parametros->desglose = $this->_request->getParam('desglose');
            $parametros->norma = $this->_request->getParam('norma');
            $parametros->regla = $this->_request->getParam('regla');
            $parametros->idusuario = $this->global->Perfil->idusuario;

            $planes = ($parametros->planes == 'true') ? 1 : 0;
            $niveles = ($parametros->niveles == 'true') ? 1 : 0;
            $normaregla = ($parametros->normaregla == 'true') ? 1 : 0;

            NomEjercicioplanificacion::eliminarTodo($parametros->idejercicioDestino, $planes, $niveles, $normaregla, $parametros->entidades);

            if ($parametros->planes == 'true') {
                NomEjercicioplanificacion::duplicarPlanes($parametros->idejercicioDestino, $parametros->idejercicioBase, $parametros->porciento, $parametros->entidades);
            }
            if ($parametros->niveles == 'true') {
                NomEjercicioplanificacion::duplicarNiveles($parametros->idejercicioDestino, $parametros->idejercicioBase, $parametros->porciento, $parametros->entidades);
                if ($parametros->desglose == 'true') {
                    NomEjercicioplanificacion::duplicarDesglose($parametros->idejercicioDestino, $parametros->idejercicioBase, $parametros->entidades);
                }
            }
            if ($parametros->regla == 'true') {
                NomEjercicioplanificacion::duplicarNormaRegla($parametros->idejercicioDestino, $parametros->idejercicioBase, $parametros->idusuario);
            } else {
                if ($parametros->norma == 'true') {
                    NomEjercicioplanificacion::duplicarNorma($parametros->idejercicioDestino, $parametros->idejercicioBase, $parametros->idusuario);
                }
            }
            echo json_encode(array('mensaje' => 1));
        } catch (Exception $e) {
            echo json_encode(array('mensaje' => 0));
        }
    }

}
