<?php

abstract class BaseDatDatosnomencladoractividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_datosnomencladoractividad');
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador', array('local' => 'iddatosnomenclador',
                                         'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
            'NomActividad',
            array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
    }

}


