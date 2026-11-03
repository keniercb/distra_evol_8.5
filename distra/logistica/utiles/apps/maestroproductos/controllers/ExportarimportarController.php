<?php

/**
 * Clase encargada le exportacion e importacion del nomenclador de productos y servicios
 *
 * @author Kenier Cumba Bueno
 */
if (!class_exists('BaseController')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ExportarimportarController extends BaseController
{

    private $modelExportar;

    public function init()
    {
        parent::init();
        $this->modelExportar = new ExportarImportarModel();
    }

    public function exportarImportarAction()
    {
        
    }

    public function importarNomencladorAction()
    {
        
    }

    public function exportarNomencladorAction()
    {
        ini_set('memory_limit',-1);
        $this->url =  $this->modelExportar->exportarNomenlclador(/*$this->uiParams*/);
       // $this->objectHelper->synchronize($this, $this->modelExportar->exportarNomenlclador($this->uiParams));
    }

}
