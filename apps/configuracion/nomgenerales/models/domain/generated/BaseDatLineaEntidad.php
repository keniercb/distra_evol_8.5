<?php

/**
 * Class BaseDatDestinoEntidad
 */
abstract class BaseDatLineaEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_lineaentidad');
        $this->hasColumn(
            'idlineaentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datlineaentidad')
        );
        $this->hasColumn('idlinea', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

//fin clase 

