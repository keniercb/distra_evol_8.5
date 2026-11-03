<?php

abstract class BaseDatConfiguracionimportar extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_configuracionimportar');
        $this->hasColumn(
            'idconfiguracion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idconcepto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tablatemporal', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

