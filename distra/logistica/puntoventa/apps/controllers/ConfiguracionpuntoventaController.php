<?php

/**
 * @description Clase controladora para la configuración general del punto de venta
 * @package Punto de venta
 * @author José Joel
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ConfiguracionpuntoventaController extends BaseController
{
    private $_serviciosConfiguracionGeneral,$serviciosCentroCosto;
    private $_cfgpuntoventa, $_objHelper, $_serviciosLogisticaGlobal, $_logisticaGlobal;

    public function init()
    {
        parent::init('log.fac.configuracionpuntoventa');
        $this->serviciosCentroCosto = ServiciosContabilidadFinanzasHelper::__init();
        $this->_cfgpuntoventa = new ConfiguracionpuntoventaModel();
        $this->_serviciosLogisticaGlobal = LogisticaGlobal::__init();
        $this->_objHelper = LogisticaObjectHelper::__init();
        $this->_serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_logisticaGlobal = LogisticaGlobal::__init()->getMonedaEntidad();
    }

    public function configuracionpuntoventaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->_serviciosConfiguracionGeneral->mostrarNomencladoresGenerales()
        );
        $existeInv = $this->_serviciosLogisticaGlobal->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        $fechaSistPV = date('d/m/Y');
        $this->view->uiVariables = array_merge(
            array("existeInv" => $existeInv ? $existeInv : 0, 'fechaSistPV' => "'{$fechaSistPV}'"),
            $this->view->uiVariables
        );
        $this->initComponent('log.fac.configuracionpuntoventa');
        $this->rendertemplate();
    }

    public function adicionarAreaCajaAction()
    {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(
                                        Zend_Json::decode($this->uiParams['datos'])
                                    );
        $this->uiParams['idestructura'] = $this->global->estructura->idestructura;
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->adicionarAreaCaja($this->uiParams));
    }

    public function eliminarAreaCajaAction()
    {
        $this->uiParams['datos'] = Zend_Json::decode($this->uiParams['datos']);
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->eliminarAreaCaja($this->uiParams));
    }

    public function activarAreaCajaAction()
    {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(Zend_Json::decode($this->uiParams['datos']));
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->activarAreaCaja($this->uiParams));
    }

    public function diasHabilesAction()
    {
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->diasHabiles($this->uiParams));
    }

    /* Función que permite cargar el grid principal de Configurar Caja */
    public function cargarAreaCajaAction()
    {
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarAreas($this->uiParams));
    }

    /* Función que permite cargar el grid principal del PtoVenta */
    public function cargarPuntoVentaAction()
    {
        $this->uiParams['gdPrincipal'] = true;
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarGridPrincipal($this->uiParams));
    }

    /* Función que permite cargar el grid para adicionar los productos */
    public function cargarUsuariosAction()
    {
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarUsuarios($this->uiParams));
    }

    public function cargarAreasAction()
    {
        $this->uiParams['idestructura'] = $this->global->estructura->idestructura;
        $this->uiParams['cmbArea'] = true;
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarAreas($this->uiParams));
    }

    public function cargarProductosAction()
    {
        $this->uiParams['idmonedaalternativa'] = $this->_logisticaGlobal->idmonedaalternativa;
        $this->uiParams['idmonedacontable'] = $this->_logisticaGlobal->idmoneda;
        $this->uiParams['configuracion'] = 1;
        //$this->uiParams['idmonedaventa'] = $this->_logisticaGlobal->idmoneda;
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarProductos($this->uiParams));
    }

    public function cargarServiciosAction()
    {
        $this->uiParams['idmonedacontable'] = $this->_logisticaGlobal->idmoneda;
        $this->uiParams['configuracion'] = 1;
        //$this->uiParams['idmonedaventa'] = $this->_logisticaGlobal->idmoneda;
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarServicios($this->uiParams));
    }

    public function adicionarServicioAction()
    {
        $this->uiParams['idmonedacontable'] = $this->_logisticaGlobal->idmoneda;
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->adicionarServicios($this->uiParams));
    }

    public function cargarPersonasAction() {
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarPersonas($this->uiParams));
    }

    public function cargarOperariosAction()
    {
        //$this->uiParams['idmonedaventa'] = $this->_logisticaGlobal->idmoneda;
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarOperarios($this->uiParams));
    }

    public function adicionarOperarioAction()
    {
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->adicionarOperarios($this->uiParams));
    }

    public function cargarGridprincipalAction()
    {
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarProductosEntrada($this->uiParams));
    }

    public function adicionarProductosgridAction()
    {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(Zend_Json::decode($this->uiParams['datos']));
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->adicionarProductosgrid($this->uiParams));
    }
    /**
     * (Descripcion de la clase, objetivo)
     * @return array
     */
    public function cargarComboCentroCostoAction()
    {
        $this->datos = $this->serviciosCentroCosto->obtenerCentrosCostoFiltro($this->global->Estructura->idestructura);
    }

    public function cargarClientesAction()
    {
        $clientes = $this->_cfgpuntoventa->getClientes($this->uiParams);
        $this->datos = $clientes['datos'];
        $this->total = $clientes['cantidad'];
    }
    
    public function cargarTipoPrecioAction()
    {
        $params['cargarSinEntidad'] = 1;    
        $params['tipo'] = 1;
        $facService = new FacturacionService();
        $this->datos = $facService->getTipoPreciosCliente($params);
    }
    
    public function cargarMonedasAction()
    {
        $this->objectHelper->synchronize($this,$this->configuracionHelper->obtenerMonedasPorEntidad(
            $this->global->Estructura->idestructura
        ));
    }
    
    public function cargarModoPagoAction()
    {
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->getModosPago($this->uiParams));
    }
    
    public function cargarOperacionAction()
    {
        $facService = new FacturacionService();
        $this->datos = $facService->getOperaciones();
        
    }

    public function guardarInfoConexionAction()
    {
        $this->uiParams['almacen'] = json_decode($this->uiParams['almacen']);
        $this->uiParams['corriente'] = json_decode($this->uiParams['corriente']);
        $this->uiParams['municipios'] = json_decode($this->uiParams['municipios']);
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->guardarInfoConexion($this->uiParams));
    }

    public function cargarNaturalezaAction()
    {
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->cargarNaturalezas($this->uiParams,$this->_serviciosConfiguracionGeneral));
        //echo json_encode($this->_cfgpuntoventa->cargarNaturalezas($this->uiParams,$this->_serviciosConfiguracionGeneral));
    }

    public function adicionarNaturalezaAction()
    {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['datos'])
            );
        $this->uiParams['idpadre'] = Zend_Json::decode($this->uiParams['idpadre']);
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->adicionarNaturaleza($this->uiParams,$this->_serviciosConfiguracionGeneral));
        //echo json_encode($this->_cfgpuntoventa->cargarNaturalezas($this->uiParams,$this->_serviciosConfiguracionGeneral));
    }

    public function cargarListadoNaturalezaAction()
    {
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->cargarNaturalezas($this->uiParams,$this->_serviciosConfiguracionGeneral));
        //echo json_encode($this->_cfgpuntoventa->cargarNaturalezas($this->uiParams,$this->_serviciosConfiguracionGeneral));
    }

    public function activarNaturalezaAction()
    {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['datos'])
            );
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->activarNaturaleza($this->uiParams));
    }

    public function activarAgrupacionAction()
    {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['datos'])
            );
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->activarAgrupacion($this->uiParams));
    }

    public function sincronizarDatosAction()
    {
        //$this->uiParams['datos'] = Zend_Json::decode($this->uiParams['datos']);
        if($this->uiParams['documentos']){            
            $this->uiParams['documentos'] = Zend_Json::decode($this->uiParams['documentos']);
        }
        $this->uiParams['idmonedaalternativa'] = $this->_logisticaGlobal->idmonedaalternativa;
        $this->uiParams['idmonedacontable'] = $this->_logisticaGlobal->idmoneda;
        if ($this->uiParams['typesync'] == 8) {
            $dir_index = $_SERVER['SCRIPT_FILENAME'];
            $path = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'web/logistica/facturacion/puntoventa/';
            if (isset($this->uiParams['format']) && $this->uiParams['format'] == 'json') {
                $fileName = $this->_cfgpuntoventa->getNombreFichero($this->uiParams);
                $myArray = $this->_cfgpuntoventa->getProductosJson($this->uiParams);
                file_put_contents($path.$fileName, stripslashes(utf8_encode(json_encode($myArray))));

                header('Content-Type: application/json');
                header('Content-Disposition: attachment; filename="' . $fileName . '";');

                $this->url = '/logistica/facturacion/puntoventa/'.$fileName;
                $this->success = true;
                $this->intercepted = null;
            } else {
                $fileName = 'Productos.xml';
                $xml = $this->_cfgpuntoventa->getProductosXml($this->uiParams);

                $sxe = new SimpleXMLElement($xml);
                $dom = new DOMDocument('1,0');
                $dom->preserveWhiteSpace = false;
                $dom->formatOutput = true;
                $dom->loadXML($sxe->asXML());

                $dom->saveXML();

                $dom->save($path.$fileName);

                /*$fileName = 'Productos.xml';
                header('Content-Type:text/xml');
                header('Content-Type: application/force-download');
                header("Content-Disposition: attachment; filename=\"{$fileName}\"");
                header('Pragma: no-cache');
                header('Expires: 0');*/

                $this->url = '/logistica/facturacion/puntoventa/'.$fileName;
            }
        } else if ($this->uiParams['typesync'] == 10) {
            unset($this->uiParams['limit']);
            $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->sincronizarProdCajas($this->uiParams/*,$this->_serviciosConfiguracionGeneral*/));
        } else {
            $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->sincronizarDatos($this->uiParams/*,$this->_serviciosConfiguracionGeneral*/));
        }
    }

    public function actualizarPreciosAction()
    {
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->actualizarPrecios($this->uiParams));
    }

    public function  guardarTiemposCantidadsAction(){
        $this->uiParams['idnaturaleza'] = Zend_Json::decode($this->uiParams['idnaturaleza']);
        if($this->uiParams['idtiempo'] == ''){
            unset($this->uiParams['idtiempo']);
        }
        if($this->uiParams['cantidaddiaslimventa'] == ''){
            unset($this->uiParams['cantidaddiaslimventa']);
        }
        if($this->uiParams['idtiempogarantia'] == ''){
            unset($this->uiParams['idtiempogarantia']);
        }
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->guardarTiemposCantidads($this->uiParams));
    }

    public function cargarTiemposCantidadsAction(){
        $this->uiParams['idnaturaleza'] = Zend_Json::decode($this->uiParams['idnaturaleza']);
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->cargarTiemposCantidads($this->uiParams));

    }
 
    public function eliminarTiemposCantidadsAction(){
        $this->uiParams['idnaturaleza'] = Zend_Json::decode($this->uiParams['idnaturaleza']);
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->eliminarTiemposCantidads($this->uiParams));
     }
     
    public function asociarAreaCajaAction(){
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->asociarAreaCaja($this->global->estructura->idestructura));
    }   

    public function aplicarConfiguracionAction(){
        $this->uiParams['idestructura'] = $this->global->estructura->idestructura;
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->aplicarConfiguracion($this->uiParams));
    } 

    public function asociarUsuarioACajaAction(){
        $this->uiParams['datos'] = Zend_Json::decode($this->uiParams['datos']);
        $this->uiParams['datos'] = implode($this->uiParams['datos'],',');
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->asociarUsuarioACaja($this->uiParams));
    }

    public function cargarConceptoAction() {
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarConceptos($this->uiParams));
    }

    public function eliminarNaturalezasAction() {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['datos'])
        );
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->eliminarNaturaleza($this->uiParams));
    }

    public function eliminarServiciosAction() {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['datos'])
        );
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->eliminarServicios($this->uiParams));
    }

    public function eliminarOperariosAction() {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['datos'])
        );
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->eliminarOperarios($this->uiParams));
    }

    public function obtenerProvinciasAction() {
        $this->objectHelper->synchronize($this,$this->_cfgpuntoventa->obtenerProvincias());
    }

    public function setModoCatalogoAction() {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(Zend_Json::decode($this->uiParams['datos']));
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->setModoCatalogo($this->uiParams));
    }

    public function enviarCajerosCajaAction() {
        $this->uiParams['datos'] = $this->_objHelper->stdClassToArray(Zend_Json::decode($this->uiParams['datos']));
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->enviarCajerosCaja($this->uiParams));
    }

    public function cargarCondicionPagoAction(){
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarCondicionPago($this->uiParams['idcliente']));        
    }

    public function cargarCajasAction()
    {
        $this->uiParams['idestructura'] = $this->global->estructura->idestructura;
        $datos = $this->_cfgpuntoventa->getCajasEntidad($this->uiParams['idestructura']);
        $this->datos = $datos;
        $this->cantidad = count($datos);
    }

    public function cargarProductoErrorAction() {
        $this->uiParams['idpedidos'] = json_decode($this->uiParams['idpedidos']);
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarProductoError($this->uiParams));
    }

    public function cargarLotesProductoAction()
    {
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->cargarLotesProducto($this->uiParams));
    }

    public function modificarPreciosLotesAction()
    {
        $this->objectHelper->synchronize($this, $this->_cfgpuntoventa->modificarPreciosLotes(json_decode($this->uiParams['lotes'])));
    }


}
