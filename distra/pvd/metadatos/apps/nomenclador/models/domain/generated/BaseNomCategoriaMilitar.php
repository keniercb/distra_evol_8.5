<?php

abstract class BaseNomCategoriaMilitar extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_categoriamilitar');
        $this->hasColumn('idcategoriamilitar', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}