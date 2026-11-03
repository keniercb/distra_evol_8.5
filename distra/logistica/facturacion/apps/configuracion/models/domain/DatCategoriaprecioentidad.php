<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatCategoriaprecioentidad extends BaseDatCategoriaprecioentidad
{
    public function Setup()
    {
        parent::Setup();
        $this->hasOne(
            'DatCuentadesgloceprecio',
            array(
                'local'   => 'idcategoriaprecioentidad',
                'foreign' => 'idcategoriaprecioentidad'
            )
        );
    }
}
