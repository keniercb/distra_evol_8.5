<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ServiciosPKIHelper
 *
 * @author kenier
 */
class ServiciosPKIHelper implements ISingletonClass
{

    public static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosPKIHelper;
        }
        return self::$instance;
    }

    /**
     * Una instancia unica de ServiciosPKIHelper
     *
     * @var ServiciosPKIHelper
     */
    private static $instance = null;

    /**
     * Variables internas de la clase
     *
     */
    private $integrator = null;
    private $varglobal = null;

    /**
     * Inicializando las variables
     *
     */
    private function __construct()
    {
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
    }

    public function getJsUIFirma()
    {
        try {
            return $this->integrator->pki->getUISign();
        } catch (Exception $e) {
        }
    }

//put your code here
}
