<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatProyecto extends Doctrine_Record
{
    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_proyecto');
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('modificado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('aprobado', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    /**
     *
     */
    public function Setup()
    {
        parent::setUp();
    }
}