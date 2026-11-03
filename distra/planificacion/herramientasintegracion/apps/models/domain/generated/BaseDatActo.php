<?php

abstract class BaseDatActo extends Doctrine_Record
{

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_acto');
        $this->hasColumn('idacto', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_acto'));
        $this->hasColumn('idestudiomatrizdanalisispolitico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('factibilidadinstitucional', 'real', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valorinteres', 'real', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('factibilidadhecho', 'real', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estabilidadminima', 'real', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nivelcompulsionmax', 'real', null, array('notnull' => false, 'primary' => false));
    }
}