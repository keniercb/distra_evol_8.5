<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class SegUsuarioNomDominio extends BaseSegUsuarioNomDominio
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegUsuario', 
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
    }

    /**
     * @method getUserDomain($idusuario) - Retorna el dominio de un usuario.
     *
     * @param integer $idusuario - Identificador del usuario.
     * @return DoctrineCollection.
     */
    static public function getUserDomain($idusuario)
    {
        return Doctrine_Query::create()->select('s.iddominio')
            ->from('SegUsuarioNomDominio s')
            ->where("s.idusuario = ?", $idusuario)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }
}