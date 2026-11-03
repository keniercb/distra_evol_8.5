<?php

/**
 * Class BaseNomDominio
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2014 xetid
 */
abstract class BaseNomDominio extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_dominio');
        $this->hasColumn(
             'iddominio', 'numeric', null, array(
                            'notnull' => true, 'primary' => true, 'sequence' => 'mod_estructuracomp.sec_dominio')
        );
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dominio', 'ARRAY', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dominiob', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dominiostring', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('lft', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('rgt', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('seguridad', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}