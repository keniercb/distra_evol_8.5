<?php

abstract class BaseTempInsindicadorviayos extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('temp_insindicadorviayos');
        $this->hasColumn(
            'codigo', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idespecialidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idinsindicadorviayos', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planifimportacion.sec_insindicadorviayos')
        );
        $this->hasColumn(
            'idorgano', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idvia', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'organosatisface', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'viaadquisicion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


