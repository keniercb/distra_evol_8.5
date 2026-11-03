<?php

abstract class BaseNomExpresionRegular extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.nom_expresionregular');
        $this->hasColumn(
            'idexpresionregular', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_nomexpresionregular')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('expresion', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}