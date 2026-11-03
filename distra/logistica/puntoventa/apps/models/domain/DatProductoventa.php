<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatProductoventa extends BaseDatProductoventa
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }
}
