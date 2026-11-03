<?php

/**
 * @author      Darien García Tejo
 * @name        ZendExt_Event_DataEventHandler - Manejador de evento para las Trazas.
 * @package     ZendExt.
 * @subpackage  ZendExt_Event
 * @version     1.0
 */
class ZendExt_Event_DataEventHandler
{

    protected $_TablesTrace = array('his_traza',
        'his_accion',
        'his_autentication',
        'his_cierresesion',
        'his_dato',
        'his_excepcion',
        'his_ioc',
        'his_integracion',
        'his_iocexception',
        'his_rendimiento',
        'his_traza',
        'seg_session'
    );

    /**
     * @method createTrace - Crea un contenedor con la traza de datos a salvar.
     * @param array $pArray
     * @return ZendExt_Trace_Container_Data | FALSE
     */
    private function createTrace($pArray)
    {
        $pRecord = $pArray ['objeto'];
        $id = $pArray ['idobjeto'];
        $table = $pArray ['tableName'];
        $sql = "SELECT table_schema FROM information_schema.tables Where table_name = '$table'";
        $transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
        $configApp = new ZendExt_App_Config();
        $configApp->addBdToConfig('reporte', 'reporte');
        $conn = $transactionManager->openConections('reporte');

        $result = $conn->execute($sql)->fetchAll();
        $schema = $result[0][0];

        if ($schema != 'mod_traza') {
            $register = Zend_Registry::getInstance();
            $global = ZendExt_GlobalConcept::getInstance();
            $user = $global->Perfil->usuario;
            $categoria = 2;//($global->Subsistema->idsubsistema) ? $global->Subsistema->idsubsistema : 0;
            $ref = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : "";
            $frontController = Zend_Controller_Front::getInstance();
            $ipReal = ZendExt_App::ipRealPcCliente();
            if ($frontController->getRequest())
                $action = $frontController->getRequest()->getActionName();
            else
                $action = 'index';
            return new ZendExt_Trace_Container_Data(
                $schema, $table, $id, -1, $ref, $user,
                isset($ipReal) ? $ipReal : "", session_id(),$global->Subsistema->denomsubsistema,$categoria,$pRecord
            );
        }

        return false;
    }

    /**
     * @name dataHandler
     * @method dataHandler - Funcion principal que se encarga de manejar los eventos que de disparan.
     *
     * @param array $pArray - Arreglo asociativo que contiene el sql (Query), los parametros (Params),
     * el identificador del objeto (id), la tabla (tableName) y el nombre de la llave primaria (nameId).
     * @return void.
     */
    function dataHandler($pArray)
    {
        $method = "";
        $action = "";
        $action = strtoupper(substr($pArray['Query'], 0, strpos($pArray['Query'], ' ')));
        if ($action == 'INSERT' || $action == 'UPDATE' || $action == 'DELETE')
            $method = ucfirst(strtolower($action));
        if ($method) {
            $tableName = self::extractTableName($pArray['Query'], $method);
            if (!array_intersect(array($tableName), $this->_TablesTrace)) {
                $array = self::parser($pArray, $method);
                $array['tableName'] = $tableName;
                $trace = $this->createTrace($array);
                if ($trace) {
                    $trace->setIdOperacion($array['operacion']);
                    $instance = ZendExt_Trace :: getInstance();
                    $instance->handle($trace);
                }
            }
        }
    }

    /**
     * @name                    - extractTableName
     * @method extractTableName - Retorna el nombre de la tabla a partir del sql.
     *
     * @param String $Query - Sql que se ejecutó.
     * @param String $method - Tipo de sql (INSERT, UPDATE, DELETE).
     * @return String           - Nombre de la tabla a partir del sql.
     */
    private static function extractTableName($Query, $method)
    {
        if ($method == 'Insert') {
            $array = explode(' ', $Query);
            $array = explode('.', $array[2]);
            return (count($array) > 1) ? $array[1] : $array[0];
        } elseif ($method == 'Update') {
            $array = explode(' ', $Query);
            $array = explode('.', $array[1]);
            return (count($array) > 1) ? $array[1] : $array[0];
        } else {
            $array = explode(' ', $Query);
            $array = explode('.', $array[2]);
            return (count($array) > 1) ? $array[1] : $array[0];
        }
    }

    /**
     * @name                 - parser
     * @method parser        - Su funcion principal es servir de fachada según el tipo de método que se ejecuta.
     *
     * @param array $array - Arreglo asociativo.
     * @param String $method - Nombre del método a ejecutar.
     * @return array         - Arreglo asociativo.
     */
    private static function parser($array, $method)
    {
        $methodExc = 'parser' . $method;
        return self::$methodExc($array);
    }

    /**
     * @name                - parserInsert.
     * @method parserInsert - Función que se encarga de parsear el sql INSERT ejecutado para extraer los valores y el nombre de los campos.
     *
     * @param array $array - Arreglo.
     * @return array        - Arreglo.
     */
    private static function parserInsert($array)
    {
        $arrayResult = array();
        $substringCampos = substr($array['Query'], strpos($array['Query'], '(') + 1, strpos($array['Query'], ')'));
        $campos = substr($substringCampos, 0, strpos($substringCampos, ')'));
        $arrayCampos = explode(',', $campos);
        $idobjeto = null;
        foreach ($arrayCampos as $key => $values) {
            $arrayResult[trim($values)] = $array['Params'][$key];
            if (trim($values) == $array['nameId'])
                $idobjeto = $array['Params'][$key];
        }
        return array('objeto' => $arrayResult, 'idobjeto' => $idobjeto, 'operacion' => 1);
    }

    /**
     * @name                - parserUpdate.
     * @method parserUpdate - Función que se encarga de parsear el sql UPDATE ejecutado para extraer los valores y el nombre de los campos.
     *
     * @param array $array - Arreglo.
     * @return array        - Arreglo.
     */
    private static function parserUpdate($array)
    {
        $query = strtolower($array['Query']);
        $arrayResult = array();
        $substringCampos = substr($query, strpos($query, 'set ') + 3, strlen(substr($query, 0, strpos($query, ' where'))));
        $substringCampos = substr($substringCampos, 0, strpos($substringCampos, ' where '));
        $arrayCampos = explode(',', $substringCampos);
        if (count($arrayCampos) > 1)
            foreach ($arrayCampos as $key => $values)
                $arrayResult[substr(trim($values), 0, strpos(trim($values), ' '))] = $array['Params'][$key];
        else
            $arrayResult[substr(trim($arrayCampos[0]), 0, strpos(trim($arrayCampos[0]), ' '))] = $array['Params'][0];
        $idobjeto = null;
        if (isset($array['id'])) {
            foreach ($array['id'] as $id) {
                $idobjeto = $id;
                break;
            }
        }
        return array('objeto' => $arrayResult, 'idobjeto' => $idobjeto, 'operacion' => 2);
    }

    /**
     * @name                - parserUpdate.
     * @method parserUpdate - Crea el objeto a eliminar.
     *
     * @param array $array - Arreglo.
     * @return array        - Arreglo.
     */
    private static function parserDelete($array)
    {
        $arrayResult = array();
        $idobjeto = null;
        if (isset($array['id'])) {
            foreach ($array['id'] as $key => $id) {
                $arrayResult[$key] = $id;
                $idobjeto = $id;
                break;
            }
        }
        return array('objeto' => $arrayResult, 'idobjeto' => $idobjeto, 'operacion' => 3);
    }

}
