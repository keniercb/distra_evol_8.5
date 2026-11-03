<?php

abstract class BaseTempInsnivelesa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifimportacion.temp_insnivelesa');
        $this->hasColumn(
            'idinsnivelesa', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planifimportacion.sec_insnivelesa')
        );
        $this->hasColumn(
            'codigoact', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nivelact', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denomentidad', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


