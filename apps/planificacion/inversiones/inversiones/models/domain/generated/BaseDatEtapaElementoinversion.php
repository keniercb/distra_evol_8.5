<?php

abstract class BaseDatEtapaElementoinversion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_etapaelementoinversion');
        $this->hasColumn('idetapaelementoinversion', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_etapaelementoinversion'));
        $this->hasColumn('idetapainversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}
