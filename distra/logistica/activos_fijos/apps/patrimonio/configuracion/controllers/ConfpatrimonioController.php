<?php

/**
 *
 */
/*$configFile = Zend_Registry::getInstance()->get('config')->dir_aplication
    . 'logistica/activos_fijos/configuracion/controllers/ConfiguracionactivosfijosController.php';
include_once($configFile);*/

/**
 *
 */
class ConfpatrimonioController extends ZendExt_Controller_Secure// BaseController
{   
    public function init($confpatrim = 'log.aft.confpatrimonio')
    {        
        parent:: init($confpatrim);
    }

    public function confpatrimonioAction()
    {
        $this->autoShow = false;
        $this->render();
    }

}
