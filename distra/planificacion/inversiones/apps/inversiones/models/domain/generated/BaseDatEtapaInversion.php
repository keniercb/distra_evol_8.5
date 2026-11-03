<?php

abstract class BaseDatEtapaInversion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_etapainversion');
        $this->hasColumn('idetapainversion', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_etapainversion'));
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idetapa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestadoft', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

