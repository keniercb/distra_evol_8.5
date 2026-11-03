<?php

abstract class BaseDatElementoInversion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_elementoinversion');
        $this->hasColumn('idelementoinversion', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_elementoinversion'));
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idetapa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('parametrodinamico', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcontenido', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

