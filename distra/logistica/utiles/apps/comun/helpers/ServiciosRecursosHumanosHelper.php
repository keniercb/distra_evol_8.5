<?php

/**
 * Clase especializada en el trabajo con los servicios que
 * se utilizan de recursos humanos
 *
 *
 */
class ServiciosRecursosHumanosHelper implements ISingletonClass
{

    /**
     * Una instancia unica de ServiciosRecursosHumanosHelper
     *
     * @var ServiciosRecursosHumanosHelper
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

    /**
     * Creates a new instance of class ServiciosRecursosHumanosHelper
     *
     * @return ServiciosRecursosHumanosHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosRecursosHumanosHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que devuelve los datos de los usuarios
     * se accede desde pvd
     *
     * @return interfaz de usuario
     */
    public function mostrarIUGestionarClientes()
    {

        try {
            return $this->integrator->pvd->mostrarIUGestionarClientes();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para buscar personas por sus filtros
     * se accede desde pvd
     *
     * @return persona
     */
    public function getPersonaBuscador($parametros)
    {

        try {
            return $this->integrator->pvd->getPersonaBuscador($parametros);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para buscar personas por sus filtros
     * se accede desde pvd
     *   <parametro nombre="arridPersona" tipo="array"/>
     * <parametro nombre="filtro" tipo="string"/>
     * <parametro nombre="limit" tipo="enterospos"/>
     * <parametro nombre="start" tipo="enterospos"/>
     * <parametro nombre="identidad" tipo="array"/>
     * <parametro nombre="idcargo" tipo="array"/>
     * <parametro nombre="idestructura"
     *
     * @return array
     */
    public function getPrincipalesDatosPersona($arridPersona, $filtro, $limit, $start, $identidad, $idcargo,
        $idestructura
    ) {

        try {
            return $this->integrator->pvd->getPrincipalesDatosPersona(
                $arridPersona, $filtro, $limit, $start, $identidad, $idcargo, $idestructura
            );
        } catch (Exception $e) {

        }
    }


    /**
     * Metodo que devuelve los datos de las personas segun sus ids
     * se accede desde pvd
     *
     * @param arreglo de id de personas
     *
     * @return stdClass
     */
    public function devolverPersonasPrincipalesPersonaById($idspersonas)
    {

        try {
            return $this->integrator->pvd->DevolverPersonasPrincipalesPersonaById($idspersonas);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de los usuarios
     * se accede desde pvd
     *
     * @return interfaz de usuario
     */
    public function mostrarIUBuscarPersona()
    {

        try {
            return $this->integrator->pvd->mostrarIUBuscarPersona();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para obtener datos de Persona uniendose con la tabla
     * se accede desde pvd
     *
     * @return
     */
    public function agregarDqlDatosPersona($objDoctrineQuery, $aliasReferenceTable, $aliasTable, $includeDqlSelect,
        $includeTablas, $relacion
    ) {

        try {
            return $this->integrator->pvd->pvd->agregarDqlDatosPersona(
                $objDoctrineQuery, $aliasReferenceTable, $aliasTable, $includeDqlSelect, $includeTablas, $relacion
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo buscar los datos de persona segun sus id
     * se accede desde pvd
     *
     * @return
     */
    public function buscarPersonaPorArreglodeID($arrIdPersonas)
    {

        try {
            return $this->integrator->pvd->pvd->BuscarPersonaPorArreglodeID($arrIdPersonas);
        } catch (Exception $e) {

        }
    }
}