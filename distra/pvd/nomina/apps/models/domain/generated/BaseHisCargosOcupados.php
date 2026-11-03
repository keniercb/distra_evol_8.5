<?php

abstract class BaseHisCargosOcupados extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.his_cargosocupados');
        $this->hasColumn('idhiscargosocupados', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_hiscargosocupados'
        ));
		$this->hasColumn('idpersona', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));        
		$this->hasColumn('idcargo', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,            
        ));
        $this->hasColumn('identidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('fecharegistro', 'date', null, array(
            'type' => 'date',
            'notnull' => true,
            'primary' => false,
			'default' => 'now()'
        ));
        $this->hasColumn('fechaaplicacion', 'date', null, array(
            'type' => 'date',
            'notnull' => true,
            'primary' => false,
			'default' => 'now()'
        ));
        $this->hasColumn('fechavencimiento', 'date', null, array(
            'type' => 'date',
            'length' => null,
            'notnull' => false,
            'primary' => false			
        ));
        $this->hasColumn('observaciones', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => false,
            'primary' => false			
        ));
        $this->hasColumn('idsituacionlaboral', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false			
        ));
        $this->hasColumn('idcajacajero', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => 1		
        ));
        $this->hasColumn('idcentrocosto', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false			
        ));
        $this->hasColumn('idpersonacuentabancariamn', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false			
        ));
        $this->hasColumn('idpersonacuentabancariacuc', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false			
        ));
        $this->hasColumn('numerocontable', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false			
        ));
        $this->hasColumn('idplantillanominal', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false			
        ));
    }
}
