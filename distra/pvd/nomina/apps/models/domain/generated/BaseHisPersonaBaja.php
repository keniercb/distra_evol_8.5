<?php


abstract class BaseHisPersonaBaja extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.his_personabaja');

        $this->hasColumn('idpersonabaja', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_personabaja'
        ));

        $this->hasColumn('tiempoacumuladoinicial', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('importeacumuladoinicial', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
		
		$this->hasColumn('idpersona', 'numeric', 19, array(
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
		
		$this->hasColumn('idplantillanominal', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));


        $this->hasColumn('idcodigocontable', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

    }

    public function setUp(){

        parent::setUp();
		
    }
}
