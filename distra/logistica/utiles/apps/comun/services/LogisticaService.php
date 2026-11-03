<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class LogisticaService extends  BaseModel
{
    public function __construct()
    {
        parent::__construct(true);
    }

    public function getEntidades($params){
        return ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras(null);
    }

    public function getAlmacenes($idEntidad, $filtro = '')
    {
        return ServiciosEstructuraComposicionHelper::__init()->obtenerEstructurasNoFormalesPorEntidad($idEntidad, $filtro, false);
    }
}