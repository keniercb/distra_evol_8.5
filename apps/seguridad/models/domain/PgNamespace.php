<?php

/**
 * Clase dominio de PgNamespace.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class PgNamespace extends BasePgNamespace
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'PgClass',
            array('local' => 'oid', 'foreign' => 'relnamespace')
        );
        $this->hasMany(
            'PgProc', 
            array('local' => 'oid', 'foreign' => 'pronamespace')
        );
    }

    static public function getInformation($conn, $criterio, $limit, $offset)
    {
        $conn->exec("set search_path = pg_catalog;");
        if ($criterio == 'Sequences')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='S'";
        if ($criterio == 'Tables')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='r'";
        if ($criterio == 'Views')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='v'";
        $query = Doctrine_Query::create();
        return $query->select(
            'ns.oid, ns.nspname, cl.relname, cl.relowner, cl.relacl, '
            . 'cl.relname name'
        )
            ->from('PgClass cl')
            ->innerjoin('cl.PgNamespace ns ON ns.oid = cl.relnamespace')
            ->where($where)
            ->orderby('ns.nspname')
            ->limit($limit)
            ->offset($offset)
            ->execute();
    }

    static public function getCantRecords($conn, $criterio)
    {
        $conn->exec("set search_path = pg_catalog;");
        if ($criterio == 'Sequences')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='S'";
        if ($criterio == 'Tables')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='r'";
        if ($criterio == 'Views')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='v'";
        $query = Doctrine_Query::create();
        return $query->select(
            'ns.oid, ns.nspname, cl.relname, cl.relacl permisos, '
            . 'cl.relname name'
        )
            ->from('PgClass cl')
            ->innerjoin('cl.PgNamespace ns ON ns.oid = cl.relnamespace')
            ->where($where)
            ->count();
    }

    static public function getInformationSchemas($conn, $limit, $offset)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('ns.oid, ns.nspname, ns.nspowner, ns.nspacl')
            ->from('PgNamespace ns')
            ->where(
                "ns.nspname NOT LIKE 'pg_%' "
                . "AND ns.nspname NOT LIKE 'information_%'"
            )
            ->orderby('ns.nspname')
            ->limit($limit)
            ->offset($offset)
            ->execute();
    }

    static public function getRecordsSchemas($conn)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('ns.oid, ns.nspname name, ns.nspowner, ns.nspacl')
            ->from('PgNamespace ns')
            ->where(
                "ns.nspname NOT LIKE 'pg_%' "
                . "AND ns.nspname NOT LIKE 'information_%'"
            )
            ->orderby('ns.nspname')
            ->count();
    }

    static public function getInformationByCriteria(
        $conn, $criterio, $esqSelected, $limit, $offset
    )
    {
        $conn->exec("set search_path = pg_catalog;");
        if ($criterio == 'Sequences')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='S' "
            . "AND ns.nspname LIKE '$esqSelected%'";
        if ($criterio == 'Tables')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='r' "
            . "AND ns.nspname LIKE '$esqSelected%'";
        if ($criterio == 'Views')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='v' "
            . "AND ns.nspname LIKE '$esqSelected%'";
        $query = Doctrine_Query::create();
        return $query->select(
            'ns.oid, ns.nspname, cl.relname, '
            . 'cl.relowner, cl.relacl, cl.relname name'
        )
            ->from('PgClass cl')
            ->innerjoin('cl.PgNamespace ns ON ns.oid = cl.relnamespace')
            ->where($where)
            ->orderby('ns.nspname')
            ->limit($limit)
            ->offset($offset)
            ->execute();
    }

    static public function getCantRecordsByCriteria(
        $conn, $criterio, $esqSelected
    )
    {
        $conn->exec("set search_path = pg_catalog;");
        if ($criterio == 'Sequences')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='S' "
            . "AND ns.nspname LIKE '$esqSelected%'";
        if ($criterio == 'Tables')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='r' "
            . "AND ns.nspname LIKE '$esqSelected%'";
        if ($criterio == 'Views')
            $where = "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
            . "NOT LIKE 'information_%' AND cl.relkind ='v' "
            . "AND ns.nspname LIKE '$esqSelected%'";
        $query = Doctrine_Query::create();
        return $query->select(
            'ns.oid, ns.nspname, cl.relname, cl.relacl permisos, '
            . 'cl.relname name'
        )
            ->from('PgClass cl')
            ->innerjoin('cl.PgNamespace ns ON ns.oid = cl.relnamespace')
            ->where($where)
            ->count();
    }

    static public function getInformationSchemasByCriteria(
        $conn, $esqSelected, $limit, $offset
    )
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('ns.oid, ns.nspname, ns.nspowner, ns.nspacl')
            ->from('PgNamespace ns')
            ->where(
                "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
                . "NOT LIKE 'information_%' AND ns.nspname LIKE '$esqSelected%'"
            )
            ->orderby('ns.nspname')
            ->limit($limit)
            ->offset($offset)
            ->execute();
    }

    static public function getRecordsSchemasByCriteria($conn, $esqSelected)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('ns.oid, ns.nspname name, ns.nspowner, ns.nspacl')
            ->from('PgNamespace ns')
            ->where(
                "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
                . "NOT LIKE 'information_%' AND ns.nspname LIKE '$esqSelected%'"
            )
            ->orderby('ns.nspname')
            ->count();
    }

}