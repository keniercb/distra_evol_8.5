<?php

class BaseNomTipoaccionimportar extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_importar.nom_tipoaccionimportar');
        $this->hasColumn(
            'idtipoaccion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

