<?php

abstract class BaseDatAreaproducto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_areaproducto');
        $this->hasColumn(
            'idareaproducto', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_datareaproducto')
        );
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idarea', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('disponible', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}


