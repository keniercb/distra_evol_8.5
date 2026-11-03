<?php

/**
 * Esta clase permite controlar los parametros
 * que se envian de la vista a la modelo
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ConffacturacionController extends ConfiglogisticaController
{

    private $idestructuracomun, $confFactModel, $confGeneral, $rangomodel, $_idpadrematriz;

    public function init()
    {
        parent::init('log.fac.configuracion');
        $this->confFactModel = new ConfFacturacionModel();
        $this->_idpadrematriz = $this->confFactModel->getIdPadreMatriz()['idpadre'];
        $this->idestructuracomun = $this->global->Estructura->idestructura;
        $this->confGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->rangomodel = new DatRangonumerocontrolModel();
        $melfi = $this->confFactModel->getConfMelfi();
        $dualidadMonedas = LogisticaGlobal::__init()->getMonedaEntidad();
        $fecha = $this->confFactModel->getUltimaFecha();
        $fecha = explode(' ',$fecha[0]['fecha'])[0];
        $this->view->uiVariables = array_merge(
            array(
                'melfi' => ($melfi == 1) ? 'true' : 'false',
                'idmoneda' => "'" . "{$dualidadMonedas->idmoneda}" . "'",
                'idmonedaalternativa' => $dualidadMonedas->idmonedaalternativa ? "'" . "{$dualidadMonedas->idmonedaalternativa}" . "'" : 'false',
                'fechaupdate' => "'" . "{$fecha}" . "'",
                'moneda' => "'" . "{$dualidadMonedas->codigoiso}" . "'",
                'monedaalternativa' => $dualidadMonedas->codigoisoalt ? "'" . "{$dualidadMonedas->codigoisoalt}" . "'" : 'false'
            ), $this->view->uiVariables
        );
    }

    public function conffacturacionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array($this->configuracionHelper->mostrarNomencladoresGenerales());
        $this->initComponent('log.lb.configuracion');
        $this->initCfgSubsistemasInstalados();
        $this->renderTemplate();
    }

    private function initCfgSubsistemasInstalados(){
        //Direccion de la servidora
        $dirIndex = $_SERVER['SCRIPT_FILENAME'];
        //Direccion del componente facturacion
        $dirComponenteFacturacion = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
            . 'apps/logistica/facturacion';
        if (file_exists($dirComponenteFacturacion)) {
            $serviceConfFacturacion = new ConfFacturacionService();
            array_push(
                $this->view->arrayJs, $serviceConfFacturacion->getJsConfigfacturacion()
            );
        }
    }

    /**
     * Funcion que permite cargar la configuracion de Facturacion
     *
     * @return array Retorna la configuracion segun la estructura
     */
    public function cargarConfiguracionAction()
    {
        $this->success = true;
        $this->datos = $this->confFactModel->cargarConfiguracion(
            $this->idestructuracomun
        );
    }

    /**
     * Funcion que permite guardar la configuracion de Facturacion
     * para determinada estructura
     *
     * @return NULL
     */
    public function guardarConfiguracionAction()
    {
        $parametros = $this->uiParams;
        $parametros['idestructuracomun'] = $this->idestructuracomun;
        $parametros['recargos'] = json_decode(
            $this->_request->getPost('recargos')
        );
        $parametros['matriz'] = json_decode(
            $this->_request->getPost('values')
        );
        $parametros['matrizBySelection'] = json_decode(
            $this->_request->getPost('matrizBySelection')
        );
        if($parametros['clientes']){
            $parametros['clientes'] = json_decode(
                $this->_request->getPost('clientes')
            );
        }
        if($parametros['naturalezas']){
            $parametros['naturalezas'] = json_decode(
                $this->_request->getPost('naturalezas')
            );
        }
        if($parametros['pagos']){
            $parametros['pagos'] = json_decode(
                $this->_request->getPost('pagos')
            );
        }

        $result = $this->confFactModel->guardarConfiguracion($parametros);
        if (!$result->success) {
            $this->success = $result->success;
            $this->codigoMsg = $result->codigoMsg;
        }
    }

    /**
     * Funcion que permite cargar los distintos tipos de categorias de precio
     *
     * @return array Retorna las categorias
     * de precio existentes en la estructura
     * y un entero que retorna tambien la cantidad de categorias
     */
    public function cargarnomencladorAction()
    {
        $parametros = $this->uiParams;
        $parametros['idestructuracomun'] = $this->idestructuracomun;
        $parametros['filtro'] = json_decode(
            stripslashes($parametros['filtro'])
        );
        if ($parametros['modelo'] == 'NomCategoriaprecio') {
            $result = $this->confFactModel->obtenerMatrizDesglosePrecios(
                $parametros
            );
        } else {
            $result = $this->confFactModel->obtenerNomenclador(
                $parametros
            );
        }
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarClientePrecioAction(){
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->confFactModel->getClientesMonedas($this->uiParams));
    }

    /**
     * Funcion que permite cargar los datos
     * segun la seleccion realizada en la matriz
     *
     * @return array Retorna los datos segun la seleccion
     * y un entero que retorna el total de los datos
     */
    function cargarDatosPorSeleccionMatrizAction()
    {
        $params = $this->uiParams;
        $params['idestructuracomun'] = $this->_idpadrematriz;
        $result = $this->confFactModel->cargarDatosGridPorSeleccion(
            $params
        );
        $this->datos = ($result['datos']) ? $result['datos'] : array();
        $this->cantidad = $result['cantidad'];
    }

    /**
     * Funcion que permite eliminar los datos
     * segun la seleccion realizada en la matriz
     *
     * @return boolean Retorna si fue un exito eliminar los datos
     */
    function eliminarDatosPorSeleccionMatrizAction()
    {
        $params = json_decode($this->_request->getPost('datos'));
        $params['idestructuracomun'] = $this->idestructuracomun;
        $this->success = $this->confFactModel->eliminarDatosGridPorSeleccion(
            $params
        );
    }

    /**
     * Funcion que permite cargar las columnas dinamicas
     * segun el tipo de precio para la matriz seleccionada
     *
     * @return array Retorna las columnas con sus datos
     */
    public function cargarColumnaSegunMatrizAction()
    {
        $params = $this->uiParams;
        $params['idestructuracomun'] = $this->_idpadrematriz;
        $this->datos = $this->confFactModel->cargarColumnaSegunMatriz(
            $params
        );
    }

    /**
     * Funcion que permite cargar el listado
     * segun el tipo de precio seleccionado
     *
     * @return array Retorna la matriz
     * y un entero que retorna el total de la matriz
     */
    public function cargarListadoMatrizAction()
    {
        $params = $this->uiParams;
        $params['idestructuracomun'] = $this->_idpadrematriz;
        $result = $this->confFactModel->obtenerMatrizPrecio(
            $params
        );
        $this->cantidad = $result['cantidad'];
        $this->datos = $result['matriz'];
    }

    /**
     * Funcion que permite cargar el tipo de moneda contable
     *
     * @return array Retorna todos
     * los tipo de monedas contables de la estructura
     */
    function cargarTipoMonedasAction()
    {
        $this->datos = $this->confFactModel->getMonedasEntidad(
                $this->idestructuracomun
        );
    }

    function cargarnomencladorentidadAction(){
        $nomencladoresModel = new NomencladoresModel();
        unset($this->uiParams['bussines']);
        $filtro = new stdClass();
        $filtro->estado = array('estado'=>1, 'signo'=>'= ?');
        if($this->uiParams['tipo']) {
            $filtro->tipo = array('tipo'=>$this->uiParams['tipo'], 'signo'=>'= ?');
        }
        $this->uiParams['filtro'] = json_encode($filtro);
        $this->uiParams['limit'] = 1000;

        $result = $nomencladoresModel->buscar($this->uiParams);
        if (!$this->uiParams['tipo'] && !$this->uiParams['nomenclador']) {
            $result['datos'][] = array('idtipoprecio' => -1, 'denominacion' => 'Precio promedio');
            $result['datos'][] = array('idtipoprecio' => -3, 'denominacion' => 'Precio contable');
            $result['datos'][] = array('idtipoprecio' => -2, 'denominacion' => 'Precio manual');
        }
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * Funcion que permite cargar los recargos segun la estructura
     *
     * @return array Retorna todos los recargos configurados para la estructura
     */
    function cargarRecargosAction()
    {
        $params = $this->uiParams;
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['idestructuracomun'] = $this->idestructuracomun;
        $result = $this->confFactModel->cargarRecargos($params);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * Funcion que permite eliminar recargos de la estructura
     *
     * @return boolean Retorna true si fue un exito eliminar los recargos
     */
    function eliminarRecargoAction()
    {
        $params = $this->uiParams;
        $this->success = $this->confFactModel->eliminarRecargo(
            $params['idrecargo']
        );
    }

    /**
     * Funcion que permite obtener los grupos-hojas
     *
     * @return array Retorna un arreglo con los grupos y sus hojas,
     * ademas de la cantidad total
     */
    public function obtenerGruposHojasAction()
    {
        $params = $this->uiParams;
        $result = $this->confGeneral->obtenerGruposHojas($params);
        $this->datos = $result['data'];
        $this->cantidad = $result['total'];
    }

    /**
     * Funcion que permite obtener la naturaleza
     *
     * @return array Retorna un arreglo con todas las naturalezas y sus hijos
     */
    public function obtenerNaturalezaAction()
    {
        $this->autoShow = false;
        $params = $this->uiParams;
        $result = $this->confGeneral->obtenerDatosArbolNaturaleza($params);
        echo json_encode(array('datos' => $result));
    }

    /**
     * Funcion que permite obtener la clasificacion contable de facturacion
     *
     * @return array Retorna un arreglo con todas las clasificaciones
     */
    public function obtenerClasificacionAction()
    {
        $this->autoShow = false;
        $params = $this->uiParams;
        $params['bussines'] = 'NomClasificacioncontableFactModel';
        $params['idnom'] = 'idclasificacioncontable';
        $params['modelo'] = 'NomClasificacioncontablelog';
        $params['facturacion'] = 1;
        $result = $this->confFactModel->obtenerClasificacion($params);
        echo json_encode($result);
    }

    /**
     * Funcion que permite obtener la marca y el modelo
     *
     * @return array Retorna un arreglo con todas las naturalezas y sus hijos
     */
    public function obtenerMarcaModeloAction()
    {
        $this->autoShow = false;
        $params = $this->uiParams;
        $result = $this->confGeneral->obtenerDatosArbolMarcaModelo($params);
        echo json_encode($result);
    }

    /**
     * Funcion que devuelve los tipos de documentos que utilizara el subsistema de Facturacion
     * 
     * @return array Retorna un arreglo con los tipos de documento
     */
    public function cargarTipoDocumentoSerieAction()
    {
        $this->datos = $this->confFactModel->cargarTipoDocumentoSerie();
    }

    /**
     * Funcion que permite cargar las series de los tipos de documentos
     * 
     * @return array Retorna un arreglo con las series de los tipos de documentos
     */
    public function cargarSerieDocumentoAction()
    {
        $result = $this->confFactModel->cargarSerieDocumento($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * Funcion que permite realizar las acciones de 
     * adicionar, modificar o eliminar las series de los tipos de documentos
     * 
     * @return boolean Retorna 
     * TRUE si la accion se realizo con exito, 
     * FALSE si hubo algun fallo
     */
    public function actionsSerieDocumentoAction()
    {
        $this->uiParams['idestructuracomun'] =  $this->idestructuracomun;
        $result = $this->confFactModel->actionsSerieDocumento($this->uiParams);
        $this->success = ($result['enuso']) ? $result['success'] : $result;
        if ($result['enuso']) {
            $this->enuso = $result['enuso'];
        }
    }

    /**
     * Funcion que permite obtener la categoria y subcategoria en la matriz
     *
     * @return array Retorna arreglo con las categorias o subcategorias segun
     * los parametros
     */
    public function obtenerCategoriaSubcategoriaAction()
    {
        $params = $this->uiParams;
        $this->datos = $this->confFactModel->obtenerCategoriaSubcategoria(
            $params
        );
    }

    public function crudNumeroControlAction()
    {
        $this->uiParams['idestructuracomun'] = $this->idestructuracomun;
        $result = $this->confFactModel->crudNumeroControl(
            $this->uiParams
        );
        $this->datos = $result->datos;
        $this->cantidad = $result->cantidad;
        $this->success = $result->success;
        $this->codigoMsg = $result->codigoMsg;
    }

    public function crudSecuenciaNumeroControlAction()
    {
        $this->uiParams['idestructuracomun'] = $this->idestructuracomun;
        $result = $this->confFactModel->adicionarNumeroControl(
            $this->uiParams
        );
        $this->success = $result['success'];
    }

    public function cargarSecPorIdPuestoAction()
    {
        $params = $this->uiParams;
        $result = $this->confFactModel->devolverRangos($params);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function crudPuestoTrabajoAction()
    {
        $this->uiParams['idestructuracomun'] = $this->idestructuracomun;
        $result = $this->confFactModel->crudPuestoTrabajo(
            $this->uiParams
        );
        $this->datos = $result->datos;
        $this->cantidad = $result->cantidad;
        $this->success = $result->success;
        $this->codigoMsg = $result->codigoMsg;
    }

    public function cargarClientesAction()
    {
        $clientes = $this->confFactModel->getClientes($this->uiParams);
        $this->datos = $clientes['datos'];
        $this->total = $clientes['cantidad'];
    }

    function eliminarSecPuestoTrabajoAction()
    {
        $array = $this->uiParams;
        $this->rangomodel->eliminaRango($array);
        $this->success = true;
    }

    function activarrangoAction()
    {
        $array = $this->uiParams;
        $this->rangomodel->activarNomenclador($array);
        $this->success = true;
    }

    public function cargarOperacionesAction(){
        $this->datos = $this->confFactModel->getOperaciones($this->uiParams);
        $this->cantidad = count($this->datos);//cambiar*/
    }
    public function cargarSubsistemasAction(){
        $this->datos =$this->confFactModel->getSubsistemas($this->uiParams);
    }

    public function cargartipostasaAction()
    {
        $result = $this->confFactModel->cargarTiposTasa();
        $this->datos = $result['datos'];
        $this->cantidad = $result['cant'];
    }

    public function getCondicionPagoAction()
    {
        $condicion = ServiciosConfiguracionGeneralHelper::__init();
        $datos = $condicion->obtenerCondicionesPago();
        $this->datos = $datos['data'];
        $this->total = $datos['total'];
    }

    public function cargarCuentasBancariasAction()
    {
        $this->datos = $this->confFactModel->getCuentasBancarias();
    }

    public function reproducirPrecioAction(){
        $this->confFactModel->reproducirPrecios($this->uiParams);
        $this->success = true;
    }
    
    public function getPuertosAction(){
        $this->datos = $this->confFactModel->getPuertos();
    }

    public function cargarReporteVentaAction(){
        $this->objectHelper->synchronize($this, $this->confFactModel->getReportesVenta());
    }

    public function actionsReporteVentaAction(){
        $this->confFactModel->actionsReporteVenta($this->uiParams);
        $this->success = true;
    }

    public function cargarConceptoAction(){
        if($this->uiParams['concepto'] == 'persona') {
            $this->objectHelper->synchronize($this, $this->confFactModel->cargarPersonas($this->uiParams));
        }
        else if (isset($this->uiParams['all'])) {
            $this->objectHelper->synchronize($this, $this->confFactModel->getListaConcepto($this->uiParams));
        } else {
            $this->objectHelper->synchronize($this, $this->confFactModel->getConceptoReporte($this->uiParams));
        }
    }

    public function actionsConceptoAction(){
        $this->confFactModel->actionsConcepto($this->uiParams);
        $this->success = true;
    }

    public function cargarVendedoresAction(){
        $this->objectHelper->synchronize($this, $this->confFactModel->getVendedores($this->uiParams));
    }
    
    public function cargarAgrupacionAction(){
        $this->objectHelper->synchronize($this, $this->confFactModel->getAgrupaciones($this->uiParams));
    }

    public function borrarPrecioAction(){
        $this->confFactModel->borrarPrecios($this->uiParams);
        $this->success = true;
    }

    public function cargarSectorAction() {
        $this->objectHelper->synchronize($this, $this->confFactModel->getSector());
    }

    public function actualizarPreciosAction() {
        $this->confFactModel->actualizarPrecios($this->uiParams);
        $this->success = true;
    }

    public function cargarNaturalezaMediaAction(){
        $this->objectHelper->synchronize($this, $this->confFactModel->cargarNaturalezaMedia($this->uiParams));
    }

    public function cargarSectorMediaAction(){
        $this->objectHelper->synchronize($this, $this->confFactModel->cargarSectorMedia($this->uiParams));
    }

    public function habilitarSeriesAction() {
        $this->confFactModel->habilitarSeries($this->uiParams);
        $this->success = true;
    }

    function cargarPagoElectronicoAction()
    {
        $this->datos = $this->confFactModel->getMonedasEntidad(
                $this->idestructuracomun, 1
        );
    }

    public function getEstructurasAction(){
        $this->objectHelper->synchronize($this, $this->confFactModel->getEstructuras());
    }

}
