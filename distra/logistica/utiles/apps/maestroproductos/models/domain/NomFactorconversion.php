<?php

class NomFactorconversion extends BaseNomFactorconversion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('NomUnidadmedida', array('local' => 'idunidadmedida', 'foreign' => 'idunidadmedida'));
    }

}
