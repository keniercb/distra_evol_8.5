<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class SalidaController extends BaseController
{
    protected $serviciosCentroCosto,
    /**
     * @var ServiciosAyudaHelper
     */
        $serviciosAyuda,
        /**
         * @var SalidaModel
         */
        $model,
        /**
         * @var array
         */
        $arrayData,
        $configuracionService;

    function init($strComponent = '')
    {
        parent::init($strComponent);
        $this->arrayData['isPrincipal'] = true;
        $this->arrayData['subsistema'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new SalidasProxy($this->arrayData);
        $this->configuracionService = new ConfiguracioninventarioService();
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->model->getModel()->getIddoc());
        $monedas = $this->configuracionHelper->monedaContableEntidad(
            $this->global->Estructura->idestructura
        );
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
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'menuAlim', $this->global->Estructura->idestructura, $this->global->Subsistema->idsubsistema
        );
        $cfg = new Datconfigubicacion();
        $confubic = $cfg->cargarDatos($this->global->Estructura->idestructura);
        $fecha = new DateTime();
        $cfgUsuarioEsp = new CfgUsuarioespecialidad();
        if ($this->jsonComponent->getComponent('log.inv.municiones', true)) {
            $configEspecialidad = $cfgUsuarioEsp->devolverConfiguracionEspecialidad(
                $this->global->Perfil->idusuario, $this->view->uiVariables['espArmamento']
            );
        }
        $prodAperturado = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_PRODUCCION);
        $produccion = false;
        if ($prodAperturado == 1 && $this->existComponent('log.produccion.ordenproduccion')) {
            $produccion = true;
        }
        $this->view->uiVariables = array_merge(
            array(
            'alternativa' => $alternativa == 1 ? 'true' : 'false',
            'monedacontable' => "'" . "{$moneda['monedacontable']}" . "'",
            'monedaalternativa' => "'" . "{$moneda['monedaalternativa']}" . "'",
            'codContable' => "'{$moneda['codContable']}'",
            'codAlternativa' => "'{$moneda['codAlternativa']}'",
            'cmpArmamento' => $this->existComponent('log.inv.municiones') ? 'true' : 'false',
            'confArmamento' => empty($configEspecialidad->idespecialidad) ? 'false' : 'true',
            'ordentrabajo' => LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_TALLERES)
                && $this->existComponent('log.tall.ordentrabajo') ? 'true' : 'false',
            'menu' => $objDocPrim->iddoc ? 'true' : 'false',//$this->existComponent('log.inv.alimento') ? 'true' : 'false',
            'produccion' => $produccion ? 'true' : 'false',
            'usarCategoria' => $this->objectHelper->getBooleanStr($config['usarcategoria']),
            'idespaciotrabajo' => empty($data->idespaciotrabajo) ? 'false' : "'$data->idespaciotrabajo'",
                'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
            'useSign' => $this->objectHelper->getBooleanStr($config['firmadigital']),
            'alias' => "'{$this->arrayData['alias']}'",
            'confubicacion' => $confubic['estructura'] ? 'false' : 'true',
            'fecha' => "'{$fecha->format('d/m/Y')}'"
            ), $this->view->uiVariables
        );
        $this->serviciosCentroCosto = ServiciosContabilidadFinanzasHelper::__init();
    }

    /**
     * @return boolean
     */
    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->eliminarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * @return integer|boolean
     */
    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = (array) Zend_Json::decode($this->uiParams['data']);
        if ($this->uiParams['transferencia']) {
            $this->uiParams['transferencia'] = (array) Zend_Json::decode($this->uiParams['transferencia']);
        }
        $this->uiParams['idestructuracomun'] = Zend_Json::decode($this->uiParams['idestructuracomun']);
        $this->uiParams['idgenerado'] = (array) Zend_Json::decode($this->uiParams['id']);
        $this->uiParams['idclientes'] = (array) Zend_Json::decode($this->uiParams['idclientes']);
        $this->uiParams['idproductos'] = (array) Zend_Json::decode($this->uiParams['idproductos']);
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        unset($this->uiParams['id']);
        $this->objectHelper->synchronize($this, $this->model->adicionarDocumento($this->uiParams));
    }

    /**
     * @return boolean
     */
    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->anularEstadoDocumento($this->uiParams['iddocumento']);
    }

    /**
     * @return boolean
     */
    public function aprobarEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->aprobarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * @return boolean
     */
    public function anularDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->cancelarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * @return array
     */
    public function cargarDocumentosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $datosBusqueda = $this->model->devolverDocumentos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    /**
     * @return array
     */
    public function cargarProductosDocumentoAction()
    {
        $maestroP = new MaestroProductoModel();
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $query = $this->model->getProductoModel()->devolverMovimientos($this->uiParams, true);
        $datos = $maestroP->addSelectionData($this->doctrineHelper->addQueryLimits($query, $this->uiParams)->fetchArray());
        $this->cantidad = $query->count();
        $this->datos = $datos;
    }

    /**
     * @return boolean
     */
    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->confirmarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * @return boolean
     */
    public function copiarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->objectHelper->synchronize($this, $this->model->copiarDocumento($this->uiParams['iddocumento']));
    }

    /**
     * @return boolean
     */
    public function eliminarMovimientosAction()
    {
        $this->uiParams['idmovimientos'] = (array) Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->success = $this->model->eliminarMovimientos($this->uiParams['idmovimientos']);
    }

    public function cargarClientesAction()
    {
        $this->uiParams['iddocumentos'] = (array) Zend_Json::decode($this->uiParams['iddocumentos']);
        $datosBusqueda = $this->model->cargarClientes($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function devolverElementosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->devolverElementos($this->uiParams));
    }
	
	/**
     * (Descripcion de la clase, objetivo)
     * @return array
     */
    public function cargarComboCentroCostoAction()
    {
        $this->datos = $this->serviciosCentroCosto->obtenerCentrosCostoFiltro($this->global->Estructura->idestructura, null, 10000, null, null, 1);
    }

}
