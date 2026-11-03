<?php

/**
 *
 */
class NomBandera extends BaseNomBandera
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatBanderaEntidad', array('local' => 'idbandera', 'foreign' => 'idbandera'));
        $this->hasOne('DatRegNumBuque', array('local' => 'idbandera', 'foreign' => 'idbandera'));
    }

    /**
     *
     */
    public function getColores()
    {
        $query = new Doctrine_Query();
        $query->select('idbandera, denominacion')->from('NomBandera');

        return $query->fetchArray();
    }

    public function getColorById($idColor)
    {
        $query = new Doctrine_Query();
        $query->select('idbandera, denominacion')
            ->from('NomBandera')
            ->where('idbandera', $idColor);

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getColoresHabilitados($iddenom)
    {
        $iddenom = ($iddenom) ? $iddenom : "idcolor";
        $query = new Doctrine_Query();
        $query->select(" c.idbandera as {$iddenom}, c.estado as estado,c.denominacion as denominacion")
            ->from('NomBandera c')
            ->where('c.estado = 1');

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getColoresHabilitadosEntidad($idestructura)
    {
        $query = new Doctrine_Query();
        $query->from('NomBandera c')->innerJoin('c.DatBanderaEntidad ent')->where(
            'c.estado = 1 and ent.idestructuracomun = ?', $idestructura
        );

        return $query->fetchArray();
    }

}
