<?php

class NomTipoObra extends BaseNomTipoObra
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatTipoObraEntidad', array('local' => 'idtipoobra', 'foreign' => 'idtipoobra'));

    }
}
