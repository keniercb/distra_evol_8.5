<?php

class DatDatosnomencladordatosnomenclador
    extends BaseDatDatosnomencladordatosnomenclador
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador', array('local'   => 'iddatosnomenclador',
                                         'foreign' => 'iddatosnomencladorpadre')
        );
        $this->hasOne(
            'NomDatosnomenclador', array('local'   => 'iddatosnomenclador',
                                         'foreign' => 'iddatosnomencladorhijo')
        );
    }

}