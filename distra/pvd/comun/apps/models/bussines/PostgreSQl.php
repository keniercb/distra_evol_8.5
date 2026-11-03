<?php

/**
 * Created by PhpStorm.
 * User: Miguel Antonio
 * Date: 20/01/2016
 * Time: 11:02 AM
 */
class PostgreSQl
{
    private $_dbname, $_dbhost, $_dbuser, $_dbpasswd, $_dbport, $_dblink, $_connection_status;
    public $save_queries = false; //Asignar a true si se desea obtener la bitacora de los SQL ejecutados
    public $arr_queries = array();

    function __construct()
    {
    }

    function __destruct()
    {
        $this->close();
    }

    /**
     * Metodo que setea los datos de conexion a la BD
     * @access public
     * @param string $dbhost Nombre o IP del host de la BD
     * @param string $dbname Nombre BD
     * @param string $dbuser Usuario de BD
     * @param string $dbpasswd Clave usuario BD
     * @param string $dbport Puerto del servidor de BD default=5432
     */
    public function setParametrosBD($dbhost, $dbname, $dbuser, $dbpasswd, $dbport = 5432)
    {
        $this->_dbhost = $dbhost;
        $this->_dbname = $dbname;
        $this->_dbuser = $dbuser;
        $this->_dbpasswd = $dbpasswd;
        $this->_dbport = $dbport;
        return $this->connect();
    }

    /**
     * Funcion que retorna un boolean dependiendo si pudo o no conectarse a la BD
     * en base a las configuraciones que fueron seteadas en el metodo setParametrosBD
     * @access private
     * @return boolean
     */
    private function connect()
    {
        $conn_string = "host=" . $this->_dbhost . " port=" . $this->_dbport . " dbname=" . $this->_dbname . " user=" . $this->_dbuser . " password=" . $this->_dbpasswd;
        $this->_dblink = pg_connect($conn_string);
        if ($this->_dblink) {
            $this->_connection_status = pg_connection_status($this->_dblink);
            return true;
        }
        return false;
    }

    /**
     * Ejecuta una sentencia SQL
     * @access private
     * @param string $tSql Cadena SQL a ser ejecutada
     * @return resource $res
     */
    private function _query($tSql)
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

    /*
    * Obtener la conexion a la BD
    * @access public
    * return enlace conexion BD
    */
    public function getConexion()
    {
        return $this->_dblink;
    }

    /**
     * Permite ejecutar sentencias SQL SELECT y obtiene los registros en un array asociativo
     * @access public
     * @param string $tSql Cadena SQL a ser ejecutada
     * @return array asociativo si el SQL tuvo exito, boolean si hubo algun problema $result
     */
    public function select($tSql)
    {
        $result = false;
        $res = $this->_query($tSql);

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
     * Permite ejecutar multiples setencias sql separadas por ';', por ejm: "select * from table where col1 BETWEEN 1 and 2; SELECT now();"
     * @access public
     * @param string $mSql a ser ejecutada
     * @return array que en cada posicion contiene un subarray con los datos obtenidos por cada sql, boolean si existio algun problema en la consulta
     * array(2) { [0]=> array(2) { [0]=> array(1) { ["col1"]=> string(1) "1" } [1]=> array(1) { ["col1"]=> string(1) "2" } }
     * [1]=> array(1) { [0]=> array(1) { ["now"]=> string(29) "2012-02-13 10:09:28.430723-05" } } }
     */
    public function multi_query($mSql)
    {

        $res = false;

        if (is_resource($this->_dblink) && ($this->_connection_status === PGSQL_CONNECTION_OK) && pg_send_query($this->_dblink, $mSql)) {

            if ($this->save_queries) {
                $this->arr_queries[] = $mSql;
            }

            do {
                $rst = pg_get_result($this->_dblink);

                $ban = (is_resource($rst)) ? true : false;

                if ($ban) {
                    $arr_query = array();
                    while ($row = pg_fetch_assoc($rst)) {
                        $arr_query[] = $row;
                    }
                    pg_free_result($rst);
                }

                if (isset($arr_query) && $ban) {
                    $res[] = $arr_query;
                }

            } while ($ban);
        }
        return $res;
    }

    /**
     * Permite ejecutar un SQL y retorna la cantidad de registros obtenidos
     * @access public
     * @param string $tSql Cadena SQL a ser ejecutada
     * @return int
     */
    public function totalRegistros($tSql)
    {
        $res = $this->_query($tSql);
        if (!is_bool($res)) {
            return pg_num_rows($res);
        }
        return 0;
    }

    /**
     * Permite ejecutar sentencias SQL INSERT, UPDATE, DELETE
     * @access public
     * @param string $tSql
     * @param integer $tipo : 0->para resource, 1->archivos afectados, 2->el ultimo id generado
     * @return dependiendo del parametro tipo retornara: resource $res, integer total registros afectados, integer ultimo id generado
     */
    public function query($tSql, $tipo = 0)
    {
        $res = $this->_query($tSql);
        switch ($tipo) {
            case 0: //retorno resource
                return $res;
                break;
            case 1: //retorno el total de registros afectados de una consulta INSERT, UPDATE, DELETE
                return pg_affected_rows($res);
                break;
            case 2: //retorno el ultimo id generado de una consulta INSERT
                return pg_last_oid($res);
                break;
        }
    }

    /**
     * Permite ejecutar sentencias SQL INSERT, UPDATE, DELETE
     * @access public
     * @param string $tSql
     * @param integer $tipo : 0->para resource, 1->archivos afectados, 2->el ultimo id generado
     * @return dependiendo del parametro tipo retornara: resource $res, integer total registros afectados, integer ultimo id generado
     */
    public function execute($tSql, $tipo = 0)
    {
        $this->query($tSql, $tipo);
    }

    /**
     * Retorna el ultimo query ejecutado
     * @access public
     * @return false si no existe sentencias sql ejecutas, caso contrario retorna la mas reciente
     */
    public function last_query()
    {
        return end($this->arr_queries);
    }

    /**
     * Cierra la conexion a la BD
     */
    private function close()
    {
        if (!empty($this->_dblink)) {
            pg_close($this->_dblink);
            unset($this->_dblink);
        }
    }
}