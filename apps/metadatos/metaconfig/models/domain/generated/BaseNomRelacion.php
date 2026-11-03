<?php

/**
 * Class BaseNomRelacion
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2014 xetid
 */
abstract class BaseNomRelacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_relacion');
        $this->hasColumn('idrelacion', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idhijo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}