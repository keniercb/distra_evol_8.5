<?php

/**
 * Clase service para brindar servicios a los sistemas
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . 'logistica/utiles/comun/config.php';
    include_once $dir;
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/factura/plugins';
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/configuracion/models/bussines';
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/configuracion/models/domain';
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps/logistica/facturacion/facturacion/configuracion/models/domain/generated';
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class FacturacionService extends LogisticaComponentService
{

    private $model;

    public function __construct()
    {
        parent::__construct();
        $this->model = new GestionarFacturaModel(
            array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
        );
    }

    /**
     * Funcion para cargar los js dinamicamente
     * en la phtml de la configuracion general
     *
     * @return content Retorna el contenido de la phtml de Facturacion
     */
    public function getfacturasContabilizadasCliente($parametros, $dql)
    {
        return $this->model->getFacturasCliente($parametros, $dql);
    }

    public function getProductosFacturas($parametros)
    {
        return $this->model->getProductosDb($parametros);
    }

    public function getNumerosControlEnF($parametros)
    {
        return $this->model->getNumerosControlEnF($parametros);
    }

    public function estaEnUsoSerie($idseriedocentidad)
    {
        return $this->model->estaEnUsoSerie($idseriedocentidad);
    }

    public function getDocumentos($parametros)
    {
        return $this->model->obtenerFacturas($parametros);
    }

    public function getSubsistemas($parametros)
    {
        return $this->model->getSubsistemasFacturan($parametros);
    }

    public function adicionarFactura($parametros)
    {
        return $this->model->adicionarFactura($parametros);
    }

    public function getNumeroFactura($iddocumento){
        return $this->model->getNumeroFactura($iddocumento);
    }

    public function getImportesFactura($iddocumento, $comprobante = false){
        return $this->model->getImporteTotalDocumento($iddocumento, $comprobante);
    }

    public function getImportesFacturaReportes($parametros)
    {
        return $this->model->getImporteVentas($parametros);
    }

    /*
     * Funcion que devuelve el precio configurado en la matriz para un indicador por monedas
     * @parametros stdClass con idtipoprecio, idindicador, idestructura
     *
     * @return array de precios y conceptos de precios por monedas configurados en la matriz de precio
     * */
    public function getPrecioVentaIndicador($parametros) {
        return $this->model->getPrecio($parametros);
    }

    /*
     * Funcion que devuelve los tipos de precios configurados para un cliente
     * @parametros array asociativo idcliente
     * @idtipoprecio identificador del tipo de precio opcional
     *
     * @return array de precios y conceptos de precios por monedas configurados en la matriz de precio
     * */
    public function getTipoPreciosCliente($parametros = null, $idtipoprecio = null) {
        return $this->model->getTipoPrecios($parametros, $idtipoprecio);
    }

    public function delCategoriaIndExt($idexterno, $idindicador = false, $idactividad = false)
    {
        return $this->model->delCategoriaIndExt($idexterno, $idindicador, $idactividad);
    }

    public function addCategoriaIndExt($arraydatos)
    {
        return $this->model->addCategoriaIndExt($arraydatos);
    }

    public function addIndicadorContrato($parametros){
        return $this->model->addIndicadorContrato($parametros);
    }

    public function delIndicadorContrato($idcontrto, $idindicador = array()){
        return $this->model->delIndicadorContrato($idcontrto, $idindicador);
    }

    public function cargarVendedor($parametros){
        return $this->model->getVendedores($parametros);
    }
    
    public function getOperaciones($params) {
        return $this->model->getOperaciones($params);
    }

    public function generarFacturaExterna($parametros) {
        return $this->model->adicionarFacturasDeDocumentos($parametros);
    }

    public function getOperacionObligaciones($idoperacion) {
        return $this->model->getOperacionObligaciones($idoperacion);
    }

    public function getDocOrigen($iddocumento) {
        return $this->model->getDocOrigen($iddocumento);
    }

    public function getClientes($params) {
        return $this->model->getClientes($params);
    }
}
