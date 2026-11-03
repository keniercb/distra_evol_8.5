<?php

/**
 * Created by PhpStorm.
 * User: Miguel Antonio
 * Date: 20/01/2016
 * Time: 11:03 AM
 */
class PDOPosgresql
{
    private $_dbname, $_dbhost, $_dbuser, $_dbpasswd, $_dblink, $_connection_status;
    public $error = array();

    function __construct()
    {
        if (!extension_loaded('pgsql') || !extension_loaded('pdo_pgsql')) {
            echo 'PGSQL OR pdo_pgsql extension not loaded into PHP!';
            die();
        }
    }

    function __destruct()
    {
        $this->close();
    }

    private function connect()
    {
        $dns = "pgsql:host=$this->_dbhost; dbname=$this->_dbname";
        $this->_connection_status = false;

        try {
            $this->_dblink = new PDO($dns, $this->_dbuser, $this->_dbpasswd);
            $this->_dblink->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->_connection_status = true;
            return true;
        } catch (PDOException $e) {
            $this->error[] = array('code' => $e->getCode(), 'error' => $e->getMessage());
            return false;
        }
    }

    private function close()
    {
        if (!empty($this->_dblink)) {
            $this->_dblink = NULL;
        }
    }

    public function getError()
    {
        return $this->error;
    }

    public function setParametrosBD($dbhost, $dbname, $dbuser, $dbpasswd)
    {
        $this->_dbhost = $dbhost;
        $this->_dbname = $dbname;
        $this->_dbuser = $dbuser;
        $this->_dbpasswd = $dbpasswd;

        return $this->connect();
    }

    public function select($sql, $param_sql = array())
    {
        if ($this->_connection_status) {
            try {
                $st = $this->_dblink->prepare($sql);
                $rst = (is_array($param_sql) && (count($param_sql) > 0)) ? $st->execute($param_sql) : $st->execute();

                if ($rst) {
                    return $st->fetchAll(PDO::FETCH_ASSOC);
                }
            } catch (PDOException $e) {
                $this->error[] = array('code' => $e->getCode(), 'error' => $e->getMessage(), 'sql' => $sql, 'script' => $e->getFile(), 'linea' => $e->getLine());
            }
        }
        return false;
    }

    public function totalRegistros($sql, $param_sql = array())
    {
        if ($this->_connection_status) {
            $st = $this->_dblink->prepare($sql);
            $rst = (is_array($param_sql) && (count($param_sql) > 0)) ? $st->execute($param_sql) : $st->execute();

            if ($rst) {
                return $st->rowCount();
            }
            return 0;
        } else
            return false;
    }

    public function query($sql, $param_sql = array(), $tipo = 0)
    {
        if ($this->_connection_status) {
            $st = $this->_dblink->prepare($sql);
            $rst = (is_array($param_sql) && (count($param_sql) > 0)) ? $st->execute($param_sql) : $st->execute();
            switch ($tipo) {
                case 0:
                    return $rst;
                    break;
                case 1:
                    return $st->rowCount();
                    break;
                case 2:
                    return $st->lastInsertId();
                    break;
            }
        } else
            return false;
    }
}