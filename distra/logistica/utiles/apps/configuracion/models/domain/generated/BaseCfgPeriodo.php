<?php

abstract class BaseCfgPeriodo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('conf_periodo');
        $this->hasColumn('idcfgperiodo', 'numeric', null,array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('longitud', 'numeric', null, array('notnull' => false, 'primary' => false));
       
    }

    public function Setup()
    {
        parent::setUp();
    }

}
