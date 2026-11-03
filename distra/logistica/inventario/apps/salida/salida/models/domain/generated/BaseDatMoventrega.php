<?php

abstract class BaseDatMoventrega extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_moventrega');
        $this->hasColumn(
            'idmoventrega', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datmoventrega')
        );
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddocorigen', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('ordenado', 'numeric', 0, array('notnull' => false, 'primary' => false));
        $this->hasColumn('pendiente', 'numeric', 0, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idordenactividad', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
