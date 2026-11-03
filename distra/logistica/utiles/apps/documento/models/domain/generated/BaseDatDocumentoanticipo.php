<?php

abstract class BaseDatDocumentoanticipo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_documentoanticipo');
        $this->hasColumn('iddocumentoanticipo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idanticipo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
