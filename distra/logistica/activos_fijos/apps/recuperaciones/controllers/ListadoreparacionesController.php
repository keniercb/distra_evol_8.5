<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 2/23/2016
 * Time: 10:46 AM
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ListadoreparacionesController extends BaseController
{

    function init()
    {
        parent::init('log.aft.listadoreparaciones');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
//        $this->movimientoLento = new MovimientoLentoModel();
//        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
    }

    public function gestListadoreparacionesAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.listadoreparaciones');
        $this->rendertemplate();
    }

    public function getListadoReparacionesAction()
    {
        $model = new RecuperacionesModel();

        $this->datos = $model->getActivosReparados($this->uiParams);
    }

}
