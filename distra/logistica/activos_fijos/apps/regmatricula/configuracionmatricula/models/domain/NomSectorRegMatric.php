<?php

class NomSectorRegMatric extends BaseNomSectorRegMatric
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatSectorRegMatricEntidad', array('local' => 'idsector', 'foreign' => 'idsector'));
    }

}
