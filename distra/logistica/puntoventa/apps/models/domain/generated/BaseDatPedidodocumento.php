<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatPedidodocumento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_pedidodocumento');
        $this->hasColumn(
            'idpedidodocumento', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logpuntoventa.sec_datpedidodocumento'
            )
        );
        $this->hasColumn(
            'idpedido', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'iddocumento', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'tipo', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}
