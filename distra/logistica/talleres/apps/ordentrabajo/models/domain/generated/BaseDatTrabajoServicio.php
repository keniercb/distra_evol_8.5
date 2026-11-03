<?php

abstract class BaseDatTrabajoServicio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_trabajoservicio');
        $this->hasColumn(
            'idtrabajoservicio', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_dattrabajoservicio')
        );
        $this->hasColumn('idservicio', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idordentrabajo', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

