<?php

abstract class BaseDatActividadentidadmanual extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_actividadentidadmanual');
        $this->hasColumn(
            'idactividadentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'nivelactividadmanual', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'version', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


