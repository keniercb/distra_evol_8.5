<?php

/**
 * @autor:Daniel Arias Espinosa
 */
class ConfNorma extends BaseConfNorma
{
    public function setUp()
    {
        $this->hasOne('ConfActividad', array('local' => 'idactividad', 'foreign' => 'idactividad'));
        $this->hasOne('NomIndicador', array('local'=> 'idindicador', 'foreign' => 'idindicador'));
    }
}