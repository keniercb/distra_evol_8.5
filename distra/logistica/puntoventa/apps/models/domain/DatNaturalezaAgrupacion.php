<?php

class DatNaturalezaAgrupacion extends BaseDatNaturalezaAgrupacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatNaturalezaVenta', array('local' => 'idnaturalezaagrupacion', 'foreign' => 'idpadre'));
    }
}
