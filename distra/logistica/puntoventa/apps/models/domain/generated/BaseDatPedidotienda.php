<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatPedidotienda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_pedidotienda');
        $this->hasColumn(
            'idpedidotienda', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logpuntoventa.sec_datpedidotienda'
            )
        );
        $this->hasColumn(
            'nropedido', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'beneficiario', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'dirbeneficiario', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'remitente', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'dirremitente', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'codigoregion', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'cibeneficiario', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'ciremitente', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'telbeneficiario', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'telremitente', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'metodopago', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idtransaccion', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechapedido', 'date', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'hora', 'time', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idareaventa', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idreferencia', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idopcomercio', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'motivocancelacion', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idusuariocancela', 'numeric', null,
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
