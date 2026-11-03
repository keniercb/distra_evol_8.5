<?php

/**
 * Clase especializada en el trabajo con los servicios que se utilizan de ayuda
 *
 *
 */
class ServiciosAyudaHelper implements ISingletonClass
{

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

    /**
     * Una instancia unica de ServiciosAyudaHelper
     *
     * @var ServiciosAyudaHelper
     */
    private static $instance = null;

    /**
     * Creates a new instance of class ServiciosAyudaHelper
     *
     * @return ServiciosAyudaHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosAyudaHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que devuelve los js para obtener la ayuda
     *
     * @return
     */
    public function getJSAyuda()
    {

        // try{
        return $this->integrator->ayuda->devolverJS();
        // }catch(Exception $e){
        //}
    }

}
