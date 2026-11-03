<?php

abstract class BaseCfgResponsableAreaPat extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.conf_responsableareapatrimonio');
        $this->hasColumn('idresponsable', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarearesp', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuraubicacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idresponsablearea', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
