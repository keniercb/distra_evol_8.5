<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 15/10/2018
 * Time: 9:18
 */

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class ListprodretenidoController extends BaseController
{
    function init()
    {
        parent::init('log.farm.listprodretenido');

    }

    public function gestListprodretenidoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.farm.listprodretenido');
        $this->rendertemplate();
    }

    public function getDatosAction()
    {
        $model = RecuperacionesFarmaciaModel::getInstance();
        $parametros = $this->uiParams;
        $parametros['idestructura'] = $this->global->Estructura->idestructura;
        $dat = $model->getDatosProdRetenido($parametros);
        $this->datos = ($dat['datos'])?$dat['datos']:array();
        $this->cantidad = $dat['cantidad'];
    }

}