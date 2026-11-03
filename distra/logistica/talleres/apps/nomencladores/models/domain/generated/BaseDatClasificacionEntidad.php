<?php

/**
 * Class BaseDatDestinoEntidad
 */
abstract class BaseDatClasificacionEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_clasificacionentidad');
        $this->hasColumn(
            'idclasificacionentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datclasificacionentidad')
        );
        $this->hasColumn('idclasificacion', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

//fin clase 

