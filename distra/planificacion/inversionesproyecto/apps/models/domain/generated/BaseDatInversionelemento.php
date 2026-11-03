<?php

abstract class BaseDatInversionelemento extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_inversionelemento');
        $this->hasColumn(
                'idinversionelemento', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_inversionelemento')
        );
        $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

   

}