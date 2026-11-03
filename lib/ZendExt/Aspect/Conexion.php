<?php

class ZendExt_Aspect_Conexion implements ZendExt_Aspect_ISinglenton
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

    public function initConexion()
    {
        $transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
        //Creo la conexion activa
        $this->conexion = $transactionManager->openConections(null, true);
    }
}
