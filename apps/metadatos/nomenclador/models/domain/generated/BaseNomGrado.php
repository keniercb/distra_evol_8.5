<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseNomGrado extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_grado');
        $this->hasColumn('idgrado', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('orden', 'numeric', 3, null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcategoriamilitar', 'numeric', 1, null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idicono', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('abreviatura', 'character varying', 10, array('notnull' => false, 'primary' => false));
        $this->hasColumn('actual', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('visible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('marina', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}