<?php

abstract class BaseConfTiposPagosConsecutivosNomina extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_tipospagosconsecutivosnomina');

        $this->hasColumn('idtipopago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            //'sequence' => 'mod_nomina.sec_partidagastoespecialidad'
        ));

        $this->hasColumn('tiposgeneranconsecutivos', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => false,
            'primary' => false,
        ));
    }

    public function setUp(){

        parent::setUp();
		
    }
}
