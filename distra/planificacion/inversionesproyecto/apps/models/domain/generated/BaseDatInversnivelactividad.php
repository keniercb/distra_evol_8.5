<?php

abstract class BaseDatInversnivelactividad extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_inversnivelactividad');
        $this->hasColumn('idinversnivelactividad', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_inversnivelactividad'));
        $this->hasColumn('idetapainversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idactespcomportamiento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nivelactividadinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}
