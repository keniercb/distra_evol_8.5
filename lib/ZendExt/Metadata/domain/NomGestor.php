<?php

class NomGestor extends BaseNomGestor
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomTipoDato', array('local'    => 'idgestor', 'foreign' => 'idtipodato',
                                 'refClass' => 'NomTipoDatoNomGestor')
        );
    }

}