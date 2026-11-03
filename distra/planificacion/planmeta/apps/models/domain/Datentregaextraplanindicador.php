<?php

class Datentregaextraplanindicador extends BaseDatentregaextraplanindicador
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'DatEntregaextraplan',
            array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->hasMany(
            'Nomindicador',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }

}
