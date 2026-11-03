<?php

abstract class BaseNomNomencladorReferencia extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.nom_nomencladorreferencia');

        $this->hasColumn('idnomencladorreferencia', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_nom_nomencladoresreferencia'
        ));

        $this->hasColumn('denominacion', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('esquematabla', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));
        
        $this->hasColumn('campomostrar', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));
        
        $this->hasColumn('llavecampomostrar', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));
        
        $this->hasColumn('condicioncampomostrar', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));
        		
		$this->hasColumn('tiponomenclador', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => '1'
        ));
        
    }
	
	public function setUp(){

        parent::setUp();
		
		$this->hasMany('NomEstructuraEscalar', array(
             'local' => 'idnomencladorreferencia',
             'foreign' => 'idnomencladorreferencia'
        ));
    }
}