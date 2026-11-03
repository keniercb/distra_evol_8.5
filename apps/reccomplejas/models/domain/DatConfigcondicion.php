<?php

class DatConfigcondicion extends BaseDatConfigcondicion
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasOne('DatCampo', array('local' => 'idcampo', 'foreign' => 'idcampo'));
    }


}

