<?php

abstract class BaseConfAgrupacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logmetadata.conf_agrupacion');
        $this->hasColumn(
            'idagrupacion', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logmetadata.sec_confagrupacion')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}