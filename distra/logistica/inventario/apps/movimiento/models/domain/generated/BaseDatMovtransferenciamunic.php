<?php

abstract class BaseDatMovtransferenciamunic extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_movtransferenciamunic');
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idmovtransferenciamunic', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datmovtransferenciamunic')
        );
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartidaorigen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idpartidadestino', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('estiba', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('hilera', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}