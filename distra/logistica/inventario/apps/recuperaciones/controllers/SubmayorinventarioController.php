<?php

/**
 * Esta clase sirve de puente entre el acceso a datos y las interfaces graficas
 * @copyright XETID
 * @author División de Gestión de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class SubmayorinventarioController extends BaseController
{

    private $serviciosAyuda;
    /**
     * @var SubmayorIventarioModel
     */
    private $model;
    private $logHelper;
    private $serviciosCFG;
    private $configuracionService;

    function init()
    {
        parent::init('log.inv.submayor');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new SubmayorIventarioModel();
        $this->logHelper = LogisticaObjectHelper::__init();
        $this->serviciosCFG = ServiciosConfiguracionGeneralHelper::__init();
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $this->configuracionService = new ConfiguracioninventarioService();
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $alternativa = 0;
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['codigoAlternativa'] = $value['codigoiso'];
                $moneda['monedaalternativa'] = $value['idmoneda'];
            } else {
                $moneda['codigoContable'] = $value['codigoiso'];
                $moneda['monedacontable'] = $value['idmoneda'];
            }
        }
        $fecha = new DateTime();
        $cfgUsuarioEsp = new CfgUsuarioespecialidad();
        if ($this->jsonComponent->getComponent('log.inv.municiones', true)) {
            $configEspecialidad = $cfgUsuarioEsp->devolverConfiguracionEspecialidad(
                $this->global->Perfil->idusuario, $this->view->uiVariables['espArmamento']
            );
        }
        $this->view->uiVariables = array_merge(array(
                'alternativa' => $alternativa == 1 ? 'true' : 'false',
                'codigoContable' => "'" . "{$moneda['codigoContable']}" . "'",
                'codigoAlternativa' => "'" . "{$moneda['codigoAlternativa']}" . "'",
                'fecha' => "'" . "{$fecha->format('d/m/Y')}" . "'",
                'monedacontable' => "'" . "{$moneda['monedacontable']}" . "'",
                'monedaalternativa' => "'" . "{$moneda['monedaalternativa']}" . "'",
                'tarjetacombustible' => $this->objectHelper->getBooleanStr($config['tarjeta']),
                'confArmamento' => empty($configEspecialidad->idespecialidad) ? 'false' : 'true'
            ), $this->view->uiVariables
        );
    }

    public function gestsubmayorAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->serviciosCFG->mostrarNomencladoresGenerales(),
            $this->serviciosCFG->ObtenerJSArbolNaturaleza()
        );
        $configuracionService = new ConfiguracioninventarioService();
        $config = $configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $cfg = new Datconfigubicacion();
        $confubic = $cfg->cargarDatos($this->global->Estructura->idestructura);
        $this->view->uiVariables = array_merge(
            array(
            'usarCategoria' => $this->objectHelper->getBooleanStr($config['usarcategoria']),
            'cmpArmamento' => $this->existComponent('log.inv.municiones') ? 'true' : 'false',
            'confubicacion' => $confubic['estructura'] ? 'false' : 'true',
            ), $this->view->uiVariables
        );
        $this->initComponent('log.inv.submayor');
        $this->rendertemplate();
    }

    /**
     * Llama a la clase modelo enviandole el producto seleccionado del grid,
     * para mostrar los movimientos de dicho producto.
     */
    public function getMovimientosProductoAction()
    {
        $this->uiParams['iddoc'] = Zend_Json::decode($this->uiParams['iddoc']);
        $this->logHelper->synchronize($this, $this->model->devolverDetalles($this->uiParams));
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
        $dualidad = LogisticaGlobal::__init()->getMonedaEntidad();
        $this->idmonedacontable = $dualidad->idmoneda;
        $this->idmonedaalternativa = $dualidad->idmonedaalternativa;
    }

    /**
     * @return array
     */
    public function cargarproductosAction()
    {
        $this->uiParams['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;
        $this->uiParams['idmonedacontable'] = $this->view->uiVariables['monedacontable'];
        $this->uiParams['idmonedaalternativa'] = $this->view->uiVariables['monedaalternativa'];
        $this->uiParams['asentado'] = true;
        $this->uiParams['baja'] = true;
        $this->logHelper->synchronize($this, $this->model->cargarproductos($this->uiParams));
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
        $this->estructura = $this->global->Estructura->denominacion;
    }/**
     * @return array
     */
    public function cargarconsumoproductosAction()
    {
        $this->uiParams['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30000;
        $this->uiParams['idmonedacontable'] = $this->view->uiVariables['monedacontable'];
        $this->uiParams['idmonedaalternativa'] = $this->view->uiVariables['monedaalternativa'];
        $this->uiParams['asentado'] = true;
        $this->uiParams['idestructura'] = $this->uiParams['iddeposito'];
        $this->uiParams['baja'] = true;
        //$this->logHelper->synchronize($this, $this->model->cargarproductos($this->uiParams));
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
        $this->estructura = $this->global->Estructura->denominacion;
		$this->dirFichero = $this->model->exportarConsumoPorductos($this->uiParams);
    }

    /**
     * Metodo para cargar las ubicaciones
     * @return array
     */
    public function cargarUbicacionesAction()
    {

        $this->logHelper->synchronize($this, $this->model->cargarUbicaciones($this->uiParams));
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    /**
     * Carga los tipos de documento existentes.
     * @return array
     */
    public function cargarTipoDocAction()
    {
        $datos = $this->model->devolverTipoDocumento();
        $this->datos = $datos;
        $this->cantidad = count($datos);
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    /**
     * Llama a la clase modelo enviandole el producto seleccionado del grid,
     * para mostrar la tarjeta de dicho producto.
     */
    public function mostrarTarjetaAction()
    {
        $ubicacion = new UtilesubicacionService();
        $params['idproducto'] = $this->uiParams['idproducto'];

        $ubproducto = $ubicacion->cargarUbicacionesProducto($params);

        foreach ($ubproducto['datos'] as $key => $value) {
            $ubproducto['datos'][$key]['ubicacion'] = $value['area'] . " - " . $value['ubicacion'];
        }

//        $datos = LogisticaObjectHelper::__init()->synchronize(
//            $this, $ubproducto
//        );
    }

    /**
     * Llama a la clase modelo enviandole el producto seleccionado del grid,
     * para mostrar la existencia por areas de dicho producto.
     */
    public function verExistenciaPorAreaAction()
    {
        $this->logHelper->synchronize($this, $this->model->verExistenciaPorArea());
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    /**
     * Llama a la clase modelo enviandole el producto seleccionado del grid,
     * para mostrar la ubicacion por areas de dicho producto.
     * @return array
     */
    public function verUbicacionPorAreaAction()
    {
        $this->uiParams['denominacion'] = $this->uiParams['criterio'];
        $ubicacion = new UtilesubicacionService();
        $this->datos = $ubicacion->devolverProductosXidArea($this->uiParams);
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    /**
     * Llama a la clase modelo enviandole el producto seleccionado del grid,
     * para mostrar la ubicacion por areas de dicho producto.
     * @return array
     */
    public function cargarComboAreaAction()
    {
        $ubicacion = new UtilesubicacionService();
        $this->datos = $ubicacion->devolverAreasPorDeposito($this->uiParams['iddeposito']);
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    /**
     * Carga los datos del grid en la Ubicacion por areas.
     * @return array
     */
    public function datosGridUbicacionPorAreaAction()
    {
        $datos = $this->model->datosGridUbicacionPorArea($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function cerrarAlmacenAction()
    {
        $this->model->validarCierreDeposito($this->uiParams['iddeposito']);
        $fecha = $this->configuracionHelper->getFechaContableSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $estado = new DatEstadoalmacen();
        $estado->cerrarAlmacen($this->uiParams['iddeposito'], $fecha);
    }

    public function cerrarDiaAlmacenAction()
    {
        LogisticaFechasHelper::__init()->cerrarDiaDeposito($this->uiParams['iddeposito']);
    }

    public function datBajaAction()
    {
        $this->model->darBaja($this->uiParams['idproducto']);
    }

    public function restablecerDisponibleAction(){
        $this->model->restablecerDisponible($this->uiParams['idproducto']);
    }

    public function getDisponibilidadProductoAction() {
        $this->uiParams['iddoc'] = Zend_Json::decode($this->uiParams['iddoc']);
        $this->logHelper->synchronize($this, $this->model->devolverDisponibilidad($this->uiParams));
    }

    public function restablecerUbicacionesAction(){
        $this->model->restablecerUbicaciones();
    }

    public function restablecerSubmayorAction()
    {
        $this->model->restablecerAlmacen($this->uiParams['idestructura']);
    }

    public function desactivarTarjetaAction()
    {
        $this->model->desactivarTarjeta($this->uiParams['idproducto']);
    }

    public function exportargastosAction()
    {
        $this->uiParams['idestructura'] = $this->uiParams['idalmacen'];
        $this->uiParams['fechainicio'] = $this->uiParams['fechaini'];
        $this->uiParams['fechafin'] = $this->uiParams['fechafin'];
        //$this->logHelper->synchronize($this, $this->model->cargarproductos($this->uiParams));
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
        $this->estructura = $this->global->Estructura->denominacion;
        $this->dirFichero = $this->model->exportarGastoPorductos($this->uiParams);
    }

}
