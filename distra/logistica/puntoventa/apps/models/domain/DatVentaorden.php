<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatVentaorden extends BaseDatVentaorden
{

    public function setUp()
    {
        parent::Setup();
        $this->hasOne('DatVenta', array('local' => 'idventas', 'foreign' => 'idventas'));
    }
}
