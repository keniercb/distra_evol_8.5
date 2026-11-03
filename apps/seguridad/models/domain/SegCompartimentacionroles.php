<?php

/**
 * Clase dominio de SegCompartimentacionroles.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class SegCompartimentacionroles extends BaseSegCompartimentacionroles
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegRol', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
    }

    static public function eliminarRolesDominio($idrol, $iddominio)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('SegCompartimentacionroles')
            ->where('idrol =? and iddominio =?', array($idrol, $iddominio))
            ->execute();
        return;
    }

    static public function cargarRolesDominio($filtroDominio)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('idrol')
            ->from('SegCompartimentacionroles')
            ->where("iddominio = ?", $filtroDominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function cargardominioRoles($idrol)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('iddominio')
            ->from('SegCompartimentacionroles')
            ->where("idrol = ?", $idrol)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

}