<?php

abstract class BaseDatModelodatosnomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_modelodatosnomenclador');
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


