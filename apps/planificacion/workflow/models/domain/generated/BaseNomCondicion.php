<?php

abstract class  BaseNomCondicion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_flujotrabajo.nom_condicion');
        $this->hasColumn(
            'idcondicion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'dencondicion', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipocondicion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'desccondicion', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}


