<?php
/**
 * ZendExt_Trace_Container_Url
 *
 * Clase para el contenedor de las url
 *
 * @author     Omar Antonio Díaz Peña.
 * @copyright  ERP-Cuba.
 * @package    Trace.
 * @subpackage Container
 * @version    1.0.0
 */
class ZendExt_Trace_Container_Url extends ZendExt_Trace_Container_Log
{
    /**
     * Dirección.
     *
     * @var String
     */
    private $_address;

    /**
     * ¿De autenticación?
     *
     * @var bool
     */
    private $_auth;

    /**
     * Constructor
     *
     * @param String $pAddress
     * @param Int    $pIdTraceCategory
     * @param String $pUser
     * @param Int    $pIdCommonStructure
     * @param String $pFecha
     * @param String $pHora
     * @param Bool   $pAuth ;
     */
    function __construct(
        $pAuth, $pAddress, $pIdTraceCategory, $pUser, $pIdCommonStructure, $pFecha = null, $pHora = null
    )
    {
        parent :: __constructor($pIdTraceCategory, $pUser, $pIdCommonStructure, $pFecha, $pHora);

        $this->_address = $pAddress;
        $this->_auth = ($pAuth) ? 't' : 'f';
    }

    /**
     * Obtiene la dirección
     *
     * @return String
     */
    function getAddress()
    {
        return $this->_address;
    }

    /**
     * Obtiene si la traza es d autenticación
     *
     * @return bool
     */
    function getAuth()
    {
        return $this->_auth;
    }
}
