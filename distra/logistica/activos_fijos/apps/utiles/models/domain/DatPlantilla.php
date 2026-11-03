<?php

/**
 *
 */
class DatPlantilla extends BaseDatPlantilla
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatRegnumericoActivo', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
    }

}
