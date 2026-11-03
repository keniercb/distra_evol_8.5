<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatMedio extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_medio');
        $this->hasColumn('idmedio', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idtipomedio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnommedio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidadreal', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idicono', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('modificado', 'ARRAY', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idestado', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}