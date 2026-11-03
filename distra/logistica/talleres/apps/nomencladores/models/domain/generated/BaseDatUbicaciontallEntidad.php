<?php

/**
 * Class BaseDatDestinoEntidad
 */
abstract class BaseDatUbicaciontallEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_ubicaciontallentidad');
        $this->hasColumn(
            'idubicaciontallentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datubicaciontallentidad')
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
