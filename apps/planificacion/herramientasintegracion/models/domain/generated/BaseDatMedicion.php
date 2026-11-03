<?php

abstract class BaseDatMedicion extends Doctrine_Record
{
    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_medicion');
        $this->hasColumn('idmedicion', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_medicion'));
        $this->hasColumn('idestudiocurvaconflicto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechamedicion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valormedicion', 'double precision', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipoperiodo', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => true, 'primary' => false));
    }
}