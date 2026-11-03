<?php


abstract class BaseConceptosMontoElaborarPago extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_conceptoelaborarpago');

        $this->hasColumn('idconceptoelaborarpago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_conceptoelaborarpago'
        ));

        $this->hasColumn('monto', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));

        $this->hasColumn('idelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));
		
		$this->hasColumn('idestructuramodelodomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));

        $this->hasColumn('desglosecentcosto', 'character varying', null, array(
            'type' => 'character varying',
            'length' => 19,
            //'notnull' => true,
            'primary' => false,
        ));

    }

    public function setUp(){

        parent::setUp();

    }
}