<?php

/**
 * @class      MenualimentoController
 * @package    Inventario
 * @subpackage Alimento
 * @author     Jorge Luis Saavedra Rubio
 * @copyright  XETID
 * @version    1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class CuadrediarioController extends BaseController
{

    protected $model, $arrayData, $serviciosAyuda;
    private $serviciosConfiguracionGeneral, $logistEstrucUbica, $servContFinzas, $configuracionService;

    public function init()
    {
        $this->arrayData = array(
            'alias' => 'menuAlim', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV
        );
        parent::init('log.inv.alimento');
        
        $this->serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
        $this->servContFinzas = ServiciosContabilidadFinanzasHelper::__init();
        $this->model = new CuadrediarioModel(/* $this->arrayData */);
        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->model->getIddoc());
        $this->configuracionService = new ConfiguracioninventarioService();
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $fechacontable = $this->global->FechaContable->fecha;
         $this->view->uiVariables = array_merge(
            array(  
            'idespaciotrabajo' => empty($data->idespaciotrabajo) ?  'false' : "'$data->idespaciotrabajo'",
            'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
            'useSign' => $this->objectHelper->getBooleanStr($config['firmadigital']),
            'fechacontable' => $fechacontable,
            'usarCategoria' => $this->objectHelper->getBooleanStr($config['usarcategoria']),
            ), $this->view->uiVariables
        );
    }

    public function cuadrediarioAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.cuadrediario');
        $this->renderTemplate();
    }

    public function cargardepositosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargardepositos());
    }

    public function cargarCuadresRealizadosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarCuadresRealizados($this->uiParams));
    }

    public function abrirDiaActualAction()
    {
        $this->objectHelper->synchronize($this, $this->model->abrirDiaActual($this->uiParams));
    }

    public function abrirProximoDiaAction()
    {
        $this->objectHelper->synchronize($this, $this->model->AbrirProximoDia($this->uiParams));
    }

    public function cerrarDiaActualAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cerrarDiaActual($this->uiParams));
    }      
    
    public function cargarClasificacionesCierreAction(){
        $groupby['clasificacion'] = true;
        $this->objectHelper->synchronize($this, $this->model->cargardepositos($this->uiParams,$groupby));
        
    }

    public function cargarClasificacionesAction(){
        $this->objectHelper->synchronize($this, $this->model->cargarClasificaciones($this->uiParams));
    }

    public function cargarNaturalezasAction(){
        $this->objectHelper->synchronize($this, $this->model->cargarNaturalezas($this->uiParams));
    }
    
    public function eliminarCierreDiarioAction()
    {
        $this->objectHelper->synchronize($this, $this->model->eliminarCierreDiario($this->uiParams));
    } 
    
    public function cargarDepositosCerradosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarDepositosCerrados($this->uiParams));
    } 
    
    public function actualizarDatosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cerrarDiaActual($this->uiParams));
    } 
    
    public function bloquearCierreAction()
    {
        $this->objectHelper->synchronize($this, $this->model->BloquearCierre($this->uiParams));
    } 
}
