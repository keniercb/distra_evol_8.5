<?php

abstract class BaseConfReportesCertificaciones extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_tiporeportescertificaciones');

        $this->hasColumn('idconfreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_conf_tiporeportescetificaciones'
        ));

        $this->hasColumn('denominacion', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));
		
		$this->hasColumn('nivel', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => '1'
        ));
        
		$this->hasColumn('obligatorioprocesarlo', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => '1'
        ));
        
		$this->hasColumn('aprobacionelementos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => '1'
        ));
        
		$this->hasColumn('aplicaren', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => '1'
        ));
		
		$this->hasColumn('deresultados', 'numeric', 2, array(
            'type' => 'numeric',
            'length' => 2,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('mesessnc', 'numeric', 2, array(
            'type' => 'numeric',
            'length' => 2,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('tiposeleccionpersonas', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('comportamientoreportesc4', 'numeric',1,array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => false,
            'primary' => false
        ));
        
    }
	
	public function setUp(){

        parent::setUp();
		
		$this->hasMany('NomVariableAuxiliarFormula', array(
             'local' => 'idconfreportescertificaciones',
             'foreign' => 'idconfreportescertificaciones'
        ));
		
		$this->hasMany('NomEstructuraEscalar', array(
             'local' => 'idconfreportescertificaciones',
             'foreign' => 'idconfreportescertificaciones'
        ));
    }
}