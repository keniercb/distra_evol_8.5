<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class PiezasrecuperadasController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.piezasrecuperadas');
        $this->_model = new PiezasRecuperadasModel();
    }

    public function gestPiezasrecuperadasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.piezasrecuperadas');
        $this->rendertemplate();
    }

    public function obtenerPiezasAction()
    {
        $result = $this->_model->obtenerPiezasRetiradas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function obtenerPadresDePiezasAction()
    {
        $result = $this->_model->obtenerPadresPiezasRetiradas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function obtenerPiezasGeneralesAction()
    {
        $result = $this->_model->obtenerPiezasRetiradasGeneral($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function exportarExcelAction()
    {
        $this->unsetParam('limit');
        $this->unsetParam('start');
        $this->dirFichero = $this->_model->crearExcel($this->uiParams);
    }

}



