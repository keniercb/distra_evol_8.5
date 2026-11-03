<?php

abstract class BaseDatBahia extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_bahia');
        $this->hasColumn(
                'idbahia', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_bahia')
        );
        $this->hasColumn('iddatosnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

   

}