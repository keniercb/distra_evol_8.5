<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

/**
 * @class     OrdentrabajotalleresController
 * @package
 * @subpackage
 * @author    Daniel Arias Espinosa
 * @copyright XETID
 * @version   1.0
 */
class OrdentrabajotalleresController extends BaseController//Zend_Controller_Action//
{
    private $_modeloOrden, $_modelReports, $_serviciosCentroCosto, $_arrayData, $_aperturaINV, $_aperturaFAC;

    public function init()
    {
        $this->_arrayData = array('alias' => 'ordenServicioLOG');
        $this->_arrayData['isPrincipal'] = true;
        parent::init('log.tall.ordentrabajo');
        $aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $this->_aperturaINV = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        $this->_arrayData['aperturadoFAC'] =
        $this->_aperturaFAC = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
        $naturalezaPPA = IntegracionNomencladoresModel::NATURALEZA_PPA;
        $this->_arrayData['vgoperariosvarios'] = $this->view->uiVariables['vg_operariosvarios'];
        $this->_arrayData['usarubicaciontall'] = $this->view->uiVariables['usarubicaciontall'];
        $this->_modeloOrden = new OrdenTrabajoTalleresModel($this->_arrayData, $aperturaAFT);
        $monedaAlternativa = LogisticaGlobal::__init()->getMonedaEntidad();
        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->_modeloOrden->getIddoc());
        $cfgContrato = new ConfiguracionTalleresModel();
        $confContrato = $cfgContrato->cargarConfiguracionContrato()['datos'];
        $confTalleres = $cfgContrato->cargarConfiguracionTalleres()['datos'];
        $centroCostosPorActividad = "'false'";
        if ($confTalleres) {
            $centroCostosPorActividad = $confTalleres['centrocostosporactividad'] == 1 ? "true" : "false";
        }
        $this->view->uiVariables = array_merge(
            array('existeAFT' => json_encode($aperturaAFT), 'existeINV' => json_encode($this->_aperturaINV),
                'naturalezaPPA' => $naturalezaPPA, 'monedaAlternativa' => json_encode($monedaAlternativa->codigoisoalt),
                'aperturadoFAC' => json_encode($this->_aperturaFAC),
                'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
                'contratoObligatorio' => $confContrato['contratoobligatorio'] == 1 ? 'true' : 'false',
                'centroCostosPorActividad' => $centroCostosPorActividad
            ), $this->view->uiVariables
        );
        if ($this->_aperturaINV) {
            $this->_serviciosCentroCosto = ServiciosContabilidadFinanzasHelper::__init();
        }
    }

    public function gestOrdentrabajotalleresAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.ordentrabajo');
        $this->renderTemplate();
    }

    public function cargarOrdenesAction()
    {
        $params = $this->uiParams;
        $params['recsolicitudservicio'] = true;
        $resultado = $this->_modeloOrden->devolverOrdenesTrabajo($params);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
        $this->usuarios = $resultado['usuarios'];
    }

    public function cargarMaterialesOrdenAction()
    {
        $params = $this->uiParams;
        $params['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $params['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;
        $resultado = $this->_modeloOrden->devolverMaterialesOrden($this->uiParams['idordentrabajo'], false, $params);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }
    public function insertarubicacionestallAction()
    {   
        // $params = ($this->uiParams);
        $params->datos = Zend_Json::decode($this->uiParams['datos']);
        $params->iddocumento = Zend_Json::decode($this->uiParams['iddocumento']);
        $resultados = $this->_modeloOrden->insertarubicacionestall($params);
        if (!$resultados) {
            $this->success = false;
            $this->responsetext = 'No se pueden añadir dos ubicaciones iguales seguidas';
        } else{
            $this->execute = $resultado; 
        } 
    }
    public function eliminarubicacionestallAction()
    {   
        $params = Zend_Json::decode($this->uiParams['datos']);
        $resultados = $this->_modeloOrden->eliminarubicaciones($params);
        $this->execute = $resultado;
    }
    public function updateubicacionestallAction()
    {   
        $resultados = $this->_modeloOrden->updateubicaciones();
        $this->execute = $resultado;
    }
    public function cargarnomubicaciontallAction(){
        $todas = Zend_Json::decode($this->uiParams['todas']);
        $resultados = $this->_modeloOrden->devolvernomubicacionestall($todas);
        $this->datos = $resultados['datos'];
        $this->cantidad = $resultados['cantidad'];
    }
    public function cargarubicaciontalleresAction($params)
    {   
        $params = $this->uiParams;
        $params['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $params['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;
        $resultados = $this->_modeloOrden->devolverubicacionestall($params);
        //print_r($resultados);die;
        $this->datos = $resultados['datos'];
        $this->cantidad = $resultados['cantidad'];
    }
    public function cargarMaterialesExistentesAction()
    {
        $resultado = $this->_modeloOrden->devolverMaterialesExistentes($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarActividadesOrdenAction()
    {
        $params['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $params['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;
        $resultado = $this->_modeloOrden->devolverActividadesOrden($this->uiParams['idordentrabajo'], $params);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
        $this->importes = $resultado['importes'];
        $this->importesalternativos = $resultado['importesalternativos'];
        $this->servicios = $resultado['servicios'];
    }

    public function cargarActividadesExistentesAction()
    {

        $parametros = $this->uiParams;
        $parametros['idservicio'] = Zend_Json::decode($this->uiParams['idservicio']);

        if ($parametros['todo']){
            $parametros['nivel'] = 4;
            $parametros['idservicio'] = null;
        }


        $result = $this->_modeloOrden->cargarActividadesExistentes($parametros);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];

    }

    public function adicionarDocumentoAction()
    {
        $parametros = Zend_Json::decode($this->uiParams['data']);
        $listActividades = Zend_Json::decode($this->uiParams['listasactividades']);
        $listActividades['idservicioold'] = $this->uiParams['idServicioOld'];
        $listMateriales = Zend_Json::decode($this->uiParams['listasmateriales']);
        $listFallas = Zend_Json::decode($this->uiParams['listasfallas']);
        $datosMedio = $this->uiParams['datosdinamicosmedio'];
        $vg_operariosvarios = $this->_arrayData['vgoperariosvarios'];
        $vg_usarubicaciontall = ($this->_arrayData['usarubicaciontall'] == 1) ? true : false;
        $resultado = $this->_modeloOrden->adicionarOrdenTrabajo(
            $listActividades, $listMateriales, $listFallas, $datosMedio, $parametros, 0, $vg_operariosvarios, $vg_usarubicaciontall
        );
        if (isset($resultado['codMsg'])) {
            $this->codMsg = $resultado['codMsg'];
        }
        if ($resultado['documento']) {
            $doc = $resultado['documento'];
            $existencia = $this->_modeloOrden->comprobarExistenciaTotalOrden($doc['iddocumento']);
            $doc['estadoorden'] = $existencia;
            $this->datos = $doc;
            $this->existiaactividad = $resultado['algunaactvexistia'];
        }
        if ($resultado['identificadorduplicado']) {
            $this->success = false;
            $this->errorAtribIdentificador = true;
        }
    }

    public function adicionarSolucionAction()
    {
        $parametros = Zend_Json::decode($this->uiParams['data']);
        $this->unsetNullValues($parametros);
        $this->datos = $this->_modeloOrden->adicionarSolucion($parametros);
    }

    public function cargarSolucionAction()
    {
        $this->datos = $this->_modeloOrden->devolverSolucion($this->uiParams['idordentrabajo']);
    }

    public function cargarDatosMedioAction()
    {
        $this->datos = $this->_modeloOrden->devolverDatosMedio($this->uiParams['idordentrabajo']);
    }

    public function cargarClientesAction()
    {
        $this->datos = $this->_modeloOrden->cargarClientes($this->uiParams['data']);
    }

    public function eliminarDocumentoAction()
    {
        $iddocumento = Zend_Json::decode($this->uiParams['id']);
        $this->datos = $this->_modeloOrden->eliminarOrden($iddocumento, $this->uiParams['integrarfacturacion']);
    }

    public function confirmarDocumentoAction()
    {
        $iddocumento = Zend_Json::decode($this->uiParams['id']);
        $this->datos = $this->_modeloOrden->confirmarOrden($iddocumento[0], $this->uiParams);
    }

    public function anularEstadoDocumentoAction()
    {
        $iddocumento = Zend_Json::decode($this->uiParams['id']);
        if ($this->uiParams['rectificar']) {
            $this->datos = $this->_modeloOrden->rectificarOrden($iddocumento[0]);
        } else {
            $this->datos = $this->_modeloOrden->anularOrden($iddocumento[0]);
        }

    }

    public function aprobarDocumentoAction()
    {
        $iddocumento = Zend_Json::decode($this->uiParams['id']);
        $this->datos = $this->_modeloOrden->aprobarOrden($iddocumento[0]);
    }

    public function cerrarOrdenTrabajoAction()
    {
        $vg_usarubicaciontall = ($this->_arrayData['usarubicaciontall'] == 1) ? "true" : "false";
        $iddocumento = Zend_Json::decode($this->uiParams['id']);
        $this->objectHelper->synchronize(
            $this,
            $this->_modeloOrden->cerrarOrdenTrabajo($iddocumento[0],$vg_usarubicaciontall)
        );
    }

    public function facturarOrdenTrabajoAction()
    {
        $iddocumento = Zend_Json::decode($this->uiParams['id']);
        $this->objectHelper->synchronize(
            $this,
            $this->_modeloOrden->facturarOrdenTrabajo($iddocumento)
        );
    }

    public function cargarPersonasAction()
    {
        $result = $this->_modeloOrden->cargarPersonas($this->global->Estructura->idestructura, $this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarPersonasConContactosAction()
    {
        $this->objectHelper->synchronize(
            $this,
            $this->_modeloOrden->cargarPersonasConContactos($this->uiParams)
        );
    }

    public function cargarPersonasAreaInternaAction()
    {
//        $this->datos = $this->_modeloOrden->cargarPersonasAreaIinterna($this->uiParams['idarea'], $this->uiParams);
        $this->objectHelper->synchronize(
            $this,
            $this->_modeloOrden->cargarPersonasAreaIinterna($this->uiParams['idarea'], $this->uiParams)
        );
    }

    public function cargarMediosAction()
    {
        $limit = Zend_Json::decode($this->uiParams['limit']);
        $start = Zend_Json::decode($this->uiParams['start']);
        $busqueda = $this->uiParams['busqueda'];
        $idestructura = Zend_Json::decode($this->uiParams['idestructura']);
        $this->datos =
            array('idestructura' => $idestructura, 'busqueda' => $busqueda, 'start' => $start, 'limit' => $limit);
    }

    public function cargarEntidadAction()
    {
        $this->datos = array('identidad' => $this->global->Estructura->idestructura,
            'nomentidad' => $this->global->Estructura->denominacion);
    }

    public function adicionarReclamacionAction()
    {
        $parametros = Zend_Json::decode($this->uiParams['data']);
        $this->datos = $this->_modeloOrden->adicionarReclamacion($parametros);
    }

    public function cargarReclamacionesOrdenAction()
    {
        $resultado = $this->_modeloOrden->cargarReclamacionesOrden($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarMonedasEntidadAction()
    {
        $this->datos = $this->_modeloOrden->devolverMonedasContables();
    }

    public function cargarPosiblesFallasDelMedioAction()
    {
        $resultado = $this->_modeloOrden->cargarPosiblesFallasDelMedio($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarFallasDetectadasAlMedioAction()
    {
        $respuesta = $this->_modeloOrden->cargarFallasDetectadasAlMedio($this->uiParams);
        $this->datos = $respuesta['datos'];
        $this->cantidad = $respuesta['cantidad'];
    }

    public function comprobarExistenciaMaterialAction()
    {
        $params = Zend_Json::decode($this->uiParams['idsindicador']);
        $this->datos = $this->_modeloOrden->comprobarExistenciaMaterial($params);
    }

    public function cargarAreasInternasAction()
    {
        if (!empty($this->uiParams['usarsubordinacion'])) {
            if ($this->uiParams['usarsubordinacion'] == 1) {
                $this->datos = $this->_modeloOrden->cargarAreasTallerPorSubordinacion($this->uiParams);
            } else {
                $this->datos = $this->_modeloOrden->cargarEstructurasNoFormalesInternas();
            }
        }
    }

    /**
     *
     */
    public function cargarIndicadoresRecuperablesAction()
    {
        $result = $this->_modeloOrden->devolverIndicadoresRecuperables($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     *
     */
    public function adicionarPiezasRetiradasAction()
    {
        $params['piezas'] = Zend_Json::decode($this->uiParams['piezas']);
        $params['idordentrabajo'] = $this->uiParams['idordentrabajo'];
        $result = $this->_modeloOrden->adicionarPiezasRetiradas($params);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     *
     */
    public function cargarPiezasRetiradasAction()
    {

        $result = $this->_modeloOrden->cargarPiezasRetiradas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     *
     */
    public function eliminarPiezasRetiradasAction()
    {
        $this->success = $this->_modeloOrden->eliminarPiezasRetiradas($this->uiParams);
    }

    /**
     *
     */
    public function getCargarEnviadosATallerAction()
    {
        $result = $this->_modeloOrden->devolverEnviadosAReparar($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->total = $result['total'];
    }

    /**
     *
     */
    public function getCargarEnviadosAMantenimientoAction()
    {

        $result = $this->_modeloOrden->devolverEnviadosAMantenimiento($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->total = $result['total'];
    }

    /**
     * @method Metodo para mostrar los reportess
     * @params array $data Arreglo con el parametro filters
     *
     * @return Reporte creado
     */
    public function reporteAction()
    {
        $this->autoShow = false;
        $datas = json_decode(base64_decode($this->uiParams['datas']));
        //        $datas->headers = "vHeaders";
        $datas->flags = true;
        $this->_modelReports->report($datas);
    }

    public function cargarActivoAction()
    {
        $this->datos = $this->_modeloOrden->devolverActivo($this->uiParams);
    }

    public function cargarIncripcionesAction()
    {
        $this->datos = $this->_modeloOrden->devolverIncripcionesDisponibles($this->uiParams, new InscripcionService());
    }

    public function cargarComboCentroCostoAction()
    {
        if ($this->_aperturaINV) {
            $result = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
                $this->global->Estructura->idestructura, 0, 10000,
                $this->uiParams['criterio'], null, 1
            );
            $this->datos = $result;
            $this->cantidad = count($result);
        } else {
            $this->datos = array();
        }
    }

    public function cargarDestinosAction()
    {
        $result = $this->_modeloOrden->cargarDestinos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function generarPedidoAction()
    {
        $this->datos = $this->_modeloOrden->generarPedido($this->uiParams);
    }

    public function cargarPedidosAction()
    {
        $result = $this->_modeloOrden->cargarPedidos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarServiciosPedidoAction()
    {
        $result = $this->_modeloOrden->cargarServiciosPedido($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarSolicitudesAprobadasAction()
    {
        $result = $this->_modeloOrden->cargarSolicitudesAprobadas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarSolicitudesATercerosAprobadasAction()
    {
        $result = $this->_modeloOrden->cargarSolicitudesATercerosAprobadas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarAgenciaAction()
    {
        $result = $this->_modeloOrden->cargarAgencia($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarTiposDePrecioAction()
    {
        $result = $this->_modeloOrden->cargarTiposDePrecio($this->uiParams);
        $this->datos = $result;
        $this->cantidad = count($result);
    }

    /**
     * @return boolean
     */
    public function anularDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->respuesta = $this->_modeloOrden->cancelarDocumentoTalleres($this->uiParams['iddocumento'], $this->uiParams);
        $this->success = true;
    }

    /**
     * @return mixed
     */
    public function cargarMediosClienteAction()
    {
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->_modeloOrden->cargarMediosCliente($this->uiParams));
    }

    public function cargarDocumentosGeneradosAction()
    {
        $resultado = $this->_modeloOrden->devolverDocumentosGenerados($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function cargarContratosAction(){
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->_modeloOrden->getContratos($this->uiParams));
    }

    public function generarordencitaAction()
    {
        $parametros = Zend_Json::decode($this->uiParams['data']);
        $this->datos = $this->_modeloOrden->generarordencita($parametros);
    }

    public function cargarAreasTallerAction()
    {
        $this->objectHelper->synchronize($this, $this->_modeloOrden->cargarAreasTaller($this->uiParams));
    }
    public function cargarProductosEjecucionAction()
    {
        $resultado = $this->_modeloOrden->cargarProductosEjecucion($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
    }

    public function getEstructurasAction(){
        $this->objectHelper->synchronize($this, $this->_modeloOrden->getEstructuras());
    }

    public function verificarEntidadesAction() {
        $this->objectHelper->synchronize($this, $this->_modeloOrden->verificarEntidades($this->uiParams));
    }

    public function transferirProductosAction() {
        $this->objectHelper->synchronize($this, $this->_modeloOrden->procesarMaterialesExternos($this->uiParams));
    }

}
