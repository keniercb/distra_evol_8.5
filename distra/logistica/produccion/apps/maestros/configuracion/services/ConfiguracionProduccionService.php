<?php

class ConfiguracionProduccionService extends ZendExt_Model
{



    public function __construct()
    {

    }


    /**
     *
     */
    public function getJsConfig()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps.'/logistica/produccion/maestros/configuracion/views/'.
            'scripts/configuracionprod/configuracionprod.phtml';

        return file_get_contents($dirPhtml);
    }
}
