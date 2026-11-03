<?php

/**
 * @autor:Daniel Arias Espinosa
 */
class DatActividadEntidadTall extends BaseDatActividadEntidadTall
{

    public function setUp()
    {
        $this->hasMany('ConfActividad', array('local' => 'idactividad', 'foreign' => 'idactividad'));
    }
}
