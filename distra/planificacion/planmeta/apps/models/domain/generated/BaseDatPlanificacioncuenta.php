<?php

abstract class BaseDatPlanificacioncuenta extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('dat_planificacioncuenta');
        $this->hasColumn('idplanificacioncuenta', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_planificacioncuenta'));
         $this->hasColumn('idcuenta', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idplanificacion', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase 
