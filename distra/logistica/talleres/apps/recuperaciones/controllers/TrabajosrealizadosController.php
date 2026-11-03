<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class TrabajosrealizadosController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.trabajosrealizados');
        $this->_model = new TrabajosRealizadosModel();
         $configfact = LogisticaGlobal::__init()->getMonedaEntidad();
         $this->view->uiVariables = array_merge(
            array(
                'monedacontable' => "'" . $configfact->idmoneda."'",
                'monedaalternativa' => $configfact->idmonedaalternativa ? "'".$configfact->idmonedaalternativa."'" : "'0'",
                'iddocs' => "'{0}'"
                ), $this->view->uiVariables
        );
    }

    public function gestTrabajosrealizadosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.trabajosrealizados');
        $this->rendertemplate();
    }

    public function getTrabajosRealizadosAction()
    {
        $result = $this->_model->getTrabajosRealizados($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

    public function estaAperturadoSubsistemaAction()
    {
        $result = $this->_model->estaAperturadoSubsistema();
        $this->facturacionaperturado = $result['fac'];
        $this->inventarioaperturado = $result['inv'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }


}
