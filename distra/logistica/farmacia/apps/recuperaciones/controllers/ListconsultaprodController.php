<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 12/10/2018
 * Time: 9:59
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class ListconsultaprodController extends BaseController
{
    function init()
    {
        parent::init('log.farm.listconsultaprod');

    }

    public function gestListconsultaprodAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.farm.listconsultaprod');
        $this->rendertemplate();
    }

    public function getDatosAction()
    {
        $model = RecuperacionesFarmaciaModel::getInstance();
        $parametros = $this->uiParams;
        $parametros['idestructura'] = $this->global->Estructura->idestructura;
        $dat = $model->getDatosConsultaProd($parametros);
        $this->datos = ($dat['datos'])?$dat['datos']:array();
        $this->cantidad = $dat['cantidad'];
    }

}