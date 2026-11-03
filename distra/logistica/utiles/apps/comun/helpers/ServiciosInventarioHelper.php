<?php

/**
 * Clase especializada en el trabajo con los servicios que
 * se utilizan de inventario
 *
 *
 */
class ServiciosInventarioHelper implements ISingletonClass
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
     * Creates a new instance of class ServiciosInventarioHelper
     *
     * @return ServiciosInventarioHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosInventarioHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que devuelve la categoria por defecto de una entidad
     *
     * @param $idestructura
     *
     * @return numeric
     */
    public function getCategoriaDefecto($idestructura)
    {

        try {
            return $this->integrator->inventario->getCategoriaDefecto($idestructura);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que permite cambiar la categoria por defecto de una entidad
     *
     * @param $idestructura
     *
     * @return boolean
     */
    public function setCategoriaDefecto($idestructura, $idcategoria)
    {

        try {
            return $this->integrator->inventario->setCategoriaDefecto($idestructura, $idcategoria);
        } catch (Exception $e) {

        }
    }

}
