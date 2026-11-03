<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class BaseDatProductoDevuelto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_productodevolucion');
        $sequence = 'mod_logpuntoventa.sec_productodevolucion';
        $this->hasColumn(
            'idproductodevolucion', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => $sequence
            )
        );
        $this->hasColumn(
            'idproducto', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'iddevolucion', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'cantidadcomprada', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'precioventa', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'recargo', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'descuento', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'importe', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'cantidaddevolver', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
