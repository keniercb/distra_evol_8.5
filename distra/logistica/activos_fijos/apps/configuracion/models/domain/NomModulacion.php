<?php

/**
 *
 */
class NomModulacion extends BaseNomModulacion
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatModulacionEntidad', array('local' => 'idmodulacion', 'foreign' => 'idmodulacion'));
    }

    /**
     *
     */
    public function getColores()
    {
        $query = new Doctrine_Query();
        $query->select('idmodulacion, denominacion')->from('NomModulacion');

        return $query->fetchArray();
    }

    public function getColorById($idColor)
    {
        $query = new Doctrine_Query();
        $query->select('idmodulacion, denominacion')
            ->from('NomModulacion')
            ->where('idmodulacion', $idColor);

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getColoresHabilitados($iddenom)
    {
        $iddenom = ($iddenom) ? $iddenom : "idmodulacion";
        $query = new Doctrine_Query();
        $query->select(" c.idmodulacion as {$iddenom}, c.estado as estado,c.denominacion as denominacion")
            ->from('NomModulacion c')
            ->where('c.estado = 1');

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getColoresHabilitadosEntidad($idestructura)
    {
        $query = new Doctrine_Query();
        $query->from('NomModulacion c')->innerJoin('c.DatModulacionEntidad ent')->where(
            'c.estado = 1 and ent.idestructuracomun = ?', $idestructura
        );

        return $query->fetchArray();
    }

}
