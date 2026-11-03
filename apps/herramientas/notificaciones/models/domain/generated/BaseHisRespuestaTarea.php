<?php

abstract class BaseHisRespuestaTarea extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('his_respuestatarea');
        $this->hasColumn(
            'idrespuesta', 'numeric', 19,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_respuestatarea')
        );
        $this->hasColumn(
            'estadotarea', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'observacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtarea', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}