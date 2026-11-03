<?php

define(BASEPATH, "./");

include_once("database/drivers/postgre/postgre_driver.php");
include_once("database/DB_driver.php");
include_once("database/DB_active_rec.php");
include_once("database/DB_result.php");
include_once("database/drivers/postgre/postgre_result.php");

class ActiveRecordFactory
{

    private $dsn;
    private static $CIAR;

    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    public function Factory($module_name = 'xmetacomponent', $module_reference = 'herramientas/xmetacomponent')
    {
        $configApp = new ZendExt_App_Config();
        $configApp->addBdToConfig($module_name, $module_reference);
        $config = Zend_Registry :: get('config')->bd->$module_name;

        $this->dsn['hostname'] = $config->host;
        $this->dsn['username'] = $config->usuario;
        $this->dsn['password'] = $config->password;
        $this->dsn['database'] = $config->bd;
        $this->dsn['port']     = $config->port;
        $this->dsn['dbdriver'] = $this->getDbDriver($config->gestor);
        $this->dsn['dbprefix'] = "";
        $this->dsn['pconnect'] = false;
        $this->dsn['db_debug'] = true;
        $this->dsn['cache_on'] = false;
        $this->dsn['cachedir'] = "";
        $this->dsn['char_set'] = "utf8";
        $this->dsn['dbcollat'] = "utf8_general_ci";

        if (empty(self::$CIAR)) {
            if (!empty($this->dsn)) {
                $obj = new CI_DB_active_record($this->dsn);
                return $obj;
            } else {
                throw new Exception("Please give a DSN in this format 'driver://username:password@hostname/database'");
            }
        }
        return self::$CIAR;
    }

    private function getDbDriver($gestor)
    {
        switch ($gestor) {
            case 'pgsql':
                return 'postgre';
        }
    }

}

function show_error($message)
{
    throw new Exception($message);
}

function log_message($type, $message)
{
    throw new Exception("$type: $message");
}

