<?php

abstract class BaseDatFinanciamiento extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_financiamiento');
        $this->hasColumn('idfinanciamiento', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_financiamiento'));
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipofinanciamiento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfinancista', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmonedaentidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('porcientointeres', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('plazoamortizacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('gracia', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

