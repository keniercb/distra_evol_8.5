<?php

abstract class BaseConfAtributo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logmetadata.conf_atributo');
        $this->hasColumn(
            'idatributo', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logmetadata.sec_confatributo')
        );
        $this->hasColumn('nombre', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipodato', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigoui', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('propiedades', 'json', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}