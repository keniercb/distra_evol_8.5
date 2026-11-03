<?php
/**
 * PlantillaEstructura
 *
 * @package Domain.
 * @subpackage Entity.
 * @copyright UCID
 * @version 1.0
 */
class PlantillaEstructura extends DatPlantillaEstructuraMapper
{
    public function setUp()
    {
        $this->hasOne('Plantilla', array('local' => 'idplantilla', 'foreign' => 'idplantilla'));
    }
}