<?php

/**
 * Class BaseNomConcepto
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c)2014 xetid
 */
abstract class BaseNomConcepto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_concepto');
        $this->hasColumn('idconcepto', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idicono', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('grafica', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}