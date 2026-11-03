<?php

abstract class BaseDatEstudiocurvaconflicto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_estudiocurvaconflicto');
        $this->hasColumn('idestudiocurvaconflicto', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_estudiocurvaconflicto'));
        $this->hasColumn('idproyecto', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('fechaini', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fechaintermedia', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fechaavanzada', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('nativo', 'boolean', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('escala', 'boolean', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fromproblema', 'boolean', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => true, 'primary' => false));
    }


}

