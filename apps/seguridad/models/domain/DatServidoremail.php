<?php

/**
 * @name DatServidoremail - Clase dominio de servidores de correo.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatServidoremail extends BaseDatServidoremail
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatServidor',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
    }
    /*
     *
     */
    static function getServidoremailData($idservidor)
    {
        $query = Doctrine_Query::create();
        $result = $query->select(
            's.idservidor,s.denominacion, s.ip, a.usuario, '
            . 'a.password, a.fqdn, a.puerto'
        )
            ->from('DatServidoremail a')
            ->innerjoin('a.DatServidor s')
            ->where("a.idservidor = ?", $idservidor)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

}