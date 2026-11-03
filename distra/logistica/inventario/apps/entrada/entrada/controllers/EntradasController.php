<?php

/**
 * @class EntradasController
 * (Descripcion de la clase, objetivo)
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class EntradasController extends BaseController
{

    protected $model, $arrayData, $bloqueoInterceptor, $configuracionService;

    public function init($strComponent = '')
    {
        parent::init($strComponent);
        $this->arrayData['isPrincipal'] = true;
        $this->model = new EntradaProxy($this->arrayData);
        $this->configuracionService = new ConfiguracioninventarioService();
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->model->getModel()->getIddoc());
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $alternativa = 0;
        $moneda = array();
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['monedaalternativa'] = $value['idmoneda'];
                $moneda['codAlternativa'] = $value['codigoiso'];
            } else {
                $moneda['monedacontable'] = $value['idmoneda'];
                $moneda['codContable'] = $value['codigoiso'];
            }
        }
        $cfg = new Datconfigubicacion();
        $confubic = $cfg->cargarDatos($this->global->Estructura->idestructura);
        $fecha = new DateTime();
        $fechacontable = $this->configuracionHelper->getFechaContableSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $cfgUsuarioEsp = new CfgUsuarioespecialidad();
        if ($this->jsonComponent->getComponent('log.inv.municiones', true)) {
            $configEspecialidad = $cfgUsuarioEsp->devolverConfiguracionEspecialidad(
                $this->global->Perfil->idusuario, $this->view->uiVariables['espArmamento']
            );
        }
        $this->view->uiVariables = array_merge(
            array(
            'usarCategoria' => $this->objectHelper->getBooleanStr($config['usarcategoria']),
            'usarCantidad' => $this->objectHelper
                ->getBooleanStr($config['registrarcantidad'] && $this->arrayData['alias'] != 'aperturaLog'),
            'alternativa' => $alternativa == 1 ? 'true' : 'false',
            'idcontable' => "'" . "{$moneda['monedacontable']}" . "'",
            'idalternativa' => "'" . "{$moneda['monedaalternativa']}" . "'",
            'codContable' => "'" . "{$moneda['codContable']}" . "'",
            'codAlternativa' => "'" . "{$moneda['codAlternativa']}" . "'",
            'useSign' => $this->objectHelper->getBooleanStr($config['firmadigital']),
            'confubicacion' => $confubic['estructura'] ? 'false' : 'true',
            'idespaciotrabajo' => empty($data->idespaciotrabajo) ? 'false' : "'$data->idespaciotrabajo'",
                'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
            'cmpArmamento' => $this->jsonComponent->getComponent('log.inv.municiones', true) ? 'true' : 'false',
            'confArmamento' => empty($configEspecialidad->idespecialidad) ? 'false' : 'true',
            'alias' => "'{$this->arrayData['alias']}'",
            'fecha' => "'{$fecha->format('d/m/Y')}'",
            'fechacontable' => "'{$fechacontable}'",
            'almacen' => $this->objectHelper->getBooleanStr($config['almacen'])
            ), $this->view->uiVariables
        );
        $this->bloqueoInterceptor = new BloqueoInterceptor($this, $this->uiParams);
        $this->bloqueoInterceptor->initLock($this->uiParams);
    }

    /**
     * Elimina un documento dado su identificador.
     * @author Kenier Cumba Bueno
     * @return Boolean
     */
    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->eliminarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Elimina los movimientos de un documento dado su identificador.
     * @author Kenier Cumba Bueno
     * @return (lo que retorna)
     */
    public function eliminarMovimientosAction()
    {
        $this->uiParams['idmovimientos'] = (array) Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->model->getProductoModel()->eliminarMovimientos(false, $this->uiParams['idmovimientos'], false, false);
    }

    /**
     * Adicionar un documento.
     * @author Kenier Cumba Bueno
     * @return Numeric
     */
    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['tarjeta'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['tarjeta'])
        );
        $this->uiParams['arridindicador'] = $this->objectHelper
            ->stdClassToArray(Zend_Json::decode($this->uiParams['arridindicador']));
        if(count($this->uiParams['arridindicador'])){
            $this->uiParams['tarjeta'] = $this->uiParams['arridindicador'];
        }
        $this->uiParams['idproductos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->unsetNullValues();
        $this->iddocumento = $this->model->adicionarDocumento($this->uiParams);
    }

    /**
     * Adiciona los movimientos asociados a un documento.
     * @author Kenier Cumba Bueno
     * @return Array
     */
    public function adicionarMovimientosAction()
    {
        $this->uiParams['idproductos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $result = $this->model->getProductoModel()->adicionarMovimientos(
            $this->uiParams['iddocumento'], $this->uiParams['idproductos'], LogisticaMovimientoModel::SIGNO_MOV_SUMA
        );
        $this->success = (count($result['noadicionados']) == 0);
        $this->nosalvados = count($result['noadicionados']);
    }

    /**
     * Anula el estado de un documento daod su identificador.
     * @author Kenier Cumba Bueno
     * @return Boolean
     */
    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->anularEstadoDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Aprueba un documento dado su identificador.
     * @author Kenier Cumba Bueno
     * @return Boolean
     */
    public function aprobarEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->aprobarDocumento($this->uiParams['iddocumento'], true);
        $this->model->abrirDeposito($this->uiParams['iddocumento']);
    }

    /**
     * Contabiliza un documento dado su identificador.
     * @return Boolean
     */
    public function contabilizarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->objectHelper->synchronize($this, $this->model->contabilizarDocumento($this->uiParams['iddocumento']));
        $this->model->abrirDeposito($this->uiParams['iddocumento']);
    }

    /**
     * Cancela un documento dado su identificador.
     * @author Kenier Cumba Bueno
     * @return Boolean
     */
    public function anularDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->cancelarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @author Kenier Cumba Bueno
     * @return Array
     */
    public function cargarDocumentosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->model->devolverDocumentos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    /**
     * Devuelve los movimientos de un documento según los criterios de búsqueda especificados.
     * @author Kenier Cumba Bueno
     * @return Array
     */
    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->model->getProductoModel()->devolverMovimientos($this->uiParams);
        $datcofubicacion = new UtilesubicacionService();
        $confubic = $datcofubicacion->obtenerConfiguracionUbicacion($this->global->Estructura->idestructura);
        $this->confubicacion = $confubic;
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    /**
     * Confirma un documento dado su identificador.
     * @author Kenier Cumba Bueno
     * @return Boolean
     */
    public function confirmarDocumentoAction()
    {

        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->confirmarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Crea un nuevo documento a partir de otro previamente establecido.
     * @author Kenier Cumba Bueno
     * @return Boolean
     */
    public function copiarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->datos = $this->model->copiarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * (Descripción del método, objetivo)
     * @author Kenier Cumba Bueno
     * @return (lo que retorna)
     */
    public function dispatch($action)
    {
        $this->bloqueoInterceptor->around($this, $action, $this->uiParams);
        parent::dispatch($action);
    }

    /**
     * Registra las diferencias del producto.
     * @return Array
     */
    public function cargarDiferenciasXCantidadAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarDiferenciasXCantidad($this->uiParams));
    }

    /**
     * Registra las diferencias del producto por calidad.
     * @return Array
     */
    public function cargarDiferenciasXCalidadAction()
    {
        $datos = $this->model->cargarDiferenciasXCalidad($this->uiParams['idmovimiento']);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
        $this->total = $datos['total'];
    }

    /**
     * Registra las diferencias del producto.
     * @return Boolean
     */
    public function registrarDiferenciasAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->success = $this->model->registrarDiferencias($this->uiParams['data']);
    }

    /**
     * Devuelve los tipos de monedas de la entidad.
     * @return array
     */
    public function cargarTipoMonedasAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarTipoMonedas());
    }

    /**
     * Devuelve las monedas de un movimiento.
     * @return array
     */
    public function cargarMonedasAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarMonedas($this->uiParams));
    }

    /**
     * Elimina las monedas del movimiento.
     * @return boolean
     */
    public function eliminarMonedaAction()
    {
        $this->objectHelper->synchronize($this, $this->model->eliminarMoneda($this->uiParams['idmovmoneda']));
    }

    /**
     * Convierte la unidad de medida de la factura a la unidad de medida de recepcion y 
     * registra el precio del movimiento.
     */
    public function registrarPrecioAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->objectHelper->synchronize($this, $this->model->registrarPrecio($this->uiParams['data']));
    }
}
