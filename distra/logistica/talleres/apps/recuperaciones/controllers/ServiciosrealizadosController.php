<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class ServiciosrealizadosController extends BaseController
{

    private $_model, $_arrayData;

    function init()
    {
        parent::init('log.tall.serviciosrealizados');
        $this->_model = new ServiciosRealizadosModel($this->_arrayData);
        $this->_arrayData = array('alias' => 'ordenServicioLOG');
    }

    public function gestServiciosrealizadosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.serviciosrealizados');
        $this->rendertemplate();
    }

    public function getServiciosRealizadosAction()
    {
        $resultado = $this->_model->getServiciosRealizados($this->uiParams);
        $this->success = $resultado['success'];
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
        $this->ordenes = $resultado['ordenes'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }


}
