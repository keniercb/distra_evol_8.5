<?php

/**
 * ZendExt_Trace_Container_Log
 *
 * Clase base de las trazas
 *
 * @author    Omar Antonio D�az Pe�a.
 * @copyright ERP-Cuba.
 * @version   1.0.0
 */
class ZendExt_Trace_Container_Log
{
    /**
     * Fecha de la traza
     *
     * @var String
     */
    protected $_date;

    /**
     * Ip de la Traza
     *
     * @var String
     */
    protected $_ippc;

    /**
     * Id de session
     *
     * @var String
     */
    protected $_idsession;

    /**
     * Denominación del subsistema
     *
     * @var String
     */
    protected $_subsistema;

    /**
     * Hora
     *
     * @var String
     */
    protected $_time;

    /**
     * Identificador de la categoría de la traza
     *
     * @var Int.
     */
    protected $_reference;

    /**
     * Identificador de tipo
     *
     * @var Int
     */
    protected $_id_type;
    /**
     * Identificador de tipo de subsistema
     *
     * @var Int
     */
    protected $_id_categoria;

    /**
     * Usuario
     *
     * @var String
     */
    protected $_user;


    protected $_id_traza_padre;
    protected $_children = array();

    /**
     * Constructor
     *
     * @param Int $pIdTraza
     * @param Int $pIdTipo
     * @param String $pFecha
     * @param String $pHora
     */
    function __construct($categoria, $reference, $pUser, $ippc, $idsession, $subsistema, $pFecha = null, $pHora = null)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $this->_date = date($global->Formato->fecha);
        //$this->_time = date($global->Formato->hora);

        $a = microtime(true);
        $t = floor($a);
        $milliseconds = round(($a - $t) * 1000000);

        $this->_time = date(preg_replace('`(?<!\\\\)u`', $milliseconds, 'H:i:s.u'), $t);

        $this->_user = $pUser;
        $this->_id_categoria = $categoria;
        $this->_ippc = $ippc;
        $this->_idsession = $idsession;
        $this->_subsistema = $subsistema;
        $otromodo = isset($_SERVER['SERVER_NAME']) ? 'http://' . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . $_SERVER['PHP_SELF'] : "";
        $this->_reference = ($reference == '') ? $otromodo : $reference;
        $this->_id_traza_padre = 0;
        $this->_children = array();

    }

    function getIdTraceCategoryByAlias($pSubsistema)
    {
        $query = Doctrine_Query:: create(HisTraza::getConn());

        $query->from('NomCategoriatraza ct')
            ->where('ct.denominacion = ?', $pSubsistema);

        return $query->execute()->toArray();
    }

    /**
     * Caambiaar la traza padre
     *
     * @return String
     */
    function setIdTrazaPadre($id_traza_padre)
    {
        $this->_id_traza_padre = $id_traza_padre;
    }

    /**
     * Obtiene la fecha
     *
     * @return String
     */
    function getDate()
    {
        return $this->_date;
    }

    /**
     * Obtiene la fecha
     *
     * @return String
     */
    function getIpPc()
    {
        return $this->_ippc;
    }

    /**
     * Obtiene la fecha
     *
     * @return String
     */
    function getIdSession()
    {
        return $this->_idsession;
    }

    /**
     * Obtiene la fecha
     *
     * @return String
     */
    function getSubsistema()
    {
        return $this->_subsistema;
    }

    /**
     * Obtiene la hora
     *
     * @return String
     */
    function getTime()
    {
        return $this->_time;
    }

    /**
     * Identificador de la traza
     *
     * @return Int
     */
    function getReference()
    {
        return $this->_reference;
    }

    /**
     * Identificador del tipo de la traza
     *
     * @return Int
     */
    function getIdType()
    {
        return $this->_id_type;
    }

    /**
     * Devolver el usuario.
     *
     * @return String.
     */
    function getUser()
    {
        return $this->_user;
    }

    /**
     * Fija el tipo de traza
     *
     * @param Int $pType
     */
    function setTraceType($pType)
    {
        $this->_id_type = $pType;
    }

    function getCategoria()
    {
        return $this->_id_categoria;
    }

    function setChildren(array $children)
    {
        $this->_children = $children;
    }

    function getChildren()
    {
        return $this->_children;
    }

    function addChildren($child)
    {
        $this->_children[] = $child;
    }

}
