<?php

abstract class BaseDatMatrizimpactocruzado extends Doctrine_Record
{

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_matrizimpactocruzado');
        $this->hasColumn('idvariablefila', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idvariablecolumna', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idimpacto', 'numeric', null, array('notnull' => false, 'primary' => false));
    }
}