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
    $dir = Zend_Registry::getInstance()
            ->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class GestionarfacturaController extends BaseController
{
    protected $idestructuracomun, $gestFactura, $arrayData, $numeroCtl, $configuracionHelper, $configuracionService, $bloqueoInterceptor;

    public function init()
    {
        $this->arrayData = array('isPrincipal' => true, 'alias' => 'facturaLog', 'subsistema' =>
            LogisticaGlobal::SUBSISTEMA_FAC);
        parent::init('log.fac.facturacion');
        $inventario = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        if($inventario){
            $this->configuracionService = new ConfiguracioninventarioService();
            $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
            $this->view->uiVariables = array_merge(
                array(
                    'usarCategoria' => $this->objectHelper->getBooleanStr($config['usarcategoria']),
                    ),$this->view->uiVariables
            );
        } else {
            $this->view->uiVariables = array_merge(
                array('usarCategoria' => 'false'),
                $this->view->uiVariables
            );
        }
        $this->idestructuracomun = $this->global->Estructura->idestructura;
        $this->gestFactura = new GestionarFacturaModel($this->arrayData);

        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $data = $this->configuracionHelper->obtenerDocumentoPrimPorId($this->gestFactura->getIddoc()[0]);
        /*$monedas = $this->configuracionHelper->monedaContableEntidad(
           $this->global->Estructura->idestructura
       );
       $alternativa = 0;
       $moneda = array();
       foreach ($monedas['datos'] as $value) {
           if ($value['dualidad'] == 1) {
               $alternativa = 1;
               $moneda['monedaalternativa'] = $value['idmoneda'];
           } else {
               $moneda['monedacontable'] = $value['idmoneda'];
           }
       }*/
        $configfact = $this->gestFactura->cargarConfiguracion(array('idestructuracomun' => $this->global->Estructura->idestructura));
        //print_r($configfact);die;
        $contratacion = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_CRM);
        $depositos = $this->gestFactura->getDepositosEntidad();
        $this->view->uiVariables = array_merge(
            array('configfact' => json_encode($configfact),
                'depositos' => json_encode($depositos),
                'alternativa' => $configfact['dualidad'] == 1 ? 'true' : 'false',
                'contratacion' => $contratacion == 1 ? 'true' : 'false',
                'monedacontable' => "'" . "{$configfact['monedas']->codigoiso}" . "'",
                'monedaalternativa' => $configfact['dualidad'] == 1 ? "'".$configfact['monedas']->codigoisoalt."'" : "''",
                'idespaciotrabajo' => empty($data->idespaciotrabajo) ? 'false' : "'$data->idespaciotrabajo'",
                'iddocs' => "'{" . $this->gestFactura->getIddoc()[0] ."}'" ,
                'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
                'dirreporte' => "'{$configfact['dirreporte']}'",
                'alias' => "'{$this->arrayData['alias']}'",
                'iddocnotadebito' => ($this->gestFactura->getIddocNotaDebito()) ? "'{$this->gestFactura->getIddocNotaDebito()}'" : 'false',
                'iddocnotacredito' => ($this->gestFactura->getIddocNotaCredito()) ? "'{$this->gestFactura->getIddocNotaCredito()}'" : 'false',
                'idnaturaleza' => ($this->gestFactura->getIdNaturalezaExtra()) ? json_encode($this->gestFactura->getIdNaturalezaExtra()) : 'false',
                'useSign' => $this->objectHelper->getBooleanStr($configfact['utilizarfirma'])), $this->view->uiVariables
        );
        $this->bloqueoInterceptor = new BloqueoInterceptor($this, $this->uiParams);
        $this->bloqueoInterceptor->initLock($this->uiParams);
    }

    /**
     * Funcion que permite cargar la configuracion de Facturacion
     *
     * @return array Retorna la configuracion segun la estructura
     */
    public function cargarConfiguracionAction()
    {
        $params = $this->uiParams;
        $params['idestructuracomun'] = $this->idestructuracomun;
        $this->datos = $this->gestFactura->cargarConfiguracion(
            $params
        );
    }

    /**
     * Funcion contructor de la clase
     */
    public function gestionarfacturaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array($this->configuracionHelper->mostrarNomencladoresGenerales()/*,
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()*/);
        $this->initComponent('log.fac.facturacion');
        $this->renderTemplate();
    }

    /**
     * Funcion que permite adicionar una nueva factura
     *
     * @param array $params Arreglo con los datos necesarios
     *                      para crear una nueva factura
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function adicionarFacturaAction()
    {
        $parametros = json_decode($this->_request->getPost('datos'));
        if ($parametros) {
            if (!$parametros->datosComunes) {
    		$respuesta = $this->gestFactura->adicionarModificarFactura(
                    (Array)$parametros
                );
                $hitos = $this->gestFactura->getHitosFactura($respuesta['datos'][0]['iddocumento']);            
                $this->gestFactura->cambiarEstadoHitos($hitos, 1);
                $this->success = $respuesta;
            } else {
                $respuesta = $this->gestFactura->adicionarFacturasDeDocumentos(
                    (Array)$parametros
                );
                if ($respuesta['contador'] > 0) {
                    $this->success = true;
                    $this->respuesta = $respuesta;
                }
            }
        } else {
            $factor = $this->uiParams;
            $this->success = $this->gestFactura->guardarFactorMatriz(json_decode($factor['data']));
        }
    }

    /**
     * Funcion que permite modificar una factura seleccionada
     *
     * @param mixed $idfactura Identificador de la factura a modificar
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function modificarFacturaAction()
    {
    }

    /**
     * Funcion que permite eliminar una o varias
     * facturas seleccionadas en estado de elaboracion
     *
     * @param array $idfactura Arreglo con el identificador
     *                         de cada factura seleccionada
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function eliminarFacturaAction()
    {
        $hitos = $this->gestFactura->getHitosFactura(implode(',',json_decode($this->_request->getPost('documentos'))));            
        $this->gestFactura->eliminarFactura(
            array('documentos' => json_decode($this->_request->getPost('documentos')),
                'clientes' => json_decode($this->_request->getPost('clientes')),
                'oferta' => json_decode($this->_request->getPost('oferta')),
                'idsubsistema' => json_decode($this->_request->getPost('idsubsistema')))
        );
        $this->gestFactura->cambiarEstadoHitos($hitos, 0);        
		$this->success = true;
    }

    public function eliminarProdFacturaAction()
    {
        $this->importes = $this->gestFactura->eliminarProdFactura(
            json_decode($this->_request->getPost('datos')), $this->_request->getPost('idsubsistema'),
            json_decode($this->_request->getPost('iddocumento'))
        );
    }

    public function eliminarServFacturaAction()
    {
        $hitos = $this->gestFactura->getHitosFactura($this->_request->getPost('documento'));            
        $this->importes = $this->gestFactura->eliminarServFactura(
            json_decode($this->_request->getPost('datos')), $this->_request->getPost('documento')
        );
        $this->gestFactura->cambiarEstadoHitos($hitos, 0);        
    }

    /**
     * Funcion que permite confirmar una o varias
     * facturas seleccionadas en estado de elaboracion
     *
     * @param array $idfactura Arreglo con el identificador
     *                         de cada factura seleccionada
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function confirmarFacturaAction()
    {
        $respuesta = $this->gestFactura->confirmarFactura(
            json_decode($this->_request->getPost('documentos'))
        );
        $hitos = $this->gestFactura->getHitosFactura(implode(',',json_decode($this->_request->getPost('documentos'))));        
        $this->gestFactura->cambiarEstadoHitos($hitos, 2);
        $this->respuesta = $respuesta;
    }

    /**
     * Funcion que permite facturar una o varias
     * facturas seleccionadas en estado de preparado
     *
     * @param array $idfactura Arreglo con el identificador
     *                         de cada factura seleccionada
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function contabilizarFacturaAction()
    {
        $this->gestFactura->confirmarFactura(
            json_decode($this->_request->getPost('documentos'))
        );
        $respuesta = $this->gestFactura->contabilizarFactura(
            json_decode($this->_request->getPost('documentos')), $this->_request->getPost('serie'),
            json_decode($this->_request->getPost('infoDoc'))
        );
        $hitos = $this->gestFactura->getHitosFactura(implode(',',json_decode($this->_request->getPost('documentos'))));        
        $this->gestFactura->cambiarEstadoHitos($hitos, 3);
        $this->datos = $respuesta['respuesta'];
        if ($this->datos != 1) {
            $this->estado = $respuesta['estado'];
            $this->nrofactura = $respuesta['nrofactura'];
            $this->fechavencimiento = $respuesta['fechavencimiento'];
            if ($respuesta['comprobante'])
                $this->comprobante = $respuesta['comprobante'];
        }
    }

    /**
     * Funcion que permite cargar las facturas gestionadas en la estructura
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Arreglo con las facturas
     * @return int Cantidad total de facturas
     */
    public function cargarFacturasAction()
    {
        $facturas = $this->gestFactura->obtenerFacturas($this->uiParams);
        $this->datos = $facturas['datos'];
        $this->cantidad = $facturas['total'];
        $this->usuarios = $facturas['usuarios'];
    }

    /**
     * Funcion que permite obtener los depositos
     *
     * @return array Retorna un arreglo con los depositos
     */
    public function cargarDepositosBusquedaAction()
    {
        $sLogiticaUbic = LogisticaEstructuraUbicHelper::__init();
        $depositos = $sLogiticaUbic->cargardepositos(
            null, null, null, null, null, -1, 1,3
        );
        $this->datos = $depositos['depositos'];
    }

    public function cargarTiposDocumentosAction()
    {
        $this->datos = $this->gestFactura->getTipoDocumentos();
    }

    /**
     * Funcion que permite obtener los depositos y sus areas
     *
     * @return array Retorna un arreglo con los depositos
     */
    public function cargarDepositosAction()
    {
        /*$this->autoShow = false;
        $params['idestructura'] = $this->idestructuracomun;
        $params['node'] = $this->_request->getPost('node');
        $result = ($params['node']) ? $this->gestFactura->obtenerAreasPorIddeposito($params)
            : $this->gestFactura->obtenerDepositos();
        echo json_encode($result);*/
        $sLogiticaUbic = LogisticaEstructuraUbicHelper::__init();
        $depositos = $sLogiticaUbic->cargardepositos(
            null, null, null, null, null, -1, 1, 3
        );
        $this->datos = $depositos['depositos'];
    }

    /**
     * Funcion que permite obtener los tipos de documentos
     *
     * @return array Retorna un arreglo con los tipos de documentos
     */
    public function cargarTipoDocumentoAction()
    {
        $tipodocumento = $this->configuracionHelper->documentosPorSubsistemaEntidad(
            LogisticaGlobal::SUBSISTEMA_FAC, $this->idestructuracomun
        );
        $this->datos = $tipodocumento;
    }

    /**
     * Funcion que permite obtener los tipos de documentos
     *
     * @return array Retorna un arreglo con los tipos de documentos
     */
    public function cargarEncabezadoFacturaAction()
    {
        $params = $this->uiParams;
        $this->datos = $this->gestFactura->cargarEncabezado(
            $params['iddocumento']
        );
    }

    /**
     * Funcion que permite obtener las monedas contables de la entidad
     *
     * @return array Retorna un arreglo con las monedas contables de la entidad
     */
    public function cargarMonedaContableAction()
    {
        $this->datos = $this->gestFactura->getMonedas($this->uiParams);
    }

    /**
     * Funcion que permite obtener las condiciones de pago definidas para
     * la entidad
     *
     * @return array Retorna un arreglo con las condiciones de pago
     */
    public function cargarCondicionPagoAction()
    {
        $sContabilidadFinanzas = ServiciosContabilidadFinanzasHelper::__init();
        $this->datos = $sContabilidadFinanzas->obtenerCondicionesPago();
    }

    /**
     * Funcion que permite obtener la organizacion
     * transportadora segun la entidad
     *
     * @return array Retorna un arreglo con las organizaciones transportadoras
     */
    public function cargarTransportadoraAction()
    {
        $result = $this->gestFactura->getTransportadoras($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * Funcion que permite cargar los doc Distribucion de la entidad
     *
     * @return array Retorna un arreglo con los doc
     * @return int Retorna un entero con la cantidad total de productos
     */
    public function cargarDistribucionAction()
    {
        $result = $this->gestFactura->cargarDistribucion($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarDocumentosAction()
    {
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $result = $this->gestFactura->cargarDocumentos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarCuentasBancariasAction()
    {
        $this->datos = $this->gestFactura->getCuentasBancarias();
    }

    public function cargarCuentasClienteAction()
    {
        $this->datos = json_decode($this->_request->getPost('cuentas'));
    }

    /**
     * Funcion que permite cargar los doc pedidos de la entidad
     *
     * @return array Retorna un arreglo con los doc
     * @return int Retorna un entero con la cantidad total de productos
     */
    public function cargarDocumentosPedidosAction()
    {
        $result = $this->gestFactura->cargarPedidos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * Funcion que permite cargar los productos de la entidad
     *
     * @return array Retorna un arreglo con los productos
     * @return int Retorna un entero con la cantidad total de productos
     */
    public function cargarProductosAction()
    {
        $result = $this->gestFactura->obtenerProductos($this->uiParams);
        $this->datosAux = $result['datosAux'];
        $this->datos = $result['datos'];
        $this->total = $result['total'];
        $this->importes = $result['importes'];
    }

    public function cargarServiciosAction()
    {
        $result = $this->gestFactura->obtenerServicios($this->uiParams);
        $this->datosAux = $result['datosAux'];
        $this->datos = $result['datos'];
        $this->total = $result['total'];
        $this->importes = $result['importes'];
    }

    public function cargarProductosServiciosAction()
    {
        $result = $this->gestFactura->obtenerProductosServicios(
            $this->uiParams
        );
        $this->datosAux = $result['datosAux'];
        $this->datos = $result['datos'];
        $this->total = $result['total'];
    }

    /**
     * Funcion que permite anular el estado de una o varias
     * facturas seleccionadas en estado de preparado
     *
     * @param array $idfactura Arreglo con el identificador
     *                         de cada factura seleccionada
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function anularEstadoFacturaAction()
    {
        $respuesta = $this->gestFactura->anularEstadoFactura(
            json_decode($this->_request->getPost('documentos')), json_decode($this->_request->getPost('estado'))
        );
        $hitos = $this->gestFactura->getHitosFactura(implode(',',json_decode($this->_request->getPost('documentos'))));        
        $this->gestFactura->cambiarEstadoHitos($hitos, 1);
        $this->respuesta = $respuesta;
    }

    public function aprobarEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(
            ',', Zend_Json::decode($this->uiParams['id'])
        );
        $this->success = $this->gestFactura->aprobarDocumento(
            $this->uiParams['iddocumento']
        );
    }

    public function anularFacturaAction()
    {
        $respuesta = $this->gestFactura->anularFactura(
            json_decode($this->_request->getPost('documentos')), $this->_request->getPost('observacion')
        );
        $idsDocumentos = array();
        $aux = json_decode($this->_request->getPost('documentos'));
        foreach ($aux as $d) {
            array_push($idsDocumentos, $d[0]);
        }
        $hitos = $this->gestFactura->getHitosFactura(implode(',', $idsDocumentos));
             
        $this->gestFactura->cambiarEstadoHitos($hitos, 0);
        $this->respuesta = $respuesta;
        $dir2 = split("web", $_SERVER['DOCUMENT_ROOT']);
        $configFile= '' . $dir2[0] .  '/apps/masterhl7/comun/recursos/xml/config_his.xml';
        if (file_exists($configFile)) {
            $xmlCargado = simplexml_load_file($configFile);
            if($xmlCargado->config['configurado']==1){
                $arrayAux = json_decode($this->_request->getPost('documentos'));
                $doc = array();
                foreach ($arrayAux as $d) {
                    array_push($doc, $d[0]);
                }
                $this->integrator->masterhl7->serviciosNoHaFacturar($doc);
            }
        }
    }

    public function cargarClientesAction()
    {
        $clientes = $this->gestFactura->getClientes($this->uiParams);
        $this->datos = $clientes['datos'];
        $this->total = $clientes['cantidad'];
    }

    public function cargarTipoPrecioAction()
    {
        $this->datos = $this->gestFactura->getTipoPrecios($this->uiParams);
    }

    function getDocumentosaGenerarAction()
    {
        $datos = $this->gestFactura->getDocumentosaGenerar();
        $this->datos = $datos;
    }

    // Implementacion mientras exista subsistema almacenes
    function getDocumentosEntregaAction()
    {
        try {
            $this->datos = $this->gestFactura->getDocumentosAft(
                $this->uiParams
            );
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    // Implementacion mientras exista subsistema almacenes
    function getClientesByDocumentosAction()
    {
        $resultados = $this->gestFactura->getClientesByDocumentos(
            $this->uiParams
        );
        $this->datos = $resultados['datos'];
        $this->cantidad = $resultados['cantidad'];
    }

    function adicionarProductoAction()
    {
        $this->gestFactura->adicionarProducto(
            json_decode($this->_request->getPost('datos'))
        );
    }

    function adicionarServicioAction()
    {
        $this->importes = $this->gestFactura->adicionarServicio(
            json_decode($this->_request->getPost('datos'))
        );
        $hitos = $this->gestFactura->getHitosFactura(json_decode($this->_request->getPost('datos'))->documento);        
        $this->gestFactura->cambiarEstadoHitos($hitos, 1);
    }

    function adicionarProdServAction()
    {
        $this->importes = $this->gestFactura->adicionarProdServicio(
            json_decode($this->_request->getPost('datos'))
        );
    }

    public function generaFacturaDeOfertaAction()
    {
        $respuesta = $this->gestFactura->generarFacturaDeOferta(
            json_decode($this->_request->getPost('documentos'))
        );
        $this->nrogenerado = $respuesta['nrogenerado'];
        $this->success = $respuesta['success'];
    }

    public function generaPedidoDeOfertaAction()
    {
        $respuesta = $this->gestFactura->generaPedidoDeOferta(
            json_decode($this->_request->getPost('documentos'))
        );
        $this->nrogenerado = $respuesta['nrogenerado'];
        $this->success = $respuesta['success'];
    }

    public function generaDistribucionFacturaAction()
    {
        $respuesta = $this->gestFactura->generaDistribucionFactura(
            json_decode($this->_request->getPost('documentos'))
        );
        $this->nrogenerado = $respuesta['nrogenerado'];
        $this->success = $respuesta['success'];
    }

    public function getPrecioProductoAction()
    {
        $this->precio = $this->gestFactura->setTipoPrecio(
            json_decode($this->_request->getPost('datos'))
        );
    }

    public function cargarDocumentosOrigenAction()
    {
        $this->uiParams['idestructuracomun'] = $this->idestructuracomun;
        $resultados = $this->gestFactura->getDocOrigen(null, $this->uiParams);
        $this->datos = $resultados;
    }

    public function cargarSubsistemasAction()
    {
        $this->datos = $this->gestFactura->getOperaciones($this->uiParams);
        //$this->idsubsistema = LogisticaGlobal::SUBSISTEMA_FAC;
        /*$dualidad = LogisticaGlobal::__init()
            ->getMonedaEntidad();*/
        /*$this->idmonedacontable = $dualidad->idmoneda;
        $this->idmonedaalternativa = $dualidad->idmonedaalternativa;*/
    }

    public function eliminarProdServicioAction()
    {
        $this->importes = $this->gestFactura->eliminarProdServicio(
            json_decode($this->_request->getPost('datos'))
        );
    }

    public function verificarDatosProductosAction()
    {
        $productos = $this->gestFactura->getDatosProdConfirmar(
            json_decode($this->_request->getPost('iddocumento')), $this->_request->getPost('subsistema')
        );
        $servicios = $this->gestFactura->getDatosServConfirmar(
            json_decode($this->_request->getPost('iddocumento')), $this->_request->getPost('subsistema')
        );
        $this->productos = $productos;
        $this->servicios = $servicios;
    }

    public function cargarServiciosNomencladorAction()
    {
        $this->gestFactura->getServiciosnomenclador();
    }

    public function cargarActividadesAction()
    {
        $parametros = $this->uiParams;
        $parametros['nivel'] = 4;
        $parametros['criterio'] = $this->_request->getPost('criterio');
        $resultado = $this->gestFactura->cargarActividadesExistentes($parametros);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['total'];
    }

    /* numeros de control */
    public function cargarNumeroFacturaAction()
    {
    }

    public function cargarNumeroControlAction()
    {
    }

    public function verifyNumbersAction()
    {
        $respuesta = $this->gestFactura->verificarNumerosControl($this->_request->getPost('numbers'));
        $this->respuesta = $respuesta;
    }

    public function deleteNumbersAction()
    {
    }

    public function cargarNrodocumentosManualesAction()
    {
    }

    public function cargarCategoriaPrecioAction()
    {
        $result = $this->gestFactura->cargarCategoriaPrecio($this->uiParams);
        $this->datos = $result['datos'];
        $this->datosAux = $result['datosAux'];
        $this->total = $result['total'];
    }

    public function getPuntosImpresionAction()
    {
        $respuesta = $this->gestFactura->getPuntosImprecion();
        $this->datos = $respuesta;
    }

    public function getNumerosControlAction()
    {
        $parametros = array('idpuestotrabajo' => $this->_request->getPost('idpuestotrabajo'),
            'idestructuracomun' => $this->idestructuracomun,
            'cantnucontrol' => $this->_request->getPost('cantnucontrol'));
        $respuesta = $this->gestFactura->asignarNumerosControl($parametros);
        $this->respuesta = $respuesta;
    }

    public function imprimirModeloAction()
    {
        $iddocumento = json_decode(stripslashes($this->_request->getPost('iddocumento')));
        $numeroControl = json_decode($this->_request->getPost('ncontrol'));
        $numeroControlAnular = json_decode($this->_request->getPost('nroanular'));
        $puestoimpresion = json_decode($this->_request->getPost('puestoimpresion'));
        $this->respuesta = $this->gestFactura->addNumerosControl(
            $iddocumento, $numeroControl, $puestoimpresion, $numeroControlAnular
        );
    }

    //numeros de control con series
    public function getSeriesAction()
    {
        $respuesta = $this->gestFactura->getSeries($this->uiParams);
        $this->datos = $respuesta['datos'];
        $this->cantidad = $respuesta['cantidad'];
    }

    public function cargarMovLoteAction()
    {
        $lote = new LoteService();
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $lote->cargarMovLote($this->uiParams, false);
        $this->datos = $datosBusqueda['datos'];
        $this->unsetParam('criterio');
        $this->datosAux = $lote->cargarMovLote($this->uiParams, true)->fetchArray();
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function eliminarLoteAction()
    {
        $datos = json_decode($this->uiParams['data']);
        $afecta = json_decode($this->uiParams['datos']);
        $this->success = $this->gestFactura->eliminarLote($datos, $afecta);
    }

    public function dispatch($action)
    {
        $this->bloqueoInterceptor->around($this, $action, $this->uiParams);
        parent::dispatch($action);
    }

    public function getOperacionesActivoAction(){
        $this->datos = $this->gestFactura->getOperacionesActivo();
    }

    public function cargarContratosAction(){
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->gestFactura->getContratos($this->uiParams));
    }

    public function cargarServContratoAction(){
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->gestFactura->getServContrato($this->uiParams));
    }

    public function cargarProdContratoAction(){
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->gestFactura->getProdContrato($this->uiParams));
    }

    public function modificarPrecioAction(){
        $this->success = true;
    }

    public function cargarVendedorAction() {
        $this->objectHelper->synchronize($this, $this->gestFactura->getVendedores($this->uiParams));
    }

    public function cargarFormaPagoAction() {
        $this->objectHelper->synchronize($this, $this->gestFactura->cargarFormaPago($this->uiParams));
    }
    
    public function aplicarTipoPrecioAction() {
        $this->success = $this->gestFactura->aplicarTipoPrecio($this->uiParams);
    }

    public function cargarAftAction() {
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->gestFactura->cargarAft($this->uiParams));
    }

    public function exportarXmlAction()
    {
        $dir_index = $_SERVER['SCRIPT_FILENAME'];
        $path = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'web/logistica/facturacion/facturacion/factura/eFactura/';
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }
        if (!empty($_FILES['file-path']) && ($_FILES['file-path']['error'] == 0)) {
            $fileName = $this->gestFactura->getIdFile($this->uiParams['iddocumento']).'.xml';
            $xml = $this->gestFactura->getFacturaXml($this->uiParams['iddocumento']);

            $sxe = new SimpleXMLElement($xml);
            $dom = new DOMDocument('1,0');
            $dom->preserveWhiteSpace = false;
            $dom->formatOutput = true;
            $dom->loadXML($sxe->asXML());

            $dom->saveXML();

            $dom->save($path.$fileName);
            $facturaRuta = $path.$fileName;

            $respuestaApi = ( new FacertIntegrationService())->generarFactura(
                "{$facturaRuta}",
                "{$_FILES['file-path']}",
                "{$this->uiParams['password']}"
            );
            print_r($respuestaApi);die;


            $this->success = true;
            $this->error = 1;
            $this->intercepted = null;
        } else {
            $this->error = 3;
        }
        //$this->url = '/logistica/facturacion/facturacion/factura/'.$fileName;
    }

    public function exportarCsvAction()
    {
        $dir_index = $_SERVER['SCRIPT_FILENAME'];
        $path = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'web/logistica/facturacion/facturacion/factura/FacturaCvs/';
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }

        $datos = $this->gestFactura->getDatosFacturaXml($this->uiParams['iddocumento']);
        $id = $datos[0]['nrofactura'];
        $delimiter = "|";
        $fileName = $this->gestFactura->getNameFile($this->uiParams['iddocumento']).'.csv';
        //create a file pointer
        $f = fopen($path.$fileName, 'w');

        $encabezado = array($datos[0]['codreupcliente'], $datos[0]['nrofactura'], $datos[0]['moneda']);
        fputcsv($f, $encabezado, $delimiter);

        $productos = $this->gestFactura->getDatosProductos($this->uiParams['iddocumento']);

        foreach ($productos as $row) {
            $ref = $this->gestFactura->getRefProducto($row['idindicador']);
            $referencia = $ref[0]['referencia'];
            $lineData = array($referencia, $row['codigo'], $row['cantidad'], $row['importe']);
            fputcsv($f, $lineData, $delimiter);
        }

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $fileName . '";');

        $this->url = '/logistica/facturacion/facturacion/factura/FacturaCvs/'.$fileName;
        $this->success = true;
        $this->intercepted = null;
    }

    public function cargarContactosAction()
    {
        $this->objectHelper->synchronize($this, $this->gestFactura->cargarContactos($this->uiParams));
    }

    public function cargarNomCilindrosAction()
    {
        $this->objectHelper->synchronize($this, $this->gestFactura->cargarNomCilindros($this->uiParams));
    }

    public function cargarCilindrosAction()
    {
        $this->objectHelper->synchronize($this, $this->gestFactura->cargarCilindros($this->uiParams));
    }

    public function adicionarCilindroFacturaAction()
    {
        $this->uiParams['cilindros'] = json_decode($this->uiParams['cilindros']);
        $this->uiParams['util'] = json_decode($this->uiParams['util']);
        $this->gestFactura->adicionarCilindroFactura(
            $this->uiParams
        );
    }

    public function modificarCilindroAction()
    {
        $this->uiParams['cilindros'] = json_decode($this->uiParams['cilindros']);
        $this->importes = $this->gestFactura->modificarCilindro(
            $this->uiParams
        );
    }

    public function eliminarCilindroAction()
    {
        $this->uiParams['datos'] = json_decode($this->uiParams['datos']);
        $this->importes = $this->gestFactura->eliminarCilindro(
            $this->uiParams
        );
    }
}
