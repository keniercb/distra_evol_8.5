<?php

/**
 * Class BaseDatUbicaciontallorden
 */
abstract class BaseDatUbicaciontallorden extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_ubicaciontallorden');
        $this->hasColumn(
            'idubicaciontallorden', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datubicaciontallorden')
        );
        $this->hasColumn('idubicaciontall', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
    
}

//fin clase 
