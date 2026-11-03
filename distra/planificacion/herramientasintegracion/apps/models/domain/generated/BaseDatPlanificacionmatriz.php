<?php

abstract class BaseDatPlanificacionmatriz extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_planificacionmatriz');
        $this->hasColumn('idplanificacionmatriz', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_planificacionmatriz'));
        $this->hasColumn('idproyectoplanificacion', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idestudioherramienta', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('iddatosnomenclador', 'numeric', null, array ('notnull' => false,'primary' => false));
    }


}

