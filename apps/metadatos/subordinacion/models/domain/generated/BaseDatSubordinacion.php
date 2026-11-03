<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatSubordinacion extends Doctrine_Record
{
    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_subordinacion');
        $this->hasColumn('idsubordinacion', 'numeric', NULL, ['notnull' => TRUE, 'primary' => TRUE]);
        $this->hasColumn('idhijo', 'numeric', NULL, ['notnull' => TRUE, 'primary' => FALSE]);
        $this->hasColumn('idnomsubordinacion', 'numeric', NULL, ['notnull' => TRUE, 'primary' => FALSE]);
        $this->hasColumn('idpadre', 'numeric', NULL, ['notnull' => TRUE, 'primary' => FALSE]);
        $this->hasColumn('parent_path', 'string', NULL, ['notnull' => TRUE, 'primary' => FALSE]);
    }

    /**
     *
     */
    public function Setup()
    {
        parent::setUp();
    }
}