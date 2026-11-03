<?php

/**
 * @class GestcierreController
 * Clase que se encarga de manejar las acciones
 * para el cierre de los documentos.
 * @namespace Logistica\Utiles\Cierre\Controllers
 * @author Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
    
}

class FormapagoController extends BaseController
{

    private $_formaPagoModel;

    public function init()
    {
        parent :: init();
        $this->_formaPagoModel = new NomFormapagoModel();
    }

    public function formapagoAction()
    {
        $this->render();
    }

    public function adicionarformapagoAction(){
        $this->uiParams['ids'] = json_decode($this->uiParams['ids']);
        $this->_formaPagoModel->adicionarformapago($this->uiParams);
        $this->success = true;
    }

}
