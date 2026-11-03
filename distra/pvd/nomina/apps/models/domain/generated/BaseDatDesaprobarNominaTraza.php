<?php

abstract class BaseDatDesaprobarNominaTraza extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_desaprobarnominatraza');

        $this->hasColumn('iddesaprobarnominatraza', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_desaprobarnominatraza'
        ));
        
        $this->hasColumn('descripcion', 'character varying', 500, array(
            'type' => 'character varying',
            'length' => 500,
            'notnull' => false,
            'primary' => false
        ));
        
        $this->hasColumn('usuario', 'character varying', 50, array(
            'type' => 'character varying',
            'length' => 50,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('fecha', 'timestamp', null, array(
            'type' => 'timestamp',
            'length' => null,
            'notnull' => false,
            'primary' => false
        ));
        
        $this->hasColumn('idelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
		
		$this->hasColumn('accion', 'character varying', 50, array(
            'type' => 'character varying',
            'length' => 50,
            'notnull' => false,
            'primary' => false
        ));
		
		$this->hasColumn('nombreapellidos', 'character varying', 50, array(
            'type' => 'character varying',
            'length' => 50,
            'notnull' => false,
            'primary' => false
        ));
		
		$this->hasColumn('tipo', 'numeric', 2, array(
            'type' => 'numeric',
            'length' => 2,
            'notnull' => false,
            'primary' => false
        ));
        
    }
}
