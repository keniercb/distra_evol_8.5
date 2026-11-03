<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class OrdenproduccionController extends DocumentoController
{ 
    protected $_arrayData, $model;

    public function init()
    {
        $this->_arrayData = array(
            'isPrincipal' => true,'alias' => 'produccionLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_PRODUCCION
        );
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->contabilidadHelper->getComprobanteComponent(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()
        );
        parent::init('log.produccion.ordenproduccion');
        //$this->model = OrdenProduccionModel::getInstance();
        $this->model = new OrdenProduccionModel($this->_arrayData);
    }

    /**
     * Funcion contructor de la clase
     */
    public function indexAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.produccion.ordenproduccion');
        $this->renderTemplate();
    }
    public function adicionarMaterialesAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->adicionarMateriales($this->uiParams));
    }

    public function cargarMaterialesPorCartaAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarMaterialesPorCarta($this->uiParams));
    }
    public function cargarMaterialesAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['arrayProdSust'] = (array) Zend_Json::decode(
            $this->uiParams['arrayProdSust']
        );
        $this->objectHelper->synchronize($this, $this->model->cargarMateriales($this->uiParams));
    }
    public function eliminarMaterialesAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->eliminarMateriales($this->uiParams));
    }

    public function adicionarMaquinariaAction()
    {
        $this->objectHelper->synchronize($this, $this->model->adicionarMaquinaria($this->uiParams));
    }

    public function cargarMaquinariaAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarMaquinaria($this->uiParams));
    }

    public function eliminarMaquinariaAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->eliminarMaquinaria($this->uiParams));
    }

    public function adicionarGastoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->adicionarGasto($this->uiParams));
    }

    public function cargarGastoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarGasto($this->uiParams));
    }

    public function eliminarGastoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->eliminarGasto($this->uiParams));
    }

    public function eliminarOperarioAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->eliminarOperario($this->uiParams));
    }
    /**
     * Carga los contrato a partir de un cliente.
     * @author Yadrian Aguila
     * @return array
     */
    public function cargarContratoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarContrato($this->uiParams));
    }

    /**
     * Carga los contrato a partir de un cliente.
     * @author Yadrian Aguila
     * @return array
     */
    public function cargarComboCentroCostoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarComboCentroCosto($this->uiParams));
    }

    public function adicionarSolicitudEntregaAction()
    {
        $this->uiParams['idproductos'] = (array) Zend_Json::decode(
            $this->uiParams['idproductos']
        );
        $this->objectHelper->synchronize($this, $this->model->adicionarSolicitudEntrega($this->uiParams));
    }

    public function cargarDocumentosGeneradosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->devolverDocumentosGenerados($this->uiParams));
    }

    public function cargarProductosEjecucionAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarProductosEjecucion($this->uiParams));
    }

    public function cargaractividadesAction(){ 
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargaractividades($this->uiParams));

    }
    public function cargarMateriaPrimaAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['arrayActividad'] = (array) Zend_Json::decode(
            $this->uiParams['arrayActividad']
        );
        $this->objectHelper->synchronize($this, $this->model->cargarMateriaPrima($this->uiParams));
    }
///
    public function cargarproductosAction()
    {
        $this->uiParams['asentado'] = true;
        $result = $this->model->cargarProductos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

   /* public function getSubordinacionEntidadAction()
    {
        $this->uiParams['identidad'] = Zend_Json::decode($this->uiParams['identidad']);
        $result = $this->_distribucionModel->getDepositosEntidad($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }*/

   
    public function cargarPersonasAction()
    {
        $result = $this->model->cargarPersonas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function adicionarPersonaAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['personas'] = (array) Zend_Json::decode(
            $this->uiParams['personas']
        );
        $this->objectHelper->synchronize($this, $this->model->adicionarPersona($this->uiParams));
    }

    public function validarDocumentoSubsistemaAction(){
        $idestructura = $this->global->Estructura->idestructura;
        $idsubsistema = $this->global->Subsistema->idsubsistema;
        $documenosub = $this->integrator->datosmaestros->documentosPorSubsistemaEntidad($idsubsistema, $idestructura,null);
        $mensaje;
        // if(count($documenosub) > 0){
        //     $mensaje = "tiene-doc";
        // }else{
        //     $mensaje = "no-tiene-doc";
        // }
        if(count($documenosub) < 0){
            throw new LogisticaException('LOG_LB_PRO_006');
        }
      
        //echo json_encode($mensaje);
    }
    public function adicionarProductosExtrasOrdenAction()
    {
        $this->objectHelper->synchronize($this, $this->model->adicionarProductosExtrasOrden($this->uiParams));
    }

    public function eliminarProductosExtrasOrdenAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->eliminarProductosExtrasOrden($this->uiParams));
    }

    public function cargarGastosEntidadAction()
    {
        $result = $this->model->cargarGastosEntidad($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }
////
   
}
