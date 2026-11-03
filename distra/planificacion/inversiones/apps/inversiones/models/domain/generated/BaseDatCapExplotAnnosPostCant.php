<?php

abstract class BaseDatCapExplotAnnosPostCant extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_capexplotannospostcant');
        $this->hasColumn('idcapexplotannospostcant', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_capexplotannospostcant'));
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddatcapexplotacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}