<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatDevolucion extends BaseDatDevolucion
{
    public function Setup()
    {
        parent::setUp();
        $this->hasMany('DatVenta', array('local' => 'idventas', 'foreign' => 'idventas'));
        $this->hasMany('DatProductoDevuelto', array('local' => 'iddevolucion', 'foreign' => 'iddevolucion'));
    }
}
