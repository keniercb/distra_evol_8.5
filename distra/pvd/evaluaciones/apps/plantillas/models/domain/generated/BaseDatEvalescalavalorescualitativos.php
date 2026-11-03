<?php
abstract class BaseDatEvalescalavalorescualitativos extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_evaluaciones.dat_evalescalavalorescualitativos');
        $this->hasColumn('idescalavalorescualitativos', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_evalescalavalorescualitativos'));
        $this->hasColumn('idescala', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idvalorescualitativos', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('peso', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('color', 'character varying', 10, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}