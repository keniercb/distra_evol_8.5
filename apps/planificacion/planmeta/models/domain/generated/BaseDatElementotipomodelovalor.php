<?php

abstract class BaseDatElementotipomodelovalor extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_elementotipomodelovalor');
        $this->hasColumn('idelementotipomodelovalor', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_elementotipomodelovalor'));
        $this->hasColumn('idelementotipomodelo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtabla', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}
