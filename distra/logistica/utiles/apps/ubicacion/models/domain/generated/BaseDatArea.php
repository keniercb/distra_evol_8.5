<?php

abstract class BaseDatArea extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_area');
        $this->hasColumn(
            'idarea', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_datarea')
        );
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idformato', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}



