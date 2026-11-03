<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatProyectoUsuario extends Doctrine_Record
{
    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_proyectousuario');
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idresponsable', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('nuevo', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    /**
     *
     */
    public function Setup()
    {
        parent::setUp();
    }
}