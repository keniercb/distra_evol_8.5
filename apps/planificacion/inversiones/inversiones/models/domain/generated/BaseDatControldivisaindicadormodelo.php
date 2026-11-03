<?php

abstract class BaseDatControldivisaindicadormodelo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('dat_controldivisaindicadormodelo');
        $this->hasColumn(
                'idcontroldivisaindicadormodelo', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_controldivisaindicador')
        );
        $this->hasColumn('idcontroldivisa', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idaprobacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidadmodelo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('identidadautor', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();

        $this->hasOne('DatEntidadmodelo', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo'));
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('NomControldivisa', array('local' => 'idcontroldivisa', 'foreign' => 'idcontroldivisa'));
        $this->hasOne('NomAprobacion', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion'));
        $this->hasOne('DatEntidaddatosnomenclador', array('local' => 'identidadautor', 'foreign' => 'identidaddatosnomenclador'));
        $this->hasOne('NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
    }

}
?> 
