<?php

/**
 * Class BaseNomIcono
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2014 xetid
 */
abstract class BaseNomIcono extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_icono');
        $this->hasColumn('idicono', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('icono', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('concepto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('medio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('grado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('logo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}