<?php

abstract class BaseDatActividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmmarketing.dat_actividad');
        $this->hasColumn('idactividad', 'numeric', 19,array('notnull'  => true, 'primary' => true,'sequence' => 'mod_crmmarketing.sec_actividad'));
        $this->hasColumn('presupuesto', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255,array('primary' => false));
        $this->hasColumn('idcampanna', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idprioridad', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcanal', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255,array('notnull' => true, 'primary' => false));

    }

}
