<?php

abstract class BaseTempInsindicadorplan extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifimportacion.temp_insindicadorplan');
        $this->hasColumn(
            'idinsindicadorplan', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planifimportacion.sec_insindicadorplan')
        );
        $this->hasColumn(
            'codigoindicador', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantindicadores', 'numeric', null,
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
            'denomentidad', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denommodelo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denactividad', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


