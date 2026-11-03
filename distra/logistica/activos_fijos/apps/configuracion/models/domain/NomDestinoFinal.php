<?php

/**
 *
 */
class NomDestinoFinal extends BaseNomDestinoFinal
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatDestinoFinalEntidad', array('local' => 'iddestinofinal', 'foreign' => 'iddestinofinal'));
    }

    /**
     *
     */
    public function getDestinoFinal()
    {
        $query = new Doctrine_Query();
        $query->select('iddestinofinal, denominacion')->from('NomDestinoFinal');

        return $query->fetchArray();
    }

    public function getDestinoFinalById($idDestinoFinal)
    {
        $query = new Doctrine_Query();
        $query->select('iddestinofinal, denominacion')
            ->from('NomDestinoFinal')
            ->where('iddestinofinal', $idDestinoFinal);

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getDestinoFinalHabilitados($iddenom)
    {
        $iddenom = ($iddenom) ? $iddenom : "iddestinofinal";
        $query = new Doctrine_Query();
        $query->select(" c.iddestinofinal as {$iddenom}, c.estado as estado,c.denominacion as denominacion")
            ->from('NomDestinoFinal c')
            ->where('c.estado = 1');

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getDestinoFinalHabilitadosEntidad($idestructura)
    {
        $query = new Doctrine_Query();
        $query->from('NomDestinoFinal c')->innerJoin('c.DatDestinoFinalEntidad ent')->where(
            'c.estado = 1 and ent.idestructuracomun = ?', $idestructura
        );

        return $query->fetchArray();
    }

    public function getNomDestinoFinal($estructura)
    {
        $result = Doctrine_Query::create()
            ->select('c.iddestinofinal,c.denominacion')
            ->from('NomDestinoFinal c')
            ->innerJoin('c.DatDestinoFinalEntidad ce');
        $result->addWhere("ce.idestructuracomun =" . $estructura);
        return $result->fetchArray();
    }

}
