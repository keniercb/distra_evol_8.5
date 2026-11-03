<?php

/**
 * Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatGrafica extends Doctrine_Record
{
    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_grafica');
        $this->hasColumn('idgrafica', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'string', 255, array('unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('configuracion', 'string', null, array('unsigned' => false, 'notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }
}