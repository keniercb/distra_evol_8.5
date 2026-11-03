<?php

/**
 * ZendExt_Trace_Publisher_Data
 *
 * Clase para la gestión de las trazas de datos
 *
 * @author     Omar Antonio Díaz Peña.
 * @package    Trace.
 * @subpackage Publisher.
 * @copyright  ERP-Cuba.
 * @version    1.0.0.
 */
class ZendExt_Trace_Container_Data extends ZendExt_Trace_Container_Log
{

    /**
     * Esquema
     *
     * @var String
     */
    protected $_schema;
    /**
     * Tabla
     *
     * @var String
     */
    protected $_table;
    /**
     * Acción
     *
     * @var String
     */
    protected $_id_operacion;
    protected $_id_objeto;


    /**
     * El objeto a actualizar
     *
     * @var String
     */
    protected $_datos;

    /**
     * Constructor
     *
     * @param type $pSchema
     * @param type $pTable
     * @param type $pIdObjeto
     * @param type $pIdOperacion
     * @param type $pAction
     * @param type $pIdCategory
     * @param type $pUser
     * @param type $pIdCommonStructure
     * @param type $array
     */
    function __construct(
        $pSchema, $pTable, $pIdObjeto, $pIdOperacion,$reference, $pUser, $ippc, $idsession, $subsistema,$categoria ,$array
    )
    {

        parent :: __construct($categoria,$reference, $pUser, $ippc, $idsession, $subsistema);
        $this->_schema = $pSchema;
        $this->_table = $pTable;
        $this->_id_objeto = $pIdObjeto;
        $this->_id_operacion = $pIdOperacion;
        $this->_datos = serialize($array);
        parent::setTraceType(10);
    }

    /**
     * Esquema
     *
     * @return String
     */
    function getSchema()
    {
        return $this->_schema;
    }

    /**
     * Accion
     *
     * @return String
     */
    function getIdOperacion()
    {
        return $this->_id_operacion;
    }

    function getIdObjeto()
    {
        return $this->_id_objeto;
    }

    function getDatosSerializados()
    {
        return $this->_datos;
    }

    function setIdOperacion($pIdOperacion)
    {
        $this->_id_operacion = $pIdOperacion;
    }

    /**
     * Tabla
     *
     * @return String
     */
    function getTable()
    {
        return $this->_table;
    }

}