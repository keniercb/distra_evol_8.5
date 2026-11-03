<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseNomExpresionRegular extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.nom_expresionregular');
        $this->hasColumn(
            'idexpresionregular', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_metadata.sec_expresionregular')
        );
        $this->hasColumn('expresionregular', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 50, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}