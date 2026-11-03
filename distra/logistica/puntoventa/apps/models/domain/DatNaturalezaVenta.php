<?php

class DatNaturalezaVenta extends BaseDatNaturalezaVenta
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatNaturalezaAgrupacion', array('local' => 'idpadre', 'foreign' => 'idnaturalezaagrupacion'));
    }
}
