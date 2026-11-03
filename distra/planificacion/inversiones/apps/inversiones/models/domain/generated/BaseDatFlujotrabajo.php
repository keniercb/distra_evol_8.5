<?php

abstract class BaseDatFlujotrabajo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_flujotrabajo');
        $this->hasColumn('idflujotrabajo', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_flujotrabajo'));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
    }

}

