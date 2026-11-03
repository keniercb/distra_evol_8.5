<?php

class DatMatrizdofa extends BaseDatMatrizdofa
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasOne ('NomAmbitodofa', array ('local' => 'idambitodofa', 'foreign' => 'idambitodofa'));
        $this->hasOne ('DatEstudiomatrizdofa', array ('local' => 'idestudiomatrizdofa', 'foreign' => 'idestudiomatrizdofa'));
        //$this->hasMany ('DatFactor', array ('local' => 'idmatrizdofa', 'foreign' => 'idmatrizdofa'));
    }

    public function getByid($idmatrizdofa)
    {
        return Doctrine::getTable('DatMatrizdofa')->find($idmatrizdofa);
    }

    public function salvarMatrizDofa($obj){
        $obj->save();
        return $obj->idmatrizdofa;
    }


}

