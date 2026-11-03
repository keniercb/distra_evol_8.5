<?php

abstract class BaseDatControldemandafecha extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.dat_controldemandafecha');
        $this->hasColumn('idcontroldemandafecha', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_controldemandafecha'));
        $this->hasColumn('idcontroldemanda', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddatosnomenclador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidadcontratada', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('preciocontratacion', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('cantidadejecutada', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('precioejecucion', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('idaprobacionejecucion', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 1));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'timestamp', null, array('default' => 'now()', 'notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

?>