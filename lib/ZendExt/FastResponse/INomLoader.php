<?php
/**
 * ZendExt_FastResponse_INomLoader
 *
 * Interfaz para el nomenclador
 *
 * @author     : Omar Antonio Diaz Peña
 * @package    : ZendExt
 * @subpackage ZendExt_FastResponse
 * @copyright  : UCID-ERP Cuba
 * @version    1.0-0
 */
interface ZendExt_FastResponse_INomLoader
{
    /**
     * Load
     *
     * Carga los datos del nomenclador.
     *
     * @throws ZendExt_Exception - excepciones declaradas en el xml de excepciones
     * @return void
     */
    public function Load();

    /**
     * Connect
     *
     * Creacion de la conexion a la BD.
     *
     * @throws ZendExt_Exception - excepciones declaradas en el xml de excepciones
     * @return void
     */
    public function Connect();

    /**
     * Data
     *
     * Devuelve los datos del nomenclador
     *
     * @return array  - datos del nomenclador
     */
    public function Data();

    /**
     * Count
     *
     * Cuenta las filas obtenidas del nomenclador
     *
     * @return integer  - cantidad de filas obtenidas
     */
    public function Count();

    /**
     * getConn
     *
     * Devuelve la conexión a la BD
     *
     * @return Doctrine_Conexion - conexión a la BD
     */
    public function getConn();
}
