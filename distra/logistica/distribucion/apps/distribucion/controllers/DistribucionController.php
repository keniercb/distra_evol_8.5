<?php

/**
 * @class DistribucionController
 * (Descripcion de la clase, objetivo)
 *
 * @package Distribucion
 * @subpackage Distribucion
 * @author Manuel Yhon Figueroa
 * @copyright XETID
 * @version 1.0
 */
if (!class_exists('BaseModel')) { 
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class DistribucionController extends BaseController /* ZendExt_Controller_Secure */
{

    private $_arrayData;
    private $_distribucionModel;
    private $_configuracionService;
    private $configuracionInventario;

    public function init()
    {
        $this->_arrayData = array(
            'isPrincipal' => true,'alias' => 'entregaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_DIST
        );
        parent::init('log.dist.distribucion');
        $this->_distribucionModel = new DistribucionModel($this->_arrayData);
        $this->_configuracionService = new ConfiguracioninventarioService();
        $this->configuracionInventario = $this->_configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->_distribucionModel->getIddoc());
        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        $depositos = $this->_distribucionModel->getDepositosEntidad(array());
        $cfgUsuarioEsp = new CfgUsuarioespecialidad();
        if ($this->jsonComponent->getComponent('log.inv.municiones', true)) {
            $configEspecialidad = $cfgUsuarioEsp->devolverConfiguracionEspecialidad(
                $this->global->Perfil->idusuario, $this->view->uiVariables['espArmamento']
            );
        }
        $this->view->uiVariables = array_merge(
            array(
            'useSign' => $this->objectHelper->getBooleanStr($this->configuracionInventario['firmadigital']),
            'usarCategoria' => $this->objectHelper->getBooleanStr($this->configuracionInventario['usarcategoria']),
            'alias' => "'{$this->_arrayData['alias']}'",
            'idespaciotrabajo' => empty($data->idespaciotrabajo) ? 'false' : "'$data->idespaciotrabajo'",
            'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
            'alternativa' => empty($monedas->idmonedaalternativa) ? 'false' : 'true',
            'monedacontable' => $monedas->idmoneda,
            'monedaalternativa' => empty($monedas->idmonedaalternativa) ?  "'0'" : $monedas->idmonedaalternativa,
            'cmpArmamento' => $this->jsonComponent->getComponent('log.inv.municiones', true) ? 'true' : 'false',
            'confArmamento' => empty($configEspecialidad->idespecialidad) ? 'false' : 'true',
            'codContable' => "'$monedas->codigoiso'",
            'codAlternativa' => "'$monedas->codigoisoalt'",
            'depositos' => json_encode($depositos['datos'])
            ), $this->view->uiVariables
        );
        $this->logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
    }

    public function distribucionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.dist.distribucion');
        $this->renderTemplate();
    }

    public function cargarEstructurasAction()
    {
        $this->uiParams['idseleccionados'] = Zend_Json::decode(
            $this->uiParams['idseleccionados']
        );
        $depositos = $this->_distribucionModel->cargarEstructuras($this->uiParams);
        $this->datos = $depositos['datos'];
        $this->cantidad = $depositos['cantidad'];
    }

    public function cargarClientesCriticosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosCliente = $this->_distribucionModel->devolverClientesConsumoCritico($this->uiParams);
        $this->datos = $datosCliente['datos'];
        $this->cantidad = $datosCliente['cantidad'];
    }

    public function cargarClientesAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['listaClientes'] = (array) Zend_Json::decode(
            $this->uiParams['listaClientes']
        );
        $this->uiParams['idpedido'] = implode(',', Zend_Json::decode($this->uiParams['idpedido']));
        $datosCliente = $this->_distribucionModel->devolverClientesPedidos($this->uiParams);
        $this->datos = $datosCliente['datos'];
        $this->cantidad = $datosCliente['cantidad'];
    }

    public function cargarCentrosCostoAction()
    {
        $idseleccionados = Zend_Json::decode(
            $this->uiParams['idseleccionados']
        );
        $data = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
            $this->global->Estructura->idestructura, $this->uiParams['start'], $this->uiParams['limit'],
            ($this->uiParams['query'])?$this->uiParams['query']:$this->uiParams['criterio'],null,1
        );
        if (count($data) > 0) {
            foreach ($data as $index => $objCliente) {
                foreach ($idseleccionados as $idCliente) {
                    if ($objCliente->idcentrogrupo == $idCliente) {
                        unset($data[$index]);
                    }
                }
            }
        }
        $this->datos = array_values($data);
        $this->cantidad = count($data);
    }

    public function cargarPedidosAction()
    {
        $this->uiParams['distribucion'] = true;
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];

        if ($this->uiParams['idseleccionados']) {
            $this->uiParams['idseleccionados'] = Zend_Json::decode($this->uiParams['idseleccionados']);
        }
        $pedido = new PedidoService();
        $datos = $pedido->cargarDocPedido($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function cargarDocumentosAction()
    {
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $datosBusqueda = $this->_distribucionModel->devolverDocumentos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function cargarDestinosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->_distribucionModel->devolverClientes($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->_distribucionModel->devolverMovimientos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
        $this->importetotal = $datosBusqueda['importetotal'];
        $this->importetotalcuc = $datosBusqueda['importetotalcuc'];
        $this->cantclientes = $datosBusqueda['cant_clientes'];
        $this->cantproductos = $datosBusqueda['cant_productos'];

    }

    public function cargarProductosDistribuirAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['arrayCliente'] = (array) Zend_Json::decode(
            $this->uiParams['arrayCliente']
        );
        $datosBusqueda = $this->_distribucionModel->devolverProductosDistribuir($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function cargarProductosDistribucionAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        if ($this->uiParams['idproductoorigen']) {
            $this->uiParams['idproductoorigen'] = (array) Zend_Json::decode($this->uiParams['idproductoorigen']);
        }
        $datosBusqueda = $this->_distribucionModel->devolverMovimientos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
        $this->cantproductos = $datosBusqueda['cant_productos'];
    }

    public function devolverIndicadoresPedidoAction()
    {
        $this->datos = $this->_distribucionModel->devolverIndicadoresPedido($this->uiParams);
    }

    public function cargarProductosDistribuidosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->_distribucionModel->devolverProductosDistribuidos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function cargarProductosAlternativosAction()
    {
        
    }

    public function cargarProductosEstadoEjecucionAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->_distribucionModel->devolverMovimientos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
        $this->cantcumpltotal = $datosBusqueda['cantcumpltotal'];
        $this->cantcumplparc = $datosBusqueda['cantcumplparc'];
        $this->porcientocumplimiento = $datosBusqueda['porcientocumplimiento'];
    }

    public function cargarDocumentosGeneradosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->_distribucionModel->devolverDocumentosGenerados($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    function cargarArbolClientesAction()
    {
        $this->autoShow = false;
        if ($this->params['node'] == 0) {
            $arrayClientes = $this->_distribucionModel->cargarClientes($this->uiParams);
            if (count($arrayClientes) > 0) {
                foreach ($arrayClientes as $clientes) {
                    $obj = new stdClass();
                    $obj->id = $clientes['idcliente'];
                    $obj->text = $clientes['text'];
                    $obj->leaf = true;
                    $arbolClientes[] = $obj;
                }
            } else {
                $arbolClientes[] = null;
            }
            echo json_encode($arbolClientes);
        }
    }

    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = (array) Zend_Json::decode(
            $this->uiParams['data']
        );
        $this->uiParams['idcliente'] = (array) Zend_Json::decode(
            $this->uiParams['idcliente']
        );
        $this->uiParams['idpedido'] = (array) Zend_Json::decode(
            $this->uiParams['idpedido']
        );
        $this->uiParams['documentos'] = (array) Zend_Json::decode(
            $this->uiParams['documentos']
        );
        $this->uiParams['inversa'] = (array) Zend_Json::decode(
            $this->uiParams['inversa']
        );
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        //$result = $this->_distribucionModel->adicionarDocumento($this->uiParams);
        $this->objectHelper->synchronize($this, $this->_distribucionModel->adicionarDocumento($this->uiParams));
        /*$this->iddocumento = $result['iddocumento'];
        $this->destino = $result['destino'];*/

        /*if ($result['destino'] > 1) {
            $this->success = false;
        }*/
    }

    public function adicionarDestinosAction()
    {
        $this->uiParams['idcliente'] = (array) Zend_Json::decode(
            $this->uiParams['idcliente']
        );
        $this->uiParams['idpedido'] = (array) Zend_Json::decode(
            $this->uiParams['idpedido']
        );
        /*$result = $this->_distribucionModel->adicionarClientesDocumento(
            $this->uiParams['iddocumento'], $this->uiParams
        );*/
        $this->objectHelper->synchronize(
            $this, $this->_distribucionModel->adicionarClientesDocumento($this->uiParams['iddocumento'], $this->uiParams)
        );
        /*$this->success = $result['success'];*/
    }

    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(
            ',', Zend_Json::decode($this->uiParams['id'])
        );
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_distribucionModel->eliminarDocumento(
            $this->uiParams['iddocumento']
        );
    }

    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(
            ',', Zend_Json::decode($this->uiParams['id'])
        );
        $this->uiParams['idclientes'] = Zend_Json::decode($this->uiParams['idclientes']);
        $datos = $this->success = $this->_distribucionModel->confirmarDocumento(
            $this->uiParams['iddocumento'], $this->uiParams
        );
        $this->success = $datos['success'];
        $this->noconfirmados = $datos['noconfirmados'];
        $this->estado = EstadoDocumentoModel::ESTADO_PENDIENTE;

    }

    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(
            ',', Zend_Json::decode($this->uiParams['id'])
        );
        $this->success = $this->_distribucionModel->anularEstadoDocumento(
            $this->uiParams['iddocumento']
        );
    }

    public function aprobarEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(
            ',', Zend_Json::decode($this->uiParams['id'])
        );
        $this->objectHelper->synchronize(
            $this, $this->_distribucionModel->aprobarDocumento($this->uiParams)
        );
    }

    public function eliminarDestinosAction()
    {
        $this->uiParams['iddocclientes'] = (array) Zend_Json::decode($this->uiParams['iddocclientes']);
        $result = $this->_distribucionModel->eliminarDestinos($this->uiParams);
        $this->success =  $result['success'];
    }

    public function adicionarMovimientosAction()
    {
        $this->uiParams['idproductos'] = (array) Zend_Json::decode($this->uiParams['idproductos']);
        $this->uiParams['idestructuras'] = (array) Zend_Json::decode($this->uiParams['idestructuras']);
        $this->uiParams['cantidad'] = (array) Zend_Json::decode($this->uiParams['cantidad']);
        if ($this->uiParams['alternativo']) {
            $this->success = $this->_distribucionModel->adicionarProdAlternativos($this->uiParams);
        } else {
            $result = $this->_distribucionModel->adicionarMovimientos($this->uiParams);
            $this->success = $result['success'];
            $this->cantclientes = $result['cant_clientes'];
            $this->cantproductos = $result['cant_productos'];
        }
    }

    public function adicionarPedidosAction()
    {
        $this->uiParams['idcliente'] = (array) Zend_Json::decode(
            $this->uiParams['idcliente']
        );
        $this->uiParams['idpedido'] = (array) Zend_Json::decode(
            $this->uiParams['idpedido']
        );
        $this->uiParams['idindicador'] = Zend_Json::decode(
            $this->uiParams['idindicador']
        );
        $this->destino = $this->_distribucionModel->adicionarDistribucionPedido(
            $this->uiParams['iddocumento'], $this->uiParams
        );
    }

    public function eliminarMovimientosAction()
    {
        $this->uiParams['idmovimientos'] = Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->uiParams['idclientes'] = Zend_Json::decode($this->uiParams['idclientes']);
        $result = $this->_distribucionModel->eliminarProductos($this->uiParams);
        $this->success = $result['success'];
        $this->cantclientes = $result['cant_clientes'];
        $this->cantproductos = $result['cant_productos'];
    }

    public function salvarCantidadesAction()
    {
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_distribucionModel->salvarCantidades($this->uiParams);
    }

    public function devorlverProductosAnulacionAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->_distribucionModel->devolverProductosAnulacion($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
        $this->asigcancelada = $datosBusqueda['asigcancelada'];
    }

    public function salvarCantidadesAnularAction()
    {
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_distribucionModel->salvarCantidadesAnular($this->uiParams);
    }

    public function anularAsignacionAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_distribucionModel->actualizarCantidades($this->uiParams['iddocumento']);
    }

    public function anularEstadoDocAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->objectHelper->synchronize(
            $this, $this->_distribucionModel->anularEstadoDoc($this->uiParams['iddocumento'])
        );
    }

    public function realizarPropuestaDistribucionAction()
    {
        $this->uiParams['idproducto'] = (array) Zend_Json::decode($this->uiParams['idproducto']);
        $this->uiParams['idcliente'] = (array) Zend_Json::decode($this->uiParams['idcliente']);
        $this->uiParams['idindicador'] = (array) Zend_Json::decode($this->uiParams['idindicador']);
        $this->uiParams['idestructuraop'] = (array) Zend_Json::decode($this->uiParams['idestructuraop']);
        $result = $this->_distribucionModel->realizarPropuestaDistribucion($this->uiParams);
        $this->success = $result['success'];
        $this->nodistribuidos = $result['nodistribuidos'];
        $this->arrayproductos = $result['arrayproductos'];
    }

    public function cargarLotesAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->_distribucionModel->cargarLotes($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function ajustarPrioridadAction()
    {
        $datos = Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->_distribucionModel->ajustarPrioridades($datos);
    }

    public function cargarproductosAction()
    {
        $this->uiParams['asentado'] = true;
        $result = $this->_distribucionModel->cargarProductos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function getDistribucionPedidoAction()
    {
        if (class_exists('ConfiguraciondistribucionService')) {
            $configuracionDistribucion = new ConfiguraciondistribucionService();
            $configuracion = $configuracionDistribucion->devolverConfiguracion();
        }
        $reserva = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_RESERVA);
        if($reserva){
            $cfgReserva = new ConfreservaService();
            $cfg = $cfgReserva->obtenerConfiguracionGeneral();
            if ($cfg['idestructurapadre']) {
            }
            $objIddocP = $this->documentosHelper->devuelveIddocByIdEstructura(
                'prestamoLog', $cfg['idestructurapadre'], LogisticaGlobal::SUBSISTEMA_RESERVA
            );
            $objIddocCU = $this->documentosHelper->devuelveIddocByIdEstructura(
                'cambioubicLog', $cfg['idestructurapadre'], LogisticaGlobal::SUBSISTEMA_RESERVA
            );
            $objIddocCS = $this->documentosHelper->devuelveIddocByIdEstructura(
                'solicitudCS', $cfg['idestructurapadre'], LogisticaGlobal::SUBSISTEMA_RESERVA
            );
            $objIddocSL = $this->documentosHelper->devuelveIddocByIdEstructura(
                'solicitudlcLog', $cfg['idestructurapadre'], LogisticaGlobal::SUBSISTEMA_RESERVA
            );
            $configuracion[0]['reserva'] =
                ($objIddocP->iddoc || $objIddocCU->iddoc || $objIddocCS->iddoc || $objIddocSL->iddoc) ? 1 : 0;
        }else{
            $configuracion[0]['reserva'] = 0;
        }

        $this->datos = $configuracion;
    }

    public function getSubordinacionEntidadAction()
    {
        $this->uiParams['identidad'] = Zend_Json::decode($this->uiParams['identidad']);
        $result = $this->_distribucionModel->getDepositosEntidad($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarSolicitudPrestamoAction()
    {
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->uiParams['estado'] = array('3');
        $this->uiParams['iddelegacion'] = $this->global->Estructura->idestructura;
        $this->uiParams['tipodoc'] = 1;
        $comunreserva = new ComunReservaService();
        $this->objectHelper->synchronize($this, $comunreserva->devolverDocumentos($this->uiParams));
    }

    public function cargarSolicitudCambioUbicAction()
    {
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->uiParams['estado'] = array('3');
        $this->uiParams['iddelegacion'] = $this->global->Estructura->idestructura;
        $this->uiParams['tipodoc'] = 2;
        $comunreserva = new ComunReservaService();
        $this->objectHelper->synchronize($this, $comunreserva->devolverDocumentos($this->uiParams));
    }

    public function cargarSolicitudCambioSurtidoAction()
    {
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->uiParams['estado'] = array('3');
        $this->uiParams['iddelegacion'] = $this->global->Estructura->idestructura;
        $this->uiParams['tipodoc'] = 3;
        $comunreserva = new ComunReservaService();
        $this->objectHelper->synchronize($this, $comunreserva->devolverDocumentos($this->uiParams));
    }

    public function cargarSolicitudLiberacionAction()
    {
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->uiParams['estado'] = array('3');
        $this->uiParams['iddelegacion'] = $this->global->Estructura->idestructura;
        $this->uiParams['tipodoc'] = 4;
        $comunreserva = new ComunReservaService();
        $this->objectHelper->synchronize($this, $comunreserva->devolverDocumentos($this->uiParams));
    }

    /**
     * Devuelve los informes de recepción aprobados.
     */
    public function cargarRecepcionAction()
    {
        $this->uiParams['estado'] = 4;
        $this->uiParams['filtraiddoc'] = true;
        $this->uiParams['alias'] = 'recepcionLog';
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->_distribucionModel->cargarRecepcion($this->uiParams));
    }
    
    /**
     * Devuelve los movimientos de un informe de recepción.
     */
    public function cargarMovRecepcionAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->_distribucionModel->cargarMovRecepcion($this->uiParams['id']), $this->uiParams);
    }

    public function eliminarClientesProductosAction()
    {
        $this->uiParams['idmovimientos'] = Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->uiParams['idclientes'] = Zend_Json::decode($this->uiParams['idclientes']);
        $this->uiParams['idprodorden'] = Zend_Json::decode($this->uiParams['idprodorden']);
        $result = $this->_distribucionModel->eliminarClientesProductos($this->uiParams);
        $this->success = $result['success'];
        $this->cantclientes = $result['cant_clientes'];
        $this->cantproductos = $result['cant_productos'];
    }

    public function cargarEntidadesAction()
    {
        //$this->datos = ServiciosSeguridadHelper::__init()->getEntidadesByRolUsuario();
        if($this->configuracionInventario['contintegrada'] == 0){
            $this->datos = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras($this->global->Estructura->idestructura, false, $this->uiParams['criterio']);
        }else{
            $this->datos = $this->_distribucionModel->cargarEntidades($this->uiParams['criterio']);
        }    
    }

    public function copiarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->datos = $this->_distribucionModel->copiarDocumento($this->uiParams['iddocumento']);
    }

    public function cargarCancelacionesAction()
    {
        $this->objectHelper->synchronize($this, $this->_distribucionModel->cargarCancelaciones($this->uiParams['idprodorden']), $this->uiParams);
    }

    public function restablecerCumplimientoAction() {
        $this->_distribucionModel->restablecerCumplimiento($this->uiParams['iddocumento']);
    }

    public function cancelarAsignacionesAction() {
        $this->success = $this->_distribucionModel->cancelarAsignaciones($this->uiParams['iddocumento'], $this->uiParams['motivo']);
    }

    public function cargarAreasResponsabilidadAction() {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['distribucion'] = true;
        $documentoActivoService = new DocumentoActivoModel();
        $datos = $documentoActivoService->getAreasResponsabilidad($this->uiParams);
        $this->datos = $datos['depositos']['datos'];
        $this->cantidad = $datos['depositos']['cantidad'];
    }
}
