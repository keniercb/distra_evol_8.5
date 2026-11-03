<?php

/**
 * Created by PhpStorm.
 * User: keniercb
 * Date: 1/12/16
 * Time: 14:07
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class PGMServices extends ExistenciasWSModel
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getJsWinMedioPGM()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps.'/logistica/utiles/pgm/services/pgm.phtml';
        $js = file_get_contents($dir_phtml);
        return $js;
    }

    public function obtenerDatosMedioPorId($idIndicador){
        return json_decode($this->getWsClient()->obtenerDatosMedioPorId($idIndicador));
    }
}