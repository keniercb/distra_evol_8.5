<?php

/**
 * Class BaseDatDestinoEntidad
 */
abstract class BaseDatCuadreProcesoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_cuadreprocesoentidad');
        $this->hasColumn(
            'idcuadreprocesoentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datcuadreprocesoentidad')
        );
        $this->hasColumn('idcuadreproceso', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

//fin clase 

