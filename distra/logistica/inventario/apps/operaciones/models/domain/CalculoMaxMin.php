<?php

/**
 * @class      ConfInventario
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0
 */
class CalculoMaxMin extends BaseCalculoMaxMin
{

    public function setUp()
    {
        parent:: setUp();
        /* $this->hasOne(
            'DatProductoLogistica', array('local' => 'idprodcalculomaxmin', 'foreign' => 'idproducto')
        );*/
    }

}
