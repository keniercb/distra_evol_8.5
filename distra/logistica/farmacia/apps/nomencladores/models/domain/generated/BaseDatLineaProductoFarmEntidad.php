<?php

/**
 * Class BaseDatDestinoEntidad
 */
abstract class BaseDatLineaProductoFarmEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_lineaprodentidad');
        $this->hasColumn(
            'idlineaprodentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfarmacia.sec_datlineaprodentidad')
        );
        $this->hasColumn('idlineaprod', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}