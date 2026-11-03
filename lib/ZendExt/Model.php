<?php

/**
 * Modelo o Gestor de Negocio
 *
 * @copyright Centro UCID
 * @package   ZendExt
 * @author    Omar Antonio Díaz Peña
 * @version   1.0-0
 */
abstract class ZendExt_Model
{
    /**
     * Conexion a la BD
     *
     * @var Doctrine_Conexion
     */
    protected $conn;
    /**
     * Integrador IoC
     */
    protected $integrator;
    /**
     * Integrador interno IoC
     */
    protected $pIntegrator;
    /**
     * Modulo al cual pertenece el negocio
     *
     * @var string
     */
    protected $module;
    /**
     * Puntero para la obtencion de los conceptos globales
     *
     * @var object
     */
    protected $global;

    /**
     * Constructor de la clase. Inicializa u obtiene la conexion a la BD
     *
     * @throws ZendExt_Exception - excepcion declarada en el xml de excepciones
     */
    public function ZendExt_Model($module = null)
    {
        //Obtengo la instancia del integrador
        $this->integrator = ZendExt_IoC::getInstance();
        //Obtengo la instancia del integrador interno
        $this->pIntegrator = ZendExt_IoC_Inter::getInstance();
        //Obtengo la instancia del GlobalConcept
        $this->global = ZendExt_GlobalConcept::getInstance();
        try {
            //Inicializo la conexion
            $this->initConnection($module);
        } catch (Exception $e) {
            throw new ZendExt_Exception('E014', $e);
        }
    }

    /**
     * Devuelve la conexion a la BD
     *
     * @return Doctrine_Conexion - conexión a la BD
     */
    public function getConn()
    {
        return $this->conn;
    }

    /**
     * Inicializa el modulo al cual pertenece el negocio
     *
     * @return void
     */
    public function setModule($module = null)
    {
        if (isset($module)) {
            $this->module = $module;
        } elseif (!$this->module) {
            $this->module = Zend_Registry::get('config')->module_name;
        }
    }

    /**
     * Inicializa la conexion del modulo
     *
     * @param string $module - Modulo al que pertenece el modelo
     *
     * @return void
     */
    public function initConnection($module = null)
    {
        //Se obtiene una instancia del gestor de doctrine
        $dmInstance = Doctrine_Manager::getInstance();
        //Se obtiene la conexion del modulo
        if ($module) {
            $this->conn = $dmInstance->getConnection($module);
        } else {
            $this->conn = $dmInstance->getCurrentConnection();
        }
    }

}