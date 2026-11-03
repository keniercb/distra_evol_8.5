<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatVentaproducto extends BaseDatVentaproducto
{

    public function setUp()
    {
        parent::Setup();

        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatCaja', array('local' => 'idcaja', 'foreign' => 'idcaja'));
        $this->hasOne('DatVenta', array('local' => 'idventas', 'foreign' => 'idventas'));
    }
}
