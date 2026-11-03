<?php

abstract class BaseTempInsactividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifimportacion.temp_insactividad');
        $this->hasColumn(
            'idinsactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planifimportacion.sec_insactividad')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'especialidad', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'aprobada', 'character varying', 2,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'activada', 'character varying', 2,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nivel', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'plan', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idespecialidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


