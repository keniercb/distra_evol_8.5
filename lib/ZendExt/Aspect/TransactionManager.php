<?php
/**
 * ZendExt_Aspect_Validation
 *
 * Administra las transacciones
 *
 * @author    : Yoandry Morejon Borbon
 * @copyright UCID-ERP Cuba
 * @package   : ZendExt
 * @version   1.0-0
 */
class ZendExt_Aspect_TransactionManager implements ZendExt_Aspect_ISinglenton
{

    /**
     * Conecciones activas
     *
     * @var Doctrine_Connection
     */
    private $_conections = array();

    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {

    }

    /**
     * Obtencion de la instancia de la clase, ya que esta no puede ser
     * instanciada directamente debido a que es un singlenton
     *
     * @return ZendExt_Aspect_TransactionManager - instancia de la clase
     */
    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    /**
     * Inicia una transaccion por cada conection activa
     *
     * @return void
     */
    public function initTransactions()
    {
        $doctrineManager = Doctrine_Manager::getInstance();
        $connections = $doctrineManager->getConnections();
        if (is_array($connections) && count($connections)) {
            foreach ($connections as $connection) {
                $connection->beginTransaction();
            }
        }
    }

    /**
     * Salva todos los records creados o modificados y acepta
     * la transaccion abierta por cada conection activa
     *
     * @ignore Ignora la salva de todos los records (temporalmente)
     * @return void
     */
    public function commitTransactions()
    {
        $doctrineManager = Doctrine_Manager::getInstance();
        $connections = $doctrineManager->getConnections();
        if (is_array($connections) && count($connections)) {
            foreach ($connections as $connection) {
                try {
                    if ($this->_conections[$connection->getName()]['beginTransaction']) {
                        $connection->commit();
                    }
                } catch (Doctrine_Transaction_Exception $e) {
                    $exceptionLog = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
                    $exceptionLog->handle();
                }
            }
        }
    }

    /**
     * Cancela la transaccion abierta por cada conection activa
     *
     * @return void
     */
    public function rollbackTransactions(Exception $e)
    {
        $doctrineManager = Doctrine_Manager::getInstance();
        $connections = $doctrineManager->getConnections();
        if (is_array($connections) && count($connections)) {
            foreach ($connections as $connection) {
                try {
                    if ($this->_conections[$connection->getName()]['beginTransaction']) {
                        $connection->rollback();
                    }
                } catch (Doctrine_Transaction_Exception $e) {
                    $exceptionLog = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
                    $exceptionLog->handle();
                }
            }
        }
    }

    /**
     * Abriendo las conexiones de un modulo
     *
     * @param string $module - Modulo al cual se le quiere abrir una conexion
     *
     * @return Doctrine_Connection - Conexion
     */
    public function openConections($module = null, $current = false, $beginTransaction = true)
    {
        //Obtengo la configuracion a partir del registro
        $config = Zend_Registry::get('config');
        //Si no se paso el modulo
        if (!$module) {
            //Obtengo el modulo activo
            $module = $config->module_name;
        }
        $doctrineManager = Doctrine_Manager::getInstance();
        try {
            return $doctrineManager->getConnection($module);
        } catch (Doctrine_Manager_Exception $e) {
            $bd = $config->bd->$module;
            try {
                //Se crea una conexion a la BD con los datos del fichero de configuracion.
                $gestor = $bd->gestor;
                $usuario = $bd->usuario;
                $password = $bd->password;
                $host = $bd->host;
                $port = $bd->port;
                $basedatos = $bd->bd;
                $esquema = $bd->esquema;
                if ($port) {
                    $connStr = "$gestor://$usuario:$password@$host:$port/$basedatos";
                } else {
                    $connStr = "$gestor://$usuario:$password@$host/$basedatos";
                }
                /*$connStr = ($port) ? "$gestor://$usuario:$password@$host:$port/$basedatos" :
                "$gestor://$usuario:$password@$host/$basedatos";*/
                if (!$doctrineManager->count()) {
                    $current = true;
                }
                $conn = $doctrineManager->openConnection($connStr, $module, $current);
                //Si el gestor es postgres y se paso un esquema
                if ($gestor == 'pgsql' && $esquema) {
                    //Se inicializa el o los esquemas que utilizara la aplicacion
                    $conn->exec("set search_path=pg_catalog,$esquema;");
                }
                $conn->exec("SET DATESTYLE TO European,SQL;");
                if ($beginTransaction) {
                    $conn->beginTransaction();
                }
                $this->_conections[$module] = array('beginTransaction' => $beginTransaction);
                return $conn;
            } catch (Exception $e) {
                if ($e instanceof Doctrine_Connection_Exception) { //Si se captura una excepcion de conexion  
                    //Se dispara una exception controlada
                    throw new ZendExt_Exception('E014', $e, null);
                } else {
                    throw $e;
                } //Si no se dispara la excepcion no controlada
            }
        }
    }

    /**
     * Salva los modelos de dominio creados o modificados
     *
     * @return void
     */
    public function saveModels()
    {
        $doctrineManager = Doctrine_Manager::getInstance();
        $connections = $doctrineManager->getConnections();
        if (is_array($connections)) {
            foreach ($connections as $connection) {
                $connection->flush();
            }
        }
    }

    public function initModuleConnection()
    {
        $conn = $this->openConections(null, true);
    }

    /**
     * Inicializa la conexion a la base de datos
     *
     * @throws ZendExt_Exception - excepcion declarada en el xml de excepciones
     * @return void
     */
    protected function initConexion()
    {
        //Creo la conexion activa
        $conexion = $this->openConections(null, true);
        //Se guarda en el registro la conexion activa.
        $register = Zend_Registry::getInstance();
        $register->conexion = $conexion;
    }

}
