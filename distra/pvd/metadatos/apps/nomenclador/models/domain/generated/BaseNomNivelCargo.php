<?php

/**
 * Class BaseNomOrgano
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c)2014 xetid
 */
abstract class BaseNomNivelCargo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_nivelcargo');
        $this->hasColumn('idnivelcargo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('abreviatura', 'character varying', 20, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('visible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('actual', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}