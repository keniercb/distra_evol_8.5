<?php

/**
 * @class      DatRegistroTarjeta
 * @package    Farmacia
 * @subpackage Farmacia
 * @author     Daniel Arias espinosa
 * @copyright  XETID
 * @version    1.0
 */
class DatRegistroTarjeta extends BaseDatRegistroTarjeta
{

    public function setUp()
    {
        $this->hasOne('DatTarjetaMedicamento', array('local' => 'idtarjetamedicamento', 'foreign' => 'idtarjetamedicamento'));
        parent:: setUp();
    }
}