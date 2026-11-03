<?php

class BaseNomTipodocumentoimportar extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_importar.nom_tipodocumentoimportar');
        $this->hasColumn(
            'idtipodocumento', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'extension', 'character varying', 10,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

