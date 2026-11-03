<?php

/**
 * Clase dominio de DatServidorDatGestorDatBdDatEsquema.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatServidorDatGestorDatBdDatEsquema 
extends BaseDatServidorDatGestorDatBdDatEsquema
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatServidorDatGestorDatBd', 
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasOne(
            'DatServidorDatGestorDatBd', 
            array('local' => 'idgestor', 'foreign' => 'idgestor')
        );
        $this->hasOne(
            'DatServidorDatGestorDatBd',
            array('local' => 'idbd', 'foreign' => 'idbd')
        );
        $this->hasOne(
            'DatEsquema', 
            array('local' => 'idesquema', 'foreign' => 'idesquema')
        );
    }

    static public function comprobarbdesquema($idservidor, $idgestor, $idbd)
    {
        $query = Doctrine_Query::create();
        $cant = $query->from('DatServidorDatGestorDatBdDatEsquema u')
            ->where(
                "u.idservidor = ? and u.idgestor =? and u.idbd =?", 
                array($idservidor, $idgestor, $idbd)
            )
            ->count();
        return $cant;
    }

    static public function eliminarbd($idservidor, $idgestor, $idbd)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatServidorDatGestorDatBdDatEsquema u')
            ->where(
                "u.idservidor = ? and u.idgestor =? and u.idbd =?", 
                array($idservidor, $idgestor, $idbd)
            )
            ->execute();
        return true;
    }

    static public function eliminaresq($idserv, $idgestor, $idbd, $idesquema)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatServidorDatGestorDatBdDatEsquema u')
            ->where(
                "u.idservidor = ? and u.idgestor =? and u.idbd =?  "
                . "and u.idesquema =?", 
                array($idserv, $idgestor, $idbd, $idesquema)
            )
            ->execute();
        return true;
    }

    static public function obtenercantnomgesquema($idesquema)
    {
        $query = Doctrine_Query::create();
        $cant = $query->from('DatServidorDatGestorDatBdDatEsquema u')
            ->where("u.idesquema =?", $idesquema)
            ->count();
        return $cant;
    }

}