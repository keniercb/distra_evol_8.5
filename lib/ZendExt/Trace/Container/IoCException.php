<?php
/**
 * ZendExt_Trace_Container_IoCException
 *
 * Cotenedor de las trazas producidas por un error del IoC
 *
 * @author     Omar Antonio Díaz Peña
 * @package    Trace
 * @subpackage Container
 * @copyright  ERP-Cuba
 * @version    1.5.0
 */
class ZendExt_Trace_Container_IoCException extends ZendExt_Trace_Container_Log
{
    /**
     * Código de la excepción
     *
     * @var String
     */
    private $_exception_code;

    /**
     * Mensaje de la excepción
     *
     * @var String
     */
    private $_exception_msg;

    /**
     * Descripción de la excepción
     *
     * @var String
     */
    private $_exception_desc;

    /**
     * Componente origen
     *
     * @var String
     */
    private $_source;

    /**
     * Componente destino
     *
     * @var String
     */
    private $_target;

    /**
     * Clase
     *
     * @var String
     */
    private $_class;

    /**
     * Método
     *
     * @var String
     */
    private $_method;

    /**
     * Acción
     *
     * @var String
     */
    private $_action;

    /**
     * Log
     *
     * @var String
     */
    private $_log;


    private $_controller;


    /**
     * Constructor
     *
     * @param String $pExceptionCode
     * @param String $pExceptionMsg
     * @param String $pExceptionDescription
     * @param String $pSource
     * @param String $pTarget
     * @param String $pClass
     * @param String $pMethod
     * @param String $pAction
     * @param Int    $pIdTraceCategory
     * @param String $pUser
     * @param Int    $pIdCommonStructure
     * @param String $pFecha
     * @param String $pHora
     */
    function __construct(
        $pExceptionCode, $pExceptionMsg, $pExceptionDescription, $pSource, $pTarget, $pClass, $pMethod, $pAction, $pLog,
        $pController, $pIdTraceCategory, $pUser, $ippc, $idsession, $subsistema, $pFecha = null, $pHora = null
    )
    {
        parent :: __construct($pIdTraceCategory, $pUser,$ippc, $idsession, $subsistema, $pFecha, $pHora);
        parent :: setTraceType(8);

        $this->_exception_code = $pExceptionCode;
        $this->_exception_msg = $pExceptionMsg;
        $this->_exception_desc = $pExceptionDescription;
        $this->_log = $pLog;

        $this->_action = $pAction;
        $this->_method = $pMethod;
        $this->_class = $pClass;
        $this->_source = $pSource;
        $this->_controller = $pController;
        $this->_target = $pTarget;
    }

    /**
     * Retorna la acción
     *
     * @return Strung
     */
    public function getAction()
    {
        return $this->_action;
    }

    public function getLog()
    {
        return $this->_log;
    }

    public function getController()
    {
        return $this->_controller;
    }

    /**
     * Retorna la clase
     *
     * @return String
     */
    public function getClass()
    {
        return $this->_class;
    }

    /**
     * Retorna el código de la excepción
     *
     * @return String
     */
    public function getExceptionCode()
    {
        return $this->_exception_code;
    }

    /**
     * Retorna la descripción de la excepción.
     *
     * @return String
     */
    public function getExceptionDesc()
    {
        return $this->_exception_desc;
    }

    /**
     * Retorna el mensaje de la excepción
     *
     * @return String
     */
    public function getExceptionMsg()
    {
        return $this->_exception_msg;
    }

    /**
     * Retorna el método
     *
     * @return String
     */
    public function getMethod()
    {
        return $this->_method;
    }

    /**
     * Retorna el componente origen
     *
     * @return String
     */
    public function getSource()
    {
        return $this->_source;
    }

    /**
     * Retorna el componente destino
     *
     * @return String
     */
    public function getTarget()
    {
        return $this->_target;
    }
}
