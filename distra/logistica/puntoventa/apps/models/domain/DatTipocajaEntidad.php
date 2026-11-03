<?php

class DatTipocajaEntidad extends BaseDatTipocajaentidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomTipocaja', array('local' => 'idtipocaja', 'foreign' => 'idtipocaja'));
    }
}
