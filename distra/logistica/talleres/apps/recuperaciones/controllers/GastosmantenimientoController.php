<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class GastosmantenimientoController extends BaseController
{

    private $_model, $_aperturaAFT;

    function init()
    {
        parent::init('log.tall.gastosmantenimiento');
        $this->_aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $this->_model = new GastosMantenimientoModel();
    }

    public function gestGastosMantenimientoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.gastosmantenimiento');
        $this->rendertemplate();
    }

    public function cargarMantenimientosAction()
    {
        $result = $this->_model->cargarMantenimientos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function cargarDesgloceMantenimientoAction()
    {
        $result = $this->_model->cargarDesgloceMantenimiento($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function cargarMediosAction()
    {
        $result = $this->_model->cargarMedios($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }
    public function cargarMaterialesAction()
    {
        $result = $this->_model->devolverMateriales($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function exportarExcelAction()
    {
        //$this->unsetParam('limit');
        //$this->unsetParam('start');
        $this->dirFichero = $this->_model->crearExcel($this->uiParams);
    }

}
