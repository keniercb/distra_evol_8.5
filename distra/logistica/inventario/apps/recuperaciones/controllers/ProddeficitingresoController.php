<?php
/**
 *  Esta clase controla la gestión de los productos de movimiento lento
 * * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ProddeficitingresoController extends BaseController
{
    private $serviciosAyuda;
    private $model;

    function init()
    {
        parent::init('log.inv.proddeficitingreso');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new RecuperacionesInventarioModel();
    }

    public function gestproddeficitingresoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.proddeficitingreso');
        $this->rendertemplate();
    }

    public function cargardepositosAction()
    {
        $datas = $this->model->loadDepositos();
        $this->datos = $datas['datos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

}
