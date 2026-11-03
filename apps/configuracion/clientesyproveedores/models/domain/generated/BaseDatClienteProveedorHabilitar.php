<?php

/**
 * Created by PhpStorm.
 * User: alberto
 * Date: 01/03/2016
 * Time: 2:16
 */
class BaseDatClienteProveedorHabilitar extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_clienteproveedor_habilitar');
        $this->hasColumn(
            'idclienteproveedorhabilitar', 'decimal', 19,
            array('notnull' => true, 'sequence' => 'mod_datosmaestros.sec_clienteproveedorhabilitar', 'primary' => true)
        );
        $this->hasColumn('idusuario', 'decimal', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('argumento', 'string', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idclienteproveedorentidad', 'decimal', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }
} 