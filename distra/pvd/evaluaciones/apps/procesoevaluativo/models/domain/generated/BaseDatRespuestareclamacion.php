<?php

abstract class BaseDatRespuestareclamacion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.dat_respuestareclamacion');
        $this->hasColumn('idrespuestareclamacion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.seq_respuestareclamacion'));
        $this->hasColumn('idreclamacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnivelreclamacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idresponsable', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('procede', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('respuesta', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}