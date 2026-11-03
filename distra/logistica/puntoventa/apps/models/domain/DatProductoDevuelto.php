<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0/
 */
class DatProductoDevuelto extends BaseDatProductoDevuelto
{
    public function Setup()
    {
        parent::setUp();
        $this->hasOne('DatDevolucion', array('local' => 'iddevolucion', 'foreign' => 'iddevolucion'));
    }
}
