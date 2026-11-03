<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatPrefacturacmpto extends BaseDatPrefacturacmpto
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatElementosFactura', array('local' => 'idelementofactura', 'foreign' => 'idelementofactura')
        );
        if (class_exists('DatMovimientos')) {
            $this->hasOne(
                'DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
            );
        }
    }
}
