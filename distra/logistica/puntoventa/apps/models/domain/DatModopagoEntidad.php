<?php

class DatModopagoEntidad extends BaseDatModopagoentidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomModopago', array('local' => 'idmodopago', 'foreign' => 'idmodopago'));
    }
}
