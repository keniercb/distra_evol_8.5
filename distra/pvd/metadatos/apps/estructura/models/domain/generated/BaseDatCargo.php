<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatCargo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_cargo');
        $this->hasColumn('idcargo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidadreal', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idespecialidadpreparacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idespecialidadempleo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnomcargo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpreparacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idsalario', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('modificado', 'ARRAY', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idestado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('temporal', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('directo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipoescala', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idsector', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnivelcargo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idfacultado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('decisorio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('alias', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('principal', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('jefebrigada', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}