<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 15/10/2018
 * Time: 9:14
 */

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class ListmovimientoprodController extends BaseController
{
    function init()
    {
        parent::init('log.farm.listmovimientoprod');

    }

    public function gestListmovimientoprodAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.farm.listmovimientoprod');
        $this->rendertemplate();
    }

    public function getDatosAction()
    {
        $model = RecuperacionesFarmaciaModel::getInstance();
        $parametros = $this->uiParams;
        $parametros['idestructura'] = $this->global->Estructura->idestructura;
        $dat = $model->getDatosMovProducto($parametros);
        $this->datos = ($dat['datos'])?$dat['datos']:array();
        $this->cantidad = $dat['cantidad'];
    }

}