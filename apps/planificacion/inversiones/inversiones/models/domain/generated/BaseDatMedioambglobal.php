<?php

abstract class BaseDatMedioambglobal extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_medioambglobal');
        $this->hasColumn(
                'idmedioambglobal', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_medioambglobal')
        );
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddatosnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddatosnomencladorpadre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}