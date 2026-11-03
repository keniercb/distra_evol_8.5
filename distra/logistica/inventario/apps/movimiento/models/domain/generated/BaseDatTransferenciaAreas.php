<?php

abstract class BaseDatTransferenciaAreas extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_transferenciaarea');
        $this->hasColumn('idtransferenciaarea', 'numeric', null,array('notnull' => true, 'primary' => true));
        $this->hasColumn('areaorigen', 'numeric', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('areadestino', 'numeric', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipotransferencia', 'numeric', null,array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}