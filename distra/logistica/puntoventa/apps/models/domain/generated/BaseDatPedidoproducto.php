<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatPedidoproducto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_pedidoproducto');
        $this->hasColumn(
            'idproductopedido', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logpuntoventa.sec_datpedidoproducto'
            )
        );
        $this->hasColumn(
            'idpedidotienda', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'codreferencia', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idproducto', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'cantidad', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'precio', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'importe', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idumedida', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'enproceso', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'procesado', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'devuelto', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'devolver', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'cantidadreal', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'preciounitario', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'addmod', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idusuarioaddmod', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
