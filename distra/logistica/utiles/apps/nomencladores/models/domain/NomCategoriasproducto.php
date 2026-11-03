<?php

class NomCategoriasproducto extends BaseNomCategoriasproducto
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatCategoriasproductoEntidad',
            array('local' => 'idcategoria', 'foreign' => 'idcategoria')
        );
    }

    public function devolverCategoriasEntidad($idestructura)
    {
        $query = new Doctrine_Query();
        $query->select('nc.idcategoria, nc.denominacion')
            ->from('NomCategoriasproducto nc')
            ->innerJoin('nc.DatCategoriasproductoEntidad dce')
            ->where("dce.idestructuracomun =?", $idestructura);
        return array('datos'    => $query->fetchArray(),
                     'cantidad' => $query->count());
    }
}