<?php

/**
 * @author Ing.Miguel Antonio Cabreja Aldana
 * @version 1.0
 * Clase  para interactuar con bases de datos postgresql
 *
 * ****************************FORMAS DE USOS********************************************
 *
 * $objConect=new PgSqlConnect('IP_servidor','NombreBD','Password','Usuario','5432');
 * $sql='SELECT nombre FROM Persona';
 * $result=$objConect->query($sql);
 * $cant=$objConect->count($sql);
 * $objConect->close();
 * return array('result'=$result,'cant'=$cant);
 *
 *
 * **************************************************************************************
 *
 * $objConect=new PgSqlConnect('IP_servidor','NombreBD','Password','Usuario','5432');
 * $sql='SELECT nombre FROM Persona';
 * $result=$objConect->select($sql);
 * $objConect->close();
 * return array('result'=$result,'cant'=$cant);
 * 
 */
class PgSqlConnect
{
    private $_dbname, $_dbhost, $_dbuser, $_dbport, $_dbpasswd, $_dblink, $_connection_status;

    /**
     * Constructor de la clase
     *
     * @param string $dbhost Direccion de ip del servidor
     * @param string $dbname Nombre de la base de datos
     * @param string $dbpasswd Contrasenna de conexion al servidor
     * @param string $dbuser Usuario de conexion al servidor
     * @param string $dbport Puerto de publicacion por defecto es 5432
     */


    function __construct($dbhost, $dbname, $dbpasswd, $dbuser, $dbport = '5432')
    {
        $this->_dbhost = $dbhost;
        $this->_dbname = $dbname;
        $this->_dbpasswd = $dbpasswd;
        $this->_dbport = $dbport;
        $this->_dbuser = $dbuser;
        $this->connect();
    }

    /**
     * Funcionalidad priviada para iniciar conexion con el servidor
     * @return bool
     */
    private function connect()
    {

        $conn_string = "host=" . $this->_dbhost . " port=" . $this->_dbport . " dbname=" . $this->_dbname . " user=" . $this->_dbuser . " password="
            . $this->_dbpasswd;

        $this->_dblink = pg_connect($conn_string);
        if ($this->_dblink) {
            $this->_connection_status = pg_connection_status($this->_dblink);
            return true;
        }
        return false;
    }

    /**
     * Funcionalidad para ejecutar sentencias sql sencillas
     *
     * @param string $tSql Consulta Sql
     * @return bool|resource
     */
    public function query($tSql)
    {

        $res = false;
        if (is_resource($this->_dblink) && ($this->_connection_status === PGSQL_CONNECTION_OK)) {
            $res = pg_query($this->_dblink, $tSql);
            if ($this->save_queries) {
                $this->arr_queries[] = $tSql;
            }
        }

        return $res;
    }

    /**
     * Funcionalidad para devolver la cantidad
     *
     * @param string $tSql String de la sentencia SQL
     * @return int
     */
    public function count($tSql)
    {
        $res = $this->query($tSql);
        if (!is_bool($res)) {
            return pg_num_rows($res);
        }
        return 0;
    }

    /**
     * Funcionalidad para ejecutar sentencias SQL y obtener los resultados como array
     *
     * @param string $tSql String de la sentencia SQL
     * @return array|bool
     */
    public function select($tSql)
    {

        $result = false;
        $res = $this->query($tSql);
        if (!is_bool($res)) {
            $result = array();
            while ($row = pg_fetch_assoc($res)) {
                $result[] = $row;
            }
            pg_free_result($res);
        }

        return $result;
    }

    /**
     * Funcionalidad para cerrar la conexion con el servidor
     */
    public function close()
    {
        if (!empty($this->_dblink)) {
            pg_close($this->_dblink);
            unset($this->_dblink);
        }
    }

} 
