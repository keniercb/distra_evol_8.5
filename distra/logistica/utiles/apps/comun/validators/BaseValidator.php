<?php

/**
 * Clase base para las validaciones del subsistema
 *
 * @author Kenier Cumba Bueno
 */
abstract class BaseValidator
{

    protected $iocInterno,
        $iocExterno,
        $global,
        $params,
        $model;

    /**
     * Contructor de la clase validadora
     */
    public function __construct()
    {
        $this->iocInterno = ZendExt_IoC_Inter::getInstance();
        $this->iocExterno = ZendExt_IoC::getInstance();
        $this->global = ZendExt_GlobalConcept::getInstance();
        $this->params = $_POST;
        $this->initModel();
    }

    abstract public function initModel();
}
