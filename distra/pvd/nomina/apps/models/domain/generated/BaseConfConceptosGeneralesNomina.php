<?php

abstract class BaseConfConceptosGeneralesNomina extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_conceptosgeneralesnomina');

        $this->hasColumn('idconfconceptosgeneralesnomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_conf_conceptosgeneralesnomina'
        ));
        
        $this->hasColumn('idsistemapago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

		$this->hasColumn('idconceptorm', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('idexpresionmatematica', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('identidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('idtipopago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('calcularpluriempleo', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('calcularperiodomensual', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('lugaresdecimales', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => true,
            'primary' => false
        ));
    }
	
	public function setUp(){

        parent::setUp();
		
		$this->hasMany('NomSistemaPago', array(
             'local' => 'idsistemapago',
             'foreign' => 'idsistemapago'
        ));
        
		$this->hasMany('NomConceptoRM', array(
             'local' => 'idconceptorm',
             'foreign' => 'idconceptorm'
        ));
    }
}
