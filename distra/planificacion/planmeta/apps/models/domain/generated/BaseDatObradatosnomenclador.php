<?php

abstract class BaseDatObradatosnomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_obradatosnomenclador');
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idobra', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


