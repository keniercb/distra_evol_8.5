<?php

abstract class BaseDatMenu extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logalimento.dat_menu');
        $this->hasColumn('idmenu', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idcentrocosto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnorma', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idrevisadopor', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
