<?php

class ControlController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function controlAction() {
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

    //Lista todas las unidades de medida
    public function cargarUnidadMedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    //Lista todos los usuarios
    public function cargarUsuariosAction() {
        $idusariologueado = $this->global->Perfil->idusuario;
        $usuarios = $this->integrator->seguridad->getAllUsers();
        $data->data =$usuarios;         
        $data->idusariologueado = $idusariologueado;     
        echo json_encode( $data);
    }

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

    //Lista todos los programas
    public function cargarProgramasAction() {
        $data = DemandaproduccionModel::cargarProgramas();
        echo json_encode(array('data' => $data));
    }

    //Lista todos los destinos
    public function cargarDestinosAction() {
        $data = DemandaproduccionModel::cargarDestinos();
        echo json_encode(array('data' => $data));
    }

    //Obtiene los comportamientos de una entidad(menos el "Cliente")
    public function obtenerComportamientosControlAction() {
        try {
            $params['identidad'] = $this->_request->getPost('identidad');
            $obj = DatDemandatiempoModel::obtenerComportamientoEjecutorProductor($params);
            echo json_encode(array('data' => $obj));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Lista el grid principal de las entidades empresa y rector
    public function listarControlEmpresaRectorAction() {
        try {            
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['tipo'] = $this->_request->getPost('tipo');
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            echo json_encode(ControlModel::listarControlEmpresaRector($params));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Lista el grid secundario de las entidades empresa
    public function listarControlEmpresaTallerAction() {
        try {
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['iddemanda'] = $this->_request->getPost('iddemanda');
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            echo json_encode(ControlModel::listarControlEmpresaTaller($params));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Lista el grid principal de las entidades taller
    public function listarControlEjecucionProductorAction() {
        try {
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            echo json_encode(ControlModel::listarControlEjecucionProductor($params));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Lista el grid secundario de las entidades taller
    public function listarEjecucionAction() {
        try {
            $params['iddemandatiempo'] = $this->_request->getPost('iddemandatiempo');
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            echo json_encode(ControlModel::obtenerEjecucionByDemanda($params));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function exportarControlEmpresaTallerRectorAction() {
        try {
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['denoentidad'] = $this->_request->getParam('denoentidad');
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['denoejercicio'] = $this->_request->getParam('denoejercicio');
            $params['tipo'] = $this->_request->getParam('tipo');
            $params['denotipo'] = $this->_request->getParam('denotipo');
            $params['panel'] = $this->_request->getParam('panel');
            $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
            $params['um'] = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            $params['programas'] = DemandaproduccionModel::cargarProgramas();
            $params['destinos'] = DemandaproduccionModel::cargarDestinos();
            ControlModel::exportarControl_Empresa_Taller_Rector($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Gestion del estimado de las empresas
    public function guardarEstimadoControlEmpresaAction() {
        try {
            $params['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $result = ControlModel::guardarEstimadoControlEmpresa($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Metodos para gestionar las ejecuciones y los ajustes del taller
    public function guardarEjecucionProductorAction() {
        try {
            $params['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $result = ControlModel::guardarEjecucionPlan($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function eliminarEjecucionAction() {
        try {
            $params['idejecuciones'] = json_decode(stripslashes($this->_request->getPost('ejecuciones')));
            $result = ControlModel::eliminarEjecucionPlan($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarAjusteControlEmpresaTallerAction() {
        try {
            $params['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $result = ControlModel::guardarAjusteControlEmpresaTaller($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Metodos para gestionar demandas extraplanes
    public function listarIndicadoresDemandaExtraPlanAction() {
        $params['identidad'] = ($this->_request->getPost('identidad'));
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = ControlModel::listarIndicadores($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function guardarDemandaExtraPlanAction() {
        try {
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['idprograma'] = $this->_request->getPost('idprograma');
            $params['iddestino'] = $this->_request->getPost('iddestino');
            $params['cantfinal'] = $this->_request->getPost('cantfinal');
            $params['idindicador'] = $this->_request->getPost('idindicador');
            $params['idcliente'] = $this->_request->getPost('idcliente');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            //entidad productora
            $params['identidadorganosatisface'] = $this->_request->getPost('identidadorganosatisface');
            $result = ControlModel::guardarDemandaExtraPlan($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function eliminarDemandaExtraPlanAction() {
        try {
            $params['iddemanda'] = $this->_request->getPost('iddemanda');
            $result = ControlModel::eliminarDemandaExtraPlan($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Metodos para gestionar los desgloses de las demandas extraplanes
    public function listarDesgloseDemandaExtraPlanAction() {
        try {
            $params['iddemanda'] = $this->_request->getPost('iddemanda');
            $params['tipo'] = 2;
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $data = DatDemandatiempo::listarPlanProduccionDesagregado($params);
            echo json_encode(array('total' => $data[0]['total'], 'data' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarEntidadesEjecutorasAction() {
        $res = array();
        $pos = 0;
        $params['iddemanda'] = $this->_request->getPost('iddemanda');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        $params['entidades'] = implode(',', $entidades);
        $data = DatDemandatiempoModel::listarEntidadesEjecutoras($params);
        foreach ($data as $identidad) {
            $datoestructura = $this->integrator->metadatos->DameEstructura($identidad['identidad']);
            $res[$pos]['denominacion'] = $datoestructura[0]->denominacion;
            $res[$pos]['idestructura'] = $datoestructura[0]->idestructura;
            $pos++;
        }
        echo json_encode(array('data' => $res, 'total' => $data[0]['total']));
    }

    public function adicionarDesagAction() {
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $params['iddemanda'] = $this->_request->getPost('iddemanda');
        $params['identidades'] = json_decode(stripslashes($this->_request->getPost('identidad')));
        $data = DatDemandatiempoModel::adicionarDesag($params);
        echo json_encode(array('codMsgN' => $data));
    }

    public function eliminarDesgloseDemandaExtraPlanAction() {
        try {
            $params['iddemandatiempo'] = $this->_request->getPost('iddemandatiempo');
            $result = ControlModel::eliminarDesgloseDemandaExtraPlan($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarDatosDesgExtraplanAction() {
        try {
            $params['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
            $result = ControlModel::guardarDatosDesgExtraplan($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function cargarMesesAction() {
        try {
            $datos = NomDatosnomenclador::getDatosNomPorUriTipoNom('MES', false, '-');
            echo json_encode(array("data" => $datos));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //Metodo para listar las observaciones de control 
    public function listarObservacionesControlAction() {
        try {
            $params['tipo'] = $this->_request->getPost('tipo');
            $params['iddemandatiempo'] = $this->_request->getPost('iddemandatiempo');
            $params['iddemanda'] = $this->_request->getPost('iddemanda');
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idmes'] = $this->_request->getPost('idmes');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');
            //si es empresa o rector buscar las entidades hijas para mostrar sus observaciones
            if ($params['tipo'] == 2 || $params['tipo'] == 3) {
                $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
                $params['entidades'] = implode(',', $entidades);
            }
            $observaciones = ControlModel::listarObservacionesControl($params);
            echo json_encode(array('data' => $observaciones, 'total' => $observaciones[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarObservacionControlAction() {

        $params['iddemandatiempo'] = $this->_request->getPost('iddemandatiempo');
        $params['iddemanda'] = $this->_request->getPost('iddemanda');
        $params['idmes'] = $this->_request->getPost('idmes');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['observacion'] = $this->_request->getPost('observacion');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $result = ControlModel::guardarObservacionControl($params);
        echo json_encode(array('codMsg' => $result));
    }

}
