<?php

/**
 * Clase especializada en el trabajo con los servicios
 *  que se utilizan de facturacion
 *
 *
 */
class ServiciosFacturacionHelper implements ISingletonClass
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
     * Una instancia unica de ServiciosSeguridadHelper
     *
     * @var ServiciosSeguridadHelper
     */
    private static $instance = null;

    /**
     * Creates a new instance of class ServiciosCrmHelper
     *
     * @return ServiciosCrmHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosFacturacionHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que devuelve los contratos
     *
     * @param array
     *
     * @return array
     */
    public function addSelectPrecioMatrizIndicador($idtipoprecio, $aliasInd = 'ind' , $query, $idestructura)
    {
        try {
            $parametros['idtipoprecio'] = $idtipoprecio;
            $parametros['idestructura'] = $idestructura;
            $parametros['aliasInd'] = $aliasInd;
            $parametros['query'] = $query;
            return $this->integrator->facturacion->addSelectPrecioMatrizIndicador($parametros);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getTipoPrecio($parametros)
    {
        try {
            return $this->integrator->facturacion->getTipoPrecio($parametros);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function addClienteTipoprecioPorDefecto($parametros)
    {
        try {
            return $this->integrator->facturacion->addClienteTipoprecioPorDefecto($parametros);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function addPrecioMatrizNaturaleza($parametros) {
        try {
            return $this->integrator->facturacion->addPrecioMatrizNaturaleza($parametros);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
