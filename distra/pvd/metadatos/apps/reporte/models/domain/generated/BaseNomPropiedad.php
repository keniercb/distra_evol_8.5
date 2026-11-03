<?php

/**
 * Class BaseNomPropiedad
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
abstract class BaseNomPropiedad extends Doctrine_Record
{
    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_propiedad');
        $this->hasColumn('idpropiedad', 'numeric', NULL, array('notnull' => TRUE, 'primary' => TRUE));
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => TRUE, 'primary' => FALSE));
        $this->hasColumn('referencia', 'character varying', 100, array('notnull' => TRUE, 'primary' => FALSE));
    }

    /**
     *
     */
    public function Setup()
    {
        parent::setUp();
    }
}