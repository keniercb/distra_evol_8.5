<?php

abstract class BaseDatConsecutivosNominaPorPagos extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_consecutivosnominaporpagos');

        $this->hasColumn('idelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            //'sequence' => 'mod_nomina.sec_dat_elaborarpagos'
        ));

         $this->hasColumn('consecutivo', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

         $this->hasColumn('anno', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

    }

    public function setUp(){

        parent::setUp();
		
    }
}
