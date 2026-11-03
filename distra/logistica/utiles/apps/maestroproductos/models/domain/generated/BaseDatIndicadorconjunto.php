<?php

abstract class BaseDatIndicadorconjunto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_indicadorconjunto');
        $this->hasColumn(
            'idindicadorconjunto', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_indicadorconjunto')
        );
        $this->hasColumn(
            'idindicador', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idpadre', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}
