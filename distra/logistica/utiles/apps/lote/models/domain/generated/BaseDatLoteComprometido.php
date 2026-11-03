<?php

abstract class BaseDatLoteComprometido extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_lotecomprometido');
        $this->hasColumn(
            'idlotecomprometido', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datlotecomprometido')
        );
        $this->hasColumn('idlote', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idubicacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', 0, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
