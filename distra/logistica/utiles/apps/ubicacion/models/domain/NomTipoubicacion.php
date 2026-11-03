<?php

class NomTipoubicacion extends BaseNomTipoubicacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatTipoubicacionEntidad', array('local' => 'idtipoubicacion', 'foreign' => 'idtipoubicacion'));
        $this->hasOne('NomCampostipoubicacion', array('local' => 'idtipoubicacion', 'foreign' => 'idtipoubicacion'));
        $this->hasMany('DatEstructuraubicacion', array('local' => 'idtipoubicacion', 'foreign' => 'idtipoubicacion'));
    }

}




