<?php

class DatTablaMeta extends BaseDatTablaMeta
{
    public function setUp()
    {
        $this->hasMany('DatAtributoTabla', array('local' => 'idtablameta', 'foreign' => 'idtablameta'));
    }

}
