<?php
/**
 * Marlen Caballero Ricardo
 * empresa: XETID
 */
class ZendExt_Trace_Container_Autorizacion extends ZendExt_Trace_Container_Log
{
    function __construct($pReference, $pUser, $ippc, $idsession, $subsistema,$categoria, $pFecha = null, $pHora = null)
    {
        parent :: __construct($categoria,$pReference, $pUser, $ippc, $idsession, $subsistema, $pFecha, $pHora);
           parent :: setTraceType(5);
    }
}