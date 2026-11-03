<?php

abstract class BaseDatAtributosIndicador extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_atributosindicador');
        $this->hasColumn(
            'idatributoindicador', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datatributosindicador')
        );
        $this->hasColumn(
            'idatributodinamico', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'atributoidentificador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'recuperable', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nombretabla', 'character varying', 255, array('notnull' => false, 'primary' => false)
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

