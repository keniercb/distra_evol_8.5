<?php

abstract class BaseConfConceptospdFormasySistemasPago extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_conceptospdformasysistemaspago');

        $this->hasColumn('idconfconceptospdformasysistemaspago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_conf_conceptospdformasysistemaspago'
        ));
        
        $this->hasColumn('idconfconceptosportiposysistemaspago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('idperiodopago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('formacalculo', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => '1'
        ));
        
		$this->hasColumn('idexpresionmatematica', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
        	$this->hasColumn('lugaresdecimales', 'numeric', 6, array(
            'type' => 'numeric',
            'length' => 6,
            'notnull' => false,
            'primary' => false,
        ));

    }
	
	public function setUp(){

        parent::setUp();
        
        $this->hasMany('NomPeriodoPago', array(
             'local' => 'idperiodopago',
             'foreign' => 'idperiodopago'
        ));
    }
}
