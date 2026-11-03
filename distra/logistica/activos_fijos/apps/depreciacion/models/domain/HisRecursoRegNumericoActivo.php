<?php

class HisRecursoRegNumericoActivo extends BaseHisRecursoRegNumericoActivo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatRegnumericoActivo', array('local' => 'idregnumericoactivo', 'foreign' => 'idregnumerico'));
    }

}
