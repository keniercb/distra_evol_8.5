<?php

abstract class BaseDatElementotipomodelo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_elementotipomodelo');
        $this->hasColumn('idelementotipomodelo', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_elementotipomodelo'));
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipomodelo', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}
