<?php

abstract class BaseDatDesagregacionequipoplan extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_desagregacionequipoplan');
        $this->hasColumn('iddesagregacionequipoplan', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_desagregacionequipoplan'));
        $this->hasColumn('iddesagregacionplan', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidadmodelo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}
