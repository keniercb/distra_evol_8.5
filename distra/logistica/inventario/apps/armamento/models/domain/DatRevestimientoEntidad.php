<?php

class DatRevestimientoEntidad extends BaseDatRevestimientoEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomRevestimiento', array('local' => 'idrevestimiento', 'foreign' => 'idrevestimiento'));
    }

}


