<?php

class DatIndicadorcliente extends BaseDatIndicadorcliente
{

    public function setUp()
    {
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));

        parent::setUp();
    }
}
