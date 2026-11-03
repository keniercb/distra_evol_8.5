<?php

class NomRevestimiento extends BaseNomRevestimiento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatRevestimientoEntidad', array('local' => 'idrevestimiento', 'foreign' => 'idrevestimiento'));
    }

}

