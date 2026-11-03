<?php

abstract class BaseDatConservacionEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_conservacionentidad');
        $this->hasColumn(
            'idconservacionentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datconservacionentidad')
        );
        $this->hasColumn('idconservacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

