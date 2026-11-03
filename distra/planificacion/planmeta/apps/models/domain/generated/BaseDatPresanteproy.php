<?php

abstract class BaseDatPresanteproy extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_presanteproy');
        $this->hasColumn('idpresanteproy', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_presanteproy'));
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmonedaentidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

