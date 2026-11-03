<?php

abstract class BaseDatControlplantiempocontrol extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_controlplantiempocontrol');
        $this->hasColumn('idcontrolplantiempocontrol', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_controlplantiempocontrol'));
        $this->hasColumn('idcontrolplan', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtiempocontrol', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}
