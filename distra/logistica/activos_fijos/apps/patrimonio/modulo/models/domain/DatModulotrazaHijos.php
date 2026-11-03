<?php

/**
 *
 */
class DatModulotrazaHijos extends BaseDatModulotrazaHijos
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatModulotraza', array('local' => 'idmodulotraza', 'foreign' => 'idmodulotraza'));
        $this->hasOne('DatMovRegnumerico', array('local' => 'idmovregnumerico', 'foreign' => 'idmovregnumerico'));
        $this->hasOne('DatRegnumerico', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
    }

}
