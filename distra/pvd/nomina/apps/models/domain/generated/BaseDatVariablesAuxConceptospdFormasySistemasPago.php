<?php

abstract class BaseDatVariablesAuxConceptospdFormasySistemasPago extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_variableauxconceptospdformasysistemaspago');

        $this->hasColumn('idvariableauxconceptospdformasysistemaspago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_dat_variableauxconceptospdformasysistemaspago'
        ));

		$this->hasColumn('idconfconceptospdformasysistemaspago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('denominacion', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('formaentrada', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => '1'
        ));
        
        $this->hasColumn('idconfreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => null
        ));
        
        $this->hasColumn('idvariablesconfreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => null
        ));
        
        $this->hasColumn('lugaresdecimalesvariable', 'numeric', 6, array(
            'type' => 'numeric',
            'length' => 6,
            'notnull' => false,
            'primary' => false,
        ));
        
    }
    
    public function setUp(){

        parent::setUp();
		
		$this->hasMany('ConfConceptospdFormasySistemasPago', array(
             'local' => 'idconfconceptospdformasysistemaspago',
             'foreign' => 'idconfconceptospdformasysistemaspago'
        ));
        
		$this->hasMany('ConfReportesCertificaciones', array(
             'local' => 'idconfreportescertificaciones',
             'foreign' => 'idconfreportescertificaciones'
        ));
        
        $this->hasMany('ConfVariablesReportesCertificaciones', array(
             'local' => 'idvariablesconfreportescertificaciones',
             'foreign' => 'idvariablesconfreportescertificaciones'
        ));
    }
}
