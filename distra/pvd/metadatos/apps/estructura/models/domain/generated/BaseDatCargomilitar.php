<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatCargomilitar extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_cargomilitar');
        $this->hasColumn('idcargo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idgrado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function Setup()
    {
        parent::setUp();
    }
}