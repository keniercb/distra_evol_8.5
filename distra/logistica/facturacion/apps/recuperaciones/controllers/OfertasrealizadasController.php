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

class OfertasrealizadasController extends BaseController
{
   
    private $configuracionHelper;
    private $logistEstrucUbica;

    function init()
    {
        parent::init('log.fac.ofertasrealizadas');
        
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $this->logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();

    }

    public function gestofertasrealizadasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.fac.ofertasrealizadas');
        $this->rendertemplate();
    }



}
