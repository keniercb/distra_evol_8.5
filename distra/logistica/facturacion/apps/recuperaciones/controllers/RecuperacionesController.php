<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class RecuperacionesController extends BaseController
{

    private $servFacturacion,$serviciosPlanificacion;
    private $logistEstrucUbica, $serviciosConfGeneralInv;
    private $logisticaDocumento, $mFacturasEmitidas, $mVentas, $mOrden, $mVendedor, $mVentasProgramas;


    function init()
    {
        parent::init('log.fac.recuperaciones');
        $this->servFacturacion = new FacturacionService();
        $this->logisticaProducto = new LogisticaProductoModel();
        $this->serviciosConfGeneralInv = new ConfiguracioninventarioService();
        $this->logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
        $this->serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->logisticaDocumento = LogisticaDocumentosHelper::__init();
        $this->mFacturasEmitidas = new FacturasEmitidasModel();
        $this->mVentas = new ReporteVentasModel();
        $this->mOrden = new OrdenDespachoModel();
        $this->mVendedor = new VentasvendedorModel();
        $this->mVentasProgramas = new VentasprogramasModel();
        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        $objIddocOfert = $this->logisticaDocumento->devuelveIddocByIdEstructura(
            'ofertaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $objIddocFac = $this->logisticaDocumento->devuelveIddocByIdEstructura(
            'facturaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->view->uiVariables = array_merge(
            array(
                'iddocFac' => ($objIddocFac->iddoc) ? $objIddocFac->iddoc : "",
                'iddocOfert' => ($objIddocOfert->iddoc) ? $objIddocOfert->iddoc : "false",
                'alternativa' => ($monedas->idmonedaalternativa) ? 'true' : 'false',
                'monedacontable' => $monedas->idmoneda,
                'monedaalternativa' => ($monedas->idmonedaalternativa) ? $monedas->idmonedaalternativa : 'false',
            ), $this->view->uiVariables
        );
    }

    function configlogisticaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()

        );
        $this->initComponent('log.fac.recuperaciones');
        $this->renderTemplate();
    }
    /*
     * Carga los clientes y proveedores
     * Devuelve un arreglo*/
    public function cargarClientesProveedoresAction()
    {
        if ($this->uiParams['idclientesproveedores'] && count($this->uiParams['idclientesproveedores']))
        {
            $ids['ids'] = json_decode($this->uiParams['idclientesproveedores']);
            $ids['notin'] = 1;
        } else {
            $ids = null;
        }
        if($this->uiParams['query']){
            $this->uiParams['nombre'] = $this->uiParams['query'];
            $this->uiParams['codigo'] = $this->uiParams['query'];
        } else {
            $this->uiParams['nombre'] = $this->uiParams['criterio'];
            $this->uiParams['codigo'] = $this->uiParams['criterio'];
        }
        if($this->uiParams['padre']){
            $this->uiParams['filter'] = array(array('data'=>array('type'=>'numeric', 'value'=>$this->uiParams['padre']), 'field'=>'idpadre'));
        }
        if ($this->uiParams['tipocliente'] == 'cliente')
        {
            $result = $this->configuracionHelper->getClientesProveedorByParams(
                $ids, $this->global->Estructura->idestructura, true, true, false, $this->uiParams,
                $this->uiParams['start'], $this->uiParams['limit']
            );
        }
        else
        {
            $result = $this->configuracionHelper->getClientesProveedorByParams(//proveedores
                $ids, $this->global->Estructura->idestructura, true, false, true, $this->uiParams,
                $this->uiParams['start'], $this->uiParams['limit']
            );
        }
        foreach ($result['datos'] as &$c){
            $c['nombre'] = $c['codigo'] .' '.$c['nombre'];
            if($c['idpadre']){
                $padreAux = $this->configuracionHelper->getClientesProveedorByParams(
                    $c['idpadre'], null, null, null, null, null
                );
                $c['padre'] = $padreAux['datos'][0]['codigo']. ' ' .$padreAux['datos'][0]['nombre'];
            }
        }

        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /*
     * Carga los subsistemas(combo operaciones)
     * Ademas trae el idsubsistema de FACT y los id de las monedas contable y alternativa*/
    public function getSubsistemasAction()
    {
        $this->datos = $this->servFacturacion->getSubsistemas();
    }
    /* Carga los organismos */
    public function cargaroganismosAction(){
       $result = $this->configuracionHelper->getOrganismos(array('denominacion'=>$this->uiParams['criterio'] ));
    //    $instance = Doctrine_Manager::getInstance();
    //     $conexion = $instance->getCurrentConnection();
    //     $query = "SELECT idorganismo,nombre FROM mod_crmclienteproveedor.nom_organismo
    //                ORDER BY nombre ASC ";
       // $result = $conexion->fetchAll($query);
       $this->datos = $result['data'];
       $this->cantidad = $result['cant'];
    }
    /*
     * Carga los productos*/
    public function cargarProductosAction()
    {   
         $result = $this->logisticaProducto->cargarProductos($this->uiParams);
    }
/*
*Carga los Organismos*/
    public function cargarOrganismosAction()
    {     

    //    $parametros['criterio'] = $this->_request->getPost('criterio');

        $result = $this->mVentasProgramas->cargarOrganismos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /*
     * Carga los depositos del combodeposito*/
    public function cargardepositosAction()
    {
        $depositos = $this->logistEstrucUbica->cargardepositos(null, null,null,null,0,-1);
        $this->datos = $depositos['depositos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_FAC;
    }

    /*
     * Devuelve true si se usa la categoria en la config general de Distribucion*/
    public function categoriaMarcadaAction()
    {
        $datos= $this->serviciosConfGeneralInv->devolverConfiguracion($this->global->Estructura->idestructura);
        $this->datos = $datos['usarcategoria'];
    }

    /*
     * Carga los servicios que vienen de Planificacion*/
    public function cargarActividadesAction()
    {
        $parametros = $this->uiParams;
        $parametros['nivel'] = 4;
        $parametros['criterio'] = $this->_request->getPost('criterio');

        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        $denominacion = ($parametros['criterio']) ? $parametros['criterio'] : null;
        $filtro = ($denominacion) ? array(array('valor'=>$denominacion)) : array();
        $conn = Zend_Registry::get('conexion');
        if($parametros['iddocumento']){
            $idseleccionados = implode(
                ',', $conn->execute(
                "SELECT distinct(da.idactividad)
             FROM mod_logfacturacion.dat_actividadesfactura da
             inner join mod_logfacturacion.dat_elementosfactura def on def.idelementofactura = da.idelementofactura
             WHERE def.idfactura = {$parametros['iddocumento']}"
            )->fetchAll(PDO::FETCH_COLUMN)
            );
            if(count($idseleccionados)>0)
                $filtro[] = array('notIn'=>$idseleccionados);
        }
        $result = $this->serviciosPlanificacion->obtenerActividadyNorma(
            $parametros['nivel'], null, $filtro, $start, $limit, 0
        );

        return $result;
    }
    
    public function cargarActividadesExistentesAction(){
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->mFacturasEmitidas->cargarActividadesExistentes($this->uiParams));
    }

    public function getReportesAction(){
        $this->objectHelper->synchronize($this, $this->mVentas->getReportes());
    }

    public function getEstructurasAction(){
        $this->objectHelper->synchronize($this, $this->mVentas->getEstructuras());
    }

    public function cargarOrdenDespachoAction() {
        $objIddocFac = $this->logisticaDocumento->devuelveIddocByIdEstructura(
            'facturaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->uiParams['iddoc'] = $objIddocFac->iddoc;
        $this->objectHelper->synchronize($this, $this->mOrden->cargarOrdenDespacho($this->uiParams));
    }

    public function cargarVendedorAction(){
        $this->objectHelper->synchronize($this, $this->servFacturacion->cargarVendedor($this->uiParams));
    }
    
    public function cargarProductosNaturalezaAction(){
        $this->objectHelper->synchronize($this, $this->mVentas->cargarProductosNaturaleza($this->uiParams));
    }

    public function cargarProductosPreciosAction(){
        $this->objectHelper->synchronize($this, $this->mVentas->cargarProductosPrecios($this->uiParams));
    }

}
