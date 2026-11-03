<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatActividadesFactura extends BaseDatActividadesFactura
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomActividad', array('local' => 'idactividad', 'foreign' => 'idactividad'));
    }
}
