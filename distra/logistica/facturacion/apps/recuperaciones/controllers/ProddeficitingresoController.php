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
    
    private $serviciosDepositos;
    private $model;
    private $recuperacionesController;


    function init()
    {
        parent::init('log.fac.proddeficitingreso');
        
        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
        $this->model = new ProdDeficitIngresoModel();
        $this->$recuperacionesController = new RecuperacionesController();
    }

    public function gestproddeficitingresoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.fac.proddeficitingreso');
        $this->rendertemplate();
    }


}
