<?php
class ZendExt_CompExImp_Exportacion_Exportador
{

    function __construct()
    {

    }

    function exportar($objeto, $clase, $url)
    {
        $configSchema = Zend_Registry::getInstance();
        $class = ( string )$clase ['claseex'];
        $obj = new $class ();
        $metod = ( string )$clase ['metodoex'];
        return $obj->$metod ($objeto, $url);
    }
}
