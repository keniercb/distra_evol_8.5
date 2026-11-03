<?php

class BaseDatClienteProveedorEspacioTrabajo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.dat_clienteproveedorespaciotrabajo');
        $this->hasColumn('idclienteproveedorespacio', 'decimal', 19, array('notnull' => true, 'sequence' => 'mod_datosmaestros.sec_clienteproveedorespacio', 'primary' => true));
        $this->hasColumn('idestructura', 'decimal', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idespaciotrabajo', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombreespaciotrabajo', 'varchar', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }
} 