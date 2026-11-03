<?php

abstract class BaseDatDatosnomencladordatosnomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_datosnomencladordatosnomenclador');
        $this->hasColumn(
            'iddatosnomencladorpadre', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'iddatosnomencladorhijo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
