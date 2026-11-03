<?php

abstract class BaseConfVarAuxSNC225 extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_vblesgblesregsaltmpserv');

        $this->hasColumn('idvblesgblesregsaltmpserv', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_vblesgblesregsaltmpserv'
        ));

		$this->hasColumn('idregistsalartiempservc', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('idvariablesconfreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
        ));


        $this->hasColumn('anotaciones', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => false,
            'primary' => false,
        ));

    }
    
    public function setUp(){

        parent::setUp();
        $this->hasMany('ConfVariablesReportesCertificaciones', array(
            'local' => 'idvariablesconfreportescertificaciones',
            'foreign' => 'idvariablesconfreportescertificaciones'
        ));
    }
}
