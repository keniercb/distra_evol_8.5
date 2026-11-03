<?php

abstract class BaseNomPeriodo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_periodo');
        $this->hasColumn('idperiodo', 'numeric', null,array('notnull' => true, 'primary' => true));
        $this->hasColumn('idcfgperiodo', 'numeric', null,array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('abreviatura', 'character varying', 30, array('notnull' => false, 'primary' => false));
        $this->hasColumn('mesinicial', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('mesfinal', 'numeric', null, array('notnull' => false, 'primary' => false));
       
    }

    public function Setup()
    {
        parent::setUp();
    }

}
