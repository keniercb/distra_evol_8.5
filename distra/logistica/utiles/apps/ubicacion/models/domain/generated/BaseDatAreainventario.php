<?php

abstract class BaseDatAreainventario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_areainventario');
        $this->hasColumn('idarea', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idnomtipoarea', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ubicacionarea', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

