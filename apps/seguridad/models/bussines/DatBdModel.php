<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatBdModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function insertarnombd($instance)
    {
        $instance->save();
    }

    public function modificarnombd($instance)
    {
        $instance->save();
    }

    public function eliminarnombd($instance)
    {
        $instance->delete();
    }

    public static function estaHabilitadaDeteccionCambiosBD()
    {
        $cantTablasTrigger = DatBd::obtenerCantTablasTriggersDeteccionCambiosBD();
        if ($cantTablasTrigger)
            return array('success' => true, 'datos' => array(0 => array('estaHabilitadaDeteccionCambiosBD' => true)));
        else
            return array('success' => true, 'datos' => array(0 => array('estaHabilitadaDeteccionCambiosBD' => false)));
    }

    public static function habilitarDeteccionCambiosBD()
    {
        $manager = Doctrine_Manager::getInstance();
        $query = DatBd::obtenerQueryCrearTriggers() . ' CREATE EXTENSION IF NOT EXISTS adminpack;';

        try {

            $datos = $manager->getCurrentConnection()->getOptions();
            $arrDatos = explode(':', $datos['dsn']);
            $gestor = $arrDatos[0];
            $arrDatos = explode(';', $arrDatos[1]);
            $puerto = 5432;
            foreach($arrDatos as $name){
                $n = explode('=', $name);

                switch ($n[0]){
                    case 'host':
                        $host = $n[1];
                        break;
                    case 'dbname':
                        $basedatos = $n[1];
                        break;
                    case 'port':
                        $puerto = $n[1];
                        break;
                }

            }

            $usuario = $datos['username'];
            $password = $datos['password'];


            $connStr = "$gestor://$usuario:$password@$host:$puerto/$basedatos";

            $conn = $manager->openConnection($connStr, 'db_check_integrity', false);
            $conn->exec("SET DATESTYLE TO European,SQL;");
            $conn->exec($query);
            $conn->close();

            //$manager->getCurrentConnection()->exec($query);
        } catch (Exception $e) {
            throw new ZendExt_Exception("SEGINTEGRIDADBD02");
        };
        /*-*/
        //$GLOBALS['changeDbDetect'] = true;
        /*+<*/
        $register = Zend_Registry::getInstance();
        $array = array('skipExtends' => true, 'allowModifications' => true);
        $config = new Zend_Config_Ini($register->config->security_config, null, $array);

        $config->BDIntegrity->changeDbDetect = "1";
        $arrayFile = array(
            'config' => $config,
            'filename' => $register->config->security_config
        );
        $writer = new Zend_Config_Writer_Ini($arrayFile);
        try {
            $writer->write();
        } catch (Exception $exception) {
            throw new ZendExt_Exception('SEGINTEGRIDAD06', $exception);
        }
        /*+>*/
        return array('success' => true, 'msgId' => 'infHabChequeoIBD');
    }

    public static function deshabilitarDeteccionCambiosBD()
    {
        $query = DatBd::obtenerQuerysEliminarTriggers();
        try {
            $manager = Doctrine_Manager::getInstance();

            $datos = $manager->getCurrentConnection()->getOptions();
            $arrDatos = explode(':', $datos['dsn']);
            $gestor = $arrDatos[0];
            $arrDatos = explode(';', $arrDatos[1]);
            $puerto = 5432;
            foreach($arrDatos as $name){
                $n = explode('=', $name);

                switch ($n[0]){
                    case 'host':
                        $host = $n[1];
                        break;
                    case 'dbname':
                        $basedatos = $n[1];
                        break;
                    case 'port':
                        $puerto = $n[1];
                        break;
                }

            }

            $usuario = $datos['username'];
            $password = $datos['password'];


            $connStr = "$gestor://$usuario:$password@$host:$puerto/$basedatos";

            $conn = $manager->openConnection($connStr, 'db_check_integrity', false);
            $conn->exec("SET DATESTYLE TO European,SQL;");
            $conn->exec($query);
            $conn->close();

            //$manager->getCurrentConnection()->exec($query);
        } catch (Exception $e) {
            throw new ZendExt_Exception("SEGINTEGRIDADBD03");
        };
        /*-*/
        //$GLOBALS['changeDbDetect'] = false;
        /*+<*/
        $register = Zend_Registry::getInstance();
        $array = array('skipExtends' => true, 'allowModifications' => true);
        $config = new Zend_Config_Ini($register->config->security_config, null, $array);

        $config->BDIntegrity->changeDbDetect = "0";
        $arrayFile = array(
            'config' => $config,
            'filename' => $register->config->security_config
        );
        $writer = new Zend_Config_Writer_Ini($arrayFile);
        try {
            $writer->write();
        } catch (Exception $exception) {
            throw new ZendExt_Exception('SEGINTEGRIDAD06', $exception);
        }
        /*+>*/


        return array('success' => true, 'msgId' => 'infDesChequeoIBD');
    }

    public static function validarSuperUsuarioBD()
    {
        $cnx = Doctrine_Manager::getInstance()->connection();
        $cnxOpciones = $cnx->getOptions();
        $sql = "SELECT rolsuper AS issuper FROM pg_authid WHERE rolname='{$cnxOpciones['username']}';";
        try {
            $result = $cnx->fetchOne($sql);
        } catch (Exception $e) {
            throw new ZendExt_Exception("SEGEXPORTARBD01");
        }
        if (!$result) {
            throw new ZendExt_Exception("SEGEXPORTARBD02");
        }
        return;
    }

    public static function validarCrearBDUsuarioBD()
    {
        $cnx = Doctrine_Manager::getInstance()->connection();
        $cnxOpciones = $cnx->getOptions();
        $sql = "SELECT rolcreatedb AS cancreatedb FROM pg_authid WHERE rolname='{$cnxOpciones['username']}';";
        try {
            $result = $cnx->fetchOne($sql);
        } catch (Exception $e) {
            throw new ZendExt_Exception("SEGEXPORTARBD01");
        }
        if (!$result) {
            throw new ZendExt_Exception("SEGIMPORTARBD07");
        }
        return;
    }

    public static function exportarBaseDatosMT()
    {
        $objMsg = new stdClass();
        $objMsg->msgCod = 1;
        $cnx = Doctrine_Manager::getInstance()->connection();
        $cnxOpciones = $cnx->getOptions();
        $fecha = new DateTime();
        $fecha = $fecha->format('YmdHis');
        $dirPgDump = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos($_SERVER['DOCUMENT_ROOT'], 'web')) .
            'lib' . DIRECTORY_SEPARATOR . 'pg' . DIRECTORY_SEPARATOR;
        $dsn = explode(";", $cnxOpciones['dsn']);
        $dsn = str_replace(array("pgsql:host=", "port=", "dbname="), "", $dsn);
        $dir = '/tmp/';
        $fichero = "{$dsn[2]}_{$fecha}.backup";
        try {
            $version = $cnx->fetchOne("SELECT setting FROM pg_settings WHERE name = 'server_version';");
        } catch (Exception $e) {
            throw new ZendExt_Exception("SEGEXPORTARBD05");
        }
        $version = explode(' ', $version);
        $version = explode('.', $version[0]);

        $comando = "cd '{$dirPgDump}' && ./pg_dump-{$version[0]}{$version[1]} --dbname=postgresql://{$cnxOpciones['username']}:{$cnxOpciones['password']}@{$dsn[0]}:{$dsn[1]}/{$dsn[2]} -Z9 -Fc -f {$dir}{$fichero} -b --column-inserts --inserts -v -E UTF8";
        exec($comando, $output, $returnVar);
        if (0 != $returnVar) {
            throw new ZendExt_Exception("SEGEXPORTARBD03");
        }

        $comando = "cd {$dir} && zip -9 {$fichero}.zip {$fichero}";
        exec($comando, $datos, $returnVar);
        if (0 != $returnVar) {
            throw new ZendExt_Exception("SEGEXPORTARBD04");
        }

        $objMsg->filename = "{$fichero}.zip";
        return $objMsg;
    }

    public static function importarBaseDatosMT1($nombreTrozo, $nombreOriginal, $accion)
    {
        set_time_limit(0);
        if ($accion == 'subirfichero') {
            return FicheroperacionModel::subirArchivoGrande($nombreOriginal, $nombreTrozo);
        } elseif ($accion == 'descomprimir') {
            return FicheroperacionModel::descomprimirFichero($nombreOriginal);
        } elseif ($accion == 'importar') {
            return self::importarBaseDatosMT2($nombreOriginal);
        }
        return;
    }

    private static function importarBaseDatosMT2($nombreFichero)
    {
        set_time_limit(0);
        $objMsg = new stdClass();
        $objMsg->msgCod = 1;
        $nombreSinZip = explode(".zip", $nombreFichero)[0];

        $cnx = Doctrine_Manager::getInstance()->connection();
        $cnxOpciones = $cnx->getOptions();
        /*-*/
        //$integBD = $GLOBALS['changeDbDetect'];

        /*+<*/
        $register = Zend_Registry::getInstance();
        $configBDIntegrity = new Zend_Config_Ini($register->config->security_config, "BDIntegrity");
        $integBD = $configBDIntegrity->changeDbDetect;
        /*+>*/
        $dsn = explode(";", $cnxOpciones['dsn']);
        $dsn = str_replace(array("pgsql:host=", "port=", "dbname="), "", $dsn);
        $fecha = new DateTime();
        $fecha = $fecha->format('YmdHis');
        $cnxDoctrine = "pgsql://{$cnxOpciones['username']}:{$cnxOpciones['password']}@{$dsn[0]}:{$dsn[1]}/{$dsn[2]}";
        $cnxStr = "host={$dsn[0]} port={$dsn[1]} dbname=postgres user={$cnxOpciones['username']} password={$cnxOpciones['password']}";
        $dirPgRestore = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos($_SERVER['DOCUMENT_ROOT'], 'web')) . 'lib' . DIRECTORY_SEPARATOR . 'pg' . DIRECTORY_SEPARATOR;
        try {
            $version = $cnx->fetchOne("SELECT setting FROM pg_settings WHERE name = 'server_version';");
        } catch (Exception $e) {
            throw new ZendExt_Exception("SEGEXPORTARBD05");
        }
        $version = explode(' ', $version);
        $version = explode('.', $version[0]);

        $dbconn = pg_connect($cnxStr);
        if (false === $dbconn)
            throw new ZendExt_Exception("SEGIMPORTARBD01");

        $comando = "CREATE DATABASE \"{$dsn[2]}_{$fecha}\" WITH ENCODING='UTF8' OWNER=\"{$cnxOpciones['username']}\" CONNECTION LIMIT=-1;";
        $respuesta = pg_query($dbconn, $comando);
        if (false === $respuesta)
            throw new ZendExt_Exception("SEGIMPORTARBD02");

        $comando = "cd '{$dirPgRestore}' && ./pg_restore-{$version[0]}{$version[1]} -s -v --dbname='postgresql://{$cnxOpciones['username']}:{$cnxOpciones['password']}@{$dsn[0]}:{$dsn[1]}/{$dsn[2]}_{$fecha}' /tmp/{$nombreSinZip}";
        exec($comando, $output, $returnVar);
        if (0 != $returnVar)
            throw new ZendExt_Exception("SEGIMPORTARBD03");

        $comando = "cd '{$dirPgRestore}' && ./pg_restore-{$version[0]}{$version[1]} -a -v --disable-triggers --dbname='postgresql://{$cnxOpciones['username']}:{$cnxOpciones['password']}@{$dsn[0]}:{$dsn[1]}/{$dsn[2]}_{$fecha}' /tmp/{$nombreSinZip}";
        exec($comando, $datos, $returnVar);
        if (0 != $returnVar)
            throw new ZendExt_Exception("SEGIMPORTARBD04");

        $fecha1 = new DateTime();
        $fecha1 = $fecha1->format('YmdHis');
        Doctrine_Manager::resetInstance();

        $comando = "ALTER DATABASE \"{$dsn[2]}\" RENAME TO \"{$dsn[2]}_{$fecha1}\";";
        $respuesta = pg_query($dbconn, $comando);
        if (false == $respuesta) {
            Doctrine_Manager::getInstance()->openConnection($cnxDoctrine);
            throw new ZendExt_Exception("SEGIMPORTARBD05");
        }

        $comando = "ALTER DATABASE \"{$dsn[2]}_{$fecha}\" RENAME TO \"{$dsn[2]}\";";
        $respuesta = pg_query($dbconn, $comando);
        if (false == $respuesta) {
            Doctrine_Manager::getInstance()->openConnection($cnxDoctrine);
            throw new ZendExt_Exception("SEGIMPORTARBD06");
        }

        pg_close($dbconn);
        Doctrine_Manager::getInstance()->openConnection($cnxDoctrine);
        new DatBdModel();
        if ($integBD === "1")
            DatBDModel::habilitarDeteccionCambiosBD();
        else
            DatBDModel::deshabilitarDeteccionCambiosBD();

        return $objMsg;
    }

}