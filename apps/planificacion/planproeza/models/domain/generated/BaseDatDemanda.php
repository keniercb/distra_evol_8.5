<?php

abstract class BaseDatDemanda extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planproeza.dat_demanda');
        $this->hasColumn('iddemanda', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planproeza.sec_demanda'));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidadcliente', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidadorganosatisface', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idprograma', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddestino', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idaprobacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idaprobacionplan', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidadinicial', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidadconfirmada', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ajuste', 'numeric', null, array('notnull' => true, 'primary' => false));       
        $this->hasColumn('estimacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tieneobservacion', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('extraplan', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'timestamp without time zone', null, array('default' => 'now()', 'notnull' => true));
        $this->hasColumn('fechalimite', 'date', null, array('default' => 'now()', 'notnull' => true));
        $this->hasColumn('idusuariocrea', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase

