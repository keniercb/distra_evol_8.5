<?php

/**
 * Clase dominio de PgProc.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class PgProc extends BasePgProc
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'PgNamespace', 
            array('local' => 'pronamespace', 'foreign' => 'oid')
        );
    }

    static public function getInformation($conn, $limit, $offset)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select(
            'ns.oid, ns.nspname, p.proowner, p.pronamespace , p.proacl ,'
            . ' p.proname, p.oid'
        )
            ->from('PgProc p')
            ->innerjoin('p.PgNamespace ns ON ns.oid = p.pronamespace')
            ->where(
                "ns.nspname NOT LIKE 'pg_%' "
                . "AND ns.nspname NOT LIKE 'information_%'"
            )
            ->orderby('ns.nspname')
            ->limit($limit)
            ->offset($offset)
            ->execute();
    }

    static public function getCantRecords($conn)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('ns.oid, p.oid')
            ->from('PgProc p')
            ->innerjoin('p.PgNamespace ns ON ns.oid = p.pronamespace')
            ->where(
                "ns.nspname NOT LIKE 'pg_%' AND ns.nspname"
                . " NOT LIKE 'information_%'"
            )
            ->count();
    }

    static public function getInformationByCriteria(
        $conn, $esqSelected, $limit, $offset
    )
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select(
            'ns.oid, ns.nspname, p.proowner, p.pronamespace , p.proacl ,'
            . ' p.proname, p.oid'
        )
            ->from('PgProc p')
            ->innerjoin('p.PgNamespace ns ON ns.oid = p.pronamespace')
            ->where(
                "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
                . "NOT LIKE 'information_%' AND ns.nspname LIKE '$esqSelected%'"
            )
            ->orderby('ns.nspname')
            ->limit($limit)
            ->offset($offset)
            ->execute();
    }

    static public function getCantRecordsByCriteria($conn, $esqSelected)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('ns.oid, p.oid')
            ->from('PgProc p')
            ->innerjoin('p.PgNamespace ns ON ns.oid = p.pronamespace')
            ->where(
                "ns.nspname NOT LIKE 'pg_%' AND ns.nspname "
                . "NOT LIKE 'information_%' AND ns.nspname LIKE '$esqSelected%'"
            )
            ->count();
    }

}