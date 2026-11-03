<?php

abstract class BaseNomDesignacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.nom_designacion');
        $this->hasColumn(
            'iddesignacion', 'numeric', null,
            array('type'     => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true,
                  'sequence' => 'mod_logpatrimonio.sec_nomdesignacion')
        );       
        $this->hasColumn(
            'denominacion', 'string', null,
            array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();

    }
}