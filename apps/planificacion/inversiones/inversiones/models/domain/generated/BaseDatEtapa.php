<?php

abstract class BaseDatEtapa extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.dat_etapa');
        $this->hasColumn('idetapa', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_etapa'));
        $this->hasColumn('idflujotrabajo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idformatoetapa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnombreetapa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestadoflujotrabajo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

