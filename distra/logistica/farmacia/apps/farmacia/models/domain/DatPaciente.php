<?php

/**
 * @class      DatProductoTarjeta
 * @package    Farmacia
 * @subpackage Farmacia
 * @author     Daniel Arias espinosa
 * @copyright  XETID
 * @version    1.0
 */
class DatPaciente extends BaseDatPaciente
{

    public function setUp()
    {
        $this->hasOne('DatTarjetaMedicamento', array('local' => 'idpaciente', 'foreign' => 'idpaciente'));
        parent:: setUp();
    }
}