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

class SubcategoriasController extends BaseController
{

    private $_subCategoriasModel;

    public function init()
    {
        parent :: init();
        $this->_subCategoriasModel = new NomSubcategoriasModel();
    }

    public function subcategoriasAction()
    {
        $this->render();
    }

    public function getCategoriasAction()
    {
        $this->objectHelper->synchronize($this, $this->_subCategoriasModel->getCategorias($this->uiParams));
    }

    public function getCategoriasPrecioAction()
    {
        $datos = $this->_subCategoriasModel->getCategoriasPrecio($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function adicionarrelacionAction()
    {
        $this->uiParams['ids'] = json_decode($this->uiParams['ids']);
        $this->_subCategoriasModel->adicionarRelacion($this->uiParams);
        $this->success = true;
    }

    public function eliminarSubcategoriasAction()
    {
        $this->uiParams['datos'] = json_decode($this->uiParams['datos']);
        $this->objectHelper->synchronize($this, $this->_subCategoriasModel->eliminarSubcategorias($this->uiParams));
    }

}
