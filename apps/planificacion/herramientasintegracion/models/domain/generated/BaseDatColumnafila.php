<?php

abstract class BaseDatColumnafila extends Doctrine_Record
{
    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_columnafila');
        $this->hasColumn('idcolumnafila', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_columnafila'));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fila', 'boolean', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestudiomatrizrelacion', 'numeric', null, array('notnull' => false, 'primary' => false));
    }
}