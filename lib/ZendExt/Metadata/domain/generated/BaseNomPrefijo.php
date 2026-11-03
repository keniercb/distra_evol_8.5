<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseNomPrefijo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.nom_prefijo');
        $this->hasColumn('idprefijo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('prefijo', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('uriprefijo', 'character varying', 50, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}