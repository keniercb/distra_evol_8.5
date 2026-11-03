<?php

abstract class BaseDatControlejecucion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planproeza.dat_controlejecucion');
        $this->hasColumn('idcontrolejecucion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planproeza.sec_controlejecucion'));
        $this->hasColumn('iddemandatiempo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidadproducida', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'timestamp without time zone', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechamodificacion', 'timestamp without time zone', null, array('default' => 'now()', 'notnull' => true));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase

