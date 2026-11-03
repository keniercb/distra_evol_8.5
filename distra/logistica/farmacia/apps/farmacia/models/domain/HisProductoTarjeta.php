<?php

/**
 * @class      DatProductoTarjeta
 * @package    Farmacia
 * @subpackage Farmacia
 * @author     Daniel Arias espinosa
 * @copyright  XETID
 * @version    1.0
 */
class HisProductoTarjeta extends BaseHisProductoTarjeta
{

    public function setUp()
    {
        $this->hasOne('DatDocumento', array('local' => 'idtarjetamedicamento', 'foreign' => 'iddocumento'));
        parent:: setUp();
    }
}