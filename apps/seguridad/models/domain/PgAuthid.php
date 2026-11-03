<?php

/**
 * Clase dominio de PgAuthid.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.000
 */
class PgAuthid extends BasePgAuthid
{

    static public function getRolBD($conn, $limit, $start)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select(
            'oid, rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, '
            . 'rolcatupdate, rolpassword, rolcanlogin, rolvaliduntil'
        )
            ->from('PgAuthid')
            ->limit($limit)
            ->offset($start)
            ->execute();
    }

    static public function cantRolBD($conn)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->from('PgAuthid')
            ->count();
    }

    static public function getRolBDbyName($conn, $nombreRol, $limit, $start)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select(
            'oid, rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, '
            . 'rolcatupdate, rolpassword, rolcanlogin, rolvaliduntil'
        )
            ->from('PgAuthid')
            ->where("rolname like '$nombreRol%'")
            ->limit($limit)
            ->offset($start)
            ->execute();
    }

    static public function cantRolBDbyName($conn, $nombreRol)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->from('PgAuthid')
            ->where("rolname like '$nombreRol%'")
            ->count();
    }

    static public function verifyRolBD($conn, $user)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        $result = $query->select('rolcatupdate')
            ->from('PgAuthid')
            ->where("rolname like '$user'")
            ->execute();
        return $result[0]->rolcatupdate;
    }

    static public function getRoles($conn)
    {
        $conn->exec("set search_path = pg_catalog;");
        $query = Doctrine_Query::create();
        return $query->select('oid, rolname')
            ->from('PgAuthid')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

}