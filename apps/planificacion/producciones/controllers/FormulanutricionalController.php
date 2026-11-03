<?php

class FormulanutricionalController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
        $this->model = new DatFormulaModel();
    }

    public function cargaInicialAction() {
        $identidad = $this->global->Perfil->idestructuracomun;
        $denoEntidad = $this->global->Perfil->denomestructuracomun;
        echo json_encode(array('identidad' => $identidad, 'denoEntidad' => $denoEntidad));
    }

    public function formulanutricionalAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function listarFormulasNutricionalesAction() {
        $identidad = $this->_request->getPost('identidad');
        $parametros->global = $this->_request->getPost('global');
        if ($parametros->global == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
            $parametros->identidad = implode(',', $entidades);
        } else {
            $parametros->identidad = $identidad;
        }
        $parametros->start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros->filtros = $this->_request->getPost('filtros');
        $result = $this->model->getFormulasNutriModel($parametros);
        $total = $result[0]['total'];
        echo json_encode(array('data' => $result, 'total' => $total));
    }

    public function adicionarFormulasNutricionalesAction() {
        $parametros->idformula = $this->_request->getPost('idformula');
        $parametros->identidad = $this->_request->getPost('identidad');
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->descripcion = $this->_request->getPost('descripcion');
        $parametros->idindicadorsalida = $this->_request->getPost('idindicadorsalida');
        $parametros->idagrupacion = $this->_request->getPost('idagrupacion');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->cantidadsalida = $this->_request->getPost('cantidadsalida');
        $parametros->tipoporciento = $this->_request->getPost('tipoporciento');
        $parametros->kcalformula = $this->_request->getPost('kcalformula');
        $parametros->estado = $this->_request->getPost('estado');
        if ($parametros->idformula) {
            $result = $this->model->modificarFormulasNutricionalesNutricionales($parametros);
        } else {
            $result = $this->model->adicionarFormulasNutricionales($parametros);
        }
        echo json_encode($result);
    }

    public function eliminarFormulasNutricionalesAction() {
        $parametros->idformula = json_decode(stripslashes($this->_request->getPost('idformula')));
        $result = $this->model->eliminarFormulasNutricionalesNutricionales($parametros);
        echo json_encode($result);
    }

    public function cambiarestadoFormulasNutricionalesAction() {
        $params->arrayestadoformulas = json_decode(stripslashes($this->_request->getPost('arrayestadoformulas')));
        $params->idusuario = $idusuario = $this->global->Perfil->idusuario;
        $result = $this->model->cambiarestadoFormulasNutricionales($params);
        echo json_encode($result);
    }

    public function cambiarAsociacionFormulaActividadAction() {
        $params->idformula = $this->_request->getPost('idformula');
        $params->normadas = json_decode(stripslashes($this->_request->getPost('normadas')));
        $params->nonormadas = json_decode(stripslashes($this->_request->getPost('nonormadas')));
        $params->actividadesdesa = json_decode(stripslashes($this->_request->getPost('actividadesdesa')));
        $params->accion = $this->_request->getPost('accion');
        $result = $this->model->cambiarAsociacionFormulaActividad($params);
        echo json_encode($result);
    }

    public function comprobarActividadAction() {
        $params->idactividades = json_decode(stripslashes($this->_request->getPost('idactividades')));
        $result = $this->model->comprobarActividad($params);
        echo json_encode($result);
    }

    public function cargarfiltrousuarioAction() {
        $idsusers = DatFormula::obtenerIdUsuaios();
        $arrayresult = array();
        foreach ($idsusers as $value) {
            $obj = new stdClass();
            $obj->idusuario = $value['idusuario'];
            $denominacion = $this->integrator->seguridad->nombreUsuario($idsusers[0]['idusuario']);
            $obj->denominacion = $denominacion;
            array_push($arrayresult, $obj);
        }
        echo json_encode(array('data' => $arrayresult));
    }

    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function listarAgrupacionesAction() {
        $result = $this->model->getAgrupaciones();
        echo json_encode(array('data' => $result));
    }

    public function listarIndicadoresAction() {
        $parametros->start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros->filtros = $this->_request->getPost('filtros');
        $result = $this->model->getIndicadores($parametros);
        echo json_encode(array('data' => $result));
    }

    public function listarComponentesFormulasNutriAction() {
        $parametros->identidad = $this->_request->getPost('identidad');
        $parametros->idformula = $this->_request->getPost('idformula');
        $parametros->idtablacalorica = $this->_request->getPost('idtablacalorica');
        $parametros->start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros->filtros = $this->_request->getPost('filtros');
        $result = $this->model->getindicadoresTCFormula($parametros);
        echo json_encode(array('data' => $result->data, 'total' => $result->total));
    }

    public function listarComponentesAction() {
        $parametros->idformula = $this->_request->getPost('idformula');
        $parametros->start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros->filtros = $this->_request->getPost('filtros');
        $result = $this->model->listarComponentes($parametros);
        echo json_encode(array('data' => $result->data, 'total' => $result->total,
            'importetotal' => $result->importeTotal, 'kcaltotal' => $result->kcaltotal,
            'grasastotal' => $result->grasastotal, 'proteinastotal' => $result->proteinastotal,
            'carbohidratostotal' => $result->carbohidratostotal));
    }

    //Guarda los indicadores correpondientes a cada formula
    public function adicionarNormaAFormulaAction() {
        $parametros->idformula = $this->_request->getPost('idformula');
        $parametros->arraytablac = json_decode(stripslashes($this->_request->getPost('arraytablac')));
        $result = $this->model->adicionarNormaAFormula($parametros);
        echo json_encode($result);
    }

    public function eliminarNormaAFormulaAction() {
        $parametros->idformula = $this->_request->getPost('idformula');
        $parametros->arrayidtablac = json_decode(stripslashes($this->_request->getPost('arrayidtablac')));
        $result = $this->model->eliminarNormaAFormula($parametros);
        echo json_encode($result);
    }

    public function cargarIndicadorSalidadAction() {
        $parametros->idformula = $this->_request->getPost('idformula');
        $result = $this->model->cargarIndicadorSalidad($parametros);
        echo json_encode(array('data' => $result));
    }

    public function listarActividadesAction() {
        $parametros->idformula = $this->_request->getPost('idformula');
        $parametros->asociardesa = $this->_request->getPost('asociardesa');
        $parametros->start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $result = $this->model->listarActividades($parametros);
        echo json_encode(array("data" => $result, "total" => $result[0]['total']));
    }

    public function cargarUsuariosAction() {
        $result = $this->model->cargarUsuarios();
        echo json_encode(array("data" => $result));
    }

    public function cargarAgrupacionesAction() {
        $result = $this->model->getAgrupaciones();
        echo json_encode(array("data" => $result));
    }

}
