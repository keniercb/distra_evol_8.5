<?php

abstract class BaseConfExportacionBanco extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_exportacionbanco');

        $this->hasColumn('idconfexportaciondbfbanco', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_conf_exportacionbanco'
        ));
        
        $this->hasColumn('idbanco', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('tipocampo', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('denomcampo', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('tipodato', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('longitudvalor', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('tipofichero', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('lugaresdecimales', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('identidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('orden', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('idconfexportaciondbfbancoficheroentidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
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
