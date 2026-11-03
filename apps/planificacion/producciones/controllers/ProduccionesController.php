<?php

class ProduccionesController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
        $this->_meta = ZendExt_Metadata::getInstance();
    }

    public function produccionesAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function entidadODAction() {
        $identidad = $this->_request->getPost('identidad');
        $obj = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($identidad);
        if ($obj[0])
            echo json_encode(true);
        else
            echo json_encode(false);
    }

    public function listarProduccionesAction() {
        try {
            $params = array();
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['global'] = $this->_request->getPost('global');
            $params['fechaInicio'] = json_decode($this->_request->getPost('fechaInicio'));
            $params['fechaFin'] = json_decode($this->_request->getPost('fechaFin'));
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $data = ProduccionesModel::listarProducciones($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function cargarTiposModelosActivosAction() {
        $negocio = 'dat_cartatecnologica';
        $dat->data = $this->pIntegrator->planmeta->obtenerTipoModeloNegocio($negocio);
        echo json_encode($dat);
    }

    //Para obtener columnas dinamicas y pintar grid
    public function obtenerColumnasDinamicasAction() {
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        $result = $this->pIntegrator->planmeta->obtenerConfiguracionGridInterfaces($idtipomodelo);
        echo json_encode($result);
    }

    public function cargarUnidaddeMedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function cargarVariablesAction() {
        $result = CaracterizacionentidadModel::cargarVariables();
        echo json_encode(array('data' => $result));
    }

    public function listarCartasAddProduccionAction() {
        $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['identidades'] = $params['identidad'];
        $params['global'] = 'true';
        $params['produccion'] = true;
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['integrator'] = $this->integrator;
        $obj = $this->pIntegrator->planmeta->obtenerDatosTipoModelo($params['idtipomodelo']);
        $params['idtabla'] = $obj[0]['idtabla'];
        $x = $this->_meta->Metadata()->obtenerInfoTabla($params['idtabla']);
        if ($params['filtros'][0])
            $x = CartaTecnologicaModel::ordenarFiltros($params['filtros'], $x);
        $elementos = CartaTecnologicaModel::listarCartas($params, $x);
        $x = $this->_meta->Metadata()->obtenerInfoTabla($params['idtabla']);
        if ($params['filtros'][0])
            $x = CartaTecnologicaModel::ordenarFiltros($params['filtros'], $x);
        $total = CartaTecnologicaModel::listarTotalCartas($params, $x);
        echo json_encode(array('data' => $elementos, 'total' => $total));
    }

    public function adicionarProduccionAction() {
        try {
            $params['producciones'] = json_decode($this->_request->getPost('producciones'));
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $params['pIntegrator'] = $this->pIntegrator;
            $actualizados = 0;
            if ($params['producciones'][0]->idcartatecnologica != null) {
                $actualizados = ProduccionesModel::adicionarProduccion($params);
            }
            echo json_encode(array('codMsgN' => $actualizados));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarProduccionAction() {
        try {
            $params['producciones'] = json_decode($this->_request->getPost('producciones'));
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $params['pIntegrator'] = $this->pIntegrator;
            $actualizados = ProduccionesModel::guardarProducciones($params);
            echo json_encode(array('codMsgN' => $actualizados));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function aprobarProduccionesAction() {
        try {
            $params['producciones'] = json_decode($this->_request->getPost('producciones'));
            $params['idaprobacion'] = $this->_request->getPost('idaprobacion');
            $params['integracion_proyecto'] = $this->_request->getPost('integracion_proyecto');
            $params['pIntegrator'] = $this->pIntegrator;
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $actualizados = ProduccionesModel::desAprobProducciones($params);
            echo json_encode(array('codMsgN' => $actualizados['codMsgN'], 'codIntegracionProy' => $actualizados['codIntegracionProy']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function eliminarProduccionesAction() {
        try {
            $params['producciones'] = json_decode($this->_request->getPost('producciones'));
            $actualizados = ProduccionesModel::eliminarProducciones($params);
            echo json_encode(array('codMsgN' => $actualizados));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //GESTIONAR SERVICIOS

    public function listarActividadesProduccionAction() {
        try {
            $params['idaplicacioncartatec'] = $this->_request->getPost('idaplicacioncartatec');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');
            $data = ProduccionesModel::listarActividadesProduccion($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarServiciosActividadesProduccionAction() {
        try {
            $params['idaplicacioncartatec'] = $this->_request->getPost('idaplicacioncartatec');
            $params['idcartatecnologicaactividad'] = $this->_request->getPost('idcartatecnologicaactividad');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');
            $data = ProduccionesModel::listarServiciosActividadesProduccion($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarActividadesAddServicioAction() {
        $params = array();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['idproduccion'] = $this->_request->getPost('idproduccion');
        $params['idcartaactividadorigen'] = $this->_request->getPost('idcartaactividadorigen');
        $params['idactividadentidadprodcartatec'] = $this->_request->getPost('idactividadentidadprodcartatec');
        $params['fechainicio'] = $this->_request->getPost('fechainicio');
        $params['fechafin'] = $this->_request->getPost('fechafin');
        $params['identidad'] = $this->_request->getPost('identidad');
        $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
        $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
        $objCartaAct = Doctrine::getTable('DatCartatecnologicaactividad')->findByDql("idcartatecnologicaactividad = {$params['idcartaactividadorigen']}");
        $params['idactividadorigen'] = $objCartaAct[0]->idactividad;
        if (!$params['idactividadentidadprodcartatec'])
            $data = DatCartatecnologicaModel::listarActividades($params, $params['idactividadorigen']);
        else {
            $data = ProduccionesModel::listarActividadesAddServicio($params);
        }
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function adicionarServicioAction() {
        try {
            $params['idactividad'] = $this->_request->getPost('idactividad');
            $params['idaplicacioncartatec'] = $this->_request->getPost('idaplicacioncartatec');
            $params['idcartatecnologicaactividad'] = $this->_request->getPost('idcartatecnologicaactividad');
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
            $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
            $params['pIntegrator'] = $this->pIntegrator;
            $actualizados = 0;
            if ($params['identidad'] != null && $params['idactividad'] != null && $params['idaplicacioncartatec'] != null && $params['idcartatecnologicaactividad'] != null) {
                $actualizados = ProduccionesModel::adicionarServicio($params);
            }
            echo json_encode(array('codMsgN' => $actualizados));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function actualizarServicioAction() {
        try {
            $params['servicios'] = json_decode($this->_request->getPost('servicios'));
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
            $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
            $params['pIntegrator'] = $this->pIntegrator;
            $actualizados = 0;
            if ($params['servicios'][0]->idservicio != null) {
                $actualizados = ProduccionesModel::actualizarServicio($params);
            }
            echo json_encode(array('codMsgN' => $actualizados));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function eliminarServicioAction() {
        try {
            $params['servicios'] = json_decode($this->_request->getPost('servicios'));
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['pIntegrator'] = $this->pIntegrator;
            $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
            $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
            $actualizados = 0;
            if ($params['servicios'][0]->idservicio != null) {
                $actualizados = ProduccionesModel::eliminarServicio($params);
            }
            echo json_encode(array('codMsgN' => $actualizados));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function cargarEtapasAction() {
        $data = DatCartatecnologicaModel::listarEtapas();
        echo json_encode(array('data' => $data));
    }

    public function exportarProduccionesAction() {
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['denoentidad'] = $this->_request->getParam('denoentidad');
        $params['tipo'] = $this->_request->getParam('tipo');
        $params['global'] = $this->_request->getParam('global');
        $params['fechaInicio'] = json_decode(stripslashes($this->_request->getParam('fechaInicio')));
        $params['fechaFin'] = json_decode(stripslashes($this->_request->getParam('fechaFin')));
        $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $params['start'] = null;
        $params['limit'] = null;
        $salida = new ProduccionesModel;
        $salida->exportarProducciones($params);
    }

    public function exportarActividadesOIndicadoresProduccionesAction() {
        $params['denoentidad'] = $this->_request->getParam('denoentidad');
        $params['idaplicacioncartatec'] = $this->_request->getParam('idaplicacioncartatec');
        $params['denominacion'] = $this->_request->getParam('denominacion');
        $params['producto'] = $this->_request->getParam('producto');
        $params['valorrendimiento'] = $this->_request->getParam('valorrendimiento');
        $params['nivelactividad'] = $this->_request->getParam('nivelactividad');
        $params['fechainicio'] = $this->_request->getParam('fechainicio');
        $params['fecha'] = $this->_request->getParam('fecha');
        $params['tipo'] = $this->_request->getParam('tipo');
        $params['fechafin'] = $this->_request->getParam('fechafin');
        $salida = new ProduccionesModel;
        $salida->exportarActividadesOIndicadoresProducciones($params);
    }

    public function adicionarAPlanAction() {
        try {
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['idmodelo'] = $this->_request->getParam('idmodelo');
            $msg = ProduccionesModel::adicionarAPlan($params);
            echo json_encode(array('codMsgN' => $msg));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function getEjerciciosAction() {
        $data = null;
        $ejercicios = $this->pIntegrator->planmeta->obtenerEjercicios();
        $ejercsal = array();
        for ($index = 0; $index < count($ejercicios); $index++) {
            if ($ejercicios[$indeax]['denomestado'] != "Listo") {
                $ejercsal[] = $ejercicios[$index];
            }
        }
        $data->data = $ejercsal;
        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        echo json_encode($data);
    }

    public function listarplanmodeloAction() {
        ini_set("max_execution_time", 600); //10min
        $identidad = $this->_request->getPost('idesctructura');
        $tipo = $this->_request->getPost('tipo');
        $node = $this->_request->getPost('node');
        $idejercicio = $this->_request->getPost('idejercicio');
        $elementos = ProduccionesModel::listarModelosAct($identidad, $tipo, $node, $idejercicio);
        echo json_encode($elementos);
    }

}
