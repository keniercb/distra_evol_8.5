<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseNomGestor extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.nom_gestor');
        $this->hasColumn(
            'idgestor', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_metadata.sec_gestor')
        );
        $this->hasColumn('denominacion', 'character varying', 50, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}