<?php
/**
 * Created by PhpStorm.
 * User: tecnologia
 * Date: 31/05/14
 * Time: 0:06
 */
class ZendExt_Trace_Container_Block extends ZendExt_Trace_Container_Log
{
     /**
     * Usuario o direccion ip del bloqueo.
     *
     * @var String
     */
    protected $_bloqueo;
    /**
     * id del tipo de bloqueo.
     *
     * @var String
     */
    protected $_id_typeblock;

    /**
     * Constructor
     *
     * @param String $pipAddress
     */

    function __construct( $pIdTraceCategory, $pUser, $ippc, $idsession, $subsistema, $bloqueado,$tipobloqueo,$categoriat,$pFecha = null, $pHora = null)
    {

        parent :: __construct($categoriat,$pIdTraceCategory, $pUser, $ippc, $idsession, $subsistema, $pFecha, $pHora);

        parent :: setTraceType(4);

        $this->_id_typeblock = $tipobloqueo;
        $this->_bloqueo = $bloqueado;
    }


    /**
     * Obtiene la entidad bloqueada
     *
     * @return String
     */
    function getBloqueado()
    {
        return $this->_bloqueo;
    }
      /**
     * Obtiene la entidad bloqueada
     *
     * @return String
     */
    function getIdTypeBloqueo()
    {
        return $this->_id_typeblock;
    }
}