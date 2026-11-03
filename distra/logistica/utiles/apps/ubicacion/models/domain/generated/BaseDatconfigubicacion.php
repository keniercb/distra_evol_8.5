<?php

abstract class BaseDatconfigubicacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_configubicacion');
        $this->hasColumn('idconfigubicacion', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('capacidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('producto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('operaciones', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('volumen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('peso', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estrategiasalida', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

