<?php

abstract class BaseDatAccion2 extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_accion');
        $this->hasColumn(
                'idaccion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_accion')
        );
        $this->hasColumn('iddatosnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

   

}