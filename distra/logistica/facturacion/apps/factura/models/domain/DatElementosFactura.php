<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatElementosFactura extends BaseDatElementosFactura
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDocfactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        $this->hasOne(
            'DatPrefacturacmpto', array('local' => 'idelementofactura', 'foreign' => 'idelementofactura')
        );
        $this->hasMany(
            'DatProdServicios', array('local' => 'idelementofactura', 'foreign' => 'idelementofactura')
        );
        $this->hasMany(
            'DatElementocategoria', array('local' => 'idelementofactura', 'foreign' => 'idelementofactura')
        );
        $this->hasMany(
            'DatDesgloselemento', array('local' => 'idelementofactura', 'foreign' => 'idelementofactura')
        );
    }
}
