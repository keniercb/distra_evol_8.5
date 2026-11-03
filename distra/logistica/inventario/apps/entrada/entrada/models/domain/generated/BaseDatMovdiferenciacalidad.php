<?php

abstract class BaseDatMovdiferenciacalidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_movdiferenciacalidad');
        $this->hasColumn('idmovdiferenciacalidad', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcalidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidaddiferencia', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function setup()
    {
        parent::setUp();
    }

}
