<?php

abstract class BaseDatTablaMeta extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logmetadata.dat_tablameta');
        $this->hasColumn(
            'idtablameta', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logmetadata.sec_dattablameta')
        );
        $this->hasColumn('esquema', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tabla', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('columnaref', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('datoref', 'character varying', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
