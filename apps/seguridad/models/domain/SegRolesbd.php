<?php

/**
 * Clase dominio de SegRolesbd.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class SegRolesbd extends BaseSegRolesbd
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatSistemaDatServidores', 
            array('local' => 'idrolbd', 'foreign' => 'idrolbd')
        );
    }

    static public function exist($rolname, $idservidor, $idgestor)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('idrolbd')
            ->from('SegRolesbd')
            ->where(
                "nombrerol =? and idservidor =? and idgestor =?", 
                array($rolname, $idservidor, $idgestor)
            )
            ->execute();
        return $result;
    }

    static public function deleteRol($idrolesbd)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('SegRolesbd')
            ->where("idrolbd =?", $idrolesbd)->execute();
    }

    static public function loadRoleBD($idservidor, $idgestor)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('idrolbd id,nombrerol rolname')
            ->from('SegRolesbd')
            ->where(
                "idservidor =? AND idgestor =?", array($idservidor, $idgestor)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function deleteRoles($arrayDelete)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('SegRolesbd')
            ->whereIn('nombrerol', $arrayDelete)
            ->execute();
    }

    static public function getRolInformation($arrayReturn)
    {
        $query = Doctrine_Query::create();
        return $query->select('idrolbd id,nombrerol rolname')
            ->from('SegRolesbd')
            ->whereIn('nombrerol', $arrayReturn)
            ->execute();
    }

    static public function getRolesOracle($idservidor, $idgestor)
    {
        $query = Doctrine_Query::create();
        return $query->select('nombrerol,idrolbd')
            ->from('SegRolesbd')
            ->where("idservidor=$idservidor")
            ->addWhere("idgestor=$idgestor")
            ->execute()
            ->toArray();
    }

}