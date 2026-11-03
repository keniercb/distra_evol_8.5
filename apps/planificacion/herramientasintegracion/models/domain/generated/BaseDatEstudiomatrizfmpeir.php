<?php

abstract class BaseDatEstudiomatrizfmpeir extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_estudiomatrizfmpeir');
        $this->hasColumn('idestudiomatrizfmpeir', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_estudiomatrizfmpeir'));
        $this->hasColumn('idproyecto', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('nativo', 'boolean', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => true, 'primary' => false));
    }


}

