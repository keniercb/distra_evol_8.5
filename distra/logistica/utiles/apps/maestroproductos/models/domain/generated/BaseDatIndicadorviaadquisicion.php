<?php

abstract class BaseDatIndicadorviaadquisicion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_indicadorviaadquisicion');
        $this->hasColumn('idviaadquisicion', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

