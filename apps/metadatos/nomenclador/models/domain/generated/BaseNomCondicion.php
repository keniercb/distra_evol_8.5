<?php

/**
 * Class BaseNomCondicion
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c)2014 xetid
 */
abstract class BaseNomCondicion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_condicion');
        $this->hasColumn('idnomcargo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idgrupocomplejidad', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function Setup()
    {
        parent::setUp();
    }
}