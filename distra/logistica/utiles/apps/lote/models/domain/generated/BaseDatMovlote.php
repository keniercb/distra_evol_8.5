<?php

abstract class BaseDatMovlote extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_movlote');
        $this->hasColumn(
            'idmovlote', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datmovbulto')
        );
        $this->hasColumn('idlote', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idubicacion', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
