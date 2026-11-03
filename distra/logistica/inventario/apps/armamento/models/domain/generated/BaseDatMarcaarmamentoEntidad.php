<?php

abstract class BaseDatMarcaarmamentoEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_marcaarmamentoentidad');
        $this->hasColumn(
            'idmarcaarmamentoentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datmarcaarmamentoentidad')
        );
        $this->hasColumn('idmarcaarmamento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

