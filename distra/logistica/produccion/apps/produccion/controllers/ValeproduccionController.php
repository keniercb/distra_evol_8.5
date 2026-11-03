<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ValeproduccionController extends DocumentoController 
{
    protected $model;

    public function init()
    {
        parent::init('log.produccion.valeproduccion');
        $this->model = ValeProduccionModel::getInstance();
    }

    /**
     * Funcion contructor de la clase
     */
    public function indexAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.produccion.valeproduccion');
        $this->renderTemplate();
    }


    public function cargarManoObraAllAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarManoObraAll($this->uiParams));
    }

    public function adicionarManoObraAction()
    {
        $this->objectHelper->synchronize($this, $this->model->adicionarManoObra($this->uiParams));
    }

    public function cargarManoObraAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarManoObra($this->uiParams));
    }

    public function eliminarManoObraAction()
    {
        $this->objectHelper->synchronize($this, $this->model->eliminarManoObra($this->uiParams));
    }


    public function adicionarActividadAction()
    {
        $this->objectHelper->synchronize($this, $this->model->adicionarActividad($this->uiParams));
    }

    public function cargarActividadAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarActividad($this->uiParams));
    }

    public function cargarActividadAllAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarActividadAll($this->uiParams));
    }

    public function eliminarActividadAction()
    {
        $this->objectHelper->synchronize($this, $this->model->eliminarActividad($this->uiParams));
    }

    public function adicionarMaquinariaAction()
    {
        $this->objectHelper->synchronize($this, $this->model->adicionarMaquinaria($this->uiParams));
    }

    public function adicionarProductosExtrasAction()
    {
        $this->objectHelper->synchronize($this, $this->model->adicionarProductosExtras($this->uiParams));
    }

    public function cargarMaquinariaAllAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarMaquinariaAll($this->uiParams));
    }

    public function cargarMaquinariaAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarMaquinaria($this->uiParams));
    }
    public function cargarMaquinariaByIndicadorAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarMaquinariaByIndicador($this->uiParams));
    }

    public function eliminarMaquinariaAction()
    {
        $this->objectHelper->synchronize($this, $this->model->eliminarMaquinaria($this->uiParams));
    }

    public function adicionarMaterialesAction()
    {
        $this->objectHelper->synchronize($this, $this->model->adicionarMateriales($this->uiParams));
    }

    public function cargarMaterialesAllAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarMaterialesAll($this->uiParams));
    }

    public function cargarMaterialesAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarMateriales($this->uiParams));
    }

    public function eliminarMaterialesAction()
    {
        $this->objectHelper->synchronize($this, $this->model->eliminarMateriales($this->uiParams));
    }       

    public function eliminarProductosObtenidosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->eliminarProductosObtenidos($this->uiParams));
    }

    public function cargarProductosObtenidosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarProductosObtenidos($this->uiParams));
    }
}
