<?php

abstract class BaseDatDesagregacionindplan extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_desagregacionindplan');
        $this->hasColumn('iddesagregacionindplan', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_desagregacionindplan'));
        $this->hasColumn('idnomotrosindicadores', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddesagregacionplan', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}