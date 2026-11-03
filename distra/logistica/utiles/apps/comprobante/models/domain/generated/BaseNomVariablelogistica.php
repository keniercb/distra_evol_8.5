<?php

class BaseNomVariablelogistica extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.nom_variablelogistica');
        $this->hasColumn(
            'idvariablelogistica', 'numeric', 3,
            array('primary' => true, 'notnull' => true, 'sequence' => 'mod_logistica.sec_nomvariablelogistica')
        );
        $this->hasColumn(
            'codigo', 'numeric', 3,
            array('primary' => false, 'notnull' => true)
        );
        $this->hasColumn('denominacion', 'character varying', 50, array('primary' => false, 'notnull' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
