<?php

class NomIndicadorhoja extends BaseNomIndicadorhoja
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne(
            'NomIndicadorplanif', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }

}
