<?php

abstract class BaseConfVariablesReportesCertificaciones extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_variablestiporeportescertificaciones');

        $this->hasColumn('idvariablesconfreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_conf_variablestiporeportescetificaciones'
        ));

        $this->hasColumn('denominacion', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));
		
		$this->hasColumn('tipovalor', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => '1'
        ));
        
        $this->hasColumn('idnomencladorreferencia', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
		
        $this->hasColumn('nivelaplicarvalor', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => '1'
        ));
        
        $this->hasColumn('idconfreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
         	$this->hasColumn('lugaresdecimales', 'numeric', 6, array(
            'type' => 'numeric',
            'length' => 6,
            'notnull' => false,
            'primary' => false,
        ));
		$this->hasColumn('tipovariable', 'numeric', 6, array(
            'type' => 'numeric',
            'length' => 6,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('min', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
        ));
        $this->hasColumn('max', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
        ));
        $this->hasColumn('calculable', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => false,
            'primary' => false,
        ));
        $this->hasColumn('idexpresionmatematica', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('descripcion', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('orden', 'numeric', 10, array(
            'type' => 'numeric',
            'length' => 10,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('calculablehistoriconominasreportes', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => false,
            'primary' => false,
        ));
        $this->hasColumn('idexpresionmatematicahistoriconominasreportes', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('tiposnomina', 'character varying', 500, array(
            'type' => 'character varying',
            'length' => 500,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('idvariablesconfreportescertificacionesreportesanteriores', 'character varying', 19, array(
            'type' => 'character varying',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('idvariablesconfreportescertiicacionesmesinicial', 'character varying', 19, array(
            'type' => 'character varying',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
        ));

    }
	
	public function setUp(){

        parent::setUp();
		
		$this->hasMany('NomVariableAuxiliarFormula', array(
             'local' => 'idvariablesconfreportescertificaciones',
             'foreign' => 'idvariablesconfreportescertificaciones'
        ));
		
		$this->hasMany('NomEstructuraEscalar', array(
             'local' => 'idvariablesconfreportescertificaciones',
             'foreign' => 'idvariablesconfreportescertificaciones'
        ));

        $this->hasMany('ConfReportesCertificaciones', array(
             'local' => 'idconfreportescertificaciones',
             'foreign' => 'idconfreportescertificaciones'
        ));
    }
}