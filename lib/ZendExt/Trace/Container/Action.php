<?php

/**
 * ZendExt_Traza_Publisher_Action
 *
 * Publicador de las trazas de acción.
 *
 * @author     Omar Antonio Díaz Peña.
 * @copyright  ERP-Cuba
 * @package    Trace
 * @subpackage Publisher
 * @version    1.0.0
 */
class ZendExt_Trace_Container_Action extends ZendExt_Trace_Container_Log {
    
    /**
     * Controlador
     *
     * @var String
     */
    protected $_controller;

    /**
     * Acción
     *
     * @var String
     */
    protected $_action;
    
     /**
     * Descripcion
     *
     * @var String
     */
    
    protected $_descripcion;
    
     /**
     * Tiempo de ejecucion
     *
     * @var Float
     */
    
    protected $_exec_time;
    
     /**
     * Memory
     *
     * @var Float
     */
    protected $_memory;    
   


    /**
     * Constructor
     *
  
     * @param String $pController
     * @param String $pAction
     * @param String $pDescripcion
     * @param Float  $pExecTime 
     * @param Float  $pMemory    
     */
    
    function __construct(
        $pController,$pAction,$pDescripcion,$pExecTime,$pMemory,$reference, $pUser,
        $ippc, $idsession, $subsistema,$categoria, $pFecha = null, $pHora = null
    ) {
        parent :: __construct($categoria,$reference, $pUser, $ippc, $idsession, $subsistema, $pFecha = null, $pHora = null);
        parent :: setTraceType(1);      
       
        $this->_controller = $pController;
        $this->_action = $pAction;
        $this->_descripcion=$pDescripcion;
        $this->_exec_time = $pExecTime;
        $this->_memory = $pMemory;
       
    }
  

    /**
     * Controlador
     *
     * @return String
     */
    function getController() {
        return $this->_controller;
    }

    /**
     * Acción
     *
     * @return String
     */
    function getAction() {
        return $this->_action;
    }

  
    function getExecTime() {
        return $this->_exec_time;
    }

    function getMemory() {
        return $this->_memory;
    }

    function getDesc() {
       return $this->_descripcion;
    }
}
