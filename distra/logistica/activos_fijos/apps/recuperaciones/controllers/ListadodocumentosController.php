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

class ListadodocumentosController extends BaseController
{

    function init()
    {
        parent::init('log.aft.listadodocumentos');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
//        $this->movimientoLento = new MovimientoLentoModel();
//        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
    }

    public function gestListadodocumentosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.listadodocumentos');
        $this->rendertemplate();
    }

    public function getListadoOperacionesAction()
    {
        $model = new RecuperacionesModel();
        $parametros = $this->uiParams;
        $this->datos = $model->getOperaciones($parametros);
    }

    public function guardarParamsReportsAction() {
        $parametros = $this->uiParams;
        $model = new RecuperacionesModel();
        $this->idusuario = $model->guardarParamsReports($parametros);
    }

}
