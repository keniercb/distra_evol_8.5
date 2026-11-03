<?php

abstract class BaseTempActfleteycontingencia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('temp_actfleteycontingencia');
        $this->hasColumn(
            'idactfleteycontingencia', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'secuence' => 'mod_planifimportacion.sec_actfleteycontingencia')
        );
        $this->hasColumn(
            'codigo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'flete', 'numeric', null,
            array('notnull' => false, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'contingencia', 'numeric', null,
            array('notnull' => false, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
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

