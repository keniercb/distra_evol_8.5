<?php

abstract class BaseTempInsnorma extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifimportacion.temp_insnorma');
        $this->hasColumn(
            'idinsnorma', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planifimportacion.sec_insnorma')
        );
        $this->hasColumn(
            'codigoact', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'codigoind', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantbase', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantplanif', 'numeric', null,
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


