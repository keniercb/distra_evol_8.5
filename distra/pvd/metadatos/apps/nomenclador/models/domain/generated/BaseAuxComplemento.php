<?php

/**
 * Class BaseNomComplemento
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c)2014 xetid
 */
abstract class BaseAuxComplemento extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.aux_complemento');
        $this->hasColumn('idcomplemento', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function Setup()
    {
        parent::setUp();
    }
}