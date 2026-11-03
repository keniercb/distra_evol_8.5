<?php

abstract class BaseNomMedioActividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.nom_actividad');
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logactivofijotangible.sec_nomactividad')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 60, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'character varying', 150, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'iddepreciacion', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tipo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'periodo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
