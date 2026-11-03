<?php

abstract class BaseNomUbicaciontall extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.nom_ubicaciontall');
        $this->hasColumn(
            'idubicaciontall', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_nomubicaciontall')
        );
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('inicial', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('final', 'numeric', null, array('notnull' => true, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 
