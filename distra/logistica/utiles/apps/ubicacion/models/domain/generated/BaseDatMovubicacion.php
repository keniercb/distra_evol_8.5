<?php

abstract class BaseDatMovubicacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_movubicacion');
        $this->hasColumn(
            'idmovubicacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_datmovubicacion')
        );
        $this->hasColumn('idestructuraubicacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

