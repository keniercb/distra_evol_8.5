<?php

class BaseDatClienteProveedorLinea extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.dat_clienteproveedorlinea');
        $this->hasColumn('idclienteproveedorlinea', 'decimal', 19, array('notnull' => true, 'sequence' => 'mod_datosmaestros.sec_datclienteproveedorlinea', 'primary' => true));
        $this->hasColumn('idlinea', 'decimal', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipolinea', 'decimal', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idclienteproveedor', 'decimal', 19, array('notnull' => false, 'primary' => false));
    }


    public function setUp() {
        parent::setUp();
    }
} 