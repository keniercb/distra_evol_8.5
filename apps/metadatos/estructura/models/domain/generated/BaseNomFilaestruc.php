<?php

/**
 * Class BaseNomFilaestruc
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2014 xetid
 */
abstract class BaseNomFilaestruc extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_filaestruc');
        $this->hasColumn('idfila', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_estructuracomp.sec_filaestruc'));
        $this->hasColumn('accesofila', 'ARRAY', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dominiofila', 'ARRAY', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idconcepto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('oid', 'oid', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nivel', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('parent_path', 'ltree', 250, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('ordenunico', 'ltree', 250, array('fixed' => false, 'notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}