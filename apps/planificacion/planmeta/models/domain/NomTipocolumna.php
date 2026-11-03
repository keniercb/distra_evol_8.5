<?php

class NomTipocolumna extends BaseNomTipocolumna
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomTipomodelocolumna',
            array('local' => 'idtipocolumna', 'foreign' => 'idtipocolumna')
        );
    }

}


