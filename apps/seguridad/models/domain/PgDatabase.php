<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class PgDatabase extends BasePgDatabase
{

    static public function getPgsqlDatabases($conn)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('datname')
            ->from('PgDatabase')
            ->whereNotIn('datname', array('template0', 'template1', 'postgres'))
            ->execute();
    }

    static public function getInformationDatabases($conn, $limit, $start)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('datname, datdba, oid, datacl')
            ->from('PgDatabase')
            ->whereNotIn('datname', array('template0', 'template1', 'postgres'))
            ->limit($limit)
            ->offset($start)
            ->execute();
    }

    static public function getRecordsDatabases($conn)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('datname, datdba, oid, datacl')
            ->from('PgDatabase')
            ->whereNotIn('datname', array('template0', 'template1', 'postgres'))
            ->count();
    }

    static public function getInformationDatabasesByCriteria(
        $conn, $esqSelected, $limit, $offset
    )
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('datname, datdba, oid, datacl')
            ->from('PgDatabase')
            ->where("datname LIKE '$esqSelected%'")
            ->whereNotIn('datname', array('template0', 'template1', 'postgres'))
            ->limit($limit)
            ->offset($offset)
            ->execute();
    }

    static public function getRecordsDatabasesByCriteria($conn, $esqSelected)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('datname, datdba, oid, datacl')
            ->from('PgDatabase')
            ->where("datname LIKE '$esqSelected%'")
            ->whereNotIn('datname', array('template0', 'template1', 'postgres'))
            ->count();
    }

}