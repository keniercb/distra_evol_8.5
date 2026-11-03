<?php

abstract class BaseDatEvent extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_evento');
        $this->hasColumn(
            'activo', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 1)
        );
        $this->hasColumn(
            'interno', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 1)
        );
        $this->hasColumn(
            'nombre', 'character varying', 50,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idevento', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_evento')
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'referencia', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}