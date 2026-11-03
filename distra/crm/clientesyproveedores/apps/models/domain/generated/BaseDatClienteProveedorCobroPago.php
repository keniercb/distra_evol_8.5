<?php

/**
 * Created by PhpStorm.
 * User: alberto
 * Date: 01/03/2016
 * Time: 2:16
 */
class BaseDatClienteProveedorCobroPago extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_clienteproveedorcobropago');
        $this->hasColumn(
            'idclienteproveedorcobropago', 'decimal', 19,
            array('notnull' => true, 'sequence' => 'mod_datosmaestros.sec_clienteproveedorcobropago', 'primary' => true)
        );
        $this->hasColumn('idcuenta', 'decimal', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('clasificacion', 'decimal', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmoneda', 'decimal', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idclienteproveedor', 'decimal', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'decimal', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idterminodepago', 'decimal', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idoperacionentidad', 'decimal', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }
} 