<?php

/**
 * Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatGraficaUsuario extends Doctrine_Record
{
    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_graficausuario');
        $this->hasColumn('idgrafica', 'numeric', NULL, array('unsigned' => FALSE, 'notnull' => TRUE, 'primary' => TRUE));
        $this->hasColumn('idusuario', 'numeric', NULL, array('unsigned' => FALSE, 'notnull' => TRUE, 'primary' => TRUE));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }
}