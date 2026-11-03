<?php

abstract class BaseDatMovrecepcion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_movrecepcion');
        $this->hasColumn(
            'idmovimiento', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
