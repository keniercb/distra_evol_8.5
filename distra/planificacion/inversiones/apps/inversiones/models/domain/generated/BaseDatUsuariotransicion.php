<?php

abstract class BaseDatUsuariotransicion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_usuariotransicion');
        $this->hasColumn('idusuariotransicion', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_usuariotransicion'));
        $this->hasColumn('idtransicion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

