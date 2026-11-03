<?php

/**
 * Clase especializada en el trabajo con los servicios
 *  que se utilizan de crm
 *
 *
 */
class ServiciosCrmHelper implements ISingletonClass
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
            self::$instance = new ServiciosCrmHelper;
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
    public function getContratos($parametros)
    {

        try {
            return $this->integrator->crm->obtenerContratos($parametros);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve servicios de un contrato
     *
     * @param array
     *
     * @return array
     */
    public function getServiciosByContrato($parametros)
    {

        try {
            return $this->integrator->crm->obtenerDatosAdicionales($parametros);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    public function cambiarEstadoHito($arrayData){
        try {
            return $this->integrator->crm->cambiarEstadoHito($arrayData);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    public function guardarDemanda($params){
        try {
            return $this->integrator->crm->guardarDemanda($params);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    public function getSector() {
        $sql = "select ns.idsector, ns.denominacion from mod_crmcontratacion.nom_sector ns";
        return array('datos' => LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC));
    }
}
