<?php

$dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/activos_fijos/comun/config.php';
include_once $dir;
set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);

class ConfiPatrimonioService extends ZendExt_Model
{

    private $_mConfTipoMedio;

    /**
     *
     */
    public function __construct()
    {
        $this->_mConfTipoMedio = new ConfiguraciontipomedioModel();
    }

    public function initPluginsModel()
    {
        $this->_mConfTipoMedio->loadPluginsFromFile('listapluginsconf')->buildRelations();
    }

    /**
     *
     */
    public function getJsConfigPatri()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps . '/logistica/activos_fijos/patrimonio/configuracion/views/' .
            'scripts/confpatrimonio/confpatrimonio.phtml';

        return file_get_contents($dirPhtml);
    }

}
