<?php

class DatRecursoRegNumericoActivo extends BaseDatRecursoRegNumericoActivo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatRegnumericoActivo', array('local' => 'idregnumericoactivo', 'foreign' => 'idregnumerico'));
    }

}
