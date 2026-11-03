<?php

class TempInsindicadorplan extends BaseTempInsindicadorplan
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador',
            array('local'   => 'iddatosnomenclador',
                  'foreign' => 'iddatosnomenclador')
        );
    }

}
