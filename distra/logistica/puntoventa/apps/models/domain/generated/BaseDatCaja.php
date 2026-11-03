<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatCaja extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_caja');
        $sequence = 'mod_logpuntoventa.sec_datcaja';
        $this->hasColumn(
            'idcaja', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => $sequence
            )
        );
        $this->hasColumn(
            'idareaventa', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idtipocaja', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'activo', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'consumerkey', 'varchar', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'consumersecret', 'varchar', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'modeloimpresion', 'varchar', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idmodeloimpresion', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idtiporegistradora', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'modelocaja', 'varchar', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'identificador', 'varchar', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'ip', 'varchar', null, array(
                'notnull' => true, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
