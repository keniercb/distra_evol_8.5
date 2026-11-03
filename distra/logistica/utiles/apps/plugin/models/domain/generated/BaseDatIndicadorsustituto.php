<?php

abstract class BaseDatIndicadorsustituto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_indicadorsustituto');
        $this->hasColumn(
            'idindicador', 'numeric', 19,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idsustituto', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'date', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}
