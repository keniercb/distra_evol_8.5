<?php

abstract class BaseDatEvalindicadoresevaluacion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.dat_evalindicadoresevaluacion');
        $this->hasColumn('idindicadorevaluacion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evalindicadoresevaluacion'));
        $this->hasColumn('idindicadorplanilla', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idescala', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('complementotextual', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersonaevaluacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('resultado', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}