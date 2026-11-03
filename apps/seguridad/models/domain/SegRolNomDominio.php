<?php

/**
 * Clase dominio de SegRolNomDominio.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class SegRolNomDominio extends BaseSegRolNomDominio
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegRol', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
    }

    static public function RolesdelDominio($filtroDominio)
    {
        $query = Doctrine_Query::create();
        $roles = $query->select('DISTINCT (rd.idrol) idrol')
            ->from('SegRolNomDominio rd')
            ->where("rd.iddominio = ?", $filtroDominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $roles;
    }

}