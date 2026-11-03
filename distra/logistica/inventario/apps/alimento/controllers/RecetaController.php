<?php

/**
 * Description of RecetaController
 *
 * @package       Inventario
 * @subpackage    Alimento
 * @author        osmel
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RecetaController extends BaseController
{

    protected $model, $arrayData, $serviciosAyuda, $objHelper;
    private $serviciosConfiguracionGeneral;

    public function init()
    {
        parent::init('log.inv.receta');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->objHelper = LogisticaObjectHelper::__init();
        $this->model = new RecetaModel();
        $cfgUsuarioEsp = new CfgUsuarioespecialidad();
        if ($this->jsonComponent->getComponent('log.inv.municiones', true)) {
            $configEspecialidad = $cfgUsuarioEsp->devolverConfiguracionEspecialidad(
                $this->global->Perfil->idusuario, $this->view->uiVariables['espArmamento']
            );
        }
        $this->view->uiVariables = array_merge(
            array(
                'confArmamento' => empty($configEspecialidad->idespecialidad) ? 'false' : 'true'
            ), $this->view->uiVariables
        );
    }

    public function gestrecetaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        
        $this->initComponent('log.inv.receta');
        $this->renderTemplate();
    }

    public function cargarUnidadMedidaAction()
    {
        $this->datos = $this->serviciosConfiguracionGeneral->listarUnidadesMedidaTodas();
    }

    public function cargarProductosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datas = $this->model->cargarProductos($this->uiParams);
        $this->datos = $datas['datos'];
        $this->cantidad = $datas['cantidad'];
    }

    public function eliminarRecetaAction()
    {
        $this->uiParams['idreceta'] = $this->objHelper->stdClassToArray(Zend_Json::decode($this->uiParams['id']));
        $this->datos = $this->model->eliminarReceta($this->uiParams['idreceta']);
    }

    public function eliminarProductosRecetaAction()
    {
        $this->uiParams['idproductos'] = $this->objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $this->datos = $this->model->eliminarProductosReceta($this->uiParams);
    }

    public function cargarRecetasAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->model->devolverRecetas($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function adicionarDocumentoAction()
    {
        $this->uiParams['idproductos'] = $this->objHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $this->uiParams['data'] = $this->objHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->idreceta = $this->model->adicionarReceta($this->uiParams);
    }

    public function habilitarEntidadAction()
    {
              
        $this->success = $this->model->habilitarEntidad($this->uiParams);
    }

    /**
     * Crea un nuevo documento a partir de otro previamente establecido.
     *
     * @return int
     */
    public function copiarDocumentoAction()
    {
        $this->uiParams['idreceta'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->iddocumento = $this->model->copiarDocumento($this->uiParams['idreceta']);
    }

}
