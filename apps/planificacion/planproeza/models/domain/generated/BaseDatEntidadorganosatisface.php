<?php

abstract class BaseDatEntidadorganosatisface extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planproeza.dat_entidadorganosatisface');
        $this->hasColumn('identidadorganosatisface', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planproeza.sec_entidadorganosatisface'));
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idorganosatisface', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase