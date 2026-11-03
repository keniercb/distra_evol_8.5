<?php

abstract class BaseConfModulo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.conf_modulo');
        $this->hasColumn(
            'idconfmodulo', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmadministracion.sec_confmodulo')
        );
        $this->hasColumn('config', 'json', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('valores', 'json', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
