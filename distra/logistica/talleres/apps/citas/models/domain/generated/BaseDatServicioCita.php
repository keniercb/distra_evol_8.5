<?php

abstract class BaseDatServicioCita extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_serviciocita');
        $this->hasColumn(
            'idservicio', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_serviciocita')
        );
        $this->hasColumn('idservicio', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcita', 'numeric', 19, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

