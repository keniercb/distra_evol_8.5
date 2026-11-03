<?php

/**
 * @class      DatEntregaProducto
 * @package    Farmacia
 * @subpackage Farmacia
 * @author     Daniel Arias espinosa
 * @copyright  XETID
 * @version    1.0
 */
class DatEntregaProducto extends BaseDatEntregaProducto
{
    public function setUp()
    {
        $this->hasOne(
            'DatProductoTarjeta',
            array(
                'local' => 'idproductotarjetamedicamento',
                'foreign' => 'idproductotarjetamedicamento'
            ));
        parent:: setUp();
    }
}