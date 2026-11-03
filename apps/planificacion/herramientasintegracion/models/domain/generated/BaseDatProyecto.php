<?php

abstract class BaseDatProyecto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_proyecto');
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_proyecto'));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaini', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => true, 'primary' => false));
    }
}