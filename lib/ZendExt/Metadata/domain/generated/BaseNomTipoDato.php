<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseNomTipoDato extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.nom_tipodato');
        $this->hasColumn(
            'idtipodato', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_metadata.sec_tipodato')
        );
        $this->hasColumn('denominacion', 'character varying', 50, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}