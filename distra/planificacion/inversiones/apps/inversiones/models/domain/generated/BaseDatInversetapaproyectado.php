<?php

abstract class BaseDatInversetapaproyectado extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_inversetapaproyectado');
        $this->hasColumn('idplaninversetapaproyectado', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_planinversetapaproyectado'));
        $this->hasColumn('idmoneda', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idetapainversion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}