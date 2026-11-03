<?php

class TempInsnivelesa extends BaseTempInsnivelesa
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador',
            array('local'   => 'iddatosnomenclador','foreign' => 'iddatosnomenclador')
        );
    }
}
