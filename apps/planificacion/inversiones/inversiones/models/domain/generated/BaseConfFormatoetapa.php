<?php

abstract class BaseConfFormatoetapa extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.conf_formatoetapa');
        $this->hasColumn('idformatoetapa', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_formatoetapa'));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('activado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('aprobado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('uso', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}

