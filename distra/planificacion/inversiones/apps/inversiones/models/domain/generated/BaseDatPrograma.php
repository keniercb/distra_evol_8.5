<?php

abstract class BaseDatPrograma extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_programa');
        $this->hasColumn('idprograma', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_programa'));
        $this->hasColumn('iddatosnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}