<?php

/**
 * Class BaseDatDestinoEntidad
 */
abstract class BaseDatDestinoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_destinoentidad');
        $this->hasColumn(
            'iddestinoentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datdestinoentidad')
        );
        $this->hasColumn('iddestino', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

//fin clase 

