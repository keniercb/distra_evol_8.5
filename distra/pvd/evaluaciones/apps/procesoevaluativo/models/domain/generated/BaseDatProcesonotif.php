<?php

abstract class BaseDatProcesonotif extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.dat_procesonotif');
        $this->hasColumn('idprocesonotif', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_procesonotif'));
        $this->hasColumn('iddefprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('asunto', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('mensaje', 'character varying', 500, array('notnull' => true, 'primary' => false));
        $this->hasColumn('remitente', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('contrasenna', 'character varying', 255, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}