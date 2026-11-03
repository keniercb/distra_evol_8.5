<?php

abstract class BaseDatElementodoc extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_elementodoc');
        $this->hasColumn('idelementodoc', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_elementodoc'));
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocumentos', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

