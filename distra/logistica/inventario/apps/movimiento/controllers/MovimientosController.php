<?php

/**
 * @class MovimientosController
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Movimiento
 * @author Manuel Yhon Figuera
 * @copyright XETID
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class MovimientosController extends BaseController
{
    protected $serviciosAyuda, $model, $arrayData, $bloqueoInterceptor, $servConfGeneral, $configuracionService;

    function init($strComponent = '')
    {
        parent::init($strComponent);
        $this->configuracionService = new ConfiguracioninventarioService();
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->servConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->arrayData['isPrincipal'] = true;
        $this->model = new MovimientoProxy($this->arrayData);
        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->model->getModel()->getIddoc());
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $alternativa = 0;
        $moneda = array();
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['monedaalternativa'] = $value['idmoneda'];
                $moneda['codigoAlternativa'] = $value['codigoiso'];
            } else {
                $moneda['monedacontable'] = $value['idmoneda'];
                $moneda['codigoContable'] = $value['codigoiso'];
            }
        }
        $cfg = new Datconfigubicacion();
        $confubic = $cfg->cargarDatos($this->global->Estructura->idestructura);
        $fecha = new DateTime();
        $cfgUsuarioEsp = new CfgUsuarioespecialidad();
        if ($this->jsonComponent->getComponent('log.inv.municiones', true)) {
            $configEspecialidad = $cfgUsuarioEsp->devolverConfiguracionEspecialidad(
                $this->global->Perfil->idusuario, $this->view->uiVariables['espArmamento']
            );
        } 
        $this->view->uiVariables = array_merge(array(
            'alternativa' => $alternativa == 1 ? 'true' : 'false',
            'monedacontable' => "'" . "{$moneda['monedacontable']}" . "'",
            'monedaalternativa' => "'" . "{$moneda['monedaalternativa']}" . "'",
            'codigoContable' => "'" . "{$moneda['codigoContable']}" . "'",
            'codigoAlternativa' => "'" . "{$moneda['codigoAlternativa']}" . "'",
			'codContable' => "'" . "{$moneda['codigoContable']}" . "'",
            'codAlternativa' => "'" . "{$moneda['codigoAlternativa']}" . "'",
            'useSign' => $this->objectHelper->getBooleanStr($config['firmadigital']),
            'confubicacion' => $confubic['estructura'] ? 'false' : 'true',
            'idespaciotrabajo' => empty($data->idespaciotrabajo) ? 'false' : "'$data->idespaciotrabajo'",
                'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
            'usarCategoria' => $this->objectHelper->getBooleanStr($config['usarcategoria']),
            'cmpArmamento' => $this->existComponent('log.inv.municiones') ? 'true' : 'false',
            'confArmamento' => empty($configEspecialidad->idespecialidad) ? 'false' : 'true',
            'alias' => "'{$this->arrayData['alias']}'",
            'fecha' => "'{$fecha->format('d/m/Y')}'"
            ), $this->view->uiVariables
        );
        //$this->bloqueoInterceptor = new BloqueoInterceptor($this);        
    }

    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->eliminarDocumento($this->uiParams['iddocumento']);
    }

    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = (array) Zend_Json::decode($this->uiParams['data']);
        $this->uiParams['idproductos'] = (array) Zend_Json::decode($this->uiParams['idproductos']);
        $this->uiParams['tarjeta'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['tarjeta'])
        );
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->objectHelper->synchronize($this, $this->model->adicionarDocumento($this->uiParams));
    }

    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->anularEstadoDocumento($this->uiParams['iddocumento']);
    }
	
	public function anularDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->cancelarDocumento($this->uiParams['iddocumento']);
    }

    public function aprobarEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->objectHelper->synchronize($this, $this->model->aprobarDocumento($this->uiParams['iddocumento']));
    }

    public function adicionarMovimientosAction()
    {
        $this->uiParams['idproductos'] = (array) Zend_Json::decode($this->uiParams['idproductos']);
        $this->model->getProductoModel()->adicionarMovimientos(
            $this->uiParams['iddocumento'], $this->uiParams['idproductos']
        );
        $this->cantproductos = $this->model->cantidadMovimientos($this->uiParams['iddocumento']);
    }

    public function eliminarMovimientosAction()
    {
        $this->uiParams['idmovimientos'] = (array) Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->objectHelper->synchronize(
            $this, $this->model->eliminarMovimientos($this->uiParams['idmovimientos'], $this->uiParams['iddocumento'])
        );
    }

    public function cargarDocumentosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->model->devolverDocumentos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->model->devolverMovimientos($this->uiParams);

        $datcofubicacion = new UtilesubicacionService();
        $confubic = $datcofubicacion->obtenerConfiguracionUbicacion($this->global->Estructura->idestructura);
        $this->confubicacion = $confubic;
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->confirmarDocumento($this->uiParams['iddocumento']);
    }

    public function contabilizarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->objectHelper->synchronize($this, $this->model->contabilizarDocumento($this->uiParams['iddocumento']));
    }

    public function copiarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->copiarDocumento($this->uiParams['iddocumento']);
    }

    public function cargarLotesAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->model->cargarLotes($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function eliminarLoteAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $this->unsetNullValues();
        $this->success = $this->model->eliminarLote($this->uiParams);
    }

}
