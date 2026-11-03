<?php

/**
 *
 */
class DatModulotraza extends BaseDatModulotraza
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatModulotrazaHijos', array('local' => 'idmodulotraza', 'foreign' => 'idmodulotraza'));
        $this->hasOne('DatMovRegnumerico', array('local' => 'idmovregnumerico', 'foreign' => 'idmovregnumerico'));
        $this->hasOne('DatRegnumerico', array('local' => 'idregistronumerico', 'foreign' => 'idregnumerico'));
    }

}
