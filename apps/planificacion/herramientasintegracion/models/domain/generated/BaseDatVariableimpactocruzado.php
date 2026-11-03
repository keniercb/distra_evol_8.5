<?php

abstract class BaseDatVariableimpactocruzado extends Doctrine_Record
{
    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_variableimpactocruzado');
        $this->hasColumn('idvariable', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_variable'));
        $this->hasColumn('idestudiomatrizimpactocruzado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
    }
}

