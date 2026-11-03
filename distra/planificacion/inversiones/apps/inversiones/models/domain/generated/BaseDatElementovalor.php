<?php

abstract class BaseDatElementovalor extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_elementovalor');
        $this->hasColumn('idelementovalor', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_elementovalor'));
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmonedaentidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

