<?php

class NomEdades extends BaseNomEdades
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatEdadesEntidad', array('local' => 'idnomedades', 'foreign' => 'idnomedades')
        );

    }

}




