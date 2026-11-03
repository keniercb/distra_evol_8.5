<?php

class NomTipoDato extends BaseNomTipoDato
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomGestor', array('local' => 'idtipodato', 'foreign' => 'idgestor', 'refClass' => 'NomTipoDatoNomGestor')
        );
    }

}