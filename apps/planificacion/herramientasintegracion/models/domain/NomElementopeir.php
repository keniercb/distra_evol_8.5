<?php

class NomElementopeir extends BaseNomElementopeir
{

    public function setUp()
    {
        parent :: setUp ();
//        $this->hasOne ('NomElementopeir', array ('local' => 'idpadre', 'foreign' => 'idelementopeir'));
//        $this->hasMany ('NomElementopeir', array ('local' => 'idelementopeir', 'foreign' => 'idpadre'));
        $this->hasMany ('NomIndicador', array ('local' => 'idelementopeir', 'foreign' => 'idelementopeir'));
    }

    public function getByid($idelementopeir)
    {
        return Doctrine::getTable('NomElementopeir')->find($idelementopeir)->toArray();
    }


}

