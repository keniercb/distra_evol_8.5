<?php
abstract class BaseDatMovinventario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_movinventario');
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('existenciaactual', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importeactual', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importealtactual', 'numeric', null, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }
}

