<?php

/**
 *
 */
class NomCategoriaTransp extends BaseNomCategoriaTransp
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
    public function getCategoriaTransp()
    {
        $query = new Doctrine_Query();
        $query->select('idcategoriatransp, denominacion')->from('NomCategoriaTransp');
        return $query->fetchArray();
    }

    public function getCategoriaTranspById($idcategoria)
    {
        $query = new Doctrine_Query();
        $query->select('idcategoria, denominacion')
            ->from('NomCategoriaTransp')
            ->where('idcategoria', $idcategoria);

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getCategoriaTranspHabilitados($iddenom)
    {
        $iddenom = ($iddenom) ? $iddenom : "idcategoria";
        $query = new Doctrine_Query();
        $query->select(" c.idcategoria as {$iddenom}, c.estado as estado,c.denominacion as denominacion")
            ->from('NomCategoriaTransp c')
            ->where('c.estado = 1');

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getCategoriaTraspHabilitadosEntidad($idestructura)
    {
        $query = new Doctrine_Query();
        $query->from('NomCategoriaTransp c')->innerJoin('c.DatCategoriaTranspEntidad ent')->where(
            'c.estado = 1 and ent.idestructuracomun = ?', $idestructura
        );

        return $query->fetchArray();
    }

}
