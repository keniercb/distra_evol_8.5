<?php

/**
 * Clase para la comunicación de las estructuras físicas
 *
 * @author     Omar Antonio Díaz Peña
 * @version    1.0
 * @package    planificacion
 * @subpackage metadatos
 */
class ZendExt_Metadata_Sql_Manager
{
    /**
     * @var ZendExt_Metadata_Sql_PGSQL_Field
     */
    private $_field;

    /**
     * @var ZendExt_Metadata_Sql_PGSQL_Relation
     */
    private $_relation;

    /**
     * @var ZendExt_Metadata_Sql_PGSQL_Table
     */
    private $_table;

    /**
     * @var Doctrine_Connection
     */
    private $_conn;

    /**
     * Retorna un arreglo con los esquemas de la BD actual.
     *
     * @return array
     */
    public function obtenerEsquemas()
    {
        //$conn=Zend_Registry::get('conexion');
        return $this->_conn->execute($this->_table->obtenerEsquemas())->fetchAll();
    }

    public function cargarEsquemasEnArbol()
    {
        return $this->_conn->execute($this->_table->cargarEsquemasEnArbol())->fetchAll();
    }

    public function crearSecuencia($pTabla)
    {
        return $this->_conn->exec($this->_field->crearSecuencia($pTabla));
    }

    public function adicionarCampoALaLlavePrimaria($pTabla)
    {
        return $this->_conn->exec($this->_field->adicionarCampoALaLlavePrimaria($pTabla));
    }

    public function ponerNoNulo($pTabla)
    {
        return $this->_conn->exec($this->_field->ponerNoNulo($pTabla));
    }

    public function crearRelacion($pValue, $pFKName)
    {
        return $this->_conn->exec($this->_relation->crearRelacion($pValue, $pFKName));
    }

    public function ultimaForeignKey($pSchema, $pTable)
    {
        return $this->_conn->execute($this->_relation->ultimaForeignKey($pSchema, $pTable))->fetchAll();
    }

    public function crearFuncionesArbol($pValue)
    {
        return $this->_conn->exec($this->_field->crearFuncionesArbol($pValue));
    }

    public function crearIndiceUnico($pSource, $pTarget)
    {
        return $this->_conn->exec($this->_relation->crearIndiceUnico($pSource, $pTarget));
    }

    public function definirValorPorDefecto($pField, $pValue)
    {
        return $this->_conn->exec($this->_field->definirValorPorDefecto($pField, $pValue));
    }

    public function eliminarSecuencia($pNombre)
    {
        try {
            return $this->_conn->exec($this->_table->eliminarSecuencia($pNombre));
        } catch (Exception $e) {
            $this->log($e);
            return true;
        }
    }

    public function eliminarFuncsArbol($pNombre)
    {
        $treeFunctionsDropSql = $this->_table->eliminarFuncsArbol($pNombre);
        try {
            return $this->_conn->exec($treeFunctionsDropSql);
        } catch (Exception $e) {
            $this->log($e);
            $treeFunctionsDropSqlList = explode(';', $this->_table->eliminarFuncsArbol($pNombre));
            foreach ($treeFunctionsDropSqlList as $treeFunctionDropSql) {
                try {
                    $this->_conn->exec($treeFunctionDropSql);
                } catch (Exception $e) {
                    $this->log($e);
                }
            }
            return true;
        }
    }

    public function eliminarTabla($pTabla)
    {
        try {
            return $this->_conn->exec($this->_table->eliminarTabla($pTabla->esquema, $pTabla->tabla));
        } catch (Exception $e) {
            $this->log($e);
            return true;
        }
    }

    public function adicionarTabla($pEsquema, $pTabla, $pArbol)
    {
        return $this->_conn->exec($this->_table->adicionarTabla($pEsquema, $pTabla, $pArbol));
    }

    public function existeTablaEnEsquema($pEsquema, $pTabla)
    {
        return $this->_conn->execute($this->_table->existeTablaEnEsquema($pEsquema, $pTabla))->fetchAll();
    }

    public function cargarTablasEnArbol($pEsquema)
    {
        return $this->_conn->execute($this->_table->cargarTablasEnArbol($pEsquema))->fetchAll();
    }

    public function adicionarCampo($table, $denominacion, $tipo, $longitud, $permite_nulo, $secuencia, $llave_primaria,$precision)
    {
        return $this->_conn->exec(
            $this->_field->adicionarCampo(
                $table, $denominacion, $tipo, $longitud, $permite_nulo, $secuencia, $llave_primaria, $precision
            )
        );
    }

    public function eliminarCampo($field)
    {
        $this->_conn->exec($this->_field->eliminarCampo($field));
    }

    public function obtenerCamposDeTabla($schema, $table)
    {
        return $this->_conn->execute($this->_field->obtenerCamposDeTabla($schema, $table))->fetchAll();
    }

    public function obtenerPrimaryKeyDeTabla($schema, $table)
    {
        return $this->_conn->execute($this->_field->obtenerPrimaryKeyDeTabla($schema, $table))->fetchAll();
    }

    public function getConnection(
        $name = 'xmetacomponent', $beginTransaction = true, $reference = 'herramientas/xmetacomponent'
    ) {
        $transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
        $configApp = new ZendExt_App_Config();
        $configApp->addBdToConfig($name, $reference);
        return $transactionManager->openConections($name, false, $beginTransaction);
    }

    public function setCurrentConnection($module)
    {
        $doctrineManager = Doctrine_Manager::getInstance();
        $doctrineManager->setCurrentConnection($module);
        $this->_conn = $doctrineManager->getConnection($module);
    }

    public function __construct()
    {
        $module_name = Zend_Registry :: get('config')->module_name;

        $config = Zend_Registry :: get('config')->bd->$module_name;
        $dbms = strtoupper($config->gestor);

        $fieldname = 'ZendExt_Metadata_Sql_' . $dbms . '_Field';
        $tablename = 'ZendExt_Metadata_Sql_' . $dbms . '_Table';
        $relationname = 'ZendExt_Metadata_Sql_' . $dbms . '_Relation';

        $this->_field = new $fieldname ();
        $this->_table = new $tablename ();
        $this->_relation = new $relationname ();

        $this->_conn = $this->getConnection();
    }

    private function log(Exception $e)
    {
        $code = $e->getCode();
        switch ($code) {
            case 42: //No existe tabla o secuencia.
            case 42704: //No existe disparador.
            case 42883: //No existe funcion.
                $log = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
                $log->handle();
                break;

            default:
                throw $e;
        }
    }

}
