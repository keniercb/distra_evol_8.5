<?php

abstract class BaseDatClienteProveedorMapa extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.dat_clientesproveedormapa');
        $this->hasColumn('idclientesproveedoresmapa', 'decimal', null, array('notnull' => true, 'sequence' => 'mod_datosmaestros.sec_clientesproveedormapatmp', 'primary' => true));
        $this->hasColumn('idclientesproveedores', 'decimal', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('wkb_geometry', 'geometry', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('minscale', 'decimal', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('maxscale', 'decimal', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('latitud', 'double precision', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('longitud', 'double precision', 100, array( 'notnull' => true, 'primary' => false));
        $this->hasColumn('imagen', 'string', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'decimal', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
