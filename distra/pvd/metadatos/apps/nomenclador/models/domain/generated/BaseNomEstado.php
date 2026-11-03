<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseNomEstado extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_estado');
        $this->hasColumn('idestado', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 20, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}