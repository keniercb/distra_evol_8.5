<?php

/**
 * Class BaseNomPreparacion
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c)2014 xetid
 */
abstract class BaseNomEscalaSalarial extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_escalasalarial');
        $this->hasColumn('idescalasalarial', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idtipoescala', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idsalario', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('actual', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('visible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}