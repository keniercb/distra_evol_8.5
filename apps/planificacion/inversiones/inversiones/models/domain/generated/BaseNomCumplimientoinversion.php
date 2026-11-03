<?php

abstract class BaseNomCumplimientoinversion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.nom_cumplimientoinversion');
        $this->hasColumn('idcumplimientoinversion', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
    }

}

