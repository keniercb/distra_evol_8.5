<?php

class DatDeposito  extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_estructuraop');
        $this->hasColumn('idestructuraop', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('codigo', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'string', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }
}