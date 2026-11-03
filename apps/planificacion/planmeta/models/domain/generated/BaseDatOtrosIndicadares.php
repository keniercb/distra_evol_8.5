<?php

abstract class BaseDatOtrosIndicadares extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_otrosindicadares');
        $this->hasColumn('iddatotrosindicadares', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_datotrosindicadares'));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnomotrosindicadores', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ejecutado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estimado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('plan', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('proyeccion', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}