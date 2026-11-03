<?php

abstract class BaseDatcuenca extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_cuenca');
        $this->hasColumn(
                'idcuenca', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_cuenca')
        );
        $this->hasColumn('iddatosnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

   

}