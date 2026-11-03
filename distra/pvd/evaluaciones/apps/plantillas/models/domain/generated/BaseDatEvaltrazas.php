<?php

abstract class BaseDatEvaltrazas extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.dat_evaltrazas');
        $this->hasColumn('idtraza', 'numeric', null, array('notnull' => true, 'primary' => true));        
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false)); 
        $this->hasColumn('hora', 'time', null, array('notnull' => true, 'primary' => false));		
        $this->hasColumn('idmodelo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => false, 'primary' => false));
    }
    public function Setup() {
        parent::setUp();
    }

}