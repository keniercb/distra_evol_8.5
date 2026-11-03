<?php

abstract class BaseDatEvalmodelo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.dat_evalmodelo');
        $this->hasColumn('idmodelo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denom', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idplanilla', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idescala', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idexpresionmatematica', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}
?>