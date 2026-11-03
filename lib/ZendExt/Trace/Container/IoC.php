<?php
/**
 * ZendExt_Trace_Container_IoC
 *
 * Clase para la contención de lso datos de las trazas de IoC.
 *
 * @author     Omar Antonio Díaz Peña.
 * @copyright  ERP-Cuba.
 * @package    Traces
 * @subpackage Container
 * @version    1.0.0
 */
class ZendExt_Trace_Container_IoC extends ZendExt_Trace_Container_Log
{
    /**
     * Tipo de IoC
     *
     * @var bool
     */
    protected $_internal;

    /**
     * Componente Origen
     *
     * @var String
     */
    protected $_source_comp;

    /**
     * Componente destino
     *
     * @var String
     */
    protected $_target_comp;



    /**
     * Método
     *
     * @var String
     */
    protected $_method;

    /**
     * Clase
     *
     * @var String
     */
    protected $_class;
    
    protected $_exec_time;
    
    protected $_memory;

    /**
     * Constructor
     *
     * @param bool   $pInternal
     * @param String $pSourceComp
     * @param String $pTargetComp
     * @param String $pAction
     * @param String $pClass
     * @param String $pMethod
     * @param Int    $pIdTraceCategory
     * @param String $pUser
     * @param Int    $pIdCommonStructure
     * @param String $pFecha
     * @param String $pHora
     */
    function __construct(
        $pInternal, $pSourceComp, $pTargetComp, $pClass, $pMethod, $pReference, $pUser, $ippc, $idsession, $subsistema,
        $pExecTime, $pMemory,$categoria,$pFecha = null, $pHora = null
    )
    {
        parent :: __construct($categoria,$pReference, $pUser, $ippc, $idsession, $subsistema, $pFecha, $pHora);

        parent :: setTraceType(6);
        $this->_internal = (int)$pInternal;
        $this->_source_comp = $pSourceComp;
        $this->_target_comp = $pTargetComp;
        
        $this->_class = $pClass;
        $this->_method = $pMethod;
          
        $this->_memory = $pMemory;
        $this->_exec_time = $pExecTime;
    }

    /**
     * Retorna si la traza es de IoC interno
     *
     * @return unknown
     */
    function getInternal()
    {
        return $this->_internal;
    }

    /**
     * Retorna el componente que brinda el servicio.
     *
     * @return String
     */
    function getSourceComponent()
    {
        return $this->_source_comp;
    }

    /**
     * Retorna el componente que se beneficia del IoC.
     *
     * @return String
     */
    function getTargetComponent()
    {
        return $this->_target_comp;
    }

    /**
     * Retorna la acción
     *
     * @return String
     */
    function getAction()
    {
        return $this->_action;
    }

    /**
     * Retorna el método
     *
     * @return String
     */
    function getMethod()
    {
        return $this->_method;
    }

    /**
     * Obtiene la clase
     *
     * @return String
     */
    function getClass()
    {
        return $this->_class;
    }
    
    function getExecTime() {
        return $this->_exec_time;
    }

    function getMemory() {
        return $this->_memory;
    }
}
