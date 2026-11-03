<?php

/**
 *
 */
class NomColor extends BaseNomColor
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatColorEntidad', array('local' => 'idcolor', 'foreign' => 'idcolor'));
    }

    /**
     *
     */
    public function getColores()
    {
        $query = new Doctrine_Query();
        $query->select('idcolor, denominacion')->from('NomColor');

        return $query->fetchArray();
    }

    public function getColorById($idColor)
    {
        $query = new Doctrine_Query();
        $query->select('idcolor, denominacion')
            ->from('NomColor')
            ->where('idcolor', $idColor);

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getColoresHabilitados($iddenom)
    {
        $iddenom = ($iddenom) ? $iddenom : "idcolor";
        $query = new Doctrine_Query();
        $query->select(" c.idcolor as {$iddenom}, c.estado as estado,c.denominacion as denominacion")
            ->from('NomColor c')
            ->where('c.estado = 1');

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getColoresHabilitadosEntidad($idestructura)
    {
        $query = new Doctrine_Query();
        $query->from('NomColor c')->innerJoin('c.DatColorEntidad ent')->where(
            'c.estado = 1 and ent.idestructuracomun = ?', $idestructura
        );

        return $query->fetchArray();
    }

}
