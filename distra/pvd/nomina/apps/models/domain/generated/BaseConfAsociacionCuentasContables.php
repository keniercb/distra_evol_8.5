<?php

abstract class BaseConfAsociacionCuentasContables extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_asociacioncuentascontables');

        $this->hasColumn('idasociacioncuentascont', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_asociacioncuentascontables'
        ));
        
        $this->hasColumn('identidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('cuentasdeudoras', 'text', null, array(
            'type' => 'text',
            'length' => null,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('cuentasacreedoras', 'text', null, array(
            'type' => 'text',
            'length' => null,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('idtiponomina', 'numeric', 19, array(
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
    }
	
	public function setUp(){

        parent::setUp();

    }
}
