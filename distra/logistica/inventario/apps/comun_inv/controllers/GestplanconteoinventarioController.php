<?php
/**
 * @class GestplanconteoinventarioController
 * @package Inventario
 * @subpackage comun_inv
 * @author DGE
 * @copyright XETID
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class GestplanconteoinventarioController extends BaseController
{

    private $plancontinvModel;

    public function init()
    {   
        parent::init('log.inv.comuninvconteo');
    }

    public function gestplanconteoinventarioAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        // $this->arrayjs = array($this->serviciosAyuda->getJSAyuda());
        $this->initComponent('log.inv.comuninvconteo');
        $this->renderTemplate();
    }

    public function cargarSistemaAction()
    {
        $this->plancontinvModel->pruebaModelo();
    }

}
