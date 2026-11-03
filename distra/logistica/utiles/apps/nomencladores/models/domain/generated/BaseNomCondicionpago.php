<?php

abstract class BaseNomCondicionpago extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_condicionpago');
        $this->hasColumn(
            'idcondicionpago', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_nomcondicionpago')
        );
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('pordefecto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
