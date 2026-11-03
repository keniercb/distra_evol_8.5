<?php

class Nomclasificacionabc extends BaseNomclasificacionabc
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('Confdefinicionpeso', array('local' => 'idclasificacionabc', 'foreign' => 'idclasificacionabc'));

    }

    public function obtenerClasificacionABC()
    {
        $q = new Doctrine_Query();
        return $q->from('Nomclasificacionabc')->orderBy('idclasificacionabc')->execute()->toArray();
    }


}
