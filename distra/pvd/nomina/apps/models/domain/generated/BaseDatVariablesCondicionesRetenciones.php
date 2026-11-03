<?php

abstract class BaseDatVariablesCondicionesRetenciones extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_variablescondicionesretenciones');

        $this->hasColumn('idvariablescondicionesretenciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_nomina.sec_dat_variablescondicionesretenciones'
        ));
		
		$this->hasColumn('denominacion', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));

         $this->hasColumn('formaentrada', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
         $this->hasColumn('idvariablesconfreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
         $this->hasColumn('idconfreportescertificaciones', 'numeric', 19, array(
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
