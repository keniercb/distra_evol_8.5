<?php

class DatRecetaActividad extends BaseDatRecetaActividad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatActividad', array('local' => 'idactividad', 'foreign' => 'idactividad'));
        $this->hasMany('NomReceta', array('local' => 'idreceta', 'foreign' => 'idreceta')); //hasMany
    }

}
