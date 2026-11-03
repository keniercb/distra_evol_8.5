<?php

abstract class BaseDatMovdevolucion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_movdevolucion');
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idordenactividad', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
