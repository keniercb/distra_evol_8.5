<?php

abstract class BaseDatAtributosNaturaleza extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_atributosnaturaleza');
        $this->hasColumn(
            'idatributonaturaleza', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datatributosnaturaleza')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'data', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtabla', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnaturaleza', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'identificador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

