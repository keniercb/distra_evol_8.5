<?php
/**
 * Plantilla
 *
 * @package Domain.
 * @subpackage Entity.
 * @copyright UCID
 * @version 1.0
 */
class Plantilla extends DatPlantillaMapper
{
    public function setUp()
    {
        $this->hasMany('PlantillaEstructura', array('local' => 'idplantilla', 'foreign' => 'idplantilla'));
    }
}