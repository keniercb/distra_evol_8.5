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


class AnalizadorController extends BaseController
{
    private $model;

    function init()
    {
        parent::init('log.aft.analizador');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new AnalizadorModel();
    }

    public function gestAnalizadorAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.analizador');
        $this->rendertemplate();
    }

    public function cargarDatosAction()
    {
        $this->datos = $this->model->getDatos($this->uiParams);
    }


    public function getActivosByMedidorAction()
    {
        $parametros = $this->uiParams;
        $data = $this->model->getDatosPorMedidor($parametros);
        $this->datos = $data['datos'];
        $this->cantidad = $data['total'];
        $this->total = $data['total'];
    }

    public function getEstructurasAction(){
        $this->objectHelper->synchronize($this, $this->model->getEstructuras());
    }

}