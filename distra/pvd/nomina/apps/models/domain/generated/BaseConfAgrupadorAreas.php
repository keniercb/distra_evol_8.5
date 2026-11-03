<?php

abstract class BaseConfAgrupadorAreas extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_agrupadorareas');

        $this->hasColumn('idagrupador', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_agrupadorareas'
        ));

        $this->hasColumn('identidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));

        $this->hasColumn('idpagoporresultado', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));

        $this->hasColumn('denominacion', 'varchar', 255, array(
            'type' => 'varchar',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('idformula', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));
    }

    public function setUp(){
        parent::setUp();
    }
}