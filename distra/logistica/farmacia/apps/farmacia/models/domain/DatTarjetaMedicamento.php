<?php

/**
 * @class      TarjetaMedicamento
 * @package    Farmacia
 * @subpackage Farmacia
 * @author     Daniel Arias espinosa
 * @copyright  XETID
 * @version    1.0
 */
class DatTarjetaMedicamento extends BaseDatTarjetaMedicamento
{

    public function setUp()
    {
        $this->hasOne('DatDocumento', array('local' => 'idtarjetamedicamento', 'foreign' => 'iddocumento'));
        parent:: setUp();
    }
}