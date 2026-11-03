<?php

abstract class BaseDatDesglosecompleto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desglosecompleto');
        $this->hasColumn(
            'idactividadentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'iddesglosetiponomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


