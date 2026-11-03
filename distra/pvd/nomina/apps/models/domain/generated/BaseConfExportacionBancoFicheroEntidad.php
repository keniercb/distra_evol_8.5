<?php

abstract class BaseConfExportacionBancoFicheroEntidad extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_exportacionbancoficheroentidad');

        $this->hasColumn('idconfexportaciondbfbancoficheroentidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_conf_exportacionbancoficheroentidad'
        ));
        
        $this->hasColumn('identidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('fichero', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('tipoformato', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => false,
            'primary' => false
        ));

    }
	
	public function setUp(){

        parent::setUp();

    }
}
