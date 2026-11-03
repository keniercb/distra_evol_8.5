<?php

abstract class BaseDatEstudiomatrizimpactocruzado extends Doctrine_Record
{
    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_estudiomatrizimpactocruzado');
        $this->hasColumn('idestudiomatrizimpactocruzado', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_estudiomatrizimpactocruzado'));
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nativo', 'boolean', null, array('notnull' => false, 'primary' => false));
    }
}