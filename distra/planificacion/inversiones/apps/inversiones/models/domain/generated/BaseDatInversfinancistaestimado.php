<?php

abstract class BaseDatInversfinancistaestimado extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_inversfinancistaestimado');
        $this->hasColumn('idinversfinancistaestimado', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_inversfinancistaestimado'));
        $this->hasColumn('idmonedaentidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfinancista', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

}

