<?php

abstract class BaseDatMovdiferencia extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_movdiferencia');
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('signo', 'character varying', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidaddiferencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('preciodiferencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importediferencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('preciodiferenciaalt', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importediferenciaalt', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
