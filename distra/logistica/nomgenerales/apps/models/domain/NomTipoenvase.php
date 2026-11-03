<?php

class NomTipoenvase extends BaseNomTipoenvase
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatTipoenvaseEntidad', array('local' => 'idtipoenvase', 'foreign' => 'idtipoenvase'));
    }
}
