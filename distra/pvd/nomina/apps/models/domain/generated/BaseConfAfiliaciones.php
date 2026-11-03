<?php

abstract class BaseConfAfiliaciones extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_afiliacionpolitica');

        $this->hasColumn('idconfafiliacion', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_afiliacionpolitica'
        ));
        
        $this->hasColumn('idafiliacion', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('denominacion', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('tipospagos', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('idformula', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('idformuladevengadototal', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
    }
	
	public function setUp(){

        parent::setUp();

    }
}
