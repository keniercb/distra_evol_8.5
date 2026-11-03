<?php

abstract class BaseDatValedevolucion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_valedevolucion');
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idcentrocosto', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
