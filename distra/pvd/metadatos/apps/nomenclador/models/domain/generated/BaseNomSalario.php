<?php

/**
 * Class BaseNomSalario
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c)2014 xetid
 */
abstract class BaseNomSalario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_salario');
        $this->hasColumn('idsalario', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idgrupocomplejidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('salario', 'double precision', null, array('notnull' => false, 'primary' => false));
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