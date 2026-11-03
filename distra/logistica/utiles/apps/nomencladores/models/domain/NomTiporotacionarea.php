<?php

class NomTiporotacionarea extends BaseNomTiporotacionarea
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTiporotacion', array('local' => 'idtiporotacion', 'foreign' => 'idtiporotacion')
        );
    }

}
