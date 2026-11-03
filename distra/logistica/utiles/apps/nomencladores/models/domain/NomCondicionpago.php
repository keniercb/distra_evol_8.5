<?php

class NomCondicionpago extends BaseNomCondicionpago
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatCondicionpagoEntidad', array('local'=>'idcondicionpago','foreign'=>'idcondicionpago')); 
    }

    public function devolverCondicionpagoEntidad($idestructura)
    {
        $query = new Doctrine_Query();
        $query->select('nc.idcondicionpago, nc.denominacion, nc.pordefecto')
            ->from('NomCondicionpago nc')
            ->innerJoin('nc.DatCondicionpagoEntidad dce')
            ->where("dce.idestructuracomun =?", $idestructura);
        return $query->fetchArray();
    }
}