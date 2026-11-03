<?php

abstract class BaseDatCaracteristica extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_caracteristica');
        $this->hasColumn('idcaracteristica', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_caracteristica'));
        $this->hasColumn('iddatosnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

