<?php

abstract class BaseNomConceptoimportar extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_conceptoimportar');
        $this->hasColumn(
            'idconcepto', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase