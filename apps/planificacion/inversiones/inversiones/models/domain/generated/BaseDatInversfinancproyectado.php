<?php

abstract class BaseDatInversfinancproyectado extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_inversfinancproyectado');
        $this->hasColumn('idplaninversfinancproyectado', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_planinversfinancproyectado'));
        $this->hasColumn('idmonedaentidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipofinanciamiento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

}

