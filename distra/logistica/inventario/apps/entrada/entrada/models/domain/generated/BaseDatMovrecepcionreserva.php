<?php

abstract class BaseDatMovrecepcionreserva extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logreserva.dat_movrecepcionreserva');
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('cantidad', 'numeric', 0, array('notnull' => false, 'primary' => false));
        $this->hasColumn('acumular', 'numeric', 0, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuraop', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
