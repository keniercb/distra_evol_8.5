<?php

abstract class BaseDatControlindplan extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_controlindplan');
        $this->hasColumn('idcontrolindplan', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_controlindplan'));
        $this->hasColumn('idcontrolplantiempocontrol', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnomotrosindicadores', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}