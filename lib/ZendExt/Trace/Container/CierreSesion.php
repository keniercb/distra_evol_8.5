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
class ZendExt_Trace_Container_CierreSesion extends ZendExt_Trace_Container_Log
{
    /**
     * Constructor
     *
     * @param String $pipAddress
     */

    function __construct($pReference, $pUser, $ippc, $idsession, $subsistema, $categoriar,$pFecha = null, $pHora = null)
    {
        parent :: __construct($categoriar,$pReference, $pUser, $ippc, $idsession, $subsistema, $pFecha, $pHora);

        parent :: setTraceType(9);
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
