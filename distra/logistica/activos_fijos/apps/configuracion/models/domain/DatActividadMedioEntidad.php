<?php

/**
 *
 */
class DatActividadMedioEntidad extends BaseDatActividadMedioEntidad
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomActividadMedio', array('local' => 'idactividad', 'foreign' => 'idactividad'));
    }

}
