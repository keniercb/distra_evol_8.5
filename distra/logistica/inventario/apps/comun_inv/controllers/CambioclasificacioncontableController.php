<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class CambioclasificacioncontableController extends BaseController
{
    /**
     * Instancia de la modelo de cambioclacificacioncontable.
     * @var DatCambioclacificacioncontableModel
     */
    private $model;

    function init()
    {
        parent::init('log.inv.cambioclasificacioncontable');
        $datos = array(
            'alias' => 'cambioccontableLog', 'isPrincipal' => true, 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV
        );
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
        $this->model = new CambioClasificacioncontableModel($datos);
    }

    public function gestcambioclasificacioncontableAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.inv.cambioclasificacioncontable');
        $this->rendertemplate();
    }

    /**
     * Devuelve los documentos.
     */
    public function cargarDocumentosAction()
    {   
        if($this->uiParams['idestructura']){
            $this->objectHelper->synchronize($this, $this->model->devolverDocumentos($this->uiParams));
        }else{
            $this->datos=[];
            $this->cantidad=0;
        }
         
    }

    /**
     * Adiciona un documento.
     */
    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['idproductos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $this->uiParams['productos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['productos'])
        );
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->objectHelper->synchronize($this, $this->model->adicionarDocumento($this->uiParams));
    }

    /**
     * Elimina un documento dado su identificador.
     */
    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->eliminarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Confirma un documento dado su identificador.
     */
    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->confirmarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Anula el estado de un documento daod su identificador.
     */
    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->anularEstadoDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Aprueba un documento dado su identificador.
     */
    public function aprobarEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->aprobarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Devuelve los movimientos de un documento según los criterios de búsqueda especificados.
     */
    public function cargarProductosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarProductos($this->uiParams));
    }

    /**
     * Devuelve los movimientos de un documento según los criterios de búsqueda especificados.
     */
    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->devolverMovimientos($this->uiParams));
    }

    /**
     * Adiciona los cambios de clasificacion contable de productos a un documento.
     */
    public function adicionarMovimientosAction()
    {
        $this->uiParams['idproductos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $this->objectHelper->synchronize(
            $this, $this->model->adicionarMovimientos(
                $this->uiParams['iddocumento'], $this->uiParams['idproductos'], true
            )
        );
    }

    /**
     * Elimina los movimientos de un documento dado su identificador.
     */
    public function eliminarMovimientosAction()
    {
        $this->uiParams['idmovimientos'] = (array) Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->success = $this->model->eliminarMovimientos($this->uiParams['idmovimientos']);
    }
	/**
     * Elimina los movimientos de un documento dado su identificador.
     */
    public function replicarAction()
    {
        $this->uiParams['idmovimientos'] = (array) Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->success = $this->model->replicarClasificacion($this->uiParams['idmovimientos'][0]);
    }
   /* public function cargarProductosLentoMovimientoAction()
    {
        $this->uiParams['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;
        $this->setDefaultParam('valor',10);
        $result = $this->model->cargarProductosLentoMovimiento($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }*/
    public function cargarProductosOciososAction()
    {
        $this->uiParams['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;
        $this->setDefaultParam('valor',10);
        $result = $this->model->cargarProductosOciosos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }
    public function cargarClasificacionAction()
    {
        $this->uiParams['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;
        $this->setDefaultParam('valor',10);
        $result = $this->model->cargarClasificacion($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

}
