<?php

abstract class BaseDatPeriodoproceso extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.dat_periodoproceso');
        $this->hasColumn('idperiodoproceso', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_periodoproceso'));
        $this->hasColumn('idpreprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('finicioeval', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ffineval', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('planilla', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}