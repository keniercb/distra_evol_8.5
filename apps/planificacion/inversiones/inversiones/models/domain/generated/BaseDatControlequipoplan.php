<?php

abstract class BaseDatControlequipoplan extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_controlequipoplan');
        $this->hasColumn('idcontrolequipoplan', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_controlequipoplan'));
        $this->hasColumn('idcontrolplantiempocontrol', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidadmodelo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}
