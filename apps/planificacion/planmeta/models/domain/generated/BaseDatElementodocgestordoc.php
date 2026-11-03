<?php

abstract class BaseDatElementodocgestordoc extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_elementodocgestordoc');
        $this->hasColumn('idelementodocgestordoc', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_elementodocgestordoc'));
        $this->hasColumn('idetapaelementoinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcontenido', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

