<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatServidorDatGestorDatBd extends BaseDatServidorDatGestorDatBd
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatGestorDatServidorbd',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasOne(
            'DatGestorDatServidorbd', 
            array('local' => 'idgestor', 'foreign' => 'idgestor')
        );
        $this->hasOne('DatBd', array('local' => 'idbd', 'foreign' => 'idbd'));
        $this->hasMany(
            'DatServidorDatGestorDatBdDatEsquema',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasMany(
            'DatServidorDatGestorDatBdDatEsquema', 
            array('local' => 'idgestor', 'foreign' => 'idgestor')
        );
        $this->hasMany(
            'DatServidorDatGestorDatBdDatEsquema', 
            array('local' => 'idbd', 'foreign' => 'idbd')
        );
    }

    static public function comprobargestorbd($idservidor, $idgestor)
    {
        $query = Doctrine_Query::create();
        $cantFndes = $query->from('DatServidorDatGestorDatBd b')
            ->where(
                "b.idservidor = ? and b.idgestor = ?",                 
                array($idservidor, $idgestor)
            )
            ->count();
        return $cantFndes;
    }

    static public function eliminarbd($idservidor, $idgestor, $idbd)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatServidorDatGestorDatBd u')
            ->where(
                "u.idservidor = ? and u.idgestor =? and u.idbd =?",
                array($idservidor, $idgestor, $idbd)
            )
            ->execute();
        return true;
    }

    static public function obtenercantnombd($idbd)
    {
        $query = Doctrine_Query::create();
        $cant = $query->from('DatServidorDatGestorDatBd u')
            ->where("u.idbd =?", $idbd)
            ->count();
        return $cant;
    }

}