<?php

class NomConservacion extends BaseNomConservacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
                'DatConservacionEntidad', array('local' => 'idconservacion', 'foreign' => 'idconservacion')
        );
    }

}


