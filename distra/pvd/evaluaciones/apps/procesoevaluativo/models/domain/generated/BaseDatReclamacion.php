<?php

abstract class BaseDatReclamacion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.dat_reclamacion');
        $this->hasColumn('idreclamacion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_reclamacion'));
        $this->hasColumn('idpersonaevaluacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('opinion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}