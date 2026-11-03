<?php

abstract class BaseDatMovmoneda extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_movmoneda');
        $this->hasColumn(
            'idmovmoneda', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmoneda', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('recargo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descuento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importetasa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('preciotasa', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
