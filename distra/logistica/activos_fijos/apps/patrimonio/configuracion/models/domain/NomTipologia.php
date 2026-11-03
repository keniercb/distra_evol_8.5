<?php

class NomTipologia extends BaseNomTipologia
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatTipologiaEntidad', array('local' => 'idtipologia', 'foreign' => 'idtipologia'));

    }
}
