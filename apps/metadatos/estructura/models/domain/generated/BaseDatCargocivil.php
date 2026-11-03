<?php

/**
 * Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatCargocivil extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_cargocivil');
        $this->hasColumn('idcargo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idcategocup', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function Setup()
    {
        parent::setUp();
    }
}