<?php

class DatConfigmostrar extends BaseDatConfigmostrar
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasOne('DatCampo', array('local' => 'idcampo', 'foreign' => 'idcampo'));
    }

}