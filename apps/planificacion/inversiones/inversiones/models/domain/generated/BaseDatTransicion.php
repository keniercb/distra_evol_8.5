<?php

abstract class BaseDatTransicion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_transicion');
        $this->hasColumn('idtransicion', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_transicion'));
        $this->hasColumn('idflujotrabajo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestadoinicial', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestadofinal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('inicial', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

