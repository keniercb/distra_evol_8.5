<?php

abstract class BaseDatFichacosto extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_fichacosto');
        $this->hasColumn(
                'idfichacosto', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_spouam.sec_fichacosto')
        );
        $this->hasColumn(
                'idnaturaleza', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
 
    }

    public function Setup() {
        parent::setUp();
    }

}
