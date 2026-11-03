<?php

abstract class BaseDatFabricaEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_fabricaentidad');
        $this->hasColumn(
            'idfabricaentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datfabricaentidad')
        );
        $this->hasColumn('idfabrica', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

