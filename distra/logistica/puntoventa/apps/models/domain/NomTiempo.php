<?php

class NomTiempo extends BaseNomTiempo
{

    public function setUp()
    {
        parent::setUp();
        
        $this->hasMany('DatTiempoEntidad', array('local' => 'idtiempo', 'foreign' => 'idtiempo'));
    }
}
