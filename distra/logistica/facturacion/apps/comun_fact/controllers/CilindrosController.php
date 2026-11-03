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

class CilindrosController extends BaseController
{

    private $_cilidrosModel;

    public function init()
    {
        parent :: init();
        $this->_cilidrosModel = new NomCilindroModel();
    }

    public function cilindrosAction()
    {
        $this->render();
    }

    public function adicionarcilindroAction(){
        $this->uiParams['ids'] = json_decode($this->uiParams['ids']);
        $this->_cilidrosModel->adicionarcilindro($this->uiParams);
        $this->success = true;
    }

    /**
     * @return mixed
     */
    public function getProductosAction()
    {
        $this->objectHelper->synchronize($this, $this->_cilidrosModel->getProductos($this->uiParams));
    }

    public function eliminarProdCilindroAction()
    {
        $this->uiParams['datos'] = json_decode($this->uiParams['datos']);
        $this->objectHelper->synchronize($this, $this->_cilidrosModel->eliminarProdCilindro($this->uiParams));
    }

}
