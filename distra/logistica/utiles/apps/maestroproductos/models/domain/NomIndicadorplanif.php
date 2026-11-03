<?php

class NomIndicadorplanif extends BaseNomIndicadorplanif
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatIndicadorplanifcentrobalance', array('local' => 'idindicador', 'foreign' => 'idindicador'));
    }

}
