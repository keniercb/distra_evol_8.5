<?php

abstract class BaseDimCategoria extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loganalisis.dim_categoria');

        $this->hasColumn('idcategoria', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
