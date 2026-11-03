<?php

class NomTipotransfinternaarea extends BaseNomTipotransfinternaarea
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipotransfinterna', array('local' => 'idtipotransfinterna', 'foreign' => 'idtipotransfinterna')
        );
    }

}
