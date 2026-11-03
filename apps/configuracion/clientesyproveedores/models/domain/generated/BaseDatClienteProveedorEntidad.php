<?php

class BaseDatClienteProveedorEntidad extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.dat_clienteproveedorentidad');
        $this->hasColumn('idclienteproveedorentidad', 'decimal', 19, array('notnull' => true, 'sequence' => 'mod_datosmaestros.sec_clienteproveedorentidad', 'primary' => true));
        $this->hasColumn('idclienteproveedor', 'decimal', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'decimal', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idespaciotrabajo', 'decimal', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('habilitado', 'decimal', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }
} 