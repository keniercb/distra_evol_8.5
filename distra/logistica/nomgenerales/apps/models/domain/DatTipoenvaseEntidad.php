<?php

class DatTipoenvaseEntidad extends BaseDatTipoenvaseEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomTipoenvase', array('local' => 'idtipoenvase', 'foreign' => 'idtipoenvase'));
    }

}
