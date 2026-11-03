<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatAplicacioncartatecproyecto extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_aplicacioncartatecproyecto');
        $this->hasColumn('idaplicacioncartatecproyecto', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_aplicacioncartatecproyecto'));
        $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idaplicacioncartatec', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase

