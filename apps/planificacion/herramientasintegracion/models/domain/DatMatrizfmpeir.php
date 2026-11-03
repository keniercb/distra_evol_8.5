<?php

class DatMatrizfmpeir extends BaseDatMatrizfmpeir
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasOne('DatElementofuerzamotriz', array('local' => 'idelementofuerzamotriz', 'foreign' => 'idelementofuerzamotriz'));
        $this->hasOne('DatEstudiomatrizfmpeir', array('local' => 'idestudiomatrizfmpeir', 'foreign' => 'idestudiomatrizfmpeir'));
    }

    public function getByid($idmatrizfmpeir)
    {
        return Doctrine::getTable('DatMatrizfmpeir')->find($idmatrizfmpeir)->toArray();
    }


}

