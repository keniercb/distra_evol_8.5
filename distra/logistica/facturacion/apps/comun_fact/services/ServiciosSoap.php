<?php

/**
 * @author Kenier Cumba Bueno
 */
class ServiciosSoap implements ISingletonClass
{
    //direccion local http://localhost:5900/logistica/utiles/maestroproductos/webservices/server.wsdl.php
    //const DIR_WSDL = "http://facturacion.prod.xetid.cu/logistica/utiles/maestroproductos/webservices/server.wsdl.php";
    //const DIR_WSDL = "http://192.168.16.183:8080/Clinicas/services/facturacionServicios?wsdl";

    private static $instance = null;

    private function __construct()
    {
        $file = Zend_Registry::getInstance()->get('config')->dir_aplication . ''
            . DIRECTORY_SEPARATOR . '/logistica/utiles/comun/recursos/log_config';
        $this->config = InitConfigLoader::__init()->load($file);
    }

    public static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosSoap;
        }
        return self::$instance;
    }
}
