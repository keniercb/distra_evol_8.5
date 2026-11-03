<?php

class DatCondicionpagoEntidad extends BaseDatCondicionpagoEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomCondicionpago', array('local' => 'idcondicionpago', 'foreign' => 'idcondicionpago'));
    }

}
