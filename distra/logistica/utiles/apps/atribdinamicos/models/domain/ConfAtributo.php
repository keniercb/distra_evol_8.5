<?php

class ConfAtributo extends BaseConfAtributo
{
    public function setUp()
    {
        $this->hasOne('DatAtribAgrupacion', array('local' => 'idatributo', 'foreign' => 'idatributo'));
        $this->hasMany('DatAtributoTabla', array('local' => 'idatributo', 'foreign' => 'idatributo'));
    }

}
