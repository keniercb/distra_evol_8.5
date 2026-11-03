<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 01/10/2018
 * Time: 15:39
 */

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class ValoresareasController extends BaseController
{

    function init()
    {
        parent::init('log.aft.valoresareas');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
//        $this->movimientoLento = new MovimientoLentoModel();
//        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
    }

    public function gestValoresareasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.valoresareas');
        $this->rendertemplate();
    }

    public function cargarDatosAction()
    {
        $model = new RecuperacionesModel();
        $parametros = $this->uiParams;
        $this->datos = $model->getDatosValoresAreas($parametros);
    }
}