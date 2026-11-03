<?php

class DatMovmoneda extends BaseDatMovmoneda
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        if (class_exists('NomMoneda')) {
            $this->hasMany('NomMoneda', array('local' => 'idmoneda', 'foreign' => 'idmoneda'));
        }
    }

}
