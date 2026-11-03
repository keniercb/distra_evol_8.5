<?php

abstract class BaseDatEvalindicadorescalculado extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.dat_evalindicadorescalculado');
        $this->hasColumn('idindicadorcalculado', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_evalindicadorescalculado'));
        $this->hasColumn('idindicadorplanilla', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idexpresionmatematica', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}