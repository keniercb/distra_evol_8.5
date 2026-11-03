<?php

class SeguridadPersonaProxy
{

    private static $_instance = null;


    private function __construct()
    {

    }

    public static function getInstance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function log(ZendExt_FastResponse_Exception $e)
    {
        if (Zend_Registry::get('config')->development) {
            $exceptionLog = new ZendExt_Exception_Log(
                new ZendExt_Exception('NOCONTROLLED', $e)
            );
            $exceptionLog->handle();
        }
    }

    public function getAllPersons( $limit, $start, $nombre, $papell, $sapell)
    {
        try {
            $buscadorPersona = ZendExt_IoC::getInstance()->pvd->getPersonaBuscador(true);
            $buscadorPersona->incluirDatosContacto(true, false);
            $buscadorPersona->setLimit($limit, false);
            $buscadorPersona->setStart($start, false);
            $buscadorPersona->incluirDatosIdentidad(true, false);
            $buscadorPersona->incluirDatosSituacionLaboral(true, false);
            $buscadorPersona->setParamNombreyApellido($nombre, null, $papell, $sapell);
            $result = $buscadorPersona->ejecutarBusqueda();
            return $result;
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);
            return array();
        }
    }
}