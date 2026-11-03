<?php

abstract class BaseNomTipoinversion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.nom_tipoinversion');
        $this->hasColumn('idtipoinversion', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_tipoinversion'));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idformatoetapa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocumentos', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

}

