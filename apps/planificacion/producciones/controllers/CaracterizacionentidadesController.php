<?php

class CaracterizacionentidadesController extends ZendExt_Controller_Secure {

    //Inicializar el componente
    public function init() {
        $this->model = new CaracterizacionentidadModel();
        $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }

    //Renderizar la vista
    public function caracterizacionentidadesAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    //Listar variables de control
    public function listarVariablesAction() {
        $identidad = $this->_request->getPost('identidad');
        $node = $this->_request->getPost('node');
        $arrenthijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
        $elementos = $this->model->listar($arrenthijas, $node);
        echo json_encode($elementos);
    }

    //Para adicionar o modificar una agrupacion o variable
    public function adicionarmodificarElementoAction() {
        $params['idelemento'] = $this->_request->getPost('idelemento');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['descripcion'] = $this->_request->getPost('descripcion');
        $params['accion'] = $this->_request->getPost('accion');
        $params['tipo'] = $this->_request->getPost('tipo');
        $params['variable'] = $this->_request->getPost('variable');
        if ($params['variable'] == 1) {
            $params['idunidadmedida'] = $this->_request->getPost('idunidadmedida');
            $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
        }
        $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        $this->model->adicionarmodificarElemento($params);
        echo json_encode(array('codMsgM' => 1));
    }

    //Para eliminar una agrupacion o variable
    public function eliminarElementoAction() {
        try {
            $idelemento = $this->_request->getPost('idelemento');
            $this->model->eliminarElemento($idelemento);
            echo json_encode(array('codMsgM' => 1));
        } catch (Exception $e) {
            echo json_encode(array('codMsgM' => $e->getMessage()));
        }
    }

    //Para obtener columnas dinamicas y pintar grid
    public function obtenerColumnasDinamicasAction() {
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        $result = $this->pIntegrator->planmeta->obtenerConfiguracionGridInterfaces($idtipomodelo);
        echo json_encode($result);
    }

    //Listar datos de la entidad - variable
    public function listarDatosEntidadVariableAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idvariable'] = $this->_request->getPost('idvariable');
        $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
        $params['global'] = $this->_request->getPost('global');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $obj = $this->pIntegrator->planmeta->obtenerDatosTipoModelo($params['idtipomodelo']);
        if ($params['global'] == 'true') {
            $params['identidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        $params['idtabla'] = $obj[0]['idtabla'];
        $x = $this->_meta->Metadata()->obtenerInfoTabla($params['idtabla']);
        $params['filtros'] = json_decode(stripslashes($this->_request->getPost('filtrosD')));
        if ($params['filtros'][0])
            $x = $this->model->ordenarFiltros($params['filtros'], $x);
        $elementos = $this->model->listarDatosEntidadVariable($params, $x);
        $x = $this->_meta->Metadata()->obtenerInfoTabla($params['idtabla']);
        if ($params['filtros'][0])
            $x = $this->model->ordenarFiltros($params['filtros'], $x);
        $total = $this->model->listarTotalEntidadVariable($params, $x);
        $codigotm = $obj[0]['codigo'];
        $concat = $codigotm . '_id' . $codigotm;
        $llave = "mod_planificacionmeta_nom_$concat";
        $llaveprimaria = "mod_planificacionmeta_dat_$concat";
        echo json_encode(array('data' => $elementos, 'total' => $total, 'llave' => $llave, 'llaveprimaria' => $llaveprimaria));
    }

    //Listar texto de las entidades
    public function listarFiltrosEntidadesAction() {
        $idEstructura = $this->pIntegrator->planmeta->obtenerEntidadRectora();
        $result = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura[0]['identidad'], true);
        echo json_encode(array('data' => $result));
    }

    //Guardar datos de la caracterizacion
    public function GuardarAction() {
        $parametros = $this->_request->getParams();
        $this->model->guardar($parametros);
        $dat->codMsgM = 20;
        echo json_encode($dat);
    }

//Listar las entidades a asociar o desasociar
    public function listarEntidadesAsociarAction() {
        $idvariable = $this->_request->getPost('idvariable');
        $accion = $this->_request->getPost('accion');
        $identidadcrea = $this->_request->getPost('identidadcrea');
        $iddominio = $this->global->Perfil->iddominio;
        $identidades = $this->integrator->metadatos->IdEstructurasDominio($iddominio);
        $dat = $this->model->listarEntidadesAsociar($idvariable, $accion, $identidades, $identidadcrea);
        echo json_encode(array('data' => $dat));
    }

    //Asociar o desasociar variables y agrupaciones
    public function asociarDesasociarElementoAction() {
        try {
            $params['accion'] = $this->_request->getPost('accion');
            $params['tipo'] = $this->_request->getPost('tipo');
            $params['idelemento'] = $this->_request->getPost('idelemento');
            $params['idpadre'] = $this->_request->getPost('idpadre');
            $params['idarbol'] = $this->_request->getPost('idarbol');
            $params['leaf'] = $this->_request->getPost('leaf');
            $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
            $params['identidad'] = json_decode($this->_request->getPost('identidad'));
            $params['identidad'] = explode(',', $params['identidad']);
            $params['entidades'] = array();
            foreach ($params['identidad'] as $ent) {
                $temp = DatActividadentidad::auxObtenerEntidadesHijasComun($ent);
                $params['entidades'] = array_merge($params['entidades'], $temp);
            }
        
            if ($params['accion'] == 'd') {
                $this->model->desasociarElemento($params);
            } else {
                $this->model->asociarElemento($params);
            }
            $dat->codMsgM = 20;
            echo json_encode($dat);
        } catch (Exception $e) {
            echo json_encode(array('codMsgM' => $e->getMessage()));
        }
    }

    public function listarTiposModelosActivosAction() {
        $negocio = 'dat_variablecontrolentidad';
        $dat->data = $this->pIntegrator->planmeta->obtenerTipoModeloNegocio($negocio);
        echo json_encode($dat);
    }

    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

}
