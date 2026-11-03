<?php

class NomTipoComponente extends BaseNomTipoComponente
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatComponente', array('local' => 'idtipocomponente', 'foreign' => 'idtipocomponente'));
    }

}