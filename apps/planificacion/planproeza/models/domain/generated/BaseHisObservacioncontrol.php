<?php

abstract class BaseHisObservacioncontrol extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planproeza.his_observacioncontrol');
        $this->hasColumn('idobservacioncontrol', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planproeza.sec_observacioncontrol'));
        $this->hasColumn('iddemandatiempo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddemanda', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmes', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => false));       
        $this->hasColumn('fecha', 'timestamp without time zone', null, array('default' => 'now()', 'notnull' => true));
        $this->hasColumn('observacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase

