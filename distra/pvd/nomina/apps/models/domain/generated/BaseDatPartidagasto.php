<?php

abstract class BaseDatPartidagasto extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_partidagasto');

        $this->hasColumn('idpartidagastoespecialidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_nomina.sec_partidagastoespecialidad'
        ));

        $this->hasColumn('idestructura', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));

         $this->hasColumn('cajacajero', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

         $this->hasColumn('valor', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('cantpersonas', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

         $this->hasColumn('idtiponomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
         $this->hasColumn('idespecialidad', 'numeric', 19, array(
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
