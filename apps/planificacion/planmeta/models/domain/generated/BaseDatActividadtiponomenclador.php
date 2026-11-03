<?php

abstract class BaseDatActividadtiponomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_actividadtiponomenclador');
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtiponomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
