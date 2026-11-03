<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class PenalizaciontercerosController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.penalizacionterceros');
        $this->_model = new PenalizacionTercerosModel();
    }

    public function gestPenalizacionTercerosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.penalizacionterceros');
        $this->rendertemplate();
    }

    public function getOrdenesPenalizacionAction()
    {
        $result = $this->_model->obtenerOrdenesPenalizacion($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function getMediosPenalizacionAction()
    {
        $result = $this->_model->obtenerMediosPenalizacion($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function getServiciosPenalizacionAction()
    {
        $result = $this->_model->obtenerServiciosPenalizacion($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function getAgenciasPenalizacionAction()
    {
        $result = $this->_model->obtenerAgenciasPenalizacion($this->uiParams);
        $this->datos = $result;
        $this->cantidad = count($result);
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function getClientesPenalizacionAction()
    {
        $result = $this->_model->obtenerClientesPenalizacion($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }


}
