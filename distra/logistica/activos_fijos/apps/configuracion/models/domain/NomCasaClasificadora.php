<?php

/**
 *
 */
class NomCasaClasificadora extends BaseNomCasaClasific
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatCasaClasificadoraEntidad', array('local' => 'idcasaclasifc', 'foreign' => 'idcasaclasifc'));
        $this->hasOne('DatRegNumBuque', array('local' => 'idcasaclasifc', 'foreign' => 'idcasaclasifc'));
    }

    /**
     *
     */
    public function getColores()
    {
        $query = new Doctrine_Query();
        $query->select('idcasaclasifc, denominacion')->from('NomCasaClasificadora');

        return $query->fetchArray();
    }

    public function getColorById($idColor)
    {
        $query = new Doctrine_Query();
        $query->select('idcasaclasifc, denominacion')
            ->from('NomCasaClasificadora')
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
        $query->select(" c.idcasaclasifc as {$iddenom}, c.estado as estado,c.denominacion as denominacion")
            ->from('NomCasaClasificadora c')
            ->where('c.estado = 1');

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getColoresHabilitadosEntidad($idestructura)
    {
        $query = new Doctrine_Query();
        $query->from('NomCasaClasificadora c')->innerJoin('c.DatCasaClasificadoraEntidad ent')->where(
            'c.estado = 1 and ent.idestructuracomun = ?', $idestructura
        );

        return $query->fetchArray();
    }

}
