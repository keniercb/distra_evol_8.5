<?php

abstract class BaseConfConceptosporTiposySistemasPago extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_conceptosportiposysistemaspago');

        $this->hasColumn('idconfconceptosportiposysistemaspago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_conf_conceptosportiposysistemaspago'
        ));
        
        $this->hasColumn('idtipopago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('idsistemapago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('idconceptopercepciondescuento', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => '1'
        ));
        
		$this->hasColumn('identidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
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
