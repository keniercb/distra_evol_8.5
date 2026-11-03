<?php

abstract class BaseDatFallasOrdenTrabajo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_fallasordentrabajo');
        $this->hasColumn(
            'idfallasordentrabajo', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datfallasordentrabajo')
        );
        $this->hasColumn('idordentrabajo', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfalla', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

