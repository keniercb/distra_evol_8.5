<?php

class DatAtributoTabla extends BaseDatAtributoTabla
{
    public function setUp()
    {
        $this->hasMany('DatAtribAgrupacion', array('local' => 'idatribagrupacion', 'foreign' => 'idatribagrupacion'));
        $this->hasMany('DatTablaMeta', array('local' => 'idtablameta', 'foreign' => 'idtablameta'));
    }

}
