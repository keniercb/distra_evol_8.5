<?php

abstract class BaseDatArealote extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_arealote');
        $this->hasColumn(
            'idarealote', 'numeric', null,
            array('notnull' => false, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_datarealote')
        );
        $this->hasColumn('idarea', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idlote', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('disponible', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}



