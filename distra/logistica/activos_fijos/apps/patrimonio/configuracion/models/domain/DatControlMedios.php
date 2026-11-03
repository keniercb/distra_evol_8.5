<?php

class DatControlMedios extends BaseDatControlMedios
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }

}
