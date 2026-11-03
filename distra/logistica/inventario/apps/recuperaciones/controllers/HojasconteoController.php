<?php

/**
 *  Esta clase
 * * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class HojasconteoController extends BaseController
{
    private $serviciosAyuda;
    private $model;

    function init()
    {
        parent::init('log.inv.hojasconteo');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new HojasconteoModel();
       
    }

    public function cargarHojasconteoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarHojasconteo($this->uiParams));
    }
    public function getEstructurasAction(){
        $this->objectHelper->synchronize($this, $this->_model->getEstructuras($this->uiParams));
    }
    public function listarProductosAction(){
        $this->objectHelper->synchronize($this, $this->model->listarproductos($this->uiParams));
    }
    public function cargardepositosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->loadDepositos($this->uiParams));
    }
    public function imprimirExcelAction()
    {
        $this->dirFichero = $this->model->crearExcelHojaconteo();
        
    }
    

}
