<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class AbcService extends BaseModel
{
    private $configModel, $abcModel;

    public function __construct()
    {
        parent::__construct(true);
        $this->configModel = new ConfigAbcModel(true);
       // $this->abcModel = new AbcModel(true);
    }

	
	public function getJsConfiguracion(){
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps
            . '/logistica/inventario/abc/views/scripts/confabc/confabc.phtml';
        $js = file_get_contents($dirPhtml);
        return $js;
    }



}