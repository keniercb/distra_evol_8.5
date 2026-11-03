<?php

abstract class BaseDatRecepcionreserva extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logreserva.dat_recepcionreserva');
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('usareserva', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numero', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('concepto', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
