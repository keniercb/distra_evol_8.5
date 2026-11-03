<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatEstructura extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_estructura');
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('abreviatura', 'character varying', 10, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigo', 'character varying', 20, array('notnull' => false, 'primary' => false));
        $this->hasColumn('correo', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigonit', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('objetosocial', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('funcioneslegales', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('direccion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fax', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idconcepto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddpt', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idespecialidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idorgano', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('telefono', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('modificado', 'ARRAY', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipoescala', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idsector', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idicono', 'numeric', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('alias', 'character varying', 100, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigonirc', 'character varying', 150, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}