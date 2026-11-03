<?php

abstract class BaseClousureEstructura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loganalisis.clousure_estructura');
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idhijo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('distancia', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

