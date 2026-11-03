<?php

abstract class BaseDatEtapainverconsprov extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_etapinverconsprov');
        $this->hasColumn('idetapinverconsprov', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_datdesempenno'));
        $this->hasColumn('idetapainversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddpt', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idconstructor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

