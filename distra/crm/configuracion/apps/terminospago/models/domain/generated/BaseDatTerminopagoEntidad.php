<?php

abstract class BaseDatTerminopagoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_terminodepagoentidad');
        $this->hasColumn('idterminodepagoentidad', 'numeric', null,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_terminodepagoentidad'));
        $this->hasColumn('idterminodepago', 'numeric', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null,array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

