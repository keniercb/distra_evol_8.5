<?php

abstract class BaseDatEstudiocausaefecto extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_estudiocausaefecto');
        $this->hasColumn('idestudiocausaefecto', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_estudiocausaefecto'));
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nativo', 'boolean', null, array('notnull' => true, 'primary' => false));
    }

}
