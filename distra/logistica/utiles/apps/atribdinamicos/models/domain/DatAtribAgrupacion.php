<?php

class DatAtribAgrupacion extends BaseDatAtribAgrupacion
{
    public function setUp()
    {
        $this->hasMany('ConfAgrupacion', array('local' => 'idagrupacion', 'foreign' => 'idagrupacion'));
        $this->hasMany('ConfAtributo', array('local' => 'idatributo', 'foreign' => 'idatributo'));
        $this->hasMany('DatAtributoTabla', array('local' => 'idatribagrupacion', 'foreign' => 'idatribagrupacion'));
    }

}
