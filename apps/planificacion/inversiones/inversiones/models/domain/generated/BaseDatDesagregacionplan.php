<?php

abstract class BaseDatDesagregacionplan extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_desagregacionplan');
        $this->hasColumn('iddesagregacionplan', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_desagregacionplan'));
        $this->hasColumn('idtrimestre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}
