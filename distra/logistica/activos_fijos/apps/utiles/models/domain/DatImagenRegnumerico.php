<?php

/**
 *  Gerardo
 */
class DatImagenRegnumerico extends BaseDatImagenRegnumerico
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatRegnumerico', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
    }

}
