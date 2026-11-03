<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class SegCompartimentacionusuario extends BaseSegCompartimentacionusuario
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegUsuario', 
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
    }

    static public function eliminarUsuarioDominio($idusuario, $iddominio)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('SegCompartimentacionusuario')
            ->where(
                'idusuario =? and iddominio =?', 
                array($idusuario, $iddominio)
            )
            ->execute();
        return;
    }

    static public function cargardominioUsuario($idusuario)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('iddominio')
            ->from('SegCompartimentacionusuario')
            ->where("idusuario = ?", $idusuario)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

}