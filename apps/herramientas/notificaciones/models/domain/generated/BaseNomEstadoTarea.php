<?php

abstract class BaseNomEstadoTarea extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_estadotarea');
        $this->hasColumn(
            'nombre', 'character varying', 30,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestado', 'numeric', 19,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_estadotarea')
        );
        $this->hasColumn(
            'codigo', 'character varying', 2,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}