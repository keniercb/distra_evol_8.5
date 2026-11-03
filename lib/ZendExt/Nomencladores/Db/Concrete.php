<?php

class ZendExt_Nomencladores_Db_Concrete
{

    private $_tm;
    private $_ds;

    public function __construct()
    {
        $this->_tm = ZendExt_Aspect_TransactionManager::getInstance();
        $this->createDS();
    }

    public function getSchemaByTable($pTable)
    {
        $connection = $this->getConnBySchema('mod_datosmaestros');

        $result = $connection->execute("select esquema from tablas where nombre = '$pTable';");
        $result = $result->fetchAll(PDO::FETCH_ASSOC);

        return $result [0] ['esquema'];
    }

    public function getConnBySchema($pSchema)
    {
        $dm = Doctrine_Manager::getInstance();
        $result = null;

        try {
            $result = $dm->getConnection($pSchema);
        } catch (Doctrine_Manager_Exception $e) {
            $connParamters = $this->_ds [$pSchema];
            $rsa = new ZendExt_RSA();
            $password = $rsa->decrypt($connParamters->password, '85550694285145230823', '99809143352650341179');
            $port = ($connParamters->port) ? $connParamters->port : 5432;
            $connStr
                = "$connParamters->gestor://$connParamters->usuario:$password@$connParamters->host:$port/$connParamters->bd";

            $result = $dm->openConnection($connStr, $pSchema, false);

            if ($connParamters->gestor == 'pgsql') {

                try {
                    $result->execute("set search_path = {$pSchema};");
                } catch (Exception $e) {
                    //echo '<pre>';
                    //print_r($e);
                    //die;
                    throw new ZendExt_Exception('NOM010', $e);
                }
            }

            $result->beginTransaction();
        }

        return $result;
    }

    public function getSchemas()
    {
        return array_keys($this->_ds);
    }

    private function createDS()
    {
        $xml = ZendExt_FastResponse :: getXML('nomconfig');
        $conn = $xml->conn;
        $params = array('usuario', 'password');
        $parameters = array('gestor', 'host', 'bd', 'port');

        foreach ($xml->esquemas->children() as $var) {
            $schema = (string)$var['nombre'];

            $temp = null;

            foreach ($params as $tmp) {
                $temp->$tmp = (string)$var [$tmp];
            }

            foreach ($parameters as $tmp) {
                $temp->$tmp = (string)$conn[$tmp];
            }

            $this->_ds [$schema] = $temp;
        }
    }

    public function holeQuery($pQuery, $pConn)
    {
        try {
            $this->_tm->initTransactions();
            $pConn->exec($pQuery);
            $this->_tm->commitTransactions();
        } catch (Exception $e) {
            //echo '<pre>';
            //print_r ($e);

            $this->_tm->rollbackTransactions(null);
            //die;
            throw new ZendExt_Exception('NOM011', $e);
        }
    }

    /**
     * Función para ejecutar una consulta
     *
     * @param String $pSQL
     * @param        Doctrine_Connection / string $pAbstract
     *
     * @return Array
     */
    public function query($pSQL, $pAbstract)
    {
        $pSQL .= ";";

        $connection = null;


        if ($pAbstract instanceof Doctrine_Connection) {
            $connection = $pAbstract;
        } else {
            if (strstr($pAbstract, 'mod_')) {
                $connection = $this->getConnBySchema($pAbstract);
            } else {
                $schema = $this->getSchemaByTable($pAbstract);
                $connection = $this->getConnBySchema($schema);
            }
        }

        $consultas = explode(';', $pSQL);
        array_pop($consultas);

        try {
            $this->_tm->initTransactions();

            foreach ($consultas as $var) {
                $query = $connection->execute($var . ';');
            }

            $this->_tm->commitTransactions();
        } catch (Exception $e) {
            $this->_tm->rollbackTransactions($e);
            $codigo = $e->getCode();
            if ($codigo == '23503') {
                throw new ZendExt_Exception('NOM002', $e);
            } elseif ($codigo == '23505') {
                throw new ZendExt_Exception('NOM005', $e);
            } else {
                throw new ZendExt_Exception('NOM010', $e);
            }
        }

        $result = ($query != null) ? $query->fetchAll(PDO::FETCH_ASSOC) : false;

        return $result;
    }

    public function queryfield($pSQL, $pAbstract)
    {
        $pSQL .= ";";

        $connection = null;


        if ($pAbstract instanceof Doctrine_Connection) {
            $connection = $pAbstract;
        } else {
            if (strstr($pAbstract, 'mod_')) {
                $connection = $this->getConnBySchema($pAbstract);
            } else {
                $schema = 'mod_datosmaestros';
                $connection = $this->getConnBySchema($schema);
            }
        }

        $consultas = explode(';', $pSQL);
        array_pop($consultas);

        try {
            $this->_tm->initTransactions();

            foreach ($consultas as $var) {
                $query = $connection->execute($var . ';');
            }

            $this->_tm->commitTransactions();
        } catch (Exception $e) {
            //echo '<pre>';
            //print_r ($e);

            $this->_tm->rollbackTransactions($e);
            //die;
            throw new ZendExt_Exception('NOM010', $e);
        }

        $result = ($query != null) ? $query->fetchAll(PDO::FETCH_ASSOC) : false;

        return $result;
    }

}
