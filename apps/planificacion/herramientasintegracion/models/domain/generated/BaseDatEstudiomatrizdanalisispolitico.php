<?php

abstract class BaseDatEstudiomatrizdanalisispolitico extends Doctrine_Record
{

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_estudiomatrizdanalisispolitico');
        $this->hasColumn('idestudiomatrizdanalisispolitico', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_estudiomatrizanalisispolitico'));
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nativo', 'boolean', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('resultado', 'text', null, array ('notnull' => true,'primary' => false));
    }
}

