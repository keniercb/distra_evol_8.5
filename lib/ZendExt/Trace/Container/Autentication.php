<?php
/**
 * ZendExt_Trace_Container_Autentication
 *
 * @author     Arlan Cala Gutiérrez.
 * @copyright  ERP-Cuba.
 * @package    Trace.
 * @subpackage Container
 * @version    1.0.0
 */
class ZendExt_Trace_Container_Autentication extends ZendExt_Trace_Container_Log
{
    /**
     * Constructor
     *
     * @param String $pipAddress
     */

    function __construct($reference, $pUser,$ippc, $idsession, $subsistema, $categoria,$pFecha = null, $pHora = null)
    {
        parent :: __construct($categoria,$reference, $pUser, $ippc, $idsession, $subsistema, $pFecha, $pHora);
        parent :: setTraceType(8);
    }


    /**
     * Obtiene la dirección
     *
     * @return String
     */
    function getIpAddress()
    {
        return $this->_ippc;
    }
}
