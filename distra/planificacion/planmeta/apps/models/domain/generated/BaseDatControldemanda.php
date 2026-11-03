<?php

abstract class BaseDatControldemanda extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.dat_controldemanda');
        $this->hasColumn('idcontroldemanda', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_controldemanda'));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idunidadmedida', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('viasadquisicion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('organossatisface', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('precio', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('puntualizacion', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('adicionado', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('idaprobacion', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 1));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'timestamp', null, array('default' => 'now()', 'notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

?>