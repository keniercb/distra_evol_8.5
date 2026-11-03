<?php

abstract class BaseNomEstadosft extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.nom_estadosft');
        $this->hasColumn('idestadosft', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_estadosft'));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
    }

}

