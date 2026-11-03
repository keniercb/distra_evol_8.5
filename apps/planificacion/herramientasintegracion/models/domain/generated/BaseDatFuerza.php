<?php

abstract class BaseDatFuerza extends Doctrine_Record
{

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_fuerza');
        $this->hasColumn('idfuerza', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_fuerza'));
        $this->hasColumn('idestudiomatrizdanalisispolitico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('peso', 'double precision', null, array('notnull' => false, 'primary' => false));
    }
}