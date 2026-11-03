<?php

abstract class BaseDatAnnofabricacionEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_annofabricacionentidad');
        $this->hasColumn(
            'idannofabricacionentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datannofabricacionentidad')
        );
        $this->hasColumn('idannofabricacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

