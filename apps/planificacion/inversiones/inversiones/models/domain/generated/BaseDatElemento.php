<?php

abstract class BaseDatElemento extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_elemento');
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_elemento'));
        $this->hasColumn('idetapa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('documento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('parametrosdinamicos', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 50, array('notnull' => false, 'primary' => false));
    }

}
