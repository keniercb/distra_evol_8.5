<?php

abstract class BaseDatCartatecindustrial extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifindustrial.dat_cartatecindustrial');
        $this->hasColumn('idcartatecindustrial', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planifindustrial.sec_cartatecindustrial'));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => true, 'primary' => false));

        $this->hasColumn('idaprobacion', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 1));
        $this->hasColumn('idindicadorsalida', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
    }

    public function Setup() {
        parent::setUp();
    }

}
