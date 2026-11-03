<?php

abstract class BaseNomTipoaviso extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tipoaviso');
        $this->hasColumn(
            'bodyclass', 'character varying', 30,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 30,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'headertext', 'character varying', 30,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'iconclass', 'character varying', 30,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoaviso', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_tipoaviso')
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}