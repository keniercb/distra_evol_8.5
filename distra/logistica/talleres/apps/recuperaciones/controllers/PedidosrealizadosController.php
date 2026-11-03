<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class PedidosrealizadosController extends BaseController
{

    private $_model, $_aperturaAFT;

    function init()
    {
        parent::init('log.tall.pedidosrealizados');
        $this->_aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $this->view->uiVariables = array_merge(
            array('existeAFT' => json_encode($this->_aperturaAFT)), $this->view->uiVariables
        );
        $this->_model = new PedidosRealizadosModel($this->_aperturaAFT);
    }

    public function gestPedidosRealizadosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.pedidosrealizados');
        $this->rendertemplate();
    }

    public function cargarPedidosAction()
    {
        $result = $this->_model->cargarPedidos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function cargarProductosAction()
    {
        $result = $this->_model->cargarProductos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

}
