<?php

class ZendExt_Aspect_Registro implements ZendExt_Aspect_ISinglenton
{
    private function __construct()
    {

    }

    static public function getInstance()
    {
        static $instance;
        if (!isset ($instance)) {
            $instance = new self ();
        }
        return $instance;
    }

    public function initRegistro()
    {
        //Se crea el registro de objetos, variables y arreglos
        $register = new Zend_Registry(array(), ArrayObject::ARRAY_AS_PROPS);
        //Se guarda el registro en el singelton de Registro
        Zend_Registry::setInstance($register);
    }
}
