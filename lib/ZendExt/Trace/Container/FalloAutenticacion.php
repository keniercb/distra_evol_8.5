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
class ZendExt_Trace_Container_FalloAutenticacion extends ZendExt_Trace_Container_Log
{
    /**
     * Usuario intento
     *
     * @var String
     */
    protected $_puser;
    
    /**
     * Constructor
     *
     * @param String $pipAddress
     */

    function __construct($usuariointento,$reference, $pUser, $ippc, $idsession, $subsistema,$categoria,$pFecha = null, $pHora = null)
    {
        parent :: __construct($categoria,$reference, $pUser, $ippc, $idsession, $subsistema, $pFecha, $pHora);

        $this->_puser=$usuariointento;
        parent :: setTraceType(2);
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
    
      /**
     * Obtiene la dirección
     *
     * @return String
     */
    function getPUser()
    {
        return $this->_puser;
    }
}
